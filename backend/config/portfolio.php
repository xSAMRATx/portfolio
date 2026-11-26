<?php

return [
    // Seeded admin account. Set these in .env before running `php artisan db:seed`.
    'admin_email' => env('ADMIN_EMAIL'),
    'admin_password' => env('ADMIN_PASSWORD'),

    // Comma separated list of frontend origins allowed by CORS.
    'frontend_urls' => array_filter(array_map('trim', explode(',', (string) env('FRONTEND_URL', 'http://localhost:5173')))),
];
