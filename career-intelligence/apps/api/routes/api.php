<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', fn() => response()->json([
        'success' => true,
        'data' => ['status' => 'ok'],
        'meta' => new \stdClass(),
    ]));

    // auth, profile, resumes, scores ...
});