<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

return new class extends Migration
{
    public function up(): void
    {
        $rolCliente = DB::table('roles')->where('nombre_rol', 'cliente')->value('id_rol');
        // if roles haven't been seeded yet, bail out; tests will add their own data
        if (!$rolCliente) {
            return;
        }

        $clienteId = DB::table('usuarios')->where('email', 'cliente.demo@example.com')->value('id_usuario');
        if (!$clienteId) {
            $clienteId = DB::table('usuarios')->insertGetId([
                'nombre' => 'Cliente Demo',
                'email' => 'cliente.demo@example.com',
                'password' => Hash::make('cliente1234'),
                'telefono' => '0000000002',
                'id_rol' => $rolCliente,
                'created_at' => now(),
            ]);
        }

        $d0 = Carbon::today()->toDateString();
        $d1 = Carbon::today()->addDay()->toDateString();
        $d2 = Carbon::today()->addDays(2)->toDateString();
        $d3 = Carbon::today()->addDays(3)->toDateString();

        $targets = [
            [$d0, '09:00:00', 'pendiente', 'Consulta general'],
            [$d1, '11:00:00', 'pendiente', 'Vacunación'],
            [$d2, '14:00:00', 'confirmada', 'Control'],
            [$d3, '16:00:00', 'cancelada', 'Emergencia'],
        ];

        foreach ($targets as [$fecha, $horaInicio, $estado, $motivo]) {
            $dispId = DB::table('disponibilidad_citas')
                ->where('fecha', $fecha)
                ->where('hora_inicio', $horaInicio)
                ->value('id_disponibilidad');
            if ($dispId) {
                DB::table('citas')->insert([
                    'id_cliente' => $clienteId,
                    'id_disponibilidad' => $dispId,
                    'motivo' => $motivo,
                    'estado' => $estado,
                    'fecha_creacion' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        $clienteId = DB::table('usuarios')->where('email', 'cliente.demo@example.com')->value('id_usuario');
        $d0 = Carbon::today()->toDateString();
        $d1 = Carbon::today()->addDay()->toDateString();
        $d2 = Carbon::today()->addDays(2)->toDateString();
        $d3 = Carbon::today()->addDays(3)->toDateString();
        $horaInicios = ['09:00:00','11:00:00','14:00:00','16:00:00'];

        $dispIds = DB::table('disponibilidad_citas')
            ->whereIn('fecha', [$d0,$d1,$d2,$d3])
            ->whereIn('hora_inicio', $horaInicios)
            ->pluck('id_disponibilidad')
            ->all();

        if (!empty($dispIds)) {
            DB::table('citas')
                ->where('id_cliente', $clienteId)
                ->whereIn('id_disponibilidad', $dispIds)
                ->delete();
        }
    }
};
