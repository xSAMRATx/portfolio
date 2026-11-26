<?php

namespace Tests\Feature;

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

    public function test_health_check_still_works(): void
    {
        $this->get('/up')->assertOk()->assertDontSee('<div id="root"></div>', false);
    }
}
