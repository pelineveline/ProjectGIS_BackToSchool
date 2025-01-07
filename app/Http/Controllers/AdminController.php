<?php

namespace App\Http\Controllers;

use App\Models\Sekolah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use DB;
use Inertia\Inertia;

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

        // Simpan atau update data ke database
        $data = Sekolah::updateOrCreate(
            ['id' => $request->id], // Jika ID ada, update, jika tidak, buat baru
            $request->except('foto') // Kecualikan foto untuk sementara
        );

        // Simpan file foto jika ada
        if ($request->hasFile('foto')) {
            // Hapus gambar lama jika ada (hanya jika update)
            if ($data->foto) {
                Storage::disk('public')->delete('sekolah/' . $data->foto);
            }

            // Simpan file gambar baru
            $fileName = time() . '_' . Str::random(10) . '.' . $request->file('foto')->getClientOriginalExtension();
            $request->file('foto')->storeAs('sekolah', $fileName, 'public');

            // Simpan nama file ke dalam field `foto`
            $data->foto = $fileName;
            $data->save(); // Simpan perubahan ke database
        }

        return Inertia::location('/list-sekolah');
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

        return Inertia::location('/list-sekolah');
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
            return Inertia::location('/list-sekolah');
        } catch (\Exception $e) {
            // Flash error jika terjadi masalah
            session()->flash('error', 'Failed to delete the item.');

            // Redirect dengan flash error
            return Inertia::location('/list-sekolah');
        }
    }

    public function destroyAdmin($id)
    {
        try {
            // Hapus item dari tabel
            // \App\Models\Sekolah::find('id', $id)->delete();
            DB::table("users")->where('id', $id)->delete();

            // Flash message sukses
            // Kembalikan respons sukses
            return Inertia::location('/list-admin');
        } catch (\Exception $e) {
            // Flash error jika terjadi masalah
            session()->flash('error', 'Failed to delete the item.');

            // Redirect dengan flash error
            return redirect('/list-admin');
        }
    }

    public function storeAdmin(Request $request)
    {
        // Validasi input
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:500,' . $request->id,
        ]);

        // Simpan atau update data ke database
        $data = User::updateOrCreate(
            ['id' => $request->id], // Cari berdasarkan ID (jika ada, update; jika tidak, buat baru)
            [
                'name' => $request->name,
                'email' => $request->email,
            ]
        );

        return Inertia::location('/list-admin');
    }

    public function getAdminList()
    {
        // Ambil data dari database
        $schools = User::select('id', 'name', 'email')->get();

        // Format data sesuai kebutuhan React
        $formattedSchools = $schools->map(function ($school, $index) {
            return [
                'id' => $school->id,
                'name' => $school->name,
                'email' => $school->email
            ];
        });

        return response()->json($formattedSchools);
    }
}
