<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Rol;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class RegistroController extends Controller
{
    /**
     * Registra un nuevo usuario (endpoint público para creación de cuenta)
     */
    public function store(Request $request)
    {
        // Validaciones estrictas para registro público
        $validator = Validator::make($request->all(), [
            'nombre'   => 'required|string|max:100|min:2',
            'email'    => 'required|email|max:100|unique:usuarios,email',
            'password' => ['required', 'string', 'min:8', Password::defaults()],
            'telefono' => 'nullable|string|max:20',
            // No permitimos que envíen id_rol desde el frontend
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Errores de validación',
                'errors'  => $validator->errors()
            ], 422);
        }

        $rolCliente = Rol::where('nombre_rol', 'cliente')->first();
        $idRol = $rolCliente?->id_rol;

        if (!$idRol) {
            $idRol = Rol::query()->value('id_rol') ?? 1;
        }

        $usuario = Usuario::create([
            'nombre'   => $request->input('nombre'),
            'email'    => $request->input('email'),
            'password' => Hash::make($request->input('password')),
            'telefono' => $request->input('telefono'),
            'id_rol'   => $idRol,
        ]);

        // Mensaje de registro exitoso
        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'usuario' => $usuario
        ], 201);
    }

    public function register(Request $request)
    {
        return $this->store($request);
    }
}
