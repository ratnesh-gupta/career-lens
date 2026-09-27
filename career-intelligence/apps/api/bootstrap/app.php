<?php

use App\Http\Middleware\EnsureEntitlement;
use App\Http\Middleware\EnsureSuperAdmin;
use App\Support\ApiResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Exception\RouteNotFoundException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'super_admin' => EnsureSuperAdmin::class,
            'entitlement' => EnsureEntitlement::class,
        ]);

        $middleware->redirectGuestsTo(function (Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return null;
            }

            return '/login';
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->render(function (ValidationException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            return ApiResponse::error(
                'VALIDATION_ERROR',
                'Invalid request',
                $e->errors(),
                $e->status,
            );
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            return ApiResponse::error(
                'UNAUTHENTICATED',
                $e->getMessage() !== '' ? $e->getMessage() : 'Unauthenticated.',
                [],
                401,
            );
        });

        $exceptions->render(function (RouteNotFoundException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            if (str_contains($e->getMessage(), 'Route [login]')) {
                return ApiResponse::error(
                    'UNAUTHENTICATED',
                    'Unauthenticated.',
                    [],
                    401,
                );
            }

            return null;
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            return ApiResponse::error(
                'NOT_FOUND',
                'Resource not found.',
                [],
                404,
            );
        });

        $exceptions->render(function (\Throwable $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            if ($e instanceof HttpExceptionInterface) {
                $status = $e->getStatusCode();
                $code = match ($status) {
                    401 => 'UNAUTHENTICATED',
                    403 => 'FORBIDDEN',
                    404 => 'NOT_FOUND',
                    405 => 'METHOD_NOT_ALLOWED',
                    409 => 'CONFLICT',
                    422 => 'VALIDATION_ERROR',
                    429 => 'TOO_MANY_REQUESTS',
                    default => 'HTTP_ERROR',
                };

                return ApiResponse::error(
                    $code,
                    $e->getMessage() !== '' ? $e->getMessage() : 'Request failed.',
                    [],
                    $status,
                );
            }

            $message = config('app.debug')
                ? ($e->getMessage() !== '' ? $e->getMessage() : 'Server error.')
                : 'Server error.';

            return ApiResponse::error('SERVER_ERROR', $message, [], 500);
        });
    })->create();
