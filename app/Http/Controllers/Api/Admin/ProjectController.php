<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ProjectController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ProjectResource::collection(Project::query()->latest('id')->get());
    }

    public function store(ProjectRequest $request): ProjectResource
    {
        return new ProjectResource(Project::create($request->validated()));
    }

    public function show(Project $model): ProjectResource
    {
        return new ProjectResource($model);
    }

    public function update(ProjectRequest $request, Project $model): ProjectResource
    {
        $model->update($request->validated());

        return new ProjectResource($model);
    }

    public function destroy(Project $model): Response
    {
        $model->delete();

        return response()->noContent();
    }
}
