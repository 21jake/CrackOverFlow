<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostVoteController;

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
    Route::get('/dummy', [UsersController::class, 'dummyFunction'])->middleware('auth:api');
});

Route::group(['prefix' => 'posts'], function () {
    Route::get('/', [PostController::class, 'getPosts']);
    Route::post('create', [PostController::class, 'create']);
    Route::get('detail/{post_id}', [PostController::class, 'getPost']);
    Route::get('user/{user_id}', [PostController::class, 'getPostsUser']);
    Route::delete('delete/{post_id}', [PostController::class, 'deletePost']);
    Route::put('update', [PostController::class, 'updatePost']);
});

Route::group(['prefix' => 'comments'], function () {
    Route::get('/user/{user_id}', [CommentController::class, 'getCommentsUser']);
    Route::get('/post/{post_id}', [CommentController::class, 'getCommentPost']);
    Route::get('/comment/{comment_id}', [CommentController::class, 'getChildrenComments']);
    Route::post('create', [CommentController::class, 'create']);
    Route::delete('delete/{comment_id}', [CommentController::class, 'delete']);
    Route::put('update', [CommentController::class, 'update']);


    // Route::get('detail/{postId}', [CommentController::class, 'getPost']);
    // Route::get('user/{userId}', [CommentController::class, 'getPostsUser']);
    // Route::delete('delete/{postId}', [CommentController::class, 'deletePost']);
    // Route::put('update', [CommentController::class, 'updatePost']);
});

Route::group(['prefix' => 'vote'], function () {
    Route::post('post', [PostVoteController::class, 'index']);
});
