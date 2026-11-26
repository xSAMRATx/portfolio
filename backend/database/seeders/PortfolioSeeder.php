<?php

namespace Database\Seeders;

use App\Models\Experience;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        Profile::query()->delete();
        Profile::create([
            'name' => 'MD. ABDUL AZIZ SAMRAT',
            'title' => 'Full-Stack Developer (Laravel & JavaScript)',
            'bio' => "I build web applications with Laravel on the backend and modern JavaScript frameworks on the frontend.\n"
                .'This is placeholder text — update it from the admin panel (Profile).',
            'email' => 'you@example.com', // placeholder: change in admin → Profile
            'location' => 'Bangladesh',
            'social_links' => [
                'github' => 'https://github.com/xSAMRATx',
                'linkedin' => null,
                'twitter' => null,
                'website' => null,
            ],
            'cv_path' => null, // e.g. put cv.pdf in public/ and set this to /cv.pdf
        ]);

        Skill::query()->delete();
        foreach ([
            ['PHP', 'backend', 90],
            ['Laravel', 'backend', 90],
            ['MySQL', 'database', 80],
            ['Vue / Nuxt', 'frontend', 85],
            ['React', 'frontend', 75],
            ['TypeScript', 'frontend', 70],
            ['Tailwind CSS', 'frontend', 80],
            ['Bootstrap', 'frontend', 85],
            ['Git', 'tools', 85],
        ] as [$name, $category, $level]) {
            Skill::create(compact('name', 'category', 'level'));
        }

        Project::query()->delete();
        $projects = [
            [
                'title' => 'Role-Based Authentication',
                'description' => 'Laravel custom role-based auth system with manual login, permissions, and middleware (no external packages).',
                'tech_stack' => ['PHP', 'Laravel'],
                'repo' => 'role-based-authentication',
                'featured' => true,
            ],
            [
                'title' => 'Laravel React Inertia CRUD',
                'description' => 'A CRUD application built with Laravel, React and Inertia.',
                'tech_stack' => ['Laravel', 'React', 'Inertia', 'TypeScript'],
                'repo' => 'LARAVEL_REACT_INERTIA_CRUD',
                'featured' => true,
            ],
            [
                'title' => 'Front-end design collection',
                'description' => 'A collection of front-end design builds: Amazon clone, YouTube clone, Google home page, parallax site, restaurant, university, music and landing pages.',
                'tech_stack' => ['HTML', 'CSS'],
                'repo' => 'PROJECT',
                'featured' => true,
            ],
            [
                'title' => 'Laravel Inertia Vue UI',
                'description' => 'User interface built with Laravel, Inertia and Vue.',
                'tech_stack' => ['Laravel', 'Inertia', 'Vue'],
                'repo' => 'User_Interface_Laravel_Inertia_Vue',
                'featured' => false,
            ],
            [
                'title' => 'ERP Sales Module',
                'description' => 'Sales module for an ERP system, built with Laravel and Blade.',
                'tech_stack' => ['Laravel', 'Blade'],
                'repo' => 'erp_sales_module',
                'featured' => false,
            ],
        ];

        foreach ($projects as $i => $p) {
            Project::create([
                'title' => $p['title'],
                'description' => $p['description'],
                'tech_stack' => $p['tech_stack'],
                'image' => null,
                'github_url' => 'https://github.com/xSAMRATx/'.$p['repo'],
                'live_url' => null,
                'featured' => $p['featured'],
                'order' => $i + 1,
            ]);
        }

        // Placeholder experience — replace with real roles from the CV via admin → Experience.
        Experience::query()->delete();
        Experience::create([
            'company' => 'Your Company (placeholder)',
            'role' => 'Full-Stack Developer',
            'start_date' => '2024-01-01',
            'end_date' => null,
            'description' => 'Placeholder — describe your current role, the stack you use and what you build.',
        ]);
        Experience::create([
            'company' => 'Previous Company (placeholder)',
            'role' => 'Junior Web Developer',
            'start_date' => '2022-01-01',
            'end_date' => '2023-12-31',
            'description' => 'Placeholder — describe your earlier role.',
        ]);
    }
}
