<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default AI driver
    |--------------------------------------------------------------------------
    |
    | R1a ships with "fake" only. Real vendors are selected later without
    | changing pipeline call sites (AiManager).
    |
    */
    'default' => env('AI_DRIVER', 'fake'),
];
