<?php

namespace App\Tests\Service;

use App\Entity\Restaurant;
use App\Entity\Table;
use App\Repository\ReservationRepository;
use App\Repository\RestaurantRepository;
use App\Service\DisponibiliteService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class DisponibiliteServiceTest extends TestCase
{
    public function testVerifierDisponibiliteRestaurantNonTrouve()
    {
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $reservationRepository = $this->createMock(ReservationRepository::class);
        $restaurantRepository = $this->createMock(RestaurantRepository::class);

        $restaurantRepository->expects($this->once())
            ->method('find')
            ->with(999)
            ->willReturn(null);

        $service = new DisponibiliteService($entityManager, $reservationRepository, $restaurantRepository);
        $result = $service->verifierDisponibilite(999, '2026-06-01', '12:00', 2);

        $this->assertFalse($result['disponible']);
        $this->assertNull($result['table']);
        $this->assertEmpty($result['alternatives']);
    }
}
