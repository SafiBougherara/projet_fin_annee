<?php

namespace App\Controller;

use App\Entity\Client;
use App\Entity\Reservation;
use App\Repository\ClientRepository;
use App\Repository\RestaurantRepository;
use App\Service\ChatbotService;
use App\Service\DisponibiliteService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/chatbot', name: 'api_chatbot_')]
class ChatbotController extends AbstractController
{
    private string $telegramBotToken;
    private string $telegramBotUsername;

    public function __construct(string $telegramBotToken, string $telegramBotUsername)
    {
        $this->telegramBotToken = $telegramBotToken;
        $this->telegramBotUsername = $telegramBotUsername;
    }

    #[Route('/config', name: 'config', methods: ['GET'])]
    public function config(): JsonResponse
    {
        return $this->json([
            'telegramBotUsername' => $this->telegramBotUsername
        ]);
    }

    #[Route('/init/{restaurantId}', name: 'init', methods: ['GET'])]
    public function init(int $restaurantId, RestaurantRepository $restaurantRepository): JsonResponse
    {
        $restaurant = $restaurantRepository->find($restaurantId);
        if (!$restaurant) {
            return $this->json(['error' => 'Restaurant introuvable'], Response::HTTP_NOT_FOUND);
        }

        $sessionId = bin2hex(random_bytes(16));

        return $this->json([
            'sessionId' => $sessionId,
            'restaurant' => [
                'id' => $restaurant->getId(),
                'nom' => $restaurant->getNom(),
                'adresse' => $restaurant->getAdresse(),
                'telephone' => $restaurant->getTelephone(),
                'email' => $restaurant->getEmail()
            ],
            'welcomeMessage' => sprintf(
                "Bonjour ! Je suis l'assistant virtuel de \"%s\". Comment puis-je vous aider aujourd'hui ? (Vous pouvez me demander de réserver une table)",
                $restaurant->getNom()
            )
        ]);
    }

    #[Route('/message', name: 'message', methods: ['POST'])]
    public function message(Request $request, ChatbotService $chatbotService): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json(['error' => 'Corps JSON invalide'], Response::HTTP_BAD_REQUEST);
        }

        $sessionId = $data['sessionId'] ?? null;
        $restaurantId = $data['restaurantId'] ?? null;
        $message = $data['message'] ?? null;

        if (!$sessionId || !$restaurantId || !$message) {
            return $this->json(['error' => 'Champs requis manquants (sessionId, restaurantId, message)'], Response::HTTP_BAD_REQUEST);
        }

        $result = $chatbotService->traiterMessage($sessionId, (int)$restaurantId, $message);

        return $this->json($result);
    }

    #[Route('/telegram', name: 'telegram', methods: ['POST'])]
    public function telegram(
        Request $request,
        ChatbotService $chatbotService,
        RestaurantRepository $restaurantRepository,
        \Symfony\Contracts\HttpClient\HttpClientInterface $httpClient,
        \Symfony\Contracts\Cache\CacheInterface $cache,
        \Psr\Log\LoggerInterface $logger
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json(['error' => 'Corps JSON invalide'], Response::HTTP_BAD_REQUEST);
        }

        $messageObj = $data['message'] ?? null;
        if (!$messageObj) {
            return $this->json(['status' => 'No message']);
        }

        $chatId = $messageObj['chat']['id'] ?? null;
        $text = trim($messageObj['text'] ?? '');

        if (!$chatId) {
            return $this->json(['error' => 'Chat ID manquant'], Response::HTTP_BAD_REQUEST);
        }

        $restaurantId = (int)($request->query->get('restaurantId') ?? 1);
        $restaurant = $restaurantRepository->find($restaurantId);
        if (!$restaurant) {
            return $this->json(['error' => 'Restaurant introuvable'], Response::HTTP_NOT_FOUND);
        }

        if ($text === '/start') {
            $responseText = sprintf(
                "Bonjour ! Je suis l'assistant de réservation du restaurant \"%s\". Comment puis-je vous aider aujourd'hui ? (Vous pouvez me demander de réserver une table)",
                $restaurant->getNom()
            );
        } elseif ($text === '/reset' || $text === '/clear') {
            $cache->delete("chatbot_session_telegram_" . $chatId);
            $responseText = "Votre session de réservation a été réinitialisée. Comment puis-je vous aider pour votre nouvelle réservation ?";
        } elseif (empty($text)) {
            return $this->json(['status' => 'Ignored empty text']);
        } else {
            $sessionId = "telegram_" . $chatId;
            $result = $chatbotService->traiterMessage($sessionId, $restaurantId, $text);
            $responseText = $result['response'];
        }

        if ($this->telegramBotToken && $this->telegramBotToken !== 'your_telegram_bot_token_here') {
            try {
                $telegramUrl = sprintf("https://api.telegram.org/bot%s/sendMessage", $this->telegramBotToken);
                $httpClient->request('POST', $telegramUrl, [
                    'json' => [
                        'chat_id' => $chatId,
                        'text' => $responseText
                    ]
                ]);
            } catch (\Exception $e) {
                $logger->error("Erreur lors de l'envoi du message Telegram", ['exception' => $e]);
            }
        }

        return $this->json(['status' => 'success', 'response' => $responseText]);
    }

    #[Route('/call', name: 'call', methods: ['POST'])]
    public function callWebhook(
        Request $request,
        ClientRepository $clientRepository,
        DisponibiliteService $disponibiliteService,
        RestaurantRepository $restaurantRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json([
                'success' => false,
                'message' => 'Corps JSON invalide'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Extraction flexible des paramètres
        $nom = $data['nom'] ?? $data['name'] ?? $data['clientName'] ?? $data['client_name'] ?? null;
        $telephone = $data['telephone'] ?? $data['phone'] ?? $data['phoneNumber'] ?? $data['phone_number'] ?? null;
        $nombrePersonnes = $data['nombrePersonnes'] ?? $data['guests'] ?? $data['guestsCount'] ?? $data['guests_count'] ?? $data['nombre_personnes'] ?? null;
        $dateStr = $data['date'] ?? null;
        $heureStr = $data['heure'] ?? $data['time'] ?? $data['hour'] ?? null;

        // Restaurant ID (facultatif, par défaut 1)
        $restaurantId = (int)($data['restaurantId'] ?? $data['restaurant_id'] ?? $request->query->get('restaurantId') ?? 1);

        if (!$nom || !$telephone || !$nombrePersonnes || !$dateStr || !$heureStr) {
            $missing = [];
            if (!$nom) $missing[] = 'nom/name';
            if (!$telephone) $missing[] = 'telephone/phone';
            if (!$nombrePersonnes) $missing[] = 'nombrePersonnes/guests';
            if (!$dateStr) $missing[] = 'date';
            if (!$heureStr) $missing[] = 'heure/time';

            return $this->json([
                'success' => false,
                'message' => 'Champs requis manquants : ' . implode(', ', $missing)
            ], Response::HTTP_BAD_REQUEST);
        }

        $restaurant = $restaurantRepository->find($restaurantId);
        if (!$restaurant) {
            return $this->json([
                'success' => false,
                'message' => 'Restaurant introuvable'
            ], Response::HTTP_NOT_FOUND);
        }

        // Nettoyage/normalisation du nombre de personnes en entier
        $nombrePersonnes = (int)$nombrePersonnes;

        // Appel du service de disponibilité
        $resAvailability = $disponibiliteService->verifierDisponibilite(
            $restaurantId,
            $dateStr,
            $heureStr,
            $nombrePersonnes
        );

        if (!$resAvailability['disponible']) {
            $alternatives = [];
            foreach ($resAvailability['alternatives'] ?? [] as $alt) {
                $alternatives[] = $alt['heure'];
            }

            $raison = $resAvailability['raison'] ?? 'indisponible';

            if ($raison === 'ferme') {
                if (!empty($alternatives)) {
                    $altStr = implode(', ', $alternatives);
                    $message = sprintf(
                        "Le restaurant est fermé à %s (pas de service ouvert à cet horaire). Des créneaux disponibles existent ce jour-là : %s. Proposez l'un de ces horaires au client.",
                        $heureStr,
                        $altStr
                    );
                } else {
                    $message = sprintf(
                        "Le restaurant est fermé à %s et aucun autre créneau n'est disponible ce jour. Horaires d'ouverture : déjeuner lundi-vendredi 12h00-14h30, dîner lundi-samedi 19h00-22h30.",
                        $heureStr
                    );
                }
            } else {
                if (!empty($alternatives)) {
                    $altStr = implode(', ', $alternatives);
                    $message = sprintf(
                        "Toutes les tables sont complètes à %s pour %d personne(s). Des créneaux sont disponibles à : %s. Proposez l'un de ces horaires au client.",
                        $heureStr,
                        $nombrePersonnes,
                        $altStr
                    );
                } else {
                    $message = sprintf(
                        "Toutes les tables sont complètes pour le %s et aucune alternative n'est disponible ce jour.",
                        (new \DateTime($dateStr))->format('d/m/Y')
                    );
                }
            }

            return $this->json([
                'success' => false,
                'message' => $message,
                'alternatives' => $alternatives
            ], Response::HTTP_OK);
        }

        $table = $resAvailability['table'];

        // Recherche ou création du client
        $client = $clientRepository->findOneBy(['telephone' => $telephone]);
        if (!$client) {
            $client = new Client();
            $client->setNom($nom);
            $client->setTelephone($telephone);
            $client->setConsentementRgpd(true);
            $client->setCreatedAt(new \DateTimeImmutable());
            $entityManager->persist($client);
        } else {
            $client->setNom($nom);
        }

        // Création de la réservation
        try {
            $reservation = new Reservation();
            $reservation->setClient($client);
            $reservation->setRestaurant($restaurant);
            $reservation->setTableReservee($table);
            $reservation->setDateReservation(new \DateTime($dateStr));
            $reservation->setHeureReservation(new \DateTime($heureStr));
            $reservation->setNombrePersonnes($nombrePersonnes);
            $reservation->setStatut('confirmée');
            $reservation->setCreatedAt(new \DateTimeImmutable());

            $entityManager->persist($reservation);
            $entityManager->flush();

            return $this->json([
                'success' => true,
                'message' => sprintf(
                    "Réservation confirmée ! Table n°%s réservée pour le %s à %s au nom de %s pour %s personnes.",
                    $table->getNumeroTable(),
                    (new \DateTime($dateStr))->format('d/m/Y'),
                    $heureStr,
                    $nom,
                    $nombrePersonnes
                ),
                'reservationId' => $reservation->getId(),
                'tableNumero' => $table->getNumeroTable(),
                'client' => [
                    'id' => $client->getId(),
                    'nom' => $client->getNom(),
                    'telephone' => $client->getTelephone()
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la réservation : ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
