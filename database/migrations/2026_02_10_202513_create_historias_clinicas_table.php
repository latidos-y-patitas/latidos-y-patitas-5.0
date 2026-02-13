<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historias_clinicas', function (Blueprint $table) {
            $table->id('id_historia');
            $table->unsignedBigInteger('id_mascota')->unique();
            $table->date('fecha_apertura')->nullable();
            $table->enum('estado', ['activa', 'cerrada'])->default('activa');
            
            $table->foreign('id_mascota')->references('id_mascota')->on('mascotas');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historias_clinicas');
    }
};