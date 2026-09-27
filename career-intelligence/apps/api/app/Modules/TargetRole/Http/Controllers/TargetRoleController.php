<?php

namespace App\Modules\TargetRole\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TargetRole;
use App\Modules\Billing\FeatureCodes;
use App\Modules\Billing\Services\EntitlementService;
use App\Modules\CareerProfile\Actions\EnsureCareerProfileForUser;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TargetRoleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $items = TargetRole::query()
            ->where('user_id', $user->id)
            ->where('status', TargetRole::STATUS_ACTIVE)
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get()
            ->map(fn (TargetRole $r) => $this->serialize($r))
            ->values()
            ->all();

        return ApiResponse::success(['items' => $items]);
    }

    public function store(
        Request $request,
        EnsureCareerProfileForUser $ensureProfile,
        EntitlementService $entitlements,
    ): JsonResponse {
        $user = $request->user();
        $data = $request->validate([
            'roleName' => ['required', 'string', 'max:200'],
            'industry' => ['sometimes', 'nullable', 'string', 'max:150'],
            'seniority' => ['sometimes', 'nullable', 'string', 'max:80'],
            'location' => ['sometimes', 'nullable', 'string', 'max:200'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ]);

        $activeCount = TargetRole::query()
            ->where('user_id', $user->id)
            ->where('status', TargetRole::STATUS_ACTIVE)
            ->count();

        // Cap-style: amount = next count
        if (! $entitlements->can($user, FeatureCodes::TARGET_ROLES_MAX, $activeCount + 1)) {
            return ApiResponse::error(
                'ENTITLEMENT_REQUIRED',
                'Target role limit reached for your plan. Upgrade to add more.',
                [
                    'feature' => FeatureCodes::TARGET_ROLES_MAX,
                    'current' => $activeCount,
                    'remaining' => $entitlements->remaining($user, FeatureCodes::TARGET_ROLES_MAX),
                ],
                403,
            );
        }

        $profile = $ensureProfile($user);

        $role = TargetRole::query()->create([
            'user_id' => $user->id,
            'career_profile_id' => $profile->id,
            'role_name' => $data['roleName'],
            'industry' => $data['industry'] ?? null,
            'seniority' => $data['seniority'] ?? null,
            'location' => $data['location'] ?? null,
            'notes' => $data['notes'] ?? null,
            'status' => TargetRole::STATUS_ACTIVE,
            'sort_order' => $activeCount,
        ]);

        return ApiResponse::success($this->serialize($role), [], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $user = $request->user();

        $role = TargetRole::query()
            ->where('user_id', $user->id)
            ->where('uuid', $id)
            ->first();

        if ($role === null) {
            return ApiResponse::error('NOT_FOUND', 'Target role not found.', [], 404);
        }

        $data = $request->validate([
            'roleName' => ['sometimes', 'string', 'max:200'],
            'industry' => ['sometimes', 'nullable', 'string', 'max:150'],
            'seniority' => ['sometimes', 'nullable', 'string', 'max:80'],
            'location' => ['sometimes', 'nullable', 'string', 'max:200'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'status' => ['sometimes', 'string', 'in:active,archived'],
            'sortOrder' => ['sometimes', 'integer', 'min:0', 'max:999'],
        ]);

        if (array_key_exists('roleName', $data)) {
            $role->role_name = $data['roleName'];
        }
        if (array_key_exists('industry', $data)) {
            $role->industry = $data['industry'];
        }
        if (array_key_exists('seniority', $data)) {
            $role->seniority = $data['seniority'];
        }
        if (array_key_exists('location', $data)) {
            $role->location = $data['location'];
        }
        if (array_key_exists('notes', $data)) {
            $role->notes = $data['notes'];
        }
        if (array_key_exists('status', $data)) {
            $role->status = $data['status'];
        }
        if (array_key_exists('sortOrder', $data)) {
            $role->sort_order = $data['sortOrder'];
        }

        $role->save();

        return ApiResponse::success($this->serialize($role));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $user = $request->user();

        $role = TargetRole::query()
            ->where('user_id', $user->id)
            ->where('uuid', $id)
            ->first();

        if ($role === null) {
            return ApiResponse::error('NOT_FOUND', 'Target role not found.', [], 404);
        }

        $role->delete();

        return ApiResponse::success(['id' => $id, 'deleted' => true]);
    }

    /** @return array<string, mixed> */
    private function serialize(TargetRole $role): array
    {
        return [
            'id' => $role->uuid,
            'roleName' => $role->role_name,
            'industry' => $role->industry,
            'seniority' => $role->seniority,
            'location' => $role->location,
            'status' => $role->status,
            'sortOrder' => $role->sort_order,
            'notes' => $role->notes,
            'createdAt' => $role->created_at?->toIso8601String(),
            'updatedAt' => $role->updated_at?->toIso8601String(),
        ];
    }
}
