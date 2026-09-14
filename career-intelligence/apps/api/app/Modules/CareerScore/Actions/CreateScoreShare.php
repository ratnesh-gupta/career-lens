<?php

namespace App\Modules\CareerScore\Actions;

use App\Models\CareerScore;
use Illuminate\Support\Str;

final class CreateScoreShare
{
    public function __invoke(CareerScore $score): CareerScore
    {
        if ($score->share_token && $score->is_public) {
            return $score;
        }

        $score->share_token = 'shr_'.Str::lower(Str::random(20));
        $score->is_public = true;
        $score->save();

        return $score->refresh();
    }
}
