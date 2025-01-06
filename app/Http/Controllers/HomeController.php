<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use Inertia\Inertia;
use App\Models\Sales;
use App\Models\Settings;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Sekolah;

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Ambil semua data sekolah
        $schools = Sekolah::all();

        // Kirim data ke komponen Home
        return Inertia::render('Home', [
            'schools' => $schools
        ]);
    }

    public function getSchools()
    {
        // Ambil data dari database
        $schools = Sekolah::select('nama', 'alamat', 'garis_bujur', 'garis_lintang')->get();

        // Format data ke GeoJSON
        $features = $schools->map(function ($school) {
            return [
                'type' => 'Feature',
                'geometry' => [
                    'type' => 'Point',
                    'coordinates' => [$school->garis_bujur, $school->garis_lintang],
                ],
                'properties' => [
                    'Nama_Sekol' => $school->nama,
                    'Alamat' => $school->alamat,
                ],
            ];
        });

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features,
        ]);
    }

    public function getSchoolsList()
    {
        // Ambil data dari database
        $schools = Sekolah::select('id', 'nama', 'alamat')->get();

        // Format data sesuai kebutuhan React
        $formattedSchools = $schools->map(function ($school, $index) {
            return [
                'id' => $school->id,
                'nama' => $school->nama,
                'alamat' => $school->alamat,
                'tipe' => strtoupper(substr($school->nama, 0, 3)), // Ekstrak tipe dari nama sekolah
            ];
        });

        return response()->json($formattedSchools);
    }

    public function getSchoolDetail($id)
    {
        // Ambil data sekolah berdasarkan ID
        $school = Sekolah::find($id);

        // Jika data tidak ditemukan, kembalikan respons 404
        if (!$school) {
            return response()->json(['message' => 'School not found'], 404);
        }

        // Buat URL untuk foto
        $fotoUrl = $school->foto
            ? asset('storage/sekolah/' . $school->foto) // Gunakan asset helper untuk membuat URL
            : asset('storage/sekolah/placeholder.jpg'); // URL gambar default jika tidak ada foto

        return response()->json([
            'id' => $school->id,
            'nama' => $school->nama,
            'alamat' => $school->alamat,
            'garis_bujur' => $school->garis_bujur,
            'garis_lintang' => $school->garis_lintang,
            'foto' => $fotoUrl, // Kembalikan URL foto
        ]);
    }




    // Endpoint GeoJSON
    public function geojson(Request $request)
    {
        $data = [
            "type" => "FeatureCollection",
            "features" => [
                [
                    "type" => "Feature",
                    "properties" => ["name" => "Area 1", "color" => "red"],
                    "geometry" => [
                        "type" => "Polygon",
                        "coordinates" => [
                            [
                                [102.0, 0.0],
                                [103.0, 0.0],
                                [103.0, 1.0],
                                [102.0, 1.0],
                                [102.0, 0.0],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        return response()->json($data)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}
