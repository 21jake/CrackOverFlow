<?php

namespace App\Models;

use App\Collections\PostCollection;
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

    protected $appends = ['number_of_votes', 'number_of_upvotes'];
    // protected $appends = [ 'number_of_upvotes'];


    function user()
    {
        return $this->belongsTo(User::class);
    }
    public function postVotes()
    {
        return $this->hasMany(PostVote::class);
    }
    public function postUpvotes()
    {
        return $this->hasMany(PostVote::class)->where('type', 1);
    }
    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function getNumberOfVotesAttribute()
    {
        return $this->PostVotes->count();
    }
    public function getNumberOfUpvotesAttribute()
    {
        return $this->postUpvotes->count();
    }
    public function newCollection(array $models = [])
    {
        return new PostCollection($models);
    }
}
