<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Topic;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class TopicController extends Controller
{
    //
    public function create(Request $request)
    {
        $rules = [
            'name' => 'required|min:5|max:255',

        ];
        $customMessages = [
            'name.required' => 'Vui lòng nhập tên chủ đề',
            'name.min' => 'Tên chủ đề chứa ít nhất 5 ký tự',
            'name.max' => 'Tên chủ đề không chứa quá 255 ký tự'
        ];

        $validator = Validator::make($request->all(), $rules, $customMessages);
        if ($validator->fails()) {
            return GetdataOutput(0, 400, $validator->errors()->all(), '');
        }
        $topic = [
            'name' => $request->name,
        ];
        $data = Topic::create($topic);

        return GetdataOutput(1, 200, 'Tạo chủ đề thành công', $data);
    }

    public function getAllTopics () {
        $topics = Topic::all();
        return GetdataOutput(1, 200, 'Lấy danh sách chủ đề thành công', $topics);
    }
}
