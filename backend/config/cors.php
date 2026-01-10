<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://projeto-shopping-online-production-f4d2.up.railway.app',
    ],

    'allowed_headers' => ['*'],

    'supports_credentials' => false,
];


