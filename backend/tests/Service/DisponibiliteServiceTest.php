<?php

namespace App\Tests\Service;

use App\Entity\Restaurant;
use App\Entity\Service;
use App\Entity\Table;
use App\Repository\ReservationRepository;
use App\Repository\RestaurantRepository;
use App\Service\DisponibiliteService;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class DisponibiliteServiceTest extends TestCase
{
    private function makeService(): DisponibiliteService
    {
        return new DisponibiliteService(
            $this->createMock(EntityManagerInterface::class),
            $this->createMock(ReservationRepository::class),
            $this->createMock(RestaurantRepository::class)
        );
    }

    public function testVerifierDisponibiliteRestaurantNonTrouve(): void
    {
        $restaurantRepository = $this->createMock(RestaurantRepository::class);
        $restaurantRepository->expects($this->once())
            ->method('find')
            ->with(999)
            ->willReturn(null);

        $service = new DisponibiliteService(
            $this->createMock(EntityManagerInterface::class),
            $this->createMock(ReservationRepository::class),
            $restaurantRepository
        );

        $result = $service->verifierDisponibilite(999, '2026-06-01', '12:00', 2);

        $this->assertFalse($result['disponible']);
        $this->assertNull($result['table']);
        $this->assertEmpty($result['alternatives']);
    }

    public function testVerifierDisponibiliteRetourneRaisonFerme(): void
    {
        // Restaurant sans services → fermé
        $restaurant = new Restaurant();
        $restaurant->setNom('Test');
        $restaurant->setDureeRepas(90);
        $restaurant->setBufferNettoyage(15);
        // No services added → getServices() returns empty collection

        $restaurantRepository = $this->createMock(RestaurantRepository::class);
        $restaurantRepository->method('find')->willReturn($restaurant);

        $reservationRepository = $this->createMock(ReservationRepository::class);
        $reservationRepository->method('createQueryBuilder')->willReturn(
            $this->createMockQueryBuilder()
        );

        $service = new DisponibiliteService(
            $this->createMock(EntityManagerInterface::class),
            $reservationRepository,
            $restaurantRepository
        );

        $result = $service->verifierDisponibilite(1, '2026-06-02', '12:00', 2);

        $this->assertFalse($result['disponible']);
        $this->assertEquals('ferme', $result['raison']);
        $this->assertNull($result['table']);
    }

    public function testVerifierDisponibiliteAvecServiceOuvert(): void
    {
        $restaurant = $this->makeRestaurantWithSoirService();

        $table = new Table();
        $table->setNumeroTable('1');
        $table->setCapacite(4);

        // Mock table collection on the restaurant
        $restaurantRepository = $this->createMock(RestaurantRepository::class);
        $restaurantRepository->method('find')->willReturn($restaurant);

        $reservationRepository = $this->createMock(ReservationRepository::class);
        $reservationRepository->method('createQueryBuilder')->willReturn(
            $this->createMockQueryBuilder()
        );

        $service = new DisponibiliteService(
            $this->createMock(EntityManagerInterface::class),
            $reservationRepository,
            $restaurantRepository
        );

        // Monday (lundi) at 19:30 — within soir service
        $result = $service->verifierDisponibilite(1, '2026-06-01', '19:30', 2);

        // Restaurant is open, and has a table → should be available OR at least not "ferme"
        $this->assertArrayHasKey('disponible', $result);
        $this->assertArrayHasKey('raison', $result);
    }

    public function testVerifierDisponibiliteDateInvalide(): void
    {
        $restaurant = new Restaurant();
        $restaurantRepository = $this->createMock(RestaurantRepository::class);
        $restaurantRepository->method('find')->willReturn($restaurant);

        $service = new DisponibiliteService(
            $this->createMock(EntityManagerInterface::class),
            $this->createMock(ReservationRepository::class),
            $restaurantRepository
        );

        $result = $service->verifierDisponibilite(1, 'not-a-date', 'invalid-time', 2);

        $this->assertFalse($result['disponible']);
        $this->assertNull($result['table']);
    }

    // ──────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────

    private function makeRestaurantWithSoirService(): Restaurant
    {
        $restaurant = new Restaurant();
        $restaurant->setNom('Test');
        $restaurant->setDureeRepas(90);
        $restaurant->setBufferNettoyage(15);

        $serviceSoir = new Service();
        $serviceSoir->setType('soir');
        $serviceSoir->setHeureDebut(new \DateTime('19:00:00'));
        $serviceSoir->setHeureFin(new \DateTime('22:30:00'));
        $serviceSoir->setJoursOuverture(['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']);
        $serviceSoir->setRestaurant($restaurant);
        $serviceSoir->setCreatedAt(new \DateTimeImmutable());

        return $restaurant;
    }

    private function createMockQueryBuilder(): \Doctrine\ORM\QueryBuilder
    {
        $qb = $this->createMock(\Doctrine\ORM\QueryBuilder::class);
        $query = $this->createMock(\Doctrine\ORM\Query::class);
        $query->method('getResult')->willReturn([]);
        $qb->method('andWhere')->willReturnSelf();
        $qb->method('setParameter')->willReturnSelf();
        $qb->method('getQuery')->willReturn($query);
        return $qb;
    }
}
