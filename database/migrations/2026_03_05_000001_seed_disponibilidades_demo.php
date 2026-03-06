<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

return new class extends Migration
{
    public function up(): void
    {
        // Tomar un veterinario existente; si no hay, usar 1
        $vetId = DB::table('veterinarios')->value('id_veterinario') ?? 1;

        // Fechas base: hoy y los próximos 3 días
        $d0 = Carbon::today();
        $d1 = Carbon::today()->addDay();
        $d2 = Carbon::today()->addDays(2);
        $d3 = Carbon::today()->addDays(3);

        $rows = [
            [
                'id_veterinario' => $vetId,
                'fecha' => $d0->toDateString(),
                'hora_inicio' => '09:00:00',
                'hora_fin' => '10:00:00',
                'estado' => 'disponible',
            ],
            [
                'id_veterinario' => $vetId,
                'fecha' => $d1->toDateString(),
                'hora_inicio' => '11:00:00',
                'hora_fin' => '12:00:00',
                'estado' => 'disponible',
            ],
            [
                'id_veterinario' => $vetId,
                'fecha' => $d2->toDateString(),
                'hora_inicio' => '14:00:00',
                'hora_fin' => '15:00:00',
                'estado' => 'disponible',
            ],
            [
                'id_veterinario' => $vetId,
                'fecha' => $d3->toDateString(),
                'hora_inicio' => '16:00:00',
                'hora_fin' => '17:00:00',
                'estado' => 'disponible',
            ],
        ];

        DB::table('disponibilidad_citas')->insert($rows);
    }

    public function down(): void
    {
        $d0 = \Illuminate\Support\Carbon::today()->toDateString();
        $d1 = \Illuminate\Support\Carbon::today()->addDay()->toDateString();
        $d2 = \Illuminate\Support\Carbon::today()->addDays(2)->toDateString();
        $d3 = \Illuminate\Support\Carbon::today()->addDays(3)->toDateString();

        DB::table('disponibilidad_citas')
            ->whereIn('fecha', [$d0, $d1, $d2, $d3])
            ->whereIn('hora_inicio', ['09:00:00','11:00:00','14:00:00','16:00:00'])
            ->delete();
    }
};
