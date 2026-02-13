<?php

namespace App\Http\Controllers;

use App\Models\SolicitudAdopcion;
use Illuminate\Http\Request;

class SolicitudAdopcionController extends Controller
{
    public function index()
    {
        $solicitudes = SolicitudAdopcion::with('cliente', 'mascota')->get();
        return response()->json($solicitudes);
    }

    public function store(Request $request)
    {
        $solicitud = SolicitudAdopcion::create($request->all());
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
        $solicitud->update($request->all());
        return response()->json($solicitud);
    }

    public function destroy($id)
    {
        SolicitudAdopcion::destroy($id);
        return response()->json(['message' => 'Solicitud de adopción eliminada']);
    }
}