<?php

namespace App\Http\Controllers;

use App\Models\Veterinario;
use Illuminate\Http\Request;

class VeterinarioController extends Controller
{
    public function index()
    {
        $veterinarios = Veterinario::with('usuario')->get();
        return response()->json($veterinarios);
    }

    public function store(Request $request)
    {
        $veterinario = Veterinario::create($request->all());
        return response()->json($veterinario, 201);
    }

    public function show($id)
    {
        $veterinario = Veterinario::with('usuario')->findOrFail($id);
        return response()->json($veterinario);
    }

    public function update(Request $request, $id)
    {
        $veterinario = Veterinario::findOrFail($id);
        $veterinario->update($request->all());
        return response()->json($veterinario);
    }

    public function destroy($id)
    {
        Veterinario::destroy($id);
        return response()->json(['message' => 'Veterinario eliminado']);
    }
}