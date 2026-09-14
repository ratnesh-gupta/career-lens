<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class PromoteSuperAdmin extends Command
{
    protected $signature = 'admin:promote {email : User email to promote}';

    protected $description = 'Promote a user to super_admin role';

    public function handle(): int
    {
        $email = $this->argument('email');
        $user = User::query()->where('email', $email)->first();

        if ($user === null) {
            $this->error("User not found: {$email}");

            return self::FAILURE;
        }

        $user->role = User::ROLE_SUPER_ADMIN;
        $user->save();

        $this->info("Promoted {$email} to super_admin.");

        return self::SUCCESS;
    }
}
