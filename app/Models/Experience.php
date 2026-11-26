<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = ['company', 'role', 'start_date', 'end_date', 'description'];

    protected function casts(): array
    {
        return ['start_date' => 'date', 'end_date' => 'date'];
    }

    public function scopeLatestFirst(Builder $query): Builder
    {
        // Current roles (no end date) first, then most recent.
        return $query->orderByRaw('end_date is not null')->orderByDesc('start_date');
    }
}
