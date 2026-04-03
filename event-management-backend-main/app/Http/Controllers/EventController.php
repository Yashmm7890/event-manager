<?php

namespace App\Http\Controllers;

// app/Http/Controllers/EventController.php

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class EventController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        try {
            $events = Event::query()
                ->where('user_id', $userId)
                ->orderBy('start_time')
                ->paginate(10);

            return response()->json($events);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch events', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'start_time' => 'required|date|before:end_time',
                'end_time' => 'required|date|after:start_time',
                'location' => 'required|string',
                'category' => 'required|string',
            ]);
            $event = Event::create(array_merge($validated, ['user_id' => $userId]));
            return response()->json($event, 201);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create event', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $event = Event::findOrFail($id);
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($event);
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'start_time' => 'required|date|before:end_time',
                'end_time' => 'required|date|after:start_time', // Fixed typo
                'location' => 'required|string',
                'category' => 'required|string',
            ]);
            $event->update($validated);
            return response()->json($event);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update event', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event->delete();
        return response()->json(['message' => 'Event deleted']);
    }
}
