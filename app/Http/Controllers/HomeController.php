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

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Home');
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
