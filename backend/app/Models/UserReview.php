<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Product;
use App\Models\CommentReaction;

class UserReview extends Model
{   
    protected $table = 'user_reviews';

    protected $fillable = [
        'commentary',
        'username',
        'user_id',
        'product_id',
        'rate',
        'likes',
        'dislikes',
    ];

    public function users() {
        return $this->belongsTo(User::class);
    }

    public function products() {
        return $this->belongsTo(Product::class);
    }

    public function reactions() {
        return $this->hasMany(CommentReaction::class);
    }
}

