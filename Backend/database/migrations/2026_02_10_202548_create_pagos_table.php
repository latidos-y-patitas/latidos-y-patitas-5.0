<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pagos', function (Blueprint $table) {
            $table->id('id_pago');
            $table->unsignedBigInteger('id_cita')->unique();
            $table->unsignedBigInteger('id_metodo_pago');
            $table->decimal('monto', 10, 2);
            $table->date('fecha_pago')->nullable();
            $table->enum('estado', ['pendiente', 'pagado', 'rechazado'])->default('pendiente');
            $table->string('referencia', 100)->nullable();
            
            $table->foreign('id_cita')->references('id_cita')->on('citas');
            $table->foreign('id_metodo_pago')->references('id_metodo_pago')->on('metodos_pago');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};