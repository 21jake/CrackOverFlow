<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Topic;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Auth;

class PostController extends Controller
{
    //
    public function getPosts()
    {
        $posts = Post::orderBy('created_at', 'desc')->with('comments', 'topic', 'postVotes', 'user')->paginate(10);
        return GetdataOutput(1, 200, 'Lấy danh sách bài đăng thành công', $posts);
    }
    public function getPost($postId)
    {
        $post = Post::where('id', $postId)->with('comments', 'topic', 'user')->first();
        if ($post) {
            return GetdataOutput(1, 200, 'Tìm thấy bài đăng', $post);
        } else {
            return GetdataOutput(0, 400, 'Không tìm thấy bài đăng', '');
        }
    }
    public function hotPostsToday()
    {
        // $postHasMostVotes = Post::has('PostVotes')->get()->findMostVotes();
        // $postHasMostVotes = Post::has('PostVotes')->get()->sortByDesc('number_of_votes')->first();
        $fivePostsHasMostUpvotes = Post::has('postUpvotes')->with('topic')
            ->whereBetween('created_at', array(Carbon::now()->subWeek(), Carbon::now()))
            ->get()->sortByDesc('number_of_upvotes')->take(5);
        // dd($fivePostsHasMostUpvotes);
        // dd($fivePostsHasMostUpvotes->toArray());
        if ($fivePostsHasMostUpvotes->isNotEmpty()) {
            return GetdataOutput(1, 200, 'Top bài đăng nổi bật nhất trong 7 ngày', $fivePostsHasMostUpvotes);
        } else {
            return GetdataOutput(0, 201, 'Không có bài đăng nào', '');
        }

        // return GetdataOutput(1, 200, 'Top bài đăng nổi bật nhất trong 7 ngày', $fivePostsHasMostUpvotes);
    }
    public function search(Request $request)
    {
        $input = $request->all();
        $posts = Post::orderBy('created_at', 'desc')->with('topic');

        // if (isset($input['query'])) {
        //    $posts->where('title','LIKE', '%'.$input['query'].'%')
        //     ->where('content','LIKE', '%'.$input['query'].'%');
        // }
        if (isset($input['query'])) {
            $inputQuery = $input['query'];
            $posts->where(function($query) use ($inputQuery)
            {
                $query->orWhere('title', 'LIKE', '%' . $inputQuery . '%');
                $query->orWhere('content', 'LIKE', '%' . $inputQuery . '%');
            });
        }

        if (isset($input['topic'])) {
            $posts->where('topic_id', $input['topic']);
        }
        if (isset($input['topics'])) {
            $posts->whereIn('topic_id',json_decode($input['topics']));
        }
        if (isset($input['minDate'])) {
            $minDate = date('Y-m-d H:i:s', strtotime($input['minDate']  . ' + 0 days'));
            $posts->where('created_at', ">=", $minDate);
        }
        if (isset($input['maxDate'])) {
            $maxDate = date('Y-m-d H:i:s', strtotime($input['maxDate']  . ' + 1 days'));
            $posts->where('created_at', "<=",  $maxDate);
        }

        $data = $posts->paginate(10);
        // dd($data);
        if ($data->isNotEmpty()) {
            return GetdataOutput(1, 200, 'Kết quả tìm kiếm', $data);
        } else {
            return GetdataOutput(1, 201, 'Không tìm thấy bài đăng phù hợp', $data);
        }

    }
    public function getPostsUser($userId)
    {
        // $posts = User::find($userId)->find($userId)->posts;
        $user = User::find($userId);
        if ($user) {
            $posts = Post::where('user_id', $userId)->with('postVotes')->paginate(10);
            $totalScore = DB::table('posts')
                ->leftJoin('post_votes', 'post_votes.post_id', 'posts.id')->where('posts.user_id', $userId)
                ->sum('post_votes.type');
            $data =  array('posts' => $posts, 'totalCredit' => $totalScore);
            if ($posts->isNotEmpty()) {
                return GetdataOutput(1, 200, 'Danh sách bài đăng từ người dùng', $data);
            } else {
                return GetdataOutput(1, 201, 'Người dùng này không có bài đăng nào', '');
            }
        } else {
            return GetdataOutput(0, 400, 'Người dùng không tồn tại', '');
        }
    }
    public function getPostsTopic($topicId)
    {
        // $posts = User::find($userId)->find($userId)->posts;
        $topic = Topic::find($topicId);
        if ($topic) {
            $posts = Topic::find($topicId)->posts;
            if ($posts->isNotEmpty()) {
                return GetdataOutput(1, 200, 'Danh sách bài đăng từ chủ đề', $posts);
            } else {
                return GetdataOutput(1, 201, 'Chủ đề này không có bài đăng nào', '');
            }
        } else {
            return GetdataOutput(0, 400, 'Chủ đề không tồn tại', '');
        }
    }
    public function deletePost($postId)
    {
        $post = Post::find($postId);
        if (!$post) {
            return GetdataOutput(1, 400, 'Bài đăng không tồn tại', '');
        }
        $checker = $post->delete();
        if ($checker) {
            return GetdataOutput(1, 200, 'Xoá bài đăng thành công', '');
        } else {
            return GetdataOutput(1, 500, 'Đã có lỗi xảy ra, vui lòng liên hệ với quản trị viên', '');
        }
    }
    public function updatePost(Request $request)
    {
        $input = $request->all();
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
            return GetdataOutput(0, 400, $validator->errors()->all(), '');
        }

        $post = Post::find($input['id']);
        if (!$post) {
            return GetdataOutput(1, 400, 'Bài đăng không tồn tại', '');
        }

        $checker = $post->update([
            'title' => $input['title'],
            'content' => $input['content'],
            'topic_id' => $input['topic_id'],

        ]);
        if ($checker) {
            return GetdataOutput(1, 200, 'Cập nhật câu hỏi thành công', $post);
        } else {
            return GetdataOutput(1, 500, 'Đã có lỗi xảy ra, vui lòng liên hệ với quản trị viên', '');
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

        $user = Auth::user();
        $validator = Validator::make($request->all(), $rules, $customMessages);
        if ($validator->fails()) {
            return GetdataOutput(0, 400, $validator->errors()->all(), '');
        }
        $post = [
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => $user->id,
            'topic_id' => $request->topic_id,
        ];
        $data = Post::create($post);

        return GetdataOutput(1, 200, 'Tạo bài đăng thành công', $data);
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
