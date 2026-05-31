<?php

namespace App\Controller;

use App\Repository\RestaurantRepository;
use App\Service\ChatbotService;
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
}
