<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // 'allowed_origins' => ['*'],
    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', '*')),

    'allowed_headers' => ['*'],
    'allowed_methods' => ['*'],

];



// return [
//     'paths' => ['api/*', 'sanctum/csrf-cookie'],

//     'allowed_origins' => [
//         'http://192.168.0.4:5173',
//     ],

//     'allowed_headers' => ['*'],
//     'allowed_methods' => ['*'],

// ];
