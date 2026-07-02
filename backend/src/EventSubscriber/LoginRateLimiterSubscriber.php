<?php

namespace App\EventSubscriber;

use Psr\Cache\CacheItemPoolInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Http\Event\LoginFailureEvent;

class LoginRateLimiterSubscriber implements EventSubscriberInterface
{
    private const MAX_ATTEMPTS = 5;
    private const WINDOW_SECONDS = 900; // 15 minutes

    public function __construct(private CacheItemPoolInterface $cache) {}

    public static function getSubscribedEvents(): array
    {
        return [
            LoginFailureEvent::class => 'onLoginFailure',
            KernelEvents::REQUEST => ['onRequest', 10],
        ];
    }

    /**
     * Incrémente le compteur d'échecs pour cette IP.
     */
    public function onLoginFailure(LoginFailureEvent $event): void
    {
        $key = $this->getCacheKey($event->getRequest()->getClientIp());
        $item = $this->cache->getItem($key);
        $count = $item->isHit() ? (int) $item->get() : 0;
        $item->set($count + 1);
        $item->expiresAfter(self::WINDOW_SECONDS);
        $this->cache->save($item);
    }

    /**
     * Bloque la requête si le seuil est dépassé.
     */
    public function onRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        if ($request->getPathInfo() !== '/api/login' || $request->getMethod() !== 'POST') {
            return;
        }

        $key = $this->getCacheKey($request->getClientIp());
        $item = $this->cache->getItem($key);

        if ($item->isHit() && (int) $item->get() >= self::MAX_ATTEMPTS) {
            $event->setResponse(new JsonResponse(
                ['error' => 'Trop de tentatives de connexion échouées. Réessayez dans 15 minutes.'],
                JsonResponse::HTTP_TOO_MANY_REQUESTS,
                ['Retry-After' => (string) self::WINDOW_SECONDS]
            ));
        }
    }

    private function getCacheKey(?string $ip): string
    {
        return 'login_failures_' . md5($ip ?? 'unknown');
    }
}
