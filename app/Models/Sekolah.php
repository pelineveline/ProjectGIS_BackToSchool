<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sekolah extends Model
{
    protected $fillable = [
        'nama',
        'alamat',
        'garis_bujur',
        'garis_lintang',
        'foto'
    ];
}
