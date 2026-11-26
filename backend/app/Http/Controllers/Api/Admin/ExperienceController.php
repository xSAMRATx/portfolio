<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ExperienceRequest;
use App\Http\Resources\ExperienceResource;
use App\Models\Experience;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ExperienceController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ExperienceResource::collection(Experience::query()->latest('id')->get());
    }

    public function store(ExperienceRequest $request): ExperienceResource
    {
        return new ExperienceResource(Experience::create($request->validated()));
    }

    public function show(Experience $model): ExperienceResource
    {
        return new ExperienceResource($model);
    }

    public function update(ExperienceRequest $request, Experience $model): ExperienceResource
    {
        $model->update($request->validated());

        return new ExperienceResource($model);
    }

    public function destroy(Experience $model): Response
    {
        $model->delete();

        return response()->noContent();
    }
}
