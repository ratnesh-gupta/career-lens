<?php

test('health returns baseline success envelope', function () {
    $response = $this->getJson('/api/v1/health');

    $response->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.status', 'ok')
        ->assertJsonStructure([
            'success',
            'data' => ['status', 'service'],
            'meta',
        ]);
});
