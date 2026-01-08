<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AddSuggestions;

class AddSuggestionsController extends Controller
{
    public function addSuggestion(Request $request) {
        $request->validate([
            'add_suggest' => 'required|string|min:2|max:1000',
        ]);

        $userId = auth()->id();

        $data = [];

        $data['add_suggestion'] = $request->add_suggest;
        $data['user_id'] = $userId;

        AddSuggestions::create($data);

        return response()->json([
            'message' => 'Sugestão de adição mandada com sucesso',
            'type' => 'success',
        ], 201);
    }

    public function listAddSuggestions() {
        return response()->json([
            'add_suggestions' => AddSuggestions::with('user:name,id')->get(),
        ]);
    }

    public function updateAddSuggestion(Request $request, $id) {
        $data = $request->validate([
            'decision' => 'required|in:accepted,denied',
        ]);

        $addSuggestion = AddSuggestions::findOrFail($id);

        if ($data['decision'] === 'accepted') {
            $addSuggestion->update([
                'accepted' => true
            ]);

            return response()->json([
                'message' => 'Sugestão de adição foi aceita',
                'type' => 'info'
            ], 200);
        } 

        $addSuggestion->delete();

        return response()->json([
            'message' => 'Sugestão de adição foi negada',
            'type' => 'info'
        ], 200);       
    }
}
