<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('sekolahs', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->string('nama');
            $table->string('alamat');
            $table->float('garis_bujur');
            $table->float('garis_lintang');
            $table->string('foto')->nullable();
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sekolahs');
    }
};
