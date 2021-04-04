<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Post;
use App\Models\User;
use App\Models\Comment;

class Topic extends Model
{
    use HasFactory;
    protected $fillable = [
        'name'
    ];
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function users()
    {
        return $this->belongsToMany(User::class, 'interests', 'topic_id', 'user_id')->withTimestamps();;
    }
}
