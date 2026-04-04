<?php

return [
    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3915',
        'http://localhost:5173',
        'https://latidos-y-patitas-5-0.vercel.app'
    ],

    'allowed_origins_patterns' => [
        // Permite cualquier subdominio de vercel.app durante pruebas
        '#^https://[a-z0-9\-]+\.vercel\.app$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];