<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CvUploadRequest;
use App\Http\Requests\Admin\ProfileRequest;
use App\Http\Resources\ProfileResource;
use App\Models\Profile;

class ProfileController extends Controller
{
    public function show(): ProfileResource
    {
        return new ProfileResource(Profile::current());
    }

    public function update(ProfileRequest $request): ProfileResource
    {
        $profile = Profile::current();
        $profile->update($request->validated());

        return new ProfileResource($profile);
    }

    /** Upload the CV PDF to public/uploads and point the profile at it. */
    public function uploadCv(CvUploadRequest $request): ProfileResource
    {
        $request->file('cv')->move(public_path('uploads'), 'cv.pdf');

        $profile = Profile::current();
        $profile->update(['cv_path' => '/uploads/cv.pdf?v='.time()]);

        return new ProfileResource($profile);
    }

    public function removeCv(): ProfileResource
    {
        @unlink(public_path('uploads/cv.pdf'));

        $profile = Profile::current();
        $profile->update(['cv_path' => null]);

        return new ProfileResource($profile);
    }
}
