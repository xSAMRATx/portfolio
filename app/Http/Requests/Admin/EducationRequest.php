<?php

namespace App\Http\Requests\Admin;

use App\Models\Education;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EducationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(Education::TYPES)],
            'title' => ['required', 'string', 'max:150'],
            'institution' => ['required', 'string', 'max:150'],
            'period' => ['nullable', 'string', 'max:50'],
            'result' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:2000'],
            'order' => ['integer', 'min:0'],
        ];
    }
}
