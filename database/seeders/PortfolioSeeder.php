<?php

namespace Database\Seeders;

use App\Models\Education;
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
            'name' => 'Md. Abdul Aziz Samrat',
            'title' => 'Software Engineer · Laravel Backend & Vue/React Frontend',
            'bio' => 'Software engineer focused on Laravel backends, with Vue/Nuxt and React on the front end. '
                .'I build web applications across travel, e-commerce, ERP, HRM and CRM: RESTful APIs, payment and SMS gateway '
                .'integrations, MySQL optimisation and production servers.',
            'email' => 'mdabdulazizsamrat@gmail.com',
            'location' => 'Dhaka, Bangladesh',
            'social_links' => [
                'github' => 'https://github.com/xSAMRATx',
                'linkedin' => 'https://www.linkedin.com/in/aziz-samrat',
                'twitter' => null,
                'website' => null,
            ],
            'cv_path' => null, // upload the CV PDF from Admin → Profile
        ]);

        Skill::query()->delete();
        $skills = [
            'languages' => ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript', 'PHP', 'SQL'],
            'frameworks' => ['Laravel', 'React.js', 'Vue.js / Nuxt', 'Tailwind CSS', 'Bootstrap', 'Inertia.js'],
            'backend' => ['REST APIs', 'Eloquent / Query Builder', 'MySQL'],
            'tools' => ['Git / GitHub', 'Composer', 'Nginx', 'Postman', 'Linux server management', 'cPanel'],
        ];
        foreach ($skills as $category => $names) {
            foreach ($names as $name) {
                Skill::create(['name' => $name, 'category' => $category, 'level' => null]);
            }
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
                'description' => '16 HTML, CSS and JavaScript builds, live on GitHub Pages: Amazon, YouTube and Google clones, parallax site, restaurant, university, music and landing pages.',
                'tech_stack' => ['HTML', 'CSS', 'JavaScript'],
                'repo' => 'PROJECT',
                'live' => 'https://xsamratx.github.io/PROJECT/',
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
                'github_url' => $p['repo'] ? 'https://github.com/xSAMRATx/'.$p['repo'] : null,
                'live_url' => $p['live'] ?? null,
                'featured' => $p['featured'],
                'order' => $i + 1,
            ]);
        }

        Experience::query()->delete();
        $experiences = [
            [
                'company' => 'CSN Bangladesh Ltd',
                'role' => 'Software Engineer',
                'start_date' => '2026-06-10',
                'end_date' => null,
                'description' => "Working on CSN Travel with a Laravel API and a Vue/Nuxt front end.\n"
                    ."Built wholesaler promotional-deal syncing.\n"
                    .'Built scheduled Facebook Page auto-posting through the Meta Graph API.',
            ],
            [
                'company' => '6amTech',
                'role' => 'Software Engineer (PHP & Laravel Developer)',
                'start_date' => '2025-07-01',
                'end_date' => '2026-04-30',
                'description' => "Developed and maintained e-commerce products and client customisations.\n"
                    ."Built and maintained REST APIs for Flutter apps, tested with Postman.\n"
                    ."Integrated payment and SMS gateways.\n"
                    .'Managed server environments for stability and uptime.',
            ],
            [
                'company' => 'CodeCloud Technology',
                'role' => 'PHP & Laravel Developer',
                'start_date' => '2024-05-01',
                'end_date' => '2025-04-30',
                'description' => "Built ERP, CRM and HRM modules.\n"
                    ."Led payroll, attendance, leave and employee management features.\n"
                    ."Improved performance with advanced Laravel patterns.\n"
                    .'Worked with international clients via Fiverr and Upwork.',
            ],
            [
                'company' => 'CodeCloud Technology',
                'role' => 'Junior Laravel Developer (Internship)',
                'start_date' => '2024-02-01',
                'end_date' => '2024-05-31',
                'description' => 'Assisted on HRM and e-commerce platforms: database design, authentication and feature implementation.',
            ],
        ];
        foreach ($experiences as $e) {
            Experience::create($e);
        }

        Education::query()->delete();
        $educations = [
            ['degree', 'M.Sc. in Computer Science', 'Jahangirnagar University', '2023', 'CGPA 3.90', null],
            ['degree', 'B.Sc. in Computer Science & Engineering', 'Dhaka City College (National University)', '2021', 'CGPA 3.27', null],
            ['training', 'Web Development – PHP with Laravel', 'PONDIT (BASIS & SEIP)', 'Jun – Sep 2023', 'Awarded Top Trainee', null],
        ];
        foreach ($educations as $i => [$type, $title, $institution, $period, $result, $description]) {
            Education::create(compact('type', 'title', 'institution', 'period', 'result', 'description') + ['order' => $i + 1]);
        }
    }
}
