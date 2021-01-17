<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PostVote;

class PostVoteController extends Controller
{
    //
    public function index(Request $request)
    {
        $input = $request->all();
        if ($input['type'] != 1 && $input['type'] != -1 && $input['type'] != 0) {
            return GetdataOutput(1, 400, 'Stupid bitch ass', '');
        }

        if ($input['type'] == 0) {
            PostVote::where('user_id', $input['user_id'])->where('post_id', $input['post_id'])->delete();
            return GetdataOutput(1, 200, 'Xoá vote thành công', '');
        }

        $data = PostVote::updateOrCreate(
            ['user_id' => $input['user_id'], 'post_id' => $input['post_id']],
            ['type' => intval($input['type'])]
        );
        return GetdataOutput(1, 200, 'Upvote/Downvote thành công', $data);
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
