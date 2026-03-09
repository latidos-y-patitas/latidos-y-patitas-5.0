<?php

namespace App\Http\Controllers;

use App\Models\SolicitudAdopcion;
use Illuminate\Http\Request;

class SolicitudAdopcionController extends Controller
{
    public function index()
    {
        // listado general (para administración o API pública)
        $solicitudes = SolicitudAdopcion::with('cliente', 'mascota')->get();
        return response()->json($solicitudes);
    }

    /**
     * Devuelve sólo solicitudes pendientes (útil para el panel de admin).
     */
    public function pendientes()
    {
        $solicitudes = SolicitudAdopcion::with('cliente', 'mascota')
            ->where('estado', 'pendiente')
            ->get();
        return response()->json($solicitudes);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id_cliente' => ['required', 'integer'],
            'id_mascota' => ['required', 'integer'],
            'motivo' => ['required', 'string'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'tiene_mascotas' => ['nullable', 'boolean'],
            'experiencia' => ['nullable', 'string'],
            'estado' => ['nullable', 'in:pendiente,aprobada,rechazada'],
        ]);
        if (!$request->has('fecha_solicitud')) {
            $data['fecha_solicitud'] = now()->toDateString();
        }
        $data['estado'] = $data['estado'] ?? 'pendiente';
        $solicitud = SolicitudAdopcion::create($data);
        return response()->json($solicitud, 201);
    }

    public function show($id)
    {
        $solicitud = SolicitudAdopcion::with('cliente', 'mascota')->findOrFail($id);
        return response()->json($solicitud);
    }

    public function update(Request $request, $id)
    {
        $solicitud = SolicitudAdopcion::findOrFail($id);
        $data = $request->validate([
            'id_cliente' => ['sometimes', 'integer'],
            'id_mascota' => ['sometimes', 'integer'],
            'motivo' => ['sometimes', 'string'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'tiene_mascotas' => ['nullable', 'boolean'],
            'experiencia' => ['nullable', 'string'],
            'estado' => ['nullable', 'in:pendiente,aprobada,rechazada'],
            'aprobado_por' => ['nullable', 'integer'],
            'fecha_revision' => ['nullable', 'date'],
            'nota_revision' => ['nullable', 'string'],
        ]);
        $solicitud->update($data);
        return response()->json($solicitud);
    }

    public function adoptar(Request $request, $id)
    {
        $data = $request->validate([
            'id_cliente' => ['nullable', 'integer'],
            'motivo' => ['nullable', 'string'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'tiene_mascotas' => ['nullable', 'boolean'],
            'experiencia' => ['nullable', 'string'],
        ]);
        $data['id_mascota'] = (int) $id;
        if (empty($data['id_cliente'])) {
            $data['id_cliente'] = \Illuminate\Support\Facades\DB::table('usuarios')
                ->whereIn('id_rol', function ($q) {
                    $q->select('id_rol')->from('roles')->where('nombre_rol', 'cliente');
                })
                ->value('id_usuario');
        }
        $data['fecha_solicitud'] = now()->toDateString();
        $data['estado'] = 'pendiente';
        $solicitud = SolicitudAdopcion::create($data);
        return response()->json($solicitud, 201);
    }


    public function aprobar($id)
    {
        $solicitud = SolicitudAdopcion::findOrFail($id);
        $solicitud->estado = 'aprobada';
        $solicitud->save();
        // cuando se aprueba la solicitud, marcamos la mascota como adoptada
        $mascota = $solicitud->mascota;
        if ($mascota) {
            $mascota->estado = 'adoptada';
            $mascota->save();
        }
        return response()->json($solicitud);
    }

    public function rechazar($id)
    {
        $solicitud = SolicitudAdopcion::findOrFail($id);
        $solicitud->estado = 'rechazada';
        $solicitud->save();
        // en caso de rechazo no tocamos la mascota, permanece disponible
        return response()->json($solicitud);
    }

    public function destroy($id)
    {
        SolicitudAdopcion::destroy($id);
        return response()->json(['message' => 'Solicitud de adopción eliminada']);
    }
}
