<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use Illuminate\Http\Request;

class CitaController extends Controller
{
    public function index()
    {
        $citas = Cita::with('cliente', 'disponibilidad.veterinario')->get();
        return response()->json($citas);
    }

    public function store(Request $request)
    {
        $cita = Cita::create($request->all());
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

    public function destroy($id)
    {
        Cita::destroy($id);
        return response()->json(['message' => 'Cita eliminada']);
    }
}