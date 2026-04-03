<?php

// /router/web.php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
