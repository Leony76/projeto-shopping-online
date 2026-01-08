<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class AddSuggestions extends Model
{
    protected $table = 'add_suggestions';
    
    protected $fillable = [
        'user_id',
        'add_suggestion',
        'accepted',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
