<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = User::query()->orderByDesc('created_at')->limit(100);

        if ($search = $request->query('q')) {
            $q->where(function ($builder) use ($search) {
                $builder->where('email', 'ilike', '%'.$search.'%')
                    ->orWhere('name', 'ilike', '%'.$search.'%');
            });
        }

        // SQLite tests: ilike may not exist — fall back for non-pgsql
        if (config('database.default') === 'sqlite' && $search) {
            $q = User::query()
                ->where(function ($builder) use ($search) {
                    $builder->where('email', 'like', '%'.$search.'%')
                        ->orWhere('name', 'like', '%'.$search.'%');
                })
                ->orderByDesc('created_at')
                ->limit(100);
        }

        $users = $q->get();

        $data = $users->map(fn (User $u) => [
            'id' => $u->uuid,
            'email' => $u->email,
            'displayName' => $u->name,
            'role' => $u->role,
            'createdAt' => $u->created_at?->toIso8601String(),
        ])->values()->all();

        return ApiResponse::success($data);
    }
}
