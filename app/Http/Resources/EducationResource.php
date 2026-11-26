<?php

namespace App\Http\Resources;

use App\Models\Education;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Education */
class EducationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'institution' => $this->institution,
            'period' => $this->period,
            'result' => $this->result,
            'description' => $this->description,
            'order' => $this->order,
        ];
    }
}
