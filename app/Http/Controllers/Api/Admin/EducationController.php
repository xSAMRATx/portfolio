<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EducationRequest;
use App\Http\Resources\EducationResource;
use App\Models\Education;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class EducationController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return EducationResource::collection(Education::query()->orderBy('order')->get());
    }

    public function store(EducationRequest $request): EducationResource
    {
        return new EducationResource(Education::create($request->validated()));
    }

    public function show(Education $model): EducationResource
    {
        return new EducationResource($model);
    }

    public function update(EducationRequest $request, Education $model): EducationResource
    {
        $model->update($request->validated());

        return new EducationResource($model);
    }

    public function destroy(Education $model): Response
    {
        $model->delete();

        return response()->noContent();
    }
}
