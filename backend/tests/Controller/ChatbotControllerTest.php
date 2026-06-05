<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class ChatbotControllerTest extends WebTestCase
{
    public function testCallWebhookMissingParameters()
    {
        $client = static::createClient();

        $client->request('POST', '/api/chatbot/call', [], [], [], json_encode([
            'name' => 'Alice'
            // other parameters missing
        ]));

        $response = $client->getResponse();
        $this->assertEquals(Response::HTTP_BAD_REQUEST, $response->getStatusCode());
        
        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['success']);
        $this->assertStringContainsString('Champs requis manquants', $data['message']);
    }

    public function testCallWebhookInvalidJson()
    {
        $client = static::createClient();

        $client->request('POST', '/api/chatbot/call', [], [], [], 'invalid json');

        $response = $client->getResponse();
        $this->assertEquals(Response::HTTP_BAD_REQUEST, $response->getStatusCode());
        
        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['success']);
        $this->assertStringContainsString('Corps JSON invalide', $data['message']);
    }
}
