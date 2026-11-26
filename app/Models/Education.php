<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    public const TYPES = ['degree', 'training'];

    protected $table = 'educations';

    protected $fillable = ['type', 'title', 'institution', 'period', 'result', 'description', 'order'];

    protected function casts(): array
    {
        return ['order' => 'integer'];
    }
}
