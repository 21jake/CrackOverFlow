<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostVoteController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\InterestController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group(['prefix' => 'auth'], function () {
    Route::post('/login', [UsersController::class, 'login']);
    Route::post('/register', [UsersController::class, 'register']);
    Route::get('/logout', [UsersController::class, 'logout'])->middleware('auth:api');
    Route::get('/verify', [UsersController::class, 'dummyFunction'])->middleware('auth:api');
});

Route::group(['prefix' => 'users'], function () {
    Route::get('detail/{user_id}', [UsersController::class, 'getUserDetails']);
    Route::get('search', [UsersController::class, 'search']);

});

Route::group(['prefix' => 'posts'], function () {
    Route::get('/', [PostController::class, 'getPosts']);
    Route::post('create', [PostController::class, 'create'])->middleware('auth:api');
    Route::get('detail/{post_id}', [PostController::class, 'getPost']);
    Route::get('user/{user_id}', [PostController::class, 'getPostsUser']);
    Route::get('topic/{topic_id}', [PostController::class, 'getPostsTopic']);
    Route::delete('delete/{post_id}', [PostController::class, 'deletePost'])->middleware('auth:api');
    Route::put('update', [PostController::class, 'updatePost'])->middleware('auth:api');
    Route::get('hotPosts', [PostController::class, 'hotPostsToday']);
    Route::get('search', [PostController::class, 'search']);

});

Route::group(['prefix' => 'comments'], function () {
    Route::get('/user/{user_id}', [CommentController::class, 'getCommentsUser']);
    Route::get('/post/{post_id}', [CommentController::class, 'getCommentPost']);
    Route::get('/comment/{comment_id}', [CommentController::class, 'getChildrenComments']);
    Route::post('create', [CommentController::class, 'create'])->middleware('auth:api');
    Route::delete('delete/{comment_id}', [CommentController::class, 'delete'])->middleware('auth:api');
    Route::put('update', [CommentController::class, 'update']);
});

Route::group(['prefix' => 'topics'], function () {
    // Route::get('/post/{post_id}', [CommentController::class, 'getCommentPost']);
    // Route::get('/comment/{comment_id}', [CommentController::class, 'getChildrenComments']);
    Route::post('create', [TopicController::class, 'create'])->middleware('auth:api');
    Route::get('/getAll', [TopicController::class, 'getAllTopics']);

    // Route::delete('delete/{comment_id}', [CommentController::class, 'delete']);
    // Route::put('update', [CommentController::class, 'update']);

});
Route::group(['prefix' => 'interests'], function () {
    Route::post('create', [InterestController::class, 'create']);
});

Route::group(['prefix' => 'vote'], function () {
    Route::post('post', [PostVoteController::class, 'index']);

});

