<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mascotas', function (Blueprint $table) {
            $table->id('id_mascota');
            $table->string('nombre', 100)->nullable();
            $table->string('especie', 50)->nullable();
            $table->string('raza', 100)->nullable();
            $table->integer('edad')->nullable();
            $table->string('sexo', 10)->nullable();
            $table->text('descripcion')->nullable();
            $table->enum('estado', ['disponible', 'adoptada'])->default('disponible');
            $table->date('fecha_publicacion')->nullable();
            $table->unsignedBigInteger('id_admin');
            
            $table->foreign('id_admin')->references('id_usuario')->on('usuarios');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mascotas');
    }
};