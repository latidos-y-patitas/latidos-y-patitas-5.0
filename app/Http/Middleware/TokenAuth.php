<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\ApiToken;
use App\Models\Usuario;

class TokenAuth
{
    public function handle(Request $request, Closure $next)
    {
        $header = $request->header('Authorization');
        if (!$header || stripos($header, 'Bearer ') !== 0) {
            return response()->json(['message' => 'No autenticado'], 401);
        }
        
        $tokenString = trim(substr($header, 7));
        $token = ApiToken::where('token', $tokenString)->first();
        if (!$token) {
            return response()->json(['message' => 'Token inválido'], 401);
        }
        
        $usuario = Usuario::find($token->id_usuario);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 401);
        }
        
        $request->attributes->set('user', $usuario);
        return $next($request);
    }
}
