<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    protected function redirectTo(Request $request)
    {
        if ($request->expectsJson()) {
            return null; // Prevents redirect for API requests
        }
        return route('login'); // Fallback for web, if defined
    }

    protected function unauthenticated($request, array $guards)
    {
        if ($request->expectsJson()) {
            abort(response()->json(['message' => 'Unauthenticated'], 401));
        }
        parent::unauthenticated($request, $guards);
    }
}
