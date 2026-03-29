<?php

namespace App\Http\Controllers;

use App\Models\Mascota;
use App\Models\Especie;
use App\Models\Sexo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;

class MascotaController extends Controller
{
    // ─── Cloudinary SDK directo ───────────────────────────────────────────────

    private function getCloudinary(): Cloudinary
    {
        Configuration::instance([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
            'url' => ['secure' => true],
        ]);

        return new Cloudinary();
    }

    private function uploadFile(\Illuminate\Http\UploadedFile $file): string
    {
        $result = $this->getCloudinary()->uploadApi()->upload($file->getRealPath(), [
            'folder' => 'mascotas',
        ]);

        return $result['secure_url'];
    }

    private function uploadBase64(string $imgStr): ?string
    {
        if (!preg_match('/^data:image\/([a-zA-Z0-9]+);base64,/', $imgStr)) {
            return null;
        }

        $result = $this->getCloudinary()->uploadApi()->upload($imgStr, [
            'folder' => 'mascotas',
        ]);

        return $result['secure_url'];
    }

    private function deleteFromCloudinary(?string $url): void
    {
        if (!$url || !str_contains($url, 'cloudinary.com')) return;

        // URL típica: https://res.cloudinary.com/cloud/image/upload/v123/mascotas/abc123.jpg
        if (preg_match('/mascotas\/([^.\/]+)/', $url, $matches)) {
            $this->getCloudinary()->uploadApi()->destroy('mascotas/' . $matches[1]);
        }
    }

    private function resolveImagenData(Request $request): ?string
    {
        $file = $request->file('imagen')
            ?? $request->file('image')
            ?? $request->file('foto');

        if ($file) {
            return $this->uploadFile($file);
        }

        $imgStr = $request->input('imagen')
            ?? $request->input('image')
            ?? $request->input('foto');

        if (is_string($imgStr) && str_starts_with($imgStr, 'data:image')) {
            return $this->uploadBase64($imgStr);
        }

        return null;
    }

    // ─── CRUD ─────────────────────────────────────────────────────────────────

    public function index(Request $request)
    {
        $query = Mascota::query()->with('administrador');

        if ($request->filled('id_especie')) {
            $query->where('id_especie', $request->query('id_especie'));
        }
        if ($request->filled('id_sexo')) {
            $query->where('id_sexo', $request->query('id_sexo'));
        }
        if ($request->filled('especie')) {
            $query->whereRaw('LOWER(especie) = ?', [strtolower($request->query('especie'))]);
            $query->where('estado', $request->query('estado', 'disponible'));
        } elseif ($request->query('estado')) {
            $query->where('estado', $request->query('estado'));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_admin' => 'nullable|exists:usuarios,id_usuario',
        ]);

        $data = $request->only([
            'nombre', 'id_especie', 'raza', 'edad',
            'id_sexo', 'descripcion', 'estado', 'fecha_publicacion', 'id_admin',
            // ✅ Sin 'especie' ni 'sexo'
        ]);

        if (empty($data['id_admin'])) {
            $data['id_admin'] = DB::table('usuarios')
                ->where('id_rol', DB::table('roles')->where('nombre_rol', 'admin')->value('id_rol'))
                ->value('id_usuario') ?? 1;
        }

        if (!$request->filled('fecha_publicacion')) {
            $data['fecha_publicacion'] = now()->toDateString();
        }
        if (!$request->filled('estado')) {
            $data['estado'] = 'disponible';
        }

        $this->resolveEspecie($data);
        $this->resolveSexo($data);

        $imagenUrl = $this->resolveImagenData($request);
        if ($imagenUrl) {
            $data['imagen'] = $imagenUrl;
        }

        return response()->json(Mascota::create($data), 201);
    }

    public function show($id)
    {
        return response()->json(
            Mascota::with('administrador', 'historiaClinica')->findOrFail($id)
        );
    }

    public function update(Request $request, $id)
    {
        $mascota = Mascota::findOrFail($id);

        $request->validate([
            'id_admin' => 'nullable|exists:usuarios,id_usuario',
        ]);

        $data = $request->only([
            'nombre', 'id_especie', 'raza', 'edad',
            'id_sexo', 'descripcion', 'estado', 'fecha_publicacion', 'id_admin',
            // ✅ Sin 'especie' ni 'sexo'
        ]);

        $this->resolveEspecie($data);
        $this->resolveSexo($data);

        $imagenUrl = $this->resolveImagenData($request);
        if ($imagenUrl) {
            $this->deleteFromCloudinary($mascota->imagen);
            $data['imagen'] = $imagenUrl;
        }

        $mascota->update($data);

        return response()->json($mascota);
    }

    public function destroy($id)
    {
        $mascota = Mascota::findOrFail($id);
        $this->deleteFromCloudinary($mascota->imagen);
        $mascota->delete();

        return response()->json(['message' => 'Mascota eliminada']);
    }

    // ─── Catálogos ────────────────────────────────────────────────────────────

    public function especies()
    {
        return response()->json(
            DB::table('especies')
                ->select('id_especie', 'nombre')
                ->where('activo', 1)
                ->orderBy('nombre')
                ->get()
        );
    }

    public function sexos()
    {
        return response()->json(
            DB::table('sexos')
                ->select('id_sexo', 'nombre')
                ->where('activo', 1)
                ->orderBy('nombre')
                ->get()
        );
    }

    // ─── Helpers privados ────────────────────────────────────────────────────

    private function resolveEspecie(array &$data): void
{
    if (!empty($data['id_especie'])) {
        $e = Especie::find($data['id_especie']);
        if ($e) {
            // ✅ Solo guarda id_especie, no el campo 'especie' si ya no existe
            $data['id_especie'] = $e->id_especie;
        }
    }
    // Elimina 'especie' del payload por si llegó desde el frontend
    unset($data['especie']);
}

    private function resolveSexo(array &$data): void
{
    if (!empty($data['id_sexo'])) {
        $s = Sexo::find($data['id_sexo']);
        if ($s) {
            // ✅ Solo guarda id_sexo, no el campo 'sexo' que ya no existe
            $data['id_sexo'] = $s->id_sexo;
        }
    }
    // Elimina 'sexo' del payload por si llegó desde el frontend
    unset($data['sexo']);
}
}