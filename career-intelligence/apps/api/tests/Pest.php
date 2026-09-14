<?php

/*
|--------------------------------------------------------------------------
| Pest configuration
|--------------------------------------------------------------------------
|
| Feature tests need the Laravel application TestCase so helpers like
| getJson() / postJson() are available on $this.
|
*/

pest()->extend(Tests\TestCase::class)
    ->use(Illuminate\Foundation\Testing\RefreshDatabase::class)
    ->in('Feature');
