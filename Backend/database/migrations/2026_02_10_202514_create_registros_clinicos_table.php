<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registros_clinicos', function (Blueprint $table) {
            $table->id('id_registro');
            $table->unsignedBigInteger('id_historia');
            $table->unsignedBigInteger('id_veterinario');
            $table->date('fecha')->nullable();
            $table->text('diagnostico')->nullable();
            $table->text('tratamiento')->nullable();
            $table->text('observaciones')->nullable();
            $table->decimal('peso', 5, 2)->nullable();
            $table->decimal('temperatura', 4, 2)->nullable();
            
            $table->foreign('id_historia')->references('id_historia')->on('historias_clinicas');
            $table->foreign('id_veterinario')->references('id_veterinario')->on('veterinarios');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registros_clinicos');
    }
};