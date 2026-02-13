<?php

namespace App\Http\Controllers;

use App\Models\RegistroClinico;
use Illuminate\Http\Request;

class RegistroClinicoController extends Controller
{
    public function index()
    {
        $registros = RegistroClinico::with('historiaClinica', 'veterinario')->get();
        return response()->json($registros);
    }

    public function store(Request $request)
    {
        $registro = RegistroClinico::create($request->all());
        return response()->json($registro, 201);
    }

    public function show($id)
    {
        $registro = RegistroClinico::with('historiaClinica.mascota', 'veterinario.usuario')->findOrFail($id);
        return response()->json($registro);
    }

    public function update(Request $request, $id)
    {
        $registro = RegistroClinico::findOrFail($id);
        $registro->update($request->all());
        return response()->json($registro);
    }

    public function destroy($id)
    {
        RegistroClinico::destroy($id);
        return response()->json(['message' => 'Registro clínico eliminado']);
    }
}