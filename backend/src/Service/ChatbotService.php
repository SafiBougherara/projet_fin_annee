<?php

namespace App\Service;

use App\Entity\Client;
use App\Entity\Reservation;
use App\Entity\Restaurant;
use App\Repository\ClientRepository;
use App\Repository\RestaurantRepository;
use App\Repository\TableRepository;
use App\Service\DisponibiliteService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ChatbotService
{
    private EntityManagerInterface $entityManager;
    private RestaurantRepository $restaurantRepository;
    private ClientRepository $clientRepository;
    private TableRepository $tableRepository;
    private DisponibiliteService $disponibiliteService;
    private HttpClientInterface $httpClient;
    private CacheInterface $cache;
    private string $geminiApiKey;

    public function __construct(
        EntityManagerInterface $entityManager,
        RestaurantRepository $restaurantRepository,
        ClientRepository $clientRepository,
        TableRepository $tableRepository,
        DisponibiliteService $disponibiliteService,
        HttpClientInterface $httpClient,
        CacheInterface $cache,
        string $geminiApiKey
    ) {
        $this->entityManager = $entityManager;
        $this->restaurantRepository = $restaurantRepository;
        $this->clientRepository = $clientRepository;
        $this->tableRepository = $tableRepository;
        $this->disponibiliteService = $disponibiliteService;
        $this->httpClient = $httpClient;
        $this->cache = $cache;
        $this->geminiApiKey = $geminiApiKey;
    }

    /**
     * Traite un message du client et retourne la réponse de l'IA (et effectue la réservation si prête).
     *
     * @return array{response: string, ready_to_book: bool, booked: bool}
     */
    public function traiterMessage(string $sessionId, int $restaurantId, string $message): array
    {
        $restaurant = $this->restaurantRepository->find($restaurantId);
        if (!$restaurant) {
            return [
                'response' => "Restaurant introuvable.",
                'ready_to_book' => false,
                'booked' => false
            ];
        }

        // Récupérer ou initialiser la session en cache
        $cacheKey = "chatbot_session_" . $sessionId;
        $sessionData = $this->cache->get($cacheKey, function (ItemInterface $item) {
            $item->expiresAfter(1800); // 30 minutes
            return [
                'history' => [],
                'collected_data' => [
                    'nom' => null,
                    'telephone' => null,
                    'date' => null,
                    'heure' => null,
                    'nombrePersonnes' => null,
                    'demandesSpeciales' => null
                ],
                'booked' => false
            ];
        });

        // Si déjà réservé, on ne traite plus de réservation
        if ($sessionData['booked'] === true) {
            return [
                'response' => "Votre réservation a déjà été confirmée. Si vous souhaitez en effectuer une nouvelle, veuillez actualiser la page pour démarrer une nouvelle session.",
                'ready_to_book' => false,
                'booked' => true
            ];
        }

        // Préparer l'historique pour Gemini
        $history = $sessionData['history'];
        $history[] = [
            'role' => 'user',
            'parts' => [['text' => $message]]
        ];

        // Construire le prompt système
        $servicesDesc = "";
        foreach ($restaurant->getServices() as $service) {
            $days = implode(', ', $service->getJoursOuverture());
            $servicesDesc .= sprintf(
                "- Service %s : de %s à %s (jours : %s)\n",
                $service->getType(),
                $service->getHeureDebut()->format('H:i'),
                $service->getHeureFin()->format('H:i'),
                $days
            );
        }

        $now = new \DateTime();
        $daysTranslations = [
            'Monday' => 'lundi',
            'Tuesday' => 'mardi',
            'Wednesday' => 'mercredi',
            'Thursday' => 'jeudi',
            'Friday' => 'vendredi',
            'Saturday' => 'samedi',
            'Sunday' => 'dimanche'
        ];
        $currentDayFrench = $daysTranslations[$now->format('l')] ?? strtolower($now->format('l'));
        $currentDateStr = $now->format('Y-m-d');

        // Calculer dynamiquement la capacité de la plus grande table disponible
        $maxCapacity = 0;
        foreach ($restaurant->getTables() as $table) {
            if ($table->getCapacite() > $maxCapacity) {
                $maxCapacity = $table->getCapacite();
            }
        }

        $systemPrompt = <<<PROMPT
Tu es l'assistant virtuel de réservation du restaurant "{$restaurant->getNom()}".
Adresse : {$restaurant->getAdresse()}
Téléphone du restaurant : {$restaurant->getTelephone()}
Email : {$restaurant->getEmail()}

Voici les horaires et services d'ouverture :
{$servicesDesc}

Aujourd'hui nous sommes le {$currentDayFrench} {$currentDateStr}.

Ton rôle est d'aider le client à réserver une table en discutant de manière naturelle et courtoise.
Tu dois impérativement collecter les 5 informations suivantes pour effectuer la réservation :
1. Le nom du client (`nom`)
2. Le numéro de téléphone du client (`telephone`)
3. La date de réservation (`date` au format AAAA-MM-JJ)
4. L'heure de réservation (`heure` au format HH:MM)
5. Le nombre de personnes (`nombrePersonnes` sous forme d'entier)

Instructions importantes :
- Sois chaleureux, poli et concis. Parle toujours en français.
- Ne propose pas d'horaires en dehors des services d'ouverture du restaurant.
- La capacité maximale d'une table individuelle dans notre restaurant est de {$maxCapacity} personnes. Si le client demande une réservation pour plus de {$maxCapacity} personnes, tu dois lui expliquer immédiatement et poliment que notre système automatique ne gère pas les tables de cette taille, et l'inviter à appeler directement le restaurant au {$restaurant->getTelephone()} pour les grands groupes. N'essaie pas de collecter les autres informations de réservation dans ce cas.
- Si le client donne des indications de date relative (ex: "ce soir", "demain", "vendredi prochain"), convertis-les précisément en date AAAA-MM-JJ par rapport à la date d'aujourd'hui ({$currentDateStr}).
- Dès que tu as obtenu ces 5 informations de la part du client, fais-lui un récapitulatif clair et demande-lui de confirmer (ex: "Je récapitule : une table pour 4 personnes le 01/06/2026 à 20h00 au nom de Jean Dupont. Est-ce correct ?").
- Si et seulement si le client confirme (ex: "oui", "parfait", "correct", "c'est ça", etc.), définis "ready_to_book" à true.
- Tant que l'une des 5 informations est manquante ou que le client n'a pas validé le récapitulatif, définis "ready_to_book" à false.

Format de sortie requis (en JSON strict) :
{
  "response": "Le message texte que tu adresses au client",
  "collected_data": {
    "nom": "nom extrait ou null",
    "telephone": "téléphone extrait ou null",
    "date": "AAAA-MM-JJ extrait ou null",
    "heure": "HH:MM extrait ou null",
    "nombrePersonnes": nombre_entier_extrait ou null,
    "demandesSpeciales": "demandes spéciales extraites ou null"
  },
  "ready_to_book": true/false
}
PROMPT;

        try {
            // Appeler l'API Gemini 2.5 Flash
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $this->geminiApiKey;

            $response = $this->httpClient->request('POST', $url, [
                'json' => [
                    'contents' => $history,
                    'system_instruction' => [
                        'parts' => [
                            ['text' => $systemPrompt]
                        ]
                    ],
                    'generationConfig' => [
                        'responseMimeType' => 'application/json'
                    ]
                ]
            ]);

            $statusCode = $response->getStatusCode();
            if ($statusCode !== 200) {
                throw new \Exception("Erreur de l'API Gemini : " . $statusCode);
            }

            $content = $response->toArray();
            $textResponse = $content['candidates'][0]['content']['parts'][0]['text'] ?? '';
            $aiJson = json_decode(trim($textResponse), true);

            if (!$aiJson) {
                throw new \Exception("Réponse de l'IA mal formée.");
            }

            $readyToBook = $aiJson['ready_to_book'] ?? false;
            $collected = $aiJson['collected_data'] ?? [];
            $booked = false;

            // Mettre à jour les données collectées
            $sessionData['collected_data'] = array_merge($sessionData['collected_data'], $collected);

            // Vérifier si le nombre de personnes dépasse la capacité maximale autorisée
            $nbPers = $sessionData['collected_data']['nombrePersonnes'] ?? null;
            $hasCapacityIssue = false;

            if ($nbPers && $nbPers > $maxCapacity) {
                $aiJson['response'] = sprintf(
                    "Désolé, notre restaurant ne dispose pas de table individuelle pouvant accueillir %s personnes. Notre plus grande table peut accueillir jusqu'à %s personnes. Pourriez-vous diviser votre groupe ou nous appeler directement au %s pour un repas de groupe ?",
                    $nbPers,
                    $maxCapacity,
                    $restaurant->getTelephone()
                );
                // Réinitialiser le nombre de personnes pour relancer la demande
                $sessionData['collected_data']['nombrePersonnes'] = null;
                $aiJson['collected_data']['nombrePersonnes'] = null;
                $readyToBook = false;
                $aiJson['ready_to_book'] = false;
                $hasCapacityIssue = true;
            }

            // Vérifier la disponibilité à l'avance dès que date, heure et nbPers sont collectés
            $date = $sessionData['collected_data']['date'] ?? null;
            $heure = $sessionData['collected_data']['heure'] ?? null;
            $nbPers = $sessionData['collected_data']['nombrePersonnes'] ?? null;

            if (!$hasCapacityIssue && $date && $heure && $nbPers) {
                $resAvailability = $this->disponibiliteService->verifierDisponibilite(
                    $restaurantId,
                    $date,
                    $heure,
                    (int)$nbPers
                );

                if (!$resAvailability['disponible']) {
                    // Pas de dispo, proposer des alternatives immédiatement et réinitialiser l'heure
                    $alts = $resAvailability['alternatives'] ?? [];
                    if (!empty($alts)) {
                        $altHours = array_map(fn($a) => $a['heure'], $alts);
                        $aiJson['response'] = sprintf(
                            "Désolé, aucune table n'est disponible pour le %s à %s pour %s personnes. Cependant, nous avons de la place à ces horaires : %s. Lequel de ces créneaux préférez-vous ?",
                            (new \DateTime($date))->format('d/m/Y'),
                            $heure,
                            $nbPers,
                            implode(', ', $altHours)
                        );
                    } else {
                        $aiJson['response'] = sprintf(
                            "Désolé, aucune table n'est disponible pour le %s à %s pour %s personnes et nous n'avons pas d'autres créneaux libres ce jour-là. Souhaitez-vous essayer une autre date ?",
                            (new \DateTime($date))->format('d/m/Y'),
                            $heure,
                            $nbPers
                        );
                    }
                    
                    // Réinitialisation dans la session en cache et dans le retour IA
                    $sessionData['collected_data']['heure'] = null;
                    $aiJson['collected_data']['heure'] = null;
                    $readyToBook = false;
                    $aiJson['ready_to_book'] = false;
                }
            }

            if ($readyToBook) {
                $nom = $sessionData['collected_data']['nom'];
                $tel = $sessionData['collected_data']['telephone'];
                $date = $sessionData['collected_data']['date'];
                $heure = $sessionData['collected_data']['heure'];
                $nbPers = $sessionData['collected_data']['nombrePersonnes'];
                $demandes = $sessionData['collected_data']['demandesSpeciales'];

                if ($nom && $tel && $date && $heure && $nbPers) {
                    // Vérifier la disponibilité en temps réel
                    $resAvailability = $this->disponibiliteService->verifierDisponibilite(
                        $restaurantId,
                        $date,
                        $heure,
                        (int)$nbPers
                    );

                    if ($resAvailability['disponible']) {
                        $table = $resAvailability['table'];

                        // Créer/Récupérer Client
                        $client = $this->clientRepository->findOneBy(['telephone' => $tel]);
                        if (!$client) {
                            $client = new Client();
                            $client->setNom($nom);
                            $client->setTelephone($tel);
                            $client->setConsentementRgpd(true);
                            $client->setCreatedAt(new \DateTimeImmutable());
                            $this->entityManager->persist($client);
                        }

                        // Créer Réservation
                        $reservation = new Reservation();
                        $reservation->setClient($client);
                        $reservation->setRestaurant($restaurant);
                        $reservation->setTableReservee($table);
                        $reservation->setDateReservation(new \DateTime($date));
                        $reservation->setHeureReservation(new \DateTime($heure));
                        $reservation->setNombrePersonnes((int)$nbPers);
                        $reservation->setStatut('confirmée');
                        $reservation->setDemandesSpeciales($demandes);
                        $reservation->setCreatedAt(new \DateTimeImmutable());

                        $this->entityManager->persist($reservation);
                        $this->entityManager->flush();

                        // Formater le message de confirmation
                        $aiJson['response'] = sprintf(
                            "🎉 Réservation confirmée ! Votre table (Table n°%s) est bien réservée pour le %s à %s au nom de %s pour %s personnes. À bientôt !",
                            $table->getNumeroTable(),
                            (new \DateTime($date))->format('d/m/Y'),
                            $heure,
                            $nom,
                            $nbPers
                        );

                        $booked = true;
                        $sessionData['booked'] = true;
                    } else {
                        // Pas de dispo, proposer des alternatives
                        $alts = $resAvailability['alternatives'] ?? [];
                        if (!empty($alts)) {
                            $altHours = array_map(fn($a) => $a['heure'], $alts);
                            $aiJson['response'] = sprintf(
                                "Malheureusement, aucune table n'est disponible pour le %s à %s. Cependant, nous avons des disponibilités à ces horaires : %s. L'un de ces créneaux vous convient-il ?",
                                (new \DateTime($date))->format('d/m/Y'),
                                $heure,
                                implode(', ', $altHours)
                            );
                        } else {
                            $aiJson['response'] = sprintf(
                                "Malheureusement, aucune table n'est disponible pour le %s à %s et nous n'avons pas d'autres créneaux disponibles ce jour-là. Souhaitez-vous essayer une autre date ?",
                                (new \DateTime($date))->format('d/m/Y'),
                                $heure
                            );
                        }
                        $readyToBook = false;
                        $aiJson['ready_to_book'] = false;
                    }
                }
            }

            // Mettre à jour l'historique
            $sessionData['history'][] = [
                'role' => 'user',
                'parts' => [['text' => $message]]
            ];
            $sessionData['history'][] = [
                'role' => 'model',
                'parts' => [['text' => json_encode($aiJson)]]
            ];

            // Sauvegarder la session en cache
            $this->cache->delete($cacheKey);
            $this->cache->get($cacheKey, function (ItemInterface $item) use ($sessionData) {
                $item->expiresAfter(1800);
                return $sessionData;
            });

            return [
                'response' => $aiJson['response'],
                'ready_to_book' => $readyToBook,
                'booked' => $booked
            ];

        } catch (\Exception $e) {
            return [
                'response' => "Désolé, j'ai rencontré un problème technique. Pouvez-vous répéter ?",
                'ready_to_book' => false,
                'booked' => false
            ];
        }
    }
}
