<?php

namespace Database\Factories;

use App\Models\CareerProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<CareerProfile>
 */
class CareerProfileFactory extends Factory
{
    protected $model = CareerProfile::class;

    public function definition(): array
    {
        $first = fake()->firstName();
        $last = fake()->lastName();

        return [
            'uuid' => (string) Str::uuid(),
            'user_id' => User::factory(),
            'first_name' => $first,
            'last_name' => $last,
            'display_name' => "{$first} {$last}",
            'headline' => fake()->jobTitle().' · '.fake()->randomElement(['React', 'TypeScript', 'Product']),
            'bio' => fake()->paragraph(),
            'location' => fake()->city().', '.fake()->countryCode(),
            'country' => fake()->countryCode(),
            'current_job_title' => fake()->jobTitle(),
            'experience_years' => fake()->randomFloat(1, 1, 20),
            'career_level' => fake()->randomElement(['junior', 'mid', 'senior', 'lead']),
            'industry' => 'Technology',
            'linkedin_url' => null,
            'github_url' => null,
            'portfolio_url' => null,
            'current_salary' => null,
            'desired_salary' => null,
            'is_open_to_work' => false,
            'is_profile_public' => false,
            'public_slug' => Str::slug($first.'-'.$last.'-'.fake()->unique()->numerify('###')),
        ];
    }
}
