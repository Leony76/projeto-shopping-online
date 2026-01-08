<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use App\Models\UserReview;
use App\Models\CommentReaction;
use Illuminate\Support\Facades\DB;

class UserReviewController extends Controller
{
    public function store(Request $request, int $id) {
        $data = $request->validate([
            'commentary' => 'required|string|min:2|max:1000',
            'rate' => 'required|integer|min:0'
        ]); 

        $user = auth()->user();

        UserReview::updateOrCreate([
            'user_id' => $user->id,
            'product_id' => $id,
        ], [
            'username' => $user->name,
            'commentary' =>  $data['commentary'],
            'rate' => $data['rate'],
        ]);

        return response()->json([
            'message' => 'Seu comentário foi ao ar',
            'type' => 'info',
        ], 200);
    }

    public function index() {
        return response()->json([
            'comments' => UserReview::all()
        ]);
    }

    public function updateLikeDislike(int $id, Request $request) {
        $data = $request->validate([
            'type' => 'required|in:like,dislike',
        ]);

        $user = auth()->user();
        $review = UserReview::findOrFail($id);

        $review->likes = $review->likes ?? 0;
        $review->dislikes = $review->dislikes ?? 0;
        $review->save();

        DB::transaction(function () use ($data, $user, $review) {
            $reaction = CommentReaction::where('user_id', $user->id)
                ->where('user_review_id', $review->id)
                ->first();

            if ($reaction) {
                if ($reaction->type === $data['type']) {
                    $reaction->delete();
                    $review->decrement($data['type'] === 'like' ? 'likes' : 'dislikes');
                } else {
                    $reaction->update(['type' => $data['type']]);
                    $review->increment($data['type'] === 'like' ? 'likes' : 'dislikes');
                    $review->decrement($data['type'] === 'like' ? 'dislikes' : 'likes');
                }
            } else {
                CommentReaction::create([
                    'user_id' => $user->id,
                    'user_review_id' => $review->id,
                    'type' => $data['type'],
                ]);
                $review->increment($data['type'] === 'like' ? 'likes' : 'dislikes');
            }
        });


        $review->refresh();

        return response()->json([
            'likes' => $review->likes,
            'dislikes' => $review->dislikes,
            'user_reaction' => CommentReaction::where('user_id', $user->id)
                ->where('user_review_id', $review->id)
                ->first(),
        ]);
    }

    public function usersCurrentReactions() {
        return response()->json([
            'reactions' => CommentReaction::where('user_id', auth()->id())->get(),
        ]);
    }
}
