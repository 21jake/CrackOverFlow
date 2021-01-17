<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Post;



class PostVote extends Model
{
    use HasFactory;

    protected $fillable = [
        'type', 'user_id', 'post_id',
    ];

    function user()
    {
        return $this->belongsTo(User::class);
    }
    function post()
    {
        return $this->belongsTo(Post::class);
    }
}
