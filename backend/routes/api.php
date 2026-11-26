<?php

use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\ContactMessageController;
use App\Http\Controllers\Api\Admin\ExperienceController;
use App\Http\Controllers\Api\Admin\ProfileController;
use App\Http\Controllers\Api\Admin\ProjectController;
use App\Http\Controllers\Api\Admin\SkillController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\PortfolioController;
use Illuminate\Support\Facades\Route;

// Public portfolio API
Route::get('/profile', [PortfolioController::class, 'profile']);
Route::get('/skills', [PortfolioController::class, 'skills']);
Route::get('/projects', [PortfolioController::class, 'projects']);
Route::get('/experiences', [PortfolioController::class, 'experiences']);
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:contact');

// Admin API (Sanctum bearer tokens)
Route::prefix('admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);

        Route::apiResource('skills', SkillController::class)->parameters(['skills' => 'model']);
        Route::apiResource('projects', ProjectController::class)->parameters(['projects' => 'model']);
        Route::apiResource('experiences', ExperienceController::class)->parameters(['experiences' => 'model']);

        Route::get('/messages', [ContactMessageController::class, 'index']);
        Route::patch('/messages/{message}/read', [ContactMessageController::class, 'markRead']);
        Route::delete('/messages/{message}', [ContactMessageController::class, 'destroy']);
    });
});
