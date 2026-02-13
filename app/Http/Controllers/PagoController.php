<?php

namespace App\Http\Controllers;

use App\Models\Pago;
use Illuminate\Http\Request;

class PagoController extends Controller
{
    public function index()
    {
        $pagos = Pago::with('cita', 'metodoPago')->get();
        return response()->json($pagos);
    }

    public function store(Request $request)
    {
        $pago = Pago::create($request->all());
        return response()->json($pago, 201);
    }

    public function show($id)
    {
        $pago = Pago::with('cita.cliente', 'metodoPago')->findOrFail($id);
        return response()->json($pago);
    }

    public function update(Request $request, $id)
    {
        $pago = Pago::findOrFail($id);
        $pago->update($request->all());
        return response()->json($pago);
    }

    public function destroy($id)
    {
        Pago::destroy($id);
        return response()->json(['message' => 'Pago eliminado']);
    }
}