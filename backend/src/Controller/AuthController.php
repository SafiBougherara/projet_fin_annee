<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * FEATURE : Authentification du restaurateur (inscription / connexion JWT).
 *
 * Endpoints exposés :
 *  - GET  /api/health   : sonde de vie utilisée par Docker et les tests.
 *  - POST /api/register : création d'un compte restaurateur.
 *  - POST /api/login    : déclarée ici pour la documentation, mais réellement
 *                         interceptée par LexikJWTAuthenticationBundle (voir config/packages/security.yaml).
 *
 * Côté front, ces routes sont consommées par frontend/src/services/auth.service.ts.
 */
#[Route('/api', name: 'api_')]
class AuthController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator
    ) {
    }

    /**
     * Healthcheck : permet à Docker/monitoring de vérifier que l'API répond.
     */
    #[Route('/health', name: 'health', methods: ['GET'])]
    public function health(): JsonResponse
    {
        return $this->json(['status' => 'ok']);
    }

    /**
     * Crée un compte restaurateur.
     *
     * Étapes : validation du payload -> contrôle d'unicité de l'email ->
     * hachage du mot de passe (bcrypt/argon selon security.yaml) -> persistance.
     * Le mot de passe en clair n'est jamais stocké ni retourné.
     */
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validation des données
        if (!isset($data['email']) || !isset($data['password'])) {
            return $this->json([
                'error' => 'Email and password are required'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Vérifier si l'utilisateur existe déjà
        $existingUser = $this->entityManager->getRepository(User::class)
            ->findOneBy(['email' => $data['email']]);

        if ($existingUser) {
            return $this->json([
                'error' => 'User already exists'
            ], Response::HTTP_CONFLICT);
        }

        // Créer un nouvel utilisateur
        $user = new User();
        $user->setEmail($data['email']);

        // Hasher le mot de passe
        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $data['password']
        );
        $user->setPassword($hashedPassword);

        // Définir les rôles (par défaut ROLE_USER)
        $user->setRoles(['ROLE_USER']);

        // Valider l'entité
        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json([
                'errors' => $errorMessages
            ], Response::HTTP_BAD_REQUEST);
        }

        // Sauvegarder l'utilisateur
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $this->json([
            'message' => 'User registered successfully',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles()
            ]
        ], Response::HTTP_CREATED);
    }

    /**
     * Point d'entrée de connexion : le corps de la méthode n'est jamais exécuté.
     * Le firewall `login` intercepte la requête et renvoie le token JWT.
     */
    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(): JsonResponse
    {
        // Cette route est gérée automatiquement par lexik/jwt-authentication-bundle
        // La configuration se trouve dans config/packages/security.yaml
        return $this->json([
            'message' => 'Login endpoint - handled by JWT bundle'
        ]);
    }
}
