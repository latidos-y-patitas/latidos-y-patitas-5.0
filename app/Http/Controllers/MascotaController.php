<?php

namespace App\Http\Controllers;

use App\Models\Mascota;
use Illuminate\Http\Request;

class MascotaController extends Controller
{
    public function index()
    {
        $mascotas = Mascota::with('administrador')->get();
        return response()->json($mascotas);
    }

    public function store(Request $request)
    {
        $mascota = Mascota::create($request->all());
        return response()->json($mascota, 201);
    }

    public function show($id)
    {
        $mascota = Mascota::with('administrador', 'historiaClinica')->findOrFail($id);
        return response()->json($mascota);
    }

    public function update(Request $request, $id)
    {
        $mascota = Mascota::findOrFail($id);
        $mascota->update($request->all());
        return response()->json($mascota);
    }

    public function destroy($id)
    {
        Mascota::destroy($id);
        return response()->json(['message' => 'Mascota eliminada']);
    }
}
