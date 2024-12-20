<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;

// Halaman utama
Route::get('/', [HomeController::class, 'index'])->name('home');

// Halaman list sekolah
Route::get('/list-sekolah', function () {
    return Inertia::render('ListSekolah');
})->name('list-sekolah');

// Halaman login
Route::get('/login', function () {
    return Inertia::render('Login');
})->name('login');

// API GeoJSON
Route::get('/geojson', [HomeController::class, 'geojson'])->name('geojson');

Route::get('/sekolah/{id}', function ($id) {
    return Inertia::render('DetailSekolah', [
        'id' => $id,
    ]);
})->name('sekolah.detail');

require __DIR__ . '/auth.php';
