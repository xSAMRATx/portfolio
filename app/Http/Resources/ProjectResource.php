<?php

namespace App\Http\Resources;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

/** @mixin Project */
class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'tech_stack' => $this->tech_stack ?? [],
            'image_url' => $this->image
                ? (Str::startsWith($this->image, ['http://', 'https://']) ? $this->image : url($this->image))
                : null,
            'github_url' => $this->github_url,
            'live_url' => $this->live_url,
            'featured' => $this->featured,
            'order' => $this->order,
        ];
    }
}
