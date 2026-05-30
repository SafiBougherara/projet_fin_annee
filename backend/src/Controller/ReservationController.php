<?php

namespace App\Controller;

use App\Entity\Client;
use App\Entity\Reservation;
use App\Repository\ClientRepository;
use App\Repository\RestaurantRepository;
use App\Repository\ReservationRepository;
use App\Repository\TableRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'api_')]
class ReservationController extends AbstractController
{
    #[Route('/restaurants', name: 'restaurants_list', methods: ['GET'])]
    public function listRestaurants(RestaurantRepository $restaurantRepository): JsonResponse
    {
        $restaurants = $restaurantRepository->findAll();
        $payload = array_map(static function ($restaurant) {
            $tables = [];
            foreach ($restaurant->getTables() as $table) {
                $tables[] = [
                    'id' => $table->getId(),
                    'numeroTable' => $table->getNumeroTable(),
                    'capacite' => $table->getCapacite(),
                    'type' => $table->getType(),
                    'statut' => $table->getStatut(),
                    'restaurantId' => $restaurant->getId(),
                ];
            }

            return [
                'id' => $restaurant->getId(),
                'nom' => $restaurant->getNom(),
                'adresse' => $restaurant->getAdresse(),
                'telephone' => $restaurant->getTelephone(),
                'email' => $restaurant->getEmail(),
                'capaciteTotale' => $restaurant->getCapaciteTotale(),
                'dureeRepas' => $restaurant->getDureeRepas(),
                'bufferNettoyage' => $restaurant->getBufferNettoyage(),
                'tables' => $tables,
            ];
        }, $restaurants);

        return $this->json($payload);
    }

    #[Route('/tables', name: 'tables_list', methods: ['GET'])]
    public function listTables(TableRepository $tableRepository): JsonResponse
    {
        $tables = $tableRepository->findAll();
        $payload = array_map(static function ($table) {
            return [
                'id' => $table->getId(),
                'numeroTable' => $table->getNumeroTable(),
                'capacite' => $table->getCapacite(),
                'type' => $table->getType(),
                'statut' => $table->getStatut(),
                'restaurantId' => $table->getRestaurant()?->getId(),
            ];
        }, $tables);

        return $this->json($payload);
    }

    #[Route('/reservations', name: 'reservations_list', methods: ['GET'])]
    public function listReservations(ReservationRepository $reservationRepository): JsonResponse
    {
        $reservations = $reservationRepository->findAll();
        $payload = array_map(static function ($reservation) {
            return [
                'id' => $reservation->getId(),
                'statut' => $reservation->getStatut(),
                'dateReservation' => $reservation->getDateReservation()?->format('Y-m-d'),
                'heureReservation' => $reservation->getHeureReservation()?->format('H:i'),
                'nombrePersonnes' => $reservation->getNombrePersonnes(),
                'demandesSpeciales' => $reservation->getDemandesSpeciales(),
                'createdAt' => $reservation->getCreatedAt()?->format('Y-m-d H:i:s'),
                'client' => [
                    'id' => $reservation->getClient()?->getId(),
                    'nom' => $reservation->getClient()?->getNom(),
                    'telephone' => $reservation->getClient()?->getTelephone(),
                    'email' => $reservation->getClient()?->getEmail(),
                ],
                'restaurant' => [
                    'id' => $reservation->getRestaurant()?->getId(),
                    'nom' => $reservation->getRestaurant()?->getNom(),
                ],
                'table' => $reservation->getTableReservee() ? [
                    'id' => $reservation->getTableReservee()->getId(),
                    'numeroTable' => $reservation->getTableReservee()->getNumeroTable(),
                ] : null,
            ];
        }, $reservations);

        return $this->json($payload);
    }

    #[Route('/reservations', name: 'reservations_create', methods: ['POST'])]
    public function createReservation(
        Request $request,
        EntityManagerInterface $entityManager,
        RestaurantRepository $restaurantRepository,
        ClientRepository $clientRepository,
        TableRepository $tableRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return $this->json(['error' => 'Corps JSON invalide'], Response::HTTP_BAD_REQUEST);
        }

        $requiredFields = ['clientName', 'clientPhone', 'restaurantId', 'dateReservation', 'heureReservation', 'nombrePersonnes'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                return $this->json(['error' => sprintf('Le champ %s est requis', $field)], Response::HTTP_BAD_REQUEST);
            }
        }

        $restaurant = $restaurantRepository->find($data['restaurantId']);
        if (!$restaurant) {
            return $this->json(['error' => 'Restaurant introuvable'], Response::HTTP_NOT_FOUND);
        }

        $client = $clientRepository->findOneBy(['telephone' => $data['clientPhone']]);
        if (!$client) {
            $client = new Client();
            $client->setNom($data['clientName']);
            $client->setTelephone($data['clientPhone']);
            $client->setEmail($data['clientEmail'] ?? null);
            $client->setConsentementRgpd(true);
            $client->setCreatedAt(new \DateTimeImmutable());
            $entityManager->persist($client);
        }

        $table = null;
        if (!empty($data['tableId'])) {
            $table = $tableRepository->find($data['tableId']);
            if (!$table) {
                return $this->json(['error' => 'Table introuvable'], Response::HTTP_NOT_FOUND);
            }
        }

        try {
            $dateReservation = new \DateTime($data['dateReservation']);
            $heureReservation = new \DateTime($data['heureReservation']);
        } catch (\Exception $exception) {
            return $this->json(['error' => 'Format de date ou d’heure invalide'], Response::HTTP_BAD_REQUEST);
        }

        $reservation = new Reservation();
        $reservation->setClient($client);
        $reservation->setRestaurant($restaurant);
        $reservation->setTableReservee($table);
        $reservation->setDateReservation($dateReservation);
        $reservation->setHeureReservation($heureReservation);
        $reservation->setNombrePersonnes((int)$data['nombrePersonnes']);
        $reservation->setStatut($data['statut'] ?? 'confirmée');
        $reservation->setDemandesSpeciales($data['demandesSpeciales'] ?? null);
        $reservation->setCreatedAt(new \DateTimeImmutable());

        $entityManager->persist($reservation);
        $entityManager->flush();

        return $this->json([
            'id' => $reservation->getId(),
            'message' => 'Réservation créée avec succès',
        ], Response::HTTP_CREATED);
    }

    #[Route('/reservations/{id}', name: 'reservations_update', methods: ['PUT'])]
    public function updateReservation(
        int $id,
        Request $request,
        ReservationRepository $reservationRepository,
        EntityManagerInterface $entityManager,
        RestaurantRepository $restaurantRepository,
        ClientRepository $clientRepository,
        TableRepository $tableRepository
    ): JsonResponse {
        $reservation = $reservationRepository->find($id);
        if (!$reservation) {
            return $this->json(['error' => 'Réservation introuvable'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json(['error' => 'Corps JSON invalide'], Response::HTTP_BAD_REQUEST);
        }

        // Update Client if name/phone/email provided
        $clientName = $data['clientName'] ?? null;
        $clientPhone = $data['clientPhone'] ?? null;
        $clientEmail = $data['clientEmail'] ?? null;

        if ($clientPhone !== null || $clientName !== null || $clientEmail !== null) {
            $phoneToSearch = $clientPhone ?? $reservation->getClient()?->getTelephone();
            $client = null;
            if ($phoneToSearch) {
                $client = $clientRepository->findOneBy(['telephone' => $phoneToSearch]);
            }
            if (!$client) {
                $client = new Client();
                $client->setNom($clientName ?? $reservation->getClient()?->getNom() ?? 'Client');
                $client->setTelephone($phoneToSearch ?? '0000000000');
                $client->setEmail($clientEmail ?? $reservation->getClient()?->getEmail());
                $client->setConsentementRgpd(true);
                $client->setCreatedAt(new \DateTimeImmutable());
                $entityManager->persist($client);
            } else {
                if ($clientName !== null) {
                    $client->setNom($clientName);
                }
                if ($clientEmail !== null) {
                    $client->setEmail($clientEmail);
                }
            }
            $reservation->setClient($client);
        }

        // Update Restaurant
        if (!empty($data['restaurantId'])) {
            $restaurant = $restaurantRepository->find($data['restaurantId']);
            if (!$restaurant) {
                return $this->json(['error' => 'Restaurant introuvable'], Response::HTTP_NOT_FOUND);
            }
            $reservation->setRestaurant($restaurant);
        }

        // Update Table
        if (array_key_exists('tableId', $data)) {
            $tableId = $data['tableId'];
            if ($tableId === null || $tableId === '' || $tableId === 0) {
                $reservation->setTableReservee(null);
            } else {
                $table = $tableRepository->find($tableId);
                if (!$table) {
                    return $this->json(['error' => 'Table introuvable'], Response::HTTP_NOT_FOUND);
                }
                $reservation->setTableReservee($table);
            }
        }

        // Update Date & Time
        if (!empty($data['dateReservation'])) {
            try {
                $reservation->setDateReservation(new \DateTime($data['dateReservation']));
            } catch (\Exception $e) {
                return $this->json(['error' => 'Format de date invalide'], Response::HTTP_BAD_REQUEST);
            }
        }

        if (!empty($data['heureReservation'])) {
            try {
                $reservation->setHeureReservation(new \DateTime($data['heureReservation']));
            } catch (\Exception $e) {
                return $this->json(['error' => 'Format d’heure invalide'], Response::HTTP_BAD_REQUEST);
            }
        }

        // Update other fields
        if (isset($data['nombrePersonnes'])) {
            $reservation->setNombrePersonnes((int)$data['nombrePersonnes']);
        }

        if (isset($data['statut'])) {
            $reservation->setStatut($data['statut']);
        }

        if (array_key_exists('demandesSpeciales', $data)) {
            $reservation->setDemandesSpeciales($data['demandesSpeciales']);
        }

        $entityManager->flush();

        return $this->json([
            'id' => $reservation->getId(),
            'message' => 'Réservation mise à jour avec succès',
        ]);
    }

    #[Route('/reservations/{id}', name: 'reservations_delete', methods: ['DELETE'])]
    public function deleteReservation(
        int $id,
        ReservationRepository $reservationRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $reservation = $reservationRepository->find($id);
        if (!$reservation) {
            return $this->json(['error' => 'Réservation introuvable'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($reservation);
        $entityManager->flush();

        return $this->json([
            'message' => 'Réservation supprimée avec succès',
        ]);
    }
}
