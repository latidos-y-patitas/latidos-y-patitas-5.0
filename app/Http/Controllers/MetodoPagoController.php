<?php

namespace App\Http\Controllers;

use App\Models\MetodoPago;
use Illuminate\Http\Request;

class MetodoPagoController extends Controller
{
    public function index()
    {
        $metodos = MetodoPago::all();
        return response()->json($metodos);
    }

    public function store(Request $request)
    {
        $metodo = MetodoPago::create($request->all());
        return response()->json($metodo, 201);
    }

    public function show($id)
    {
        $metodo = MetodoPago::findOrFail($id);
        return response()->json($metodo);
    }

    public function update(Request $request, $id)
    {
        $metodo = MetodoPago::findOrFail($id);
        $metodo->update($request->all());
        return response()->json($metodo);
    }

    public function destroy($id)
    {
        MetodoPago::destroy($id);
        return response()->json(['message' => 'Método de pago eliminado']);
    }
}