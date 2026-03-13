<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disponibilidad_citas', function (Blueprint $table) {
            $table->id('id_disponibilidad');
            $table->unsignedBigInteger('id_veterinario');
            $table->date('fecha');
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->enum('estado', ['disponible', 'reservada'])->default('disponible');
            
            $table->foreign('id_veterinario')->references('id_veterinario')->on('veterinarios');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disponibilidad_citas');
    }
};