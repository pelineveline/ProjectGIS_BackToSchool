<?php

namespace App\Http\Controllers;

use App\Models\Sekolah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use DB;

class AdminController extends Controller
{
    // Path ke file JSON
    private $filePath = 'public/sekolahOke.json';

    public function login(Request $request)
    {
        $gUser = Socialite::driver('google')->user();

        $user = User::where('email', $gUser->getEmail())->first();

        if ($user) {
            Auth::login($user);
            session(['user_id' => $user->id, 'isAdmin' => $user->is_admin]);

            return redirect('/');
        } else {
            return redirect('/admin-login')->with('error', 'Email Tidak Terdaftar.');
        }
    }


    public function logout(Request $request)
    {
        $user = auth('web')->user();

        auth('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Read all data (Retrieve)
     */
    public function index()
    {
        if (File::exists(storage_path('app/public/sekolahOke.json'))) {
            $data = json_decode(File::get(storage_path('app/public/sekolahOke.json')), true);
            $sekolahCollection = collect($data['features']); // Gunakan collect jika diperlukan
            return response()->json(['features' => $sekolahCollection->toArray()], 200);
        } else {
            return response()->json(['message' => 'File not found'], 404);
        }
    }

    public function show($id)
    {
        $data = \App\Models\Sekolah::find($id);

        if (!$data) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        return response()->json($data);
    }


    /**
     * Create new data
     */
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string|max:500',
            'garis_bujur' => 'required|numeric',
            'garis_lintang' => 'required|numeric',
            'foto' => 'nullable|image|max:2048',
        ]);

        // Simpan data ke database
        $data = Sekolah::updateOrCreate(
            ['id' => $request->id],
            $request->except('images'
            )
        );

        // Simpan foto jika ada
        if ($request->hasFile('images')) {
            // Hapus gambar lama jika ada
            if ($data->foto) {
                Storage::disk('public')->delete($data->image_path); // Hapus gambar lama dari storage
            }

            // Simpan file gambar baru dan dapatkan pathnya
            $imagePath = $request->file('images')->store('productImage/' . Str::random(), 'public');

            // Simpan path gambar baru ke dalam field image_path produk yang sama
            $data->image_path = $imagePath;
            $data->save(); // Simpan perubahan ke database
        }

        return response()->json(['message' => 'Data created successfully', 'data' => $data]);
    }


    /**
     * Update data
     */
    public function update(Request $request, $id)
    {
        $data = \App\Models\Sekolah::find($id);
        if (!$data) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string|max:500',
            'garis_bujur' => 'required|numeric',
            'garis_lintang' => 'required|numeric',
            'foto' => 'nullable|image|max:2048',
        ]);

        // Update data
        $data->update([
            'nama' => $request->nama,
            'alamat' => $request->alamat,
            'garis_bujur' => $request->garis_bujur,
            'garis_lintang' => $request->garis_lintang,
        ]);

        // Simpan foto jika ada
        if ($request->hasFile('foto')) {
            // Hapus gambar lama jika ada
            if ($data->foto) {
                Storage::disk('public')->delete($data->foto);
            }

            // Simpan file gambar baru dan update path
            $imagePath = $request->file('foto')->store('schoolImages', 'public');
            $data->foto = $imagePath;
            $data->save();
        }

        return response()->json(['message' => 'Data updated successfully', 'data' => $data]);
    }



    /**
     * Delete data
     */
    public function destroy($id)
    {
        try {
            // Hapus item dari tabel
            // \App\Models\Sekolah::find('id', $id)->delete();
            DB::table("sekolahs")->where('id', $id)->delete();

            // Flash message sukses
            // Kembalikan respons sukses
            return response()->json(['message' => 'Data deleted successfully']);
        } catch (\Exception $e) {
            // Flash error jika terjadi masalah
            session()->flash('error', 'Failed to delete the item.');

            // Redirect dengan flash error
            return redirect()->back();
        }
    }
}
