<?php

test('validation errors use baseline error envelope', function () {
    $response = $this->postJson('/api/v1/_envelope/validate', []);

    $response->assertStatus(422)
        ->assertJsonPath('success', false)
        ->assertJsonPath('error.code', 'VALIDATION_ERROR')
        ->assertJsonPath('error.message', 'Invalid request')
        ->assertJsonStructure([
            'success',
            'error' => ['code', 'message', 'details'],
        ]);

    expect($response->json('error.details'))->toHaveKey('email');
});

test('unknown api route returns not found envelope', function () {
    $response = $this->getJson('/api/v1/does-not-exist');

    $response->assertNotFound()
        ->assertJsonPath('success', false)
        ->assertJsonPath('error.code', 'NOT_FOUND');
});
