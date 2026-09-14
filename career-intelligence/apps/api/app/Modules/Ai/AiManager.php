<?php

namespace App\Modules\Ai;

use App\Modules\Ai\Contracts\AiProvider;
use App\Modules\Ai\Providers\FakeAiProvider;
use InvalidArgumentException;

/**
 * Resolves the active AI provider. Swap implementation via config without
 * touching resume pipeline or controllers.
 */
final class AiManager
{
    public function __construct(
        private readonly FakeAiProvider $fake,
    ) {}

    public function driver(?string $name = null): AiProvider
    {
        $name ??= config('ai.default', 'fake');

        return match ($name) {
            'fake' => $this->fake,
            default => throw new InvalidArgumentException("Unknown AI driver [{$name}]."),
        };
    }
}
