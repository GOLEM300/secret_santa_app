<?php

use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'v1',
    'namespace' => 'App\Http\Controllers\Api\V1',
], function () {

    Route::group([
        'prefix' => 'auth'
    ], function () {
        Route::post('login', 'AuthController@login');
        Route::post('register', 'AuthController@register');

        Route::group([
            'middleware' => 'auth:sanctum'
        ], function () {
            Route::get('logout', 'AuthController@logout');
        });
    });

    Route::group([
        'prefix' => 'secret_santa',
    ], function () {

        Route::group([
            'middleware' => 'auth:sanctum'
        ], function () {
            Route::post('/store', 'SecretSantaController@store');
            Route::get('', 'SecretSantaController@getAllAvailableUsers');
            Route::get('/secret_santa_email', 'SecretSantaController@getSecretSantaEmail');
        });
    });
});


