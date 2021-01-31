<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\User;
use App\Models\Post;

class CommentController extends Controller
{
    public function create(Request $request)
    {
        $input = $request->all();
        $comment = [
            'post_id' => $input['post_id'],
            'content' => $input['content'],
            'user_id' => $input['user_id'],
            'parent_comment_id' => $input['parent_comment_id']
        ];
        $data = Comment::create($comment);
        $output = Comment::where('id', $data->id)->with('user')->first();
        // dd($output);
        return GetdataOutput(1, 200, 'Tạo bình luận thành công', $output);
    }
    public function getCommentsUser($user_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return GetdataOutput(0, 400, 'Người dùng không tồn tại', '');
        }
        $comments = Comment::where('user_id', $user_id)->orderBy('created_at','desc')->with('user') ->paginate(5);
        if ($comments->isNotEmpty()) {
            return GetdataOutput(1, 200, 'Danh sách bình luận từ người dùng', $comments);
        } else {
            return GetdataOutput(1, 201, 'Người dùng này không có bình luận nào', '');
        }

    }
    public function getCommentPost($post_id)
    {
        $post = Post::find($post_id);
        if (!$post) {
            return GetdataOutput(0, 400, 'Bài đăng không tồn tại', '');
        }
        $comments = Comment::where('post_id', $post_id)->orderBy('created_at','desc')->with('user')->get();

        if ($comments->isNotEmpty()) {
            return GetdataOutput(1, 200, 'Danh sách bình luận của bài đăng', $comments);
        } else {
            return GetdataOutput(1, 201, 'Bài đăng không có bình luận nào', '');
        }
    }
    public function getChildrenComments($comment_id)
    {
        $comment = Comment::find($comment_id);
        if (!$comment) {
            return GetdataOutput(0, 400, 'Bình luận không tồn tại', '');
        }
        $comments = Comment::find($comment_id)->children;
        if ($comments->isNotEmpty()) {
            return GetdataOutput(1, 200, 'Danh sách phản hồi bình luận', $comments);
        } else {
            return GetdataOutput(1, 201, 'Bình luận không có phản hồi', '');
        }
    }
    public function update(Request $request)
    {
        $input = $request->all();
        $comment = Comment::find($input['id']);
        if (!$comment) {
            return GetdataOutput(1, 400, 'Bình luận không tồn tại', '');
        }
        $checker = $comment->update([
            'content' => $input['content'],
        ]);
        if ($checker) {
            return GetdataOutput(1, 200, 'Cập nhật bình luận thành công', $comment);
        } else {
            return GetdataOutput(1, 500, 'Đã có lỗi xảy ra, vui lòng liên hệ với quản trị viên', '');
        }
    }


    public function delete($comment_id)
    {
        $comment = Comment::find($comment_id);
        if (!$comment) {
            return GetdataOutput(0, 400, 'Bình luận không tồn tại', '');
        }
        $checker = $comment->delete();
        if ($checker) {
            return GetdataOutput(1, 200, 'Xoá bình luận thành công', '');
        } else {
            return GetdataOutput(0, 500, 'Đã có lỗi xảy ra, vui lòng liên hệ với quản trị viên', '');
        }
    }

}
