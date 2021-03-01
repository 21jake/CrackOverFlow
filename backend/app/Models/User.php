<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use App\Models\Post;
use App\Models\Comment;
use App\Models\PostVote;
use App\Models\CommentVote;
use App\Models\Topic;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'fname', 'lname', 'phone', 'email', 'password', 'avatar'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $appends = ['number_of_votes'];

    function Posts()
    {
        return $this->hasMany(Post::class);
    }
    function Comments()
    {
        return $this->hasMany(Comment::class);
    }
    function PostVotes()
    {
        return $this->hasMany(PostVote::class);
    }
    function CommentVotes()
    {
        return $this->hasMany(CommentVote::class);
    }
    public function Topics()
    {
        return $this->belongsToMany(Topic::class, 'interests', 'user_id', 'topic_id')->withTimestamps();
    }

    public function getNumberOfVotesAttribute()
    {
        return $this->PostVotes->count();
    }
}
