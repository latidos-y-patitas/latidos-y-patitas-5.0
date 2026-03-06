<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Insertar Roles (ignorar si ya existen)
        DB::table('roles')->insertOrIgnore([
            ['nombre_rol' => 'admin'],
            ['nombre_rol' => 'veterinario'],
            ['nombre_rol' => 'cliente']
        ]);

        $adminRoleId = DB::table('roles')->where('nombre_rol', 'admin')->value('id_rol');
        $vetRoleId   = DB::table('roles')->where('nombre_rol', 'veterinario')->value('id_rol');

        // Crear usuario admin si no existe
        $adminId = DB::table('usuarios')->where('email', 'admin@example.com')->value('id_usuario');
        if (!$adminId) {
            $adminId = DB::table('usuarios')->insertGetId([
                'nombre'   => 'Admin',
                'email'    => 'admin@example.com',
                'password' => Hash::make('admin1234'),
                'telefono' => '0000000000',
                'id_rol'   => $adminRoleId,
                'created_at' => now(),
            ]);
        }

        // Crear usuario veterinario si no existe
        $vetUserId = DB::table('usuarios')->where('email', 'vet@example.com')->value('id_usuario');
        if (!$vetUserId) {
            $vetUserId = DB::table('usuarios')->insertGetId([
                'nombre'   => 'Veterinario',
                'email'    => 'vet@example.com',
                'password' => Hash::make('vet1234'),
                'telefono' => '0000000001',
                'id_rol'   => $vetRoleId,
                'created_at' => now(),
            ]);
        }

        // Crear registro de veterinario asociado
        $existsVet = DB::table('veterinarios')->where('id_usuario', $vetUserId)->exists();
        if (!$existsVet) {
            DB::table('veterinarios')->insert([
                'id_usuario'  => $vetUserId,
                'especialidad'=> 'General'
            ]);
        }

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
