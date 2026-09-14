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

        $search = $request->query('q');
        if (is_string($search) && $search !== '') {
            $like = '%'.$search.'%';
            $driver = config('database.default');
            $op = $driver === 'pgsql' ? 'ilike' : 'like';

            $q->where(function ($builder) use ($like, $op) {
                $builder->where('email', $op, $like)
                    ->orWhere('name', $op, $like);
            });
        }

        $data = $q->get()->map(fn (User $u) => [
            'id' => $u->uuid,
            'email' => $u->email,
            'displayName' => $u->name,
            'role' => $u->role,
            'createdAt' => $u->created_at?->toIso8601String(),
        ])->values()->all();

        return ApiResponse::success($data);
    }
}
