<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class AuthControllerTest extends WebTestCase
{
    public function testHealthEndpointReturnsOk(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/health');

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('ok', $data['status']);
    }

    public function testRegisterWithValidData(): void
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['email' => 'newuser_' . uniqid() . '@test.com', 'password' => 'Password123!'])
        );

        $response = $client->getResponse();
        $this->assertEquals(Response::HTTP_CREATED, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('user', $data);
        $this->assertArrayHasKey('email', $data['user']);
    }

    public function testRegisterWithMissingEmail(): void
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['password' => 'Password123!'])
        );

        $this->assertEquals(Response::HTTP_BAD_REQUEST, $client->getResponse()->getStatusCode());
    }

    public function testRegisterWithMissingPassword(): void
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['email' => 'test@test.com'])
        );

        $this->assertEquals(Response::HTTP_BAD_REQUEST, $client->getResponse()->getStatusCode());
    }

    public function testRegisterWithDuplicateEmail(): void
    {
        $client = static::createClient();
        $email = 'duplicate_' . uniqid() . '@test.com';
        $payload = json_encode(['email' => $email, 'password' => 'Password123!']);
        $headers = ['CONTENT_TYPE' => 'application/json'];

        // First registration should succeed
        $client->request('POST', '/api/register', [], [], $headers, $payload);
        $this->assertEquals(Response::HTTP_CREATED, $client->getResponse()->getStatusCode());

        // Second registration with same email should fail
        $client->request('POST', '/api/register', [], [], $headers, $payload);
        $this->assertEquals(Response::HTTP_CONFLICT, $client->getResponse()->getStatusCode());
    }

    public function testLoginWithInvalidCredentials(): void
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/api/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['email' => 'nobody@nowhere.com', 'password' => 'wrongpass'])
        );

        $this->assertEquals(Response::HTTP_UNAUTHORIZED, $client->getResponse()->getStatusCode());
    }
}
