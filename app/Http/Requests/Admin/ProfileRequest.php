<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'title' => ['required', 'string', 'max:150'],
            'bio' => ['required', 'string', 'max:5000'],
            'email' => ['required', 'email', 'max:150'],
            'location' => ['nullable', 'string', 'max:150'],
            'social_links' => ['nullable', 'array'],
            'social_links.*' => ['nullable', 'url', 'max:255'],
            'cv_path' => ['nullable', 'string', 'max:255'],
        ];
    }
}
