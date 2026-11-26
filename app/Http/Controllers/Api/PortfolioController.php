<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EducationResource;
use App\Http\Resources\ExperienceResource;
use App\Http\Resources\ProfileResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\SkillResource;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PortfolioController extends Controller
{
    public function profile(): ProfileResource
    {
        return new ProfileResource(Profile::current());
    }

    public function skills(): AnonymousResourceCollection
    {
        return SkillResource::collection(Skill::orderBy('id')->get());
    }

    public function projects(): AnonymousResourceCollection
    {
        return ProjectResource::collection(Project::ordered()->get());
    }

    public function experiences(): AnonymousResourceCollection
    {
        return ExperienceResource::collection(Experience::latestFirst()->get());
    }

    public function educations(): AnonymousResourceCollection
    {
        return EducationResource::collection(Education::orderBy('order')->get());
    }
}
