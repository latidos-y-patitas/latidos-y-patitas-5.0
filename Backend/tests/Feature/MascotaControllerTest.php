<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Usuario;
use App\Models\Rol;

class MascotaControllerTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        // seed roles & an admin user so the defaulting logic can pick up an id
        Rol::insert([
            ['nombre_rol' => 'admin'],
            ['nombre_rol' => 'veterinario'],
            ['nombre_rol' => 'cliente'],
        ]);

        $adminRole = Rol::where('nombre_rol', 'admin')->first();
        Usuario::create([
            'nombre' => 'Admin',
            'email' => 'admin@test.local',
            'password' => bcrypt('password'),
            'telefono' => '000',
            'id_rol' => $adminRole->id_rol,
            'created_at' => now(),
        ]);
    }

    public function test_store_assigns_default_admin_when_missing()
    {
        $response = $this->postJson('/api/mascotas', [
            'nombre' => 'foo',
        ]);

        $response->assertCreated();
        $data = $response->json();
        $this->assertEquals(1, $data['id_admin']);
        $this->assertEquals('foo', $data['nombre']);
    }
}
