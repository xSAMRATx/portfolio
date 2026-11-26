<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SkillRequest;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class SkillController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return SkillResource::collection(Skill::query()->latest('id')->get());
    }

    public function store(SkillRequest $request): SkillResource
    {
        return new SkillResource(Skill::create($request->validated()));
    }

    public function show(Skill $model): SkillResource
    {
        return new SkillResource($model);
    }

    public function update(SkillRequest $request, Skill $model): SkillResource
    {
        $model->update($request->validated());

        return new SkillResource($model);
    }

    public function destroy(Skill $model): Response
    {
        $model->delete();

        return response()->noContent();
    }
}
