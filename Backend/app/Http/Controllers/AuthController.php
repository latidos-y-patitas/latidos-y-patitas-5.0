<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\ApiToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Errores de validación', 'errors' => $validator->errors()], 422);
        }

        $user = Usuario::where('email', $request->input('email'))->first();
        if (!$user) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        $plain = (string) $request->input('password');
        $valid = false;
        try {
            $valid = Hash::check($plain, $user->password);
        } catch (\RuntimeException $e) {
            $isBcrypt = str_starts_with((string) $user->password, '$2y$') || str_starts_with((string) $user->password, '$2a$');
            if (!$isBcrypt) {
                if (hash_equals((string) $user->password, $plain)) {
                    $user->password = Hash::make($plain);
                    $user->save();
                    $valid = true;
                } else {
                    $valid = false;
                }
            } else {
                throw $e;
            }
        }

        if (!$valid) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        $token = bin2hex(random_bytes(24));
        ApiToken::create([
            'id_usuario' => $user->id_usuario,
            'token' => $token,
        ]);

        // Cargar el rol
$user->load('rol');

// Si es veterinario, incluir su id_veterinario
$vetData = null;
if ($user->rol && $user->rol->nombre_rol === 'veterinario') {
    $vet = \App\Models\Veterinario::where('id_usuario', $user->id_usuario)->first();
    $vetData = $vet ? $vet->id_veterinario : null;
}

return response()->json([
    'token' => $token,
    'user'  => array_merge($user->toArray(), [
        'id_veterinario' => $vetData,
    ]),
]);
    }

    public function logout(Request $request)
    {
        $header = $request->header('Authorization');
        if ($header && stripos($header, 'Bearer ') === 0) {
            $tokenString = trim(substr($header, 7));
            ApiToken::where('token', $tokenString)->delete();
        }
        return response()->json(['message' => 'Sesión cerrada']);
    }
}
