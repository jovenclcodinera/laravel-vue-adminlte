<?php

use Illuminate\Http\Request;

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

Route::apiResources(["user"=>"API\UsersController"]);

Route::get("profile", "API\UsersController@profile")->name("user.profile");
Route::get("findUser", "API\UsersController@search")->name("user.search");
Route::put("profile", "API\UsersController@updateProfile")->name("user.profileUpdate");
