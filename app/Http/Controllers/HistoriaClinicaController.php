<?php

namespace App\Http\Controllers;

use App\Models\HistoriaClinica;
use Illuminate\Http\Request;

class HistoriaClinicaController extends Controller
{
    public function index()
    {
        $historias = HistoriaClinica::with('mascota')->get();
        return response()->json($historias);
    }

    public function store(Request $request)
    {
        $historia = HistoriaClinica::create($request->all());
        return response()->json($historia, 201);
    }

    public function show($id)
    {
        $historia = HistoriaClinica::with('mascota', 'registros')->findOrFail($id);
        return response()->json($historia);
    }

    public function update(Request $request, $id)
    {
        $historia = HistoriaClinica::findOrFail($id);
        $historia->update($request->all());
        return response()->json($historia);
    }

    public function destroy($id)
    {
        HistoriaClinica::destroy($id);
        return response()->json(['message' => 'Historia clínica eliminada']);
    }
}