<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

/**
 * Returns the Blade shell that boots the React app.
 * The profile is read here only to fill the SEO / social preview tags, so links shared
 * on LinkedIn, Facebook etc. show the real name, title and intro.
 */
class SpaController extends Controller
{
    public function __invoke(Request $request): View
    {
        // The shell must still load if the database is not ready yet (the React app shows its own fallback).
        $profile = rescue(fn () => Profile::query()->first(), null, report: false);

        $name = $profile?->name ?? config('app.name');
        $title = $profile ? "{$profile->name} | {$profile->title}" : config('app.name');
        $intro = $profile ? Str::of($profile->bio)->explode("\n")->map(fn ($p) => trim($p))->filter()->first() : null;

        return view('app', [
            'metaTitle' => $title,
            'metaName' => $name,
            'metaDescription' => Str::limit($intro ?? (string) $profile?->title, 160),
            'canonical' => $request->url(),
            'noIndex' => $request->is('admin', 'admin/*'),
        ]);
    }
}
