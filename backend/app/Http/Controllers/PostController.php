<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class PostController extends Controller
{
    //
    public function getPosts()
    {
        $posts = Post::all();
        return $this->GetdataOutput(1, 200, 'Lấy danh sách bài đăng thành công', $posts);
    }
    public function getPost($postId)
    {
        $post = Post::find($postId);
        if ($post) {
            return $this->GetdataOutput(1, 200, 'Tìm thấy bài đăng', $post);
        } else {
            return $this->GetdataOutput(0, 400, 'Không tìm thấy bài đăng', '');
        }
    }
    public function getPostsUser($userId)
    {
        // $posts = User::find($userId)->find($userId)->posts;
        $user = User::find($userId);
        if ($user) {
            $posts = User::find($userId)->posts;
            if ($posts->isNotEmpty()) {
                return $this->GetdataOutput(1, 200, 'Danh sách bài đăng từ người dùng', $posts);
            } else {
                return $this->GetdataOutput(1, 200, 'Người dùng này không có bài đăng nào', '');
            }
        } else {
            return $this->GetdataOutput(0, 400, 'Người dùng không tồn tại', '');
        }
    }
    public function create(Request $request)
    {
        $rules = [
            'content' => 'required|min:10',
            'title' => 'required|min:10',

        ];
        $customMessages = [
            'content.required' => 'Vui lòng nhập nội dung câu hỏi',
            'title.required' => 'Vui lòng nhập tiêu đề câu hỏi',
            '*.min' => 'Nội dung hoặc tiêu đề phải chứa ít nhất 10 ký tự'
        ];

        $validator = Validator::make($request->all(), $rules, $customMessages);
        if ($validator->fails()) {
            return $this->getDataOutput(0, 400, $validator->errors()->all(), '');
        }

        $post = [
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => $request->user_id
        ];
        $data = Post::create($post);

        return $this->GetdataOutput(1, 200, 'Tạo bài đăng thành công', $data);
    }
    public function GetdataOutput($status, $code, $mess, $data)
    {
        return response()->json([
            'status' => $status,
            'code' => $code,
            'message' => $mess,
            'data' => $data
        ]);
    }
}
