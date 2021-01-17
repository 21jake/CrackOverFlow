<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\PostVote;
use App\Models\Comment;

class Post extends Model
{
    use HasFactory;
    protected $fillable = [
        'title', 'content', 'user_id'
    ];
    function user()
    {
        return $this->belongsTo(User::class);
    }
    public function postVote()
    {
        return $this->hasMany(PostVote::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
