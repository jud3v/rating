<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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


Route::group([

    'middleware' => 'api',

], function ($router) {
    Route::resource('/languages', 'LanguageController');
    Route::resource('/users', 'UserController');
    Route::resource('/courses', 'CourseController');
    Route::post('/courses/accept/{id}','CourseController@accept');
    Route::resource('/exercises', 'ExerciceController');
    Route::resource('/comment', 'CommentController');
    Route::resource('/ratings', 'RatingController');

    Route::post('register','AuthController@register');
    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');

});