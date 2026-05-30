<?php

namespace App\Controller;

use App\Entity\Restaurant;
use App\Entity\Table;
use App\Repository\RestaurantRepository;
use App\Repository\TableRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'api_admin_')]
class RestaurantAdminController extends AbstractController
{
    #[Route('/restaurants', name: 'restaurant_create', methods: ['POST'])]
    public function createRestaurant(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return $this->json(['error' => 'Corps JSON invalide'], Response::HTTP_BAD_REQUEST);
        }

        $requiredFields = ['nom', 'adresse', 'telephone', 'email', 'capaciteTotale', 'dureeRepas', 'bufferNettoyage'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                return $this->json(['error' => sprintf('Le champ %s est requis', $field)], Response::HTTP_BAD_REQUEST);
            }
        }

        $restaurant = new Restaurant();
        $restaurant->setNom($data['nom']);
        $restaurant->setAdresse($data['adresse']);
        $restaurant->setTelephone($data['telephone']);
        $restaurant->setEmail($data['email']);
        $restaurant->setCapaciteTotale((int)$data['capaciteTotale']);
        $restaurant->setDureeRepas((int)$data['dureeRepas']);
        $restaurant->setBufferNettoyage((int)$data['bufferNettoyage']);
        $restaurant->setCreatedAt(new \DateTimeImmutable());

        $entityManager->persist($restaurant);
        $entityManager->flush();

        return $this->json([
            'id' => $restaurant->getId(),
            'nom' => $restaurant->getNom(),
            'message' => 'Restaurant créé avec succès',
        ], Response::HTTP_CREATED);
    }

    #[Route('/restaurants/{id}', name: 'restaurant_update', methods: ['PUT'])]
    public function updateRestaurant(int $id, Request $request, RestaurantRepository $restaurantRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $restaurant = $restaurantRepository->find($id);
        if (!$restaurant) {
            return $this->json(['error' => 'Restaurant introuvable'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json(['error' => 'Corps JSON invalide'], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['nom'])) $restaurant->setNom($data['nom']);
        if (isset($data['adresse'])) $restaurant->setAdresse($data['adresse']);
        if (isset($data['telephone'])) $restaurant->setTelephone($data['telephone']);
        if (isset($data['email'])) $restaurant->setEmail($data['email']);
        if (isset($data['capaciteTotale'])) $restaurant->setCapaciteTotale((int)$data['capaciteTotale']);
        if (isset($data['dureeRepas'])) $restaurant->setDureeRepas((int)$data['dureeRepas']);
        if (isset($data['bufferNettoyage'])) $restaurant->setBufferNettoyage((int)$data['bufferNettoyage']);

        $entityManager->flush();

        return $this->json([
            'id' => $restaurant->getId(),
            'nom' => $restaurant->getNom(),
            'message' => 'Restaurant mis à jour avec succès',
        ]);
    }

    #[Route('/restaurants/{id}', name: 'restaurant_delete', methods: ['DELETE'])]
    public function deleteRestaurant(int $id, RestaurantRepository $restaurantRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $restaurant = $restaurantRepository->find($id);
        if (!$restaurant) {
            return $this->json(['error' => 'Restaurant introuvable'], Response::HTTP_NOT_FOUND);
        }

        if (count($restaurant->getReservations()) > 0) {
            return $this->json(['error' => 'Impossible de supprimer ce restaurant car des réservations y sont associées.'], Response::HTTP_BAD_REQUEST);
        }

        $entityManager->remove($restaurant);
        $entityManager->flush();

        return $this->json([
            'message' => 'Restaurant supprimé avec succès',
        ]);
    }

    #[Route('/tables', name: 'table_create', methods: ['POST'])]
    public function createTable(Request $request, RestaurantRepository $restaurantRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return $this->json(['error' => 'Corps JSON invalide'], Response::HTTP_BAD_REQUEST);
        }

        $requiredFields = ['numeroTable', 'capacite', 'type', 'statut', 'restaurantId'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                return $this->json(['error' => sprintf('Le champ %s est requis', $field)], Response::HTTP_BAD_REQUEST);
            }
        }

        $restaurant = $restaurantRepository->find($data['restaurantId']);
        if (!$restaurant) {
            return $this->json(['error' => 'Restaurant introuvable'], Response::HTTP_NOT_FOUND);
        }

        $table = new Table();
        $table->setNumeroTable($data['numeroTable']);
        $table->setCapacite((int)$data['capacite']);
        $table->setType($data['type']);
        $table->setStatut($data['statut']);
        $table->setRestaurant($restaurant);
        $table->setCreatedAt(new \DateTimeImmutable());

        $entityManager->persist($table);
        $entityManager->flush();

        return $this->json([
            'id' => $table->getId(),
            'numeroTable' => $table->getNumeroTable(),
            'message' => 'Table créée avec succès',
        ], Response::HTTP_CREATED);
    }

    #[Route('/tables/{id}', name: 'table_update', methods: ['PUT'])]
    public function updateTable(int $id, Request $request, TableRepository $tableRepository, RestaurantRepository $restaurantRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $table = $tableRepository->find($id);
        if (!$table) {
            return $this->json(['error' => 'Table introuvable'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json(['error' => 'Corps JSON invalide'], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['numeroTable'])) $table->setNumeroTable($data['numeroTable']);
        if (isset($data['capacite'])) $table->setCapacite((int)$data['capacite']);
        if (isset($data['type'])) $table->setType($data['type']);
        if (isset($data['statut'])) $table->setStatut($data['statut']);

        if (!empty($data['restaurantId'])) {
            $restaurant = $restaurantRepository->find($data['restaurantId']);
            if (!$restaurant) {
                return $this->json(['error' => 'Restaurant introuvable'], Response::HTTP_NOT_FOUND);
            }
            $table->setRestaurant($restaurant);
        }

        $entityManager->flush();

        return $this->json([
            'id' => $table->getId(),
            'numeroTable' => $table->getNumeroTable(),
            'message' => 'Table mise à jour avec succès',
        ]);
    }

    #[Route('/tables/{id}', name: 'table_delete', methods: ['DELETE'])]
    public function deleteTable(int $id, TableRepository $tableRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $table = $tableRepository->find($id);
        if (!$table) {
            return $this->json(['error' => 'Table introuvable'], Response::HTTP_NOT_FOUND);
        }

        if (count($table->getReservations()) > 0) {
            return $this->json(['error' => 'Impossible de supprimer cette table car des réservations y sont associées.'], Response::HTTP_BAD_REQUEST);
        }

        $entityManager->remove($table);
        $entityManager->flush();

        return $this->json([
            'message' => 'Table supprimée avec succès',
        ]);
    }
}
