<?php

namespace App\Http\Resources;

use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

/** @mixin Profile */
class ProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'title' => $this->title,
            'bio' => $this->bio,
            'email' => $this->email,
            'location' => $this->location,
            'social_links' => (object) ($this->social_links ?? []),
            'cv_url' => $this->cv_path
                ? (Str::startsWith($this->cv_path, ['http://', 'https://']) ? $this->cv_path : url($this->cv_path))
                : null,
        ];
    }
}
