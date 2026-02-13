<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solicitudes_adopcion', function (Blueprint $table) {
            $table->id('id_solicitud');
            $table->unsignedBigInteger('id_cliente');
            $table->unsignedBigInteger('id_mascota');
            $table->date('fecha_solicitud')->nullable();
            $table->enum('estado', ['pendiente', 'aprobada', 'rechazada'])->default('pendiente');
            
            $table->foreign('id_cliente')->references('id_usuario')->on('usuarios');
            $table->foreign('id_mascota')->references('id_mascota')->on('mascotas');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitudes_adopcion');
    }
};