<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    public const CATEGORIES = ['languages', 'frameworks', 'backend', 'tools', 'other'];

    protected $fillable = ['name', 'category', 'level'];

    protected function casts(): array
    {
        return ['level' => 'integer'];
    }
}
