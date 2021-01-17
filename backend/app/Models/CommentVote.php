<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Comment;

class CommentVote extends Model
{
    use HasFactory;
    protected $fillable = [
        'type', 'user_id', 'post_id', 'parent_comment_id',
    ];
    function user()
    {
        return $this->belongsTo(User::class);
    }
    function comment()
    {
        return $this->belongsTo(Comment::class);
    }
}
