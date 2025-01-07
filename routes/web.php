<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AdminController;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;

// Halaman utama
Route::get('/peta', [HomeController::class, 'index'])->name('home');
Route::get('/', function () {
    return Inertia::render('Dashboard');
});

Route::get('/api/schools', [HomeController::class, 'getSchools']);
Route::get('/api/schools-list', [HomeController::class, 'getSchoolsList']);
Route::get('/api/schools/{id}', [HomeController::class, 'getSchoolDetail']);

Route::get('/api/schools-list/{id}', [AdminController::class, 'show']); // Mendapatkan data berdasarkan ID
Route::post('/api/schools-list/store', [AdminController::class, 'store']);
// Route::put('/api/schools-list/{id}', [AdminController::class, 'update']);
Route::delete('/api/schools-list/{id}', [AdminController::class, 'destroy']);

Route::delete('/api/admin-list/{id}', [AdminController::class, 'destroyAdmin']);
Route::get('/api/admin-list', [AdminController::class, 'getAdminList']);
Route::post('/api/admin-list/store', [AdminController::class, 'storeAdmin']);

Route::get('/api/check-role', action: function () {
    return response()->json(['isAdmin' => session('isAdmin')]);
});

// Halaman list sekolah
Route::get('/list-sekolah', function () {
    return Inertia::render('ListSekolah');
})->name('list-sekolah');

Route::get('/list-admin', function () {
    return Inertia::render('ListAdmin');
});

// Halaman login
Route::get('/login', function () {
    return Inertia::render('Login');
});
Route::get('/auth/google/redirect', function (Request $request) {
    return Socialite::driver("google")->redirect();
});
Route::get('/auth/google/callback', [AdminController::class, 'login']);
Route::get('/admin/logout', [AdminController::class, 'logout']);

// Post Login
Route::post('/login', [ProfileController::class, 'login'])->name('login');

// API GeoJSON
Route::get('/geojson', [HomeController::class, 'geojson'])->name('geojson');

Route::get('/sekolah/{id}', function ($id) {
    return Inertia::render('DetailSekolah', [
        'id' => $id,
    ]);
})->name('sekolah.detail');

// CRUD Routes
Route::get('/profiles', [ProfileController::class, 'index'])->name('profiles.index'); // List semua data
Route::post('/profiles', [ProfileController::class, 'store'])->name('profiles.store'); // Tambahkan data baru
Route::get('/profiles/{id}', [ProfileController::class, 'show'])->name('profiles.show'); // Lihat data berdasarkan ID
Route::put('/profiles/{id}', [ProfileController::class, 'update'])->name('profiles.update'); // Update data berdasarkan ID
Route::delete('/profiles/{id}', [ProfileController::class, 'destroy'])->name('profiles.destroy'); // Hapus data berdasarkan ID

Route::get('/list-sekolah-admin', function () {
    return Inertia::render('ListSekolahAdmin');
})->name('listSekolahAdmin');

Route::middleware('App\Http\Middleware\AdminAuth')->group(function () {
    Route::post('/admin/schools', [AdminController::class, 'store']);
    Route::get('/admin/sekolah', [AdminController::class, 'index']);
    Route::post('/admin/sekolah', [AdminController::class, 'store']);
    Route::put('/admin/sekolah/{id}', [AdminController::class, 'update']);
    Route::delete('/admin/sekolah/{id}', [AdminController::class, 'destroy']);
});


// require __DIR__ . '/auth.php';
