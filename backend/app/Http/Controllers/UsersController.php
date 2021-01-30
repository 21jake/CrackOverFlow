<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Auth;

class UsersController extends Controller
{
    //
    public function login()
    {
        if (Auth::attempt(['email' => request('email'), 'password' => request('password')])) {
            $user = Auth::user();
            $success['token'] = $user->createToken('appToken')->accessToken;
            //After successfull authentication, notice how I return json parameters
            return response()->json([
                'success' => true,
                'token' => $success,
                'user' => $user,
                'message' => 'Đăng nhập thành công'

            ]);
        } else {
            //if authentication is unsuccessfull, notice how I return json parameter
            return GetDataOutput(0, 401, "Mật khẩu hoặc email chưa chính xác", '');
        }
    }
    public function search(Request $request)
    {
        $input = $request->all();
        $users = User::whereNotNull('id');
        if ($input['query']) {
            $users->where('fname', 'LIKE', '%' . $input['query'] . '%')
                ->orWhere('lname', 'LIKE', '%' . $input['query'] . '%')
                ->orWhere('phone', 'LIKE', '%' . $input['query'] . '%')
                ->orWhere('email', 'LIKE', '%' . $input['query'] . '%')
                ->orWhereRaw("CONCAT(`fname`, ' ', `lname`) LIKE ?", ['%'.$input['query'].'%']);
        }
        $data = $users->paginate(10);
        if ($data->isNotEmpty()) {
            return GetdataOutput(1, 200, 'Kết quả tìm kiếm', $data);
        } else {
            return GetdataOutput(1, 201, 'Không tìm thấy nguời dùng phù hợp', '');
        }
    }


    /**
     * Register api.
     *
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fname' => 'required',
            'lname' => 'required',
            'phone' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required',
        ]);
        if ($validator->fails()) {
            return GetDataOutput(0, 400, $validator->errors()->first(), '');
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);
        $success['token'] = $user->createToken('appToken')->accessToken;

        if ($input['topics']) {
            $userId = $user->id;
            $this->createInterests($userId, $input['topics']);
        }

        return response()->json([
            'success' => true,
            'token' => $success,
            'user' => $user,
            'message' => 'Tạo tài khoản thành công'
        ]);
    }
    public function createInterests($userId, $topics)
    {
        $user = User::find($userId);
        $user->Topics()->attach($topics);
    }

    public function logout(Request $res)
    {
        if (Auth::user()) {
            $user = Auth::user()->token();
            $user->revoke();

            return response()->json([
                'success' => true,
                'message' => 'Logout successfully'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Unable to Logout'
            ]);
        }
    }
    public function getUserDetails($userId)
    {
        $user = User::find($userId);
        // $topic = $user->Topics()->get();
        // dd($topic->toArray());
        foreach ($user->Topics as $topic) {
             $topic->interests;
        }
        // dd($user);
        if ($user) {
            return GetdataOutput(1, 200, 'Thông tin người dùng', $user);
        } else {
            return GetdataOutput(0, 401, 'Không tồn tại', '');
        }
        # code...
    }
    public function dummyFunction()
    {
        if (Auth::user()) {
            $user = Auth::user();
            foreach ($user->Topics as $topic) {
                $topic->interests;
            }
            return GetdataOutput(1, 200, 'Thông tin người dùng', $user);
        } else {
            return GetdataOutput(0, 401, 'Không tồn tại', '');
        }
    }
}
