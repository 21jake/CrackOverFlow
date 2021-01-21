<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\CommentVote;
use App\Models\Post;
use App\Models\Topic;


class Comment extends Model
{
    use HasFactory;
    protected $fillable = [
        'content', 'parent_comment_id', 'user_id', 'post_id'
    ];
    function user()
    {
        return $this->belongsTo(User::class);
    }
    function post()
    {
        return $this->belongsTo(Post::class);
    }
    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }
    function commentVote()
    {
        return $this->hasMany(CommentVote::class);
    }
    public function parent()
    {
        return $this->belongsTo($this, 'parent_comment_id');
    }

    public function children()
    {
        return $this->hasMany($this, 'parent_comment_id');
    }
    // function parent()
    // {
    //     return $this->belongsTo($this, 'parent_comment_id');
    // }

    // function children()
    // {
    //     return $this->hasMany($this, 'parent_comment_id', 'id');

    // }
}
