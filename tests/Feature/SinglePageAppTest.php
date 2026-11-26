<?php

namespace Tests\Feature;

use App\Models\Profile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SinglePageAppTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_home_and_admin_deep_links_return_the_react_shell(): void
    {
        foreach (['/', '/admin', '/admin/login', '/admin/projects', '/some/unknown/page'] as $path) {
            $this->get($path)
                ->assertOk()
                ->assertSee('<div id="root"></div>', false);
        }
    }

    public function test_api_routes_are_not_swallowed_by_the_react_shell(): void
    {
        $this->getJson('/api/skills')->assertOk();
        $this->getJson('/api/does-not-exist')->assertNotFound()->assertJsonStructure(['message']);
        $this->getJson('/api/admin/me')->assertUnauthorized();
    }

    public function test_shell_has_seo_tags_from_the_profile_and_hides_admin_from_search_engines(): void
    {
        Profile::query()->create([
            'name' => 'Jane Doe',
            'title' => 'Laravel Developer',
            'bio' => "First paragraph intro.\n\nSecond paragraph.",
            'email' => 'jane@example.com',
            'social_links' => [],
        ]);

        $this->get('/')
            ->assertOk()
            ->assertSee('<title>Jane Doe | Laravel Developer</title>', false)
            ->assertSee('<meta property="og:description" content="First paragraph intro." />', false)
            ->assertDontSee('noindex', false);

        $this->get('/admin/projects')->assertOk()->assertSee('noindex, nofollow', false);
    }

    public function test_health_check_still_works(): void
    {
        $this->get('/up')->assertOk()->assertDontSee('<div id="root"></div>', false);
    }
}
