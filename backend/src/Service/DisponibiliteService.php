<?php

namespace App\Service;

use App\Entity\Restaurant;
use App\Entity\Table;
use App\Repository\ReservationRepository;
use App\Repository\RestaurantRepository;
use Doctrine\ORM\EntityManagerInterface;

class DisponibiliteService
{
    private EntityManagerInterface $entityManager;
    private ReservationRepository $reservationRepository;
    private RestaurantRepository $restaurantRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        ReservationRepository $reservationRepository,
        RestaurantRepository $restaurantRepository
    ) {
        $this->entityManager = $entityManager;
        $this->reservationRepository = $reservationRepository;
        $this->restaurantRepository = $restaurantRepository;
    }

    /**
     * Vérifie la disponibilité d'une table et retourne les détails ou des alternatives.
     *
     * @return array{disponible: bool, table: ?Table, alternatives: array<array{heure: string, tableId: int}>}
     */
    public function verifierDisponibilite(int $restaurantId, string $dateStr, string $heureStr, int $nombrePersonnes): array
    {
        $restaurant = $this->restaurantRepository->find($restaurantId);
        if (!$restaurant) {
            return [
                'disponible' => false,
                'table' => null,
                'alternatives' => []
            ];
        }

        try {
            $proposedDateTime = new \DateTime($dateStr . ' ' . $heureStr);
        } catch (\Exception $e) {
            return [
                'disponible' => false,
                'table' => null,
                'alternatives' => []
            ];
        }

        // 1. Vérifier si le restaurant est ouvert à cette heure
        $estOuvert = $this->estDansServiceOuvert($restaurant, $proposedDateTime);

        // 2. Chercher une table disponible si ouvert
        $tableDisponible = null;
        if ($estOuvert) {
            $tableDisponible = $this->trouverTableDisponible($restaurant, $proposedDateTime, $nombrePersonnes);
        }

        if ($tableDisponible) {
            return [
                'disponible' => true,
                'table' => $tableDisponible,
                'alternatives' => []
            ];
        }

        // 3. Si non disponible, chercher des alternatives
        $alternatives = $this->trouverAlternatives($restaurant, $proposedDateTime, $nombrePersonnes);

        return [
            'disponible' => false,
            'table' => null,
            'alternatives' => $alternatives
        ];
    }

    /**
     * Vérifie si l'heure proposée est dans un service ouvert pour ce jour.
     */
    private function estDansServiceOuvert(Restaurant $restaurant, \DateTime $dateTime): bool
    {
        $daysOfWeek = [
            1 => 'lundi',
            2 => 'mardi',
            3 => 'mercredi',
            4 => 'jeudi',
            5 => 'vendredi',
            6 => 'samedi',
            7 => 'dimanche'
        ];
        $dayNum = (int)$dateTime->format('N');
        $dayName = $daysOfWeek[$dayNum] ?? 'lundi';

        $timeStr = $dateTime->format('H:i:s');

        foreach ($restaurant->getServices() as $service) {
            if (in_array($dayName, $service->getJoursOuverture(), true)) {
                $startStr = $service->getHeureDebut()->format('H:i:s');
                $endStr = $service->getHeureFin()->format('H:i:s');

                // On vérifie que l'heure de début de réservation est dans le service
                if ($timeStr >= $startStr && $timeStr <= $endStr) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Trouve la table la plus adaptée et disponible pour le créneau proposé.
     */
    private function trouverTableDisponible(Restaurant $restaurant, \DateTime $proposedDateTime, int $nombrePersonnes): ?Table
    {
        // Récupérer toutes les tables et les trier par capacité ascendante
        $tables = $restaurant->getTables()->toArray();
        usort($tables, function (Table $a, Table $b) {
            if ($a->getCapacite() === $b->getCapacite()) {
                return $a->getId() <=> $b->getId();
            }
            return $a->getCapacite() <=> $b->getCapacite();
        });

        // Filtrer les tables ayant une capacité suffisante
        $tablesCandidates = array_filter($tables, function (Table $table) use ($nombrePersonnes) {
            return $table->getCapacite() >= $nombrePersonnes;
        });

        if (empty($tablesCandidates)) {
            return null;
        }

        // Récupérer les réservations actives pour ce restaurant à cette date
        $reservations = $this->reservationRepository->createQueryBuilder('r')
            ->andWhere('r.restaurant = :restaurant')
            ->andWhere('r.dateReservation = :date')
            ->andWhere('r.statut != :annulee')
            ->setParameter('restaurant', $restaurant)
            ->setParameter('date', $proposedDateTime->format('Y-m-d'))
            ->setParameter('annulee', 'annulee')
            ->getQuery()
            ->getResult();

        $proposedStart = $proposedDateTime->getTimestamp();
        $dureeTotale = ($restaurant->getDureeRepas() + $restaurant->getBufferNettoyage()) * 60;
        $proposedEnd = $proposedStart + $dureeTotale;

        foreach ($tablesCandidates as $table) {
            $estLibre = true;

            foreach ($reservations as $res) {
                if ($res->getTableReservee() !== null && $res->getTableReservee()->getId() === $table->getId()) {
                    // Reconstruire les timestamps pour la réservation existante
                    $resDateStr = $res->getDateReservation()->format('Y-m-d');
                    $resTimeStr = $res->getHeureReservation()->format('H:i:s');
                    $resStart = (new \DateTime($resDateStr . ' ' . $resTimeStr))->getTimestamp();
                    $resEnd = $resStart + $dureeTotale;

                    // Condition d'intersection / conflit
                    if ($resStart < $proposedEnd && $proposedStart < $resEnd) {
                        $estLibre = false;
                        break;
                    }
                }
            }

            if ($estLibre) {
                return $table;
            }
        }

        return null;
    }

    /**
     * Trouve des alternatives horaires sur la même journée (par pas de 30 minutes).
     *
     * @return array<array{heure: string, tableId: int}>
     */
    private function trouverAlternatives(Restaurant $restaurant, \DateTime $proposedDateTime, int $nombrePersonnes): array
    {
        $daysOfWeek = [
            1 => 'lundi',
            2 => 'mardi',
            3 => 'mercredi',
            4 => 'jeudi',
            5 => 'vendredi',
            6 => 'samedi',
            7 => 'dimanche'
        ];
        $dayNum = (int)$proposedDateTime->format('N');
        $dayName = $daysOfWeek[$dayNum] ?? 'lundi';
        $dateStr = $proposedDateTime->format('Y-m-d');

        // Générer tous les créneaux par pas de 30 minutes dans les services ouverts du jour
        $creneauxPossibles = [];
        foreach ($restaurant->getServices() as $service) {
            if (in_array($dayName, $service->getJoursOuverture(), true)) {
                $start = clone $service->getHeureDebut();
                $end = clone $service->getHeureFin();

                // On s'assure d'avoir la bonne date sur les DateTime de début/fin de service
                $start = new \DateTime($dateStr . ' ' . $start->format('H:i:s'));
                $end = new \DateTime($dateStr . ' ' . $end->format('H:i:s'));

                $current = clone $start;
                // On peut réserver jusqu'à (heureFin - dureeRepas) pour avoir le temps de manger
                $limiteMax = clone $end;
                $limiteMax->modify('-' . $restaurant->getDureeRepas() . ' minutes');

                while ($current <= $limiteMax) {
                    $creneauxPossibles[] = clone $current;
                    $current->modify('+30 minutes');
                }
            }
        }

        // Trier les créneaux par proximité à l'heure demandée
        $proposedTimestamp = $proposedDateTime->getTimestamp();
        usort($creneauxPossibles, function (\DateTime $a, \DateTime $b) use ($proposedTimestamp) {
            return abs($a->getTimestamp() - $proposedTimestamp) <=> abs($b->getTimestamp() - $proposedTimestamp);
        });

        $alternatives = [];
        foreach ($creneauxPossibles as $creneau) {
            // Ignorer le créneau de départ (déjà testé et non dispo)
            if ($creneau->format('H:i') === $proposedDateTime->format('H:i')) {
                continue;
            }

            $table = $this->trouverTableDisponible($restaurant, $creneau, $nombrePersonnes);
            if ($table !== null) {
                $alternatives[] = [
                    'heure' => $creneau->format('H:i'),
                    'tableId' => $table->getId()
                ];

                if (count($alternatives) >= 3) {
                    break;
                }
            }
        }

        return $alternatives;
    }
}
