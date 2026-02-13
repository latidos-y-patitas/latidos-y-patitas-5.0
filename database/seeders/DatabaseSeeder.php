<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Insertar Roles
        DB::table('roles')->insert([
            ['nombre_rol' => 'admin'],
            ['nombre_rol' => 'veterinario'],
            ['nombre_rol' => 'cliente']
        ]);

        // Insertar Métodos de Pago
        DB::table('metodos_pago')->insert([
            ['nombre' => 'Efectivo'],
            ['nombre' => 'Tarjeta'],
            ['nombre' => 'PSE'],
            ['nombre' => 'Nequi'],
            ['nombre' => 'Daviplata']
        ]);
    }
}