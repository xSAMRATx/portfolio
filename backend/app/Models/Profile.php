<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = ['name', 'title', 'bio', 'email', 'location', 'social_links', 'cv_path'];

    protected function casts(): array
    {
        return ['social_links' => 'array'];
    }

    /** The portfolio has a single profile row. */
    public static function current(): self
    {
        return static::query()->firstOrFail();
    }
}
