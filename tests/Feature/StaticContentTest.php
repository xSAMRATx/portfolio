<?php

namespace Tests\Feature;

use Database\Seeders\PortfolioSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * resources/js/content/portfolio.json is the built-in copy of the portfolio content: the React fallback when the API
 * is down, and the whole content of the static GitHub Pages build. It must stay identical to what the seeder creates.
 * If this fails after editing PortfolioSeeder, update the JSON too (same shape as the public API responses).
 */
class StaticContentTest extends TestCase
{
    use RefreshDatabase;

    public function test_built_in_content_matches_the_seeded_api(): void
    {
        $this->seed(PortfolioSeeder::class);

        $content = json_decode(
            file_get_contents(resource_path('js/content/portfolio.json')),
            true,
            flags: JSON_THROW_ON_ERROR,
        );

        foreach (['profile', 'skills', 'projects', 'experiences', 'educations'] as $key) {
            $this->assertSame(
                $content[$key],
                $this->getJson("/api/{$key}")->assertOk()->json('data'),
                "portfolio.json \"{$key}\" differs from the seeded /api/{$key} response.",
            );
        }
    }
}
