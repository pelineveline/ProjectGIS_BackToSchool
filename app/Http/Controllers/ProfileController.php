<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\File;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    // Path ke file JSON
    private $filePath = 'public/akun.json';

    // Helper untuk membaca file JSON
    private function readJson()
    {
        $path = base_path($this->filePath);
        if (!File::exists($path)) {
            return [];
        }
        $json = File::get($path);
        return json_decode($json, true);
    }

    // Helper untuk menulis ke file JSON
    private function writeJson($data)
    {
        $path = base_path($this->filePath);
        File::put($path, json_encode($data, JSON_PRETTY_PRINT));
    }

    // Tampilkan semua data
    public function index()
    {
        $data = $this->readJson();
        return response()->json($data);
    }

    // Tambahkan data baru
    public function store(Request $request)
    {
        $data = $this->readJson();
        $newId = count($data) > 0 ? end($data)['id'] + 1 : 1;

        $newData = [
            'id' => $newId,
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ];

        $data[] = $newData;
        $this->writeJson($data);

        return response()->json(['message' => 'Data added successfully', 'data' => $newData]);
    }

    // Tampilkan data berdasarkan ID
    public function show($id)
    {
        $data = $this->readJson();
        $item = collect($data)->firstWhere('id', $id);

        if (!$item) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        return response()->json($item);
    }

    // Perbarui data berdasarkan ID
    public function update(Request $request, $id)
    {
        $data = $this->readJson();
        $index = collect($data)->search(fn($item) => $item['id'] == $id);

        if ($index === false) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $data[$index]['name'] = $request->name ?? $data[$index]['name'];
        $data[$index]['email'] = $request->email ?? $data[$index]['email'];
        if ($request->password) {
            $data[$index]['password'] = bcrypt($request->password);
        }

        $this->writeJson($data);

        return response()->json(['message' => 'Data updated successfully', 'data' => $data[$index]]);
    }

    // Hapus data berdasarkan ID
    public function destroy($id)
    {
        $data = $this->readJson();
        $filteredData = collect($data)->reject(fn($item) => $item['id'] == $id)->values();

        if (count($data) == count($filteredData)) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $this->writeJson($filteredData);

        return response()->json(['message' => 'Data deleted successfully']);
    }

    public function login(Request $request)
    {
        // Validasi input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Baca data dari akun.json
        $data = $this->readJson();

        // Cari pengguna berdasarkan email
        $user = collect($data)->firstWhere('email', $request->email);

        if (!$user) {
            return redirect()->back()->withErrors(['email' => 'Email not found']);
        }

        // Verifikasi password
        if (!password_verify($request->password, $user['password'])) {
            return redirect()->back()->withErrors(['password' => 'Invalid password']);
        }

        // Simpan data pengguna di session
        session(['user' => $user]);

        // Redirect ke halaman listSekolahAdmin
        return redirect()->route('listSekolahAdmin');
    }
}
