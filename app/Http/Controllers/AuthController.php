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
        if (!$user || !Hash::check($request->input('password'), $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        $token = bin2hex(random_bytes(24));
        ApiToken::create([
            'id_usuario' => $user->id_usuario,
            'token' => $token,
        ]);

        return response()->json([
            'token' => $token,
            'user'  => $user,
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
