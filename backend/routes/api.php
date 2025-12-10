<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;

Route::get('/', function() {
    redirect('/login');
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware(['auth:sanctum'])->group(function() {
    Route::get('/user', [UserController::class, 'userData']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/get', [ProductController::class, 'listUserProducts']);
    Route::post('/products/buy', [ProductController::class, 'buyProduct']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:sanctum', 'is_admin'])->group(function() {
    Route::post('/admin/products', [ProductController::class, 'store']);
});