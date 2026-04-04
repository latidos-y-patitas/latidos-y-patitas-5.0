<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Rol;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function index()
    {
        $usuarios = Usuario::with('rol')->get();
        return response()->json($usuarios);
    }

    public function store(Request $request)
    {
        $data = $request->all();

        if (empty($data['id_rol'])) {
            $rolCliente = Rol::where('nombre_rol', 'cliente')->first();
            $data['id_rol'] = $rolCliente?->id_rol ?? Rol::query()->value('id_rol') ?? 1;
        }

        $data['password'] = Hash::make($request->password);
        $usuario = Usuario::create($data);
        return response()->json($usuario, 201);
    }

    public function show($id)
    {
        $usuario = Usuario::with('rol')->findOrFail($id);
        return response()->json($usuario);
    }

    public function update(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);
        $data = $request->all();
        
        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }
        
        $usuario->update($data);
        return response()->json($usuario);
    }

    public function destroy($id)
    {
        Usuario::destroy($id);
        return response()->json(['message' => 'Usuario eliminado']);
    }

    public function misMascotas($id)
{
    $solicitudes = \App\Models\SolicitudAdopcion::with('mascota')
        ->where('id_cliente', $id)
        ->where('estado', 'aprobada')
        ->get();

    $result = $solicitudes->map(function ($s) {
        $m = $s->mascota;
        if (!$m) return null;
        return [
            'id_mascota'     => $m->id_mascota,
            'nombre'         => $m->nombre,
            'especie'        => $m->especie,
            'raza'           => $m->raza,
            'edad'           => $m->edad,
            'imagen'         => $m->imagen,
            'estado'         => $m->estado,
            'id_solicitud'   => $s->id_solicitud,
            'fecha_adopcion' => $s->fecha_revision,
        ];
    })->filter()->values();

    return response()->json($result);
}
}
