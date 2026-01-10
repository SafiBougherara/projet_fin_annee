<?php

namespace App\DataFixtures;

use App\Entity\Client;
use App\Entity\Reservation;
use App\Entity\Restaurant;
use App\Entity\Service;
use App\Entity\Table;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Créer un restaurant
        $restaurant = new Restaurant();
        $restaurant->setNom('Le Gourmet Parisien');
        $restaurant->setAdresse('123 Avenue des Champs-Élysées, 75008 Paris, France');
        $restaurant->setTelephone('0142563789');
        $restaurant->setEmail('contact@legourmet.fr');
        $restaurant->setCapaciteTotale(50);
        $restaurant->setDureeRepas(90);
        $restaurant->setBufferNettoyage(15);
        $restaurant->setCreatedAt(new \DateTimeImmutable());
        $manager->persist($restaurant);

        // Créer des tables
        $tables = [];
        for ($i = 1; $i <= 10; $i++) {
            $table = new Table();
            $table->setNumeroTable($i);
            $table->setCapacite($i <= 4 ? 2 : ($i <= 7 ? 4 : 6));
            $table->setType($i <= 7 ? 'interieur' : 'terrasse');
            $table->setStatut('disponible');
            $table->setRestaurant($restaurant);
            $table->setCreatedAt(new \DateTimeImmutable());
            $manager->persist($table);
            $tables[] = $table;
        }

        // Créer des services
        $serviceMidi = new Service();
        $serviceMidi->setType('midi');
        $serviceMidi->setHeureDebut(new \DateTime('12:00:00'));
        $serviceMidi->setHeureFin(new \DateTime('14:30:00'));
        $serviceMidi->setJoursOuverture(['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']);
        $serviceMidi->setRestaurant($restaurant);
        $serviceMidi->setCreatedAt(new \DateTimeImmutable());
        $manager->persist($serviceMidi);

        $serviceSoir = new Service();
        $serviceSoir->setType('soir');
        $serviceSoir->setHeureDebut(new \DateTime('19:00:00'));
        $serviceSoir->setHeureFin(new \DateTime('22:30:00'));
        $serviceSoir->setJoursOuverture(['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']);
        $serviceSoir->setRestaurant($restaurant);
        $serviceSoir->setCreatedAt(new \DateTimeImmutable());
        $manager->persist($serviceSoir);

        // Créer des clients
        $clients = [];
        $clientsData = [
            ['Jean Dupont', '0612345678', 'jean.dupont@email.com'],
            ['Marie Martin', '0698765432', 'marie.martin@email.com'],
            ['Pierre Dubois', '0687654321', 'pierre.dubois@email.com'],
            ['Sophie Bernard', '0623456789', 'sophie.bernard@email.com'],
            ['Luc Petit', '0634567890', 'luc.petit@email.com'],
        ];

        foreach ($clientsData as $data) {
            $client = new Client();
            $client->setNom($data[0]);
            $client->setTelephone($data[1]);
            $client->setEmail($data[2]);
            $client->setConsentementRgpd(true);
            $client->setCreatedAt(new \DateTimeImmutable());
            $manager->persist($client);
            $clients[] = $client;
        }

        // Créer des réservations
        $reservationsData = [
            ['2026-01-15', '12:30:00', 2, 'confirmee', 0, 0],
            ['2026-01-15', '13:00:00', 4, 'confirmee', 1, 1],
            ['2026-01-15', '20:00:00', 4, 'confirmee', 2, 2],
            ['2026-01-16', '12:00:00', 2, 'confirmee', 3, 3],
            ['2026-01-16', '20:30:00', 6, 'en_attente', 4, 4],
            ['2026-01-17', '19:30:00', 2, 'confirmee', 0, 5],
            ['2026-01-17', '21:00:00', 4, 'confirmee', 1, 6],
        ];

        foreach ($reservationsData as $data) {
            $reservation = new Reservation();
            $reservation->setDateReservation(new \DateTime($data[0]));
            $reservation->setHeureReservation(new \DateTime($data[1]));
            $reservation->setNombrePersonnes($data[2]);
            $reservation->setStatut($data[3]);
            $reservation->setClient($clients[$data[4]]);
            $reservation->setRestaurant($restaurant);
            $reservation->setTableReservee($tables[$data[5]]);
            $reservation->setCreatedAt(new \DateTimeImmutable());
            $manager->persist($reservation);
        }

        $manager->flush();
    }
}
