<?php

namespace App\Http\Controllers;

use App\Models\DisponibilidadCita;
use Illuminate\Http\Request;

class DisponibilidadCitaController extends Controller
{
    public function index()
    {
        $disponibilidades = DisponibilidadCita::with('veterinario')->get();
        return response()->json($disponibilidades);
    }

    public function store(Request $request)
    {
        $disponibilidad = DisponibilidadCita::create($request->all());
        return response()->json($disponibilidad, 201);
    }

    public function show($id)
    {
        $disponibilidad = DisponibilidadCita::with('veterinario')->findOrFail($id);
        return response()->json($disponibilidad);
    }

    public function update(Request $request, $id)
    {
        $disponibilidad = DisponibilidadCita::findOrFail($id);
        $disponibilidad->update($request->all());
        return response()->json($disponibilidad);
    }

    public function destroy($id)
    {
        DisponibilidadCita::destroy($id);
        return response()->json(['message' => 'Disponibilidad eliminada']);
    }
}