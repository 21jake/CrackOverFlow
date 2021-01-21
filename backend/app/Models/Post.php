<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\PostVote;
use App\Models\Comment;
use App\Models\Topic;

class Post extends Model
{
    use HasFactory;
    protected $fillable = [
        'title', 'content', 'user_id', 'topic_id'
    ];
    function user()
    {
        return $this->belongsTo(User::class);
    }
    public function postVotes()
    {
        return $this->hasMany(PostVote::class);
    }
    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
