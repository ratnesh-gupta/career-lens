<?php

/**
 * Versioned Career Score configuration.
 * Changing CURRENT without a new version key is a breaking change — add a new version instead.
 */
return [

    'current_version' => env('CAREER_SCORE_VERSION', 'r1a-1.0'),

    'versions' => [

        /*
        | R1a production weights (sum = 1.0).
        | Categories match engineering baseline score items.
        */
        'r1a-1.0' => [
            'weights' => [
                'profile_completeness' => 0.20,
                'resume_quality' => 0.20,
                'experience' => 0.20,
                'skill_alignment' => 0.15,
                'career_progression' => 0.15,
                'target_role_alignment' => 0.10,
            ],
            'labels' => [
                'profile_completeness' => 'Profile Completeness',
                'resume_quality' => 'Resume Quality',
                'experience' => 'Experience',
                'skill_alignment' => 'Skill Alignment',
                'career_progression' => 'Career Progression',
                'target_role_alignment' => 'Target Role Alignment',
            ],
        ],

        // Kept for historical score rows generated during #5
        'r1a-stub-1.0' => [
            'weights' => [
                'profile_completeness' => 0.25,
                'experience_signal' => 0.20,
                'skills_signal' => 0.20,
                'positioning' => 0.15,
                'market_alignment' => 0.10,
                'evidence_resume' => 0.10,
            ],
            'labels' => [
                'profile_completeness' => 'Profile Completeness',
                'experience_signal' => 'Experience Signal',
                'skills_signal' => 'Skills Signal',
                'positioning' => 'Positioning',
                'market_alignment' => 'Market Alignment',
                'evidence_resume' => 'Evidence Resume',
            ],
        ],
    ],
];
