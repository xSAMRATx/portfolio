<?php

namespace App\Http\Requests\Admin;

use App\Models\Skill;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'category' => ['required', Rule::in(Skill::CATEGORIES)],
            'level' => ['required', 'integer', 'between:0,100'],
        ];
    }
}
