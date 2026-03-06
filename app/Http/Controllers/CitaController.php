<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\DisponibilidadCita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CitaController extends Controller
{
    public function index()
    {
        $citas = Cita::with('cliente', 'disponibilidad.veterinario')->get();
        return response()->json($citas);
    }

    /**
     * Listado completo para panel de administración
     */
    public function adminIndex()
    {
        $citas = Cita::with([
            'cliente:id_usuario,nombre,email,telefono',
            'disponibilidad:id_disponibilidad,fecha,hora_inicio,hora_fin,id_veterinario',
            'disponibilidad.veterinario:id_veterinario,id_usuario'
        ])->get();

        return response()->json($citas);
    }

    public function activasAhora()
    {
        $today = now()->toDateString();
        $time  = now()->toTimeString();

        $citas = Cita::with('cliente', 'disponibilidad.veterinario')
            ->whereHas('disponibilidad', function ($q) use ($today, $time) {
                $q->where('fecha', $today)
                  ->where('hora_inicio', '<=', $time)
                  ->where('hora_fin', '>=', $time);
            })
            ->get();

        return response()->json($citas);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id_cliente' => ['required', 'integer', 'exists:usuarios,id_usuario'],
            'id_disponibilidad' => ['required', 'integer', 'exists:disponibilidad_citas,id_disponibilidad'],
            'motivo' => ['nullable', 'string', 'max:255'],
            'estado' => ['nullable', 'in:pendiente,confirmada,cancelada'],
        ]);
        $data['estado'] = $data['estado'] ?? 'pendiente';
        $cita = Cita::create($data);
        DisponibilidadCita::where('id_disponibilidad', $data['id_disponibilidad'])->update(['estado' => 'reservada']);
        return response()->json($cita, 201);
    }

    public function show($id)
    {
        $cita = Cita::with('cliente', 'disponibilidad.veterinario', 'pago')->findOrFail($id);
        return response()->json($cita);
    }

    public function update(Request $request, $id)
    {
        $cita = Cita::findOrFail($id);
        $cita->update($request->all());
        return response()->json($cita);
    }

    public function confirmar($id)
    {
        $cita = Cita::findOrFail($id);
        $cita->estado = 'confirmada';
        $cita->save();
        return response()->json($cita);
    }

    public function cancelar($id)
    {
        $cita = Cita::findOrFail($id);
        $cita->estado = 'cancelada';
        $cita->save();
        return response()->json($cita);
    }

    /**
     * Cambia el estado de la cita (pendiente|confirmada|cancelada)
     */
    public function cambiarEstado(Request $request, $id)
    {
        $estado = $request->input('estado');
        $permitidos = ['pendiente','confirmada','cancelada'];
        if (!in_array($estado, $permitidos, true)) {
            return response()->json(['message' => 'Estado inválido'], 422);
        }
        $cita = Cita::findOrFail($id);
        $cita->estado = $estado;
        $cita->save();
        return response()->json($cita);
    }

    public function destroy($id)
    {
        Cita::destroy($id);
        return response()->json(['message' => 'Cita eliminada']);
    }
}
