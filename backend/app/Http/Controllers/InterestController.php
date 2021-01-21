<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Topic;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class InterestController extends Controller
{
    //
    public function create(Request $request)
    {
        $input = $request->all();
        $user = User::find($input['userId']);
        $user->Topics()->attach($input['topics']);
    }

}
