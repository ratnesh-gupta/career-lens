<?php

/*
|--------------------------------------------------------------------------
| Pest configuration
|--------------------------------------------------------------------------
|
| Feature tests need the Laravel application TestCase so helpers like
| getJson() / postJson() are available on $this.
|
| Opt into RefreshDatabase per-file when a test needs migrations:
|   uses(Illuminate\Foundation\Testing\RefreshDatabase::class);
|
*/

pest()->extend(Tests\TestCase::class)->in('Feature');
