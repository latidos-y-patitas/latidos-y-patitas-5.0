<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('citas', function (Blueprint $table) {
            $table->id('id_cita');
            $table->unsignedBigInteger('id_cliente');
            $table->unsignedBigInteger('id_disponibilidad');
            $table->string('motivo', 255)->nullable();
            $table->enum('estado', ['pendiente', 'confirmada', 'cancelada'])->default('pendiente');
            $table->timestamp('fecha_creacion')->useCurrent();
            
            $table->foreign('id_cliente')->references('id_usuario')->on('usuarios');
            $table->foreign('id_disponibilidad')->references('id_disponibilidad')->on('disponibilidad_citas');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('citas');
    }
};