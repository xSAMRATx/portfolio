<?php

use App\Http\Controllers\SpaController;
use Illuminate\Support\Facades\Route;

/*
| The React app (resources/js) handles every page itself: "/", "/admin", "/admin/projects"...
| This catch-all returns the same Blade shell for all of them, so a page refresh or a deep link works.
| Paths Laravel or the web server own (api, storage, uploads, build, up) are excluded and keep their own behaviour.
*/
Route::get('/{any?}', SpaController::class)
    ->where('any', '^(?!(?:api|storage|uploads|build)(?:/|$)|up$).*$')
    ->name('spa');
