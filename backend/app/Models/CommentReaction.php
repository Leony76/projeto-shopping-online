<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommentReaction extends Model
{
    protected $table = 'comment_reactions';

    protected $fillable = ['user_id', 'user_review_id', 'type'];
}
