<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContactMessageResource;
use App\Models\ContactMessage;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ContactMessageController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ContactMessageResource::collection(ContactMessage::latest()->get());
    }

    public function markRead(ContactMessage $message): ContactMessageResource
    {
        $message->update(['read_at' => $message->read_at ?? now()]);

        return new ContactMessageResource($message);
    }

    public function destroy(ContactMessage $message): Response
    {
        $message->delete();

        return response()->noContent();
    }
}
