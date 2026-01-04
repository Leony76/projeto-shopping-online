<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_origins' => [
        'http://192.168.0.5:5173',
    ],

    'allowed_headers' => ['*'],
    'allowed_methods' => ['*'],

];
