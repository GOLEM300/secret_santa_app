<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('app');
});

Route::fallback(function () {
    return view('app');
});

