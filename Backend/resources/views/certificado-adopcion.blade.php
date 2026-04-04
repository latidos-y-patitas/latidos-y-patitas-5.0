<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'DejaVu Sans', Arial, sans-serif;
      background: #f5faf6;
      color: #222;
      padding: 0;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 14mm;
      position: relative;
    }

    /* Borde exterior */
    .border-outer {
      position: absolute;
      top: 8mm; left: 8mm;
      right: 8mm; bottom: 8mm;
      border: 3px solid #107c41;
    }

    /* Borde interior */
    .border-inner {
      position: absolute;
      top: 11mm; left: 11mm;
      right: 11mm; bottom: 11mm;
      border: 0.8px solid #86c69b;
    }

    .content {
      position: relative;
      z-index: 1;
    }

    /* Header */
    .header {
      background: #107c41;
      color: white;
      text-align: center;
      padding: 14px 20px 10px;
      margin: 0 -14mm;
      margin-top: -14mm;
      margin-bottom: 24px;
    }

    .header .org {
      font-size: 9px;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 4px;
      opacity: 0.85;
    }

    .header h1 {
      font-size: 22px;
      font-weight: bold;
      letter-spacing: 1px;
      margin-bottom: 3px;
    }

    .header .sub {
      font-size: 9px;
      opacity: 0.8;
    }

    /* Ícono pata */
    .paw-circle {
      width: 52px;
      height: 52px;
      background: #86c69b;
      border-radius: 50%;
      margin: 0 auto 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      line-height: 52px;
      text-align: center;
      color: white;
    }

    /* Intro */
    .intro {
      text-align: center;
      font-size: 11px;
      color: #444;
      margin-bottom: 8px;
    }

    /* Nombre adoptante */
    .adoptante {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: #107c41;
      margin: 6px 0;
    }

    .adopta-texto {
      text-align: center;
      font-size: 11px;
      color: #444;
      margin-bottom: 8px;
    }

    /* Nombre mascota */
    .mascota-nombre {
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      color: #107c41;
      margin-bottom: 16px;
    }

    /* Separador */
    .divider {
      border: none;
      border-top: 1px solid #86c69b;
      margin: 10px 30px;
    }

    /* Datos */
    .datos-titulo {
      text-align: center;
      font-size: 11px;
      font-weight: bold;
      color: #107c41;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin: 14px 0 10px;
    }

    .datos-tabla {
      width: 70%;
      margin: 0 auto;
      border-collapse: collapse;
    }

    .datos-tabla tr td {
      padding: 6px 12px;
      font-size: 10px;
    }

    .datos-tabla tr:nth-child(odd) td {
      background: #e6f5eb;
      border-radius: 4px;
    }

    .datos-tabla .label {
      font-weight: bold;
      color: #107c41;
      width: 35%;
    }

    .datos-tabla .valor {
      color: #333;
    }

    /* Fechas */
    .fechas {
      text-align: center;
      font-size: 9.5px;
      color: #666;
      margin: 14px 0 10px;
    }

    /* Compromiso */
    .compromiso {
      background: #107c41;
      color: white;
      border-radius: 6px;
      padding: 12px 20px;
      margin: 14px 20px;
      font-size: 9px;
      font-style: italic;
      text-align: center;
      line-height: 1.6;
    }

    /* Firmas */
    .firmas {
      display: table;
      width: 80%;
      margin: 24px auto 0;
      table-layout: fixed;
    }

    .firma-col {
      display: table-cell;
      text-align: center;
      width: 50%;
    }

    .firma-linea {
      border-top: 1px solid #107c41;
      margin: 0 20px 4px;
    }

    .firma-label {
      font-size: 8px;
      color: #666;
    }

    /* Footer */
    .footer {
      background: #107c41;
      color: white;
      text-align: center;
      font-size: 7.5px;
      padding: 6px;
      position: absolute;
      bottom: 14mm;
      left: 14mm;
      right: 14mm;
      border-radius: 2px;
    }
  </style>
</head>
<body>
<div class="page">

  <div class="border-outer"></div>
  <div class="border-inner"></div>

  <div class="content">

    <!-- Header -->
    <div class="header">
      <div class="org">Latidos y Patitas</div>
      <h1>CERTIFICADO DE ADOPCIÓN</h1>
      <div class="sub">Centro de Adopción y Bienestar Animal</div>
    </div>

    <!-- Ícono -->
    <div class="paw-circle">&#x1F43E;</div>

    <!-- Texto principal -->
    <p class="intro">Por medio del presente documento se certifica que:</p>

    <p class="adoptante">
      {{ $cliente->nombre ?? $cliente->name ?? $cliente->email ?? 'Adoptante' }}
    </p>

    <p class="adopta-texto">ha adoptado responsablemente a:</p>

    <p class="mascota-nombre">{{ $mascota->nombre ?? 'Mascota' }}</p>

    <hr class="divider">

    <!-- Datos mascota -->
    <p class="datos-titulo">Datos de la mascota</p>

    <table class="datos-tabla">
      <tr>
        <td class="label">Especie</td>
        <td class="valor">{{ $mascota->especie ?? '—' }}</td>
      </tr>
      <tr>
        <td class="label">Raza</td>
        <td class="valor">{{ $mascota->raza ?? '—' }}</td>
      </tr>
      <tr>
        <td class="label">Edad</td>
        <td class="valor">{{ $mascota->edad ? $mascota->edad . ' años' : '—' }}</td>
      </tr>
      <tr>
        <td class="label">Estado</td>
        <td class="valor">Adoptada ✓</td>
      </tr>
      @if($solicitud->direccion)
      <tr>
        <td class="label">Domicilio</td>
        <td class="valor">{{ $solicitud->direccion }}</td>
      </tr>
      @endif
    </table>

    <!-- Fechas -->
    <div class="fechas">
      <p>Fecha de adopción: <strong>{{ $fecha }}</strong></p>
      <p>Fecha de emisión: <strong>{{ $emision }}</strong></p>
    </div>

    <!-- Compromiso -->
    <div class="compromiso">
      Al adoptar, {{ $cliente->nombre ?? $cliente->name ?? 'el adoptante' }} se compromete a brindar amor,
      cuidado, alimentación adecuada y atención veterinaria a
      {{ $mascota->nombre ?? 'su mascota' }} durante toda su vida.
    </div>

    <!-- Firmas -->
    <div class="firmas">
      <div class="firma-col">
        <div class="firma-linea"></div>
        <p class="firma-label">{{ $cliente->nombre ?? $cliente->name ?? 'Adoptante' }}</p>
      </div>
      <div class="firma-col">
        <div class="firma-linea"></div>
        <p class="firma-label">Latidos y Patitas</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      Latidos y Patitas — Centro de Adopción y Bienestar Animal &nbsp;|&nbsp; Certificado N° {{ $solicitud->id_solicitud }}
    </div>

  </div>
</div>
</body>
</html>