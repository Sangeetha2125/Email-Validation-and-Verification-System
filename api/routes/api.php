<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ListsController;
use App\Http\Controllers\ListResultsController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TransactionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
    Route::post('refresh', 'refresh');
});
Route::controller(ListsController::class)->group(function () {
    Route::get('lists', 'index');
    Route::post('lists', 'store');
    Route::get('lists/{id}','show');
    Route::get('lists/{id}/edit','edit');
    Route::put('lists/{id}/edit','update');
    Route::delete('lists/{id}/delete','destroy');
    Route::get('lists/listprocess','listprocess');
    Route::get('lists/total/{id}','getTotalCount');
});

Route::controller(ListResultsController::class)->group(function () {
    Route::get('listresults','index');
    Route::post('listresults','store');
    Route::get('listresults/{id}','show');
    Route::get('listresults/{id}/edit','edit');
    Route::put('listresults/{id}/edit','update');
    Route::delete('listresults/{id}/delete','destroy');
    Route::get('lists/results/{id}','results');
    Route::get('lists/report/{id}','viewTop');
    Route::get('lists/valid/{id}','getValidCount');
    Route::get('lists/invalid/{id}','getInvalidCount');
    Route::get('lists/domain/{id}','getDomainCount');
    Route::get('lists/role/{id}','getRoleCount');
    Route::get('lists/spam/{id}','getSpamCount');
});

Route::controller(UserController::class)->group(
    function(){
        Route::get('users','index');
        Route::post('users','create');
        Route::get('users/{id}','show');
        Route::get('users/{id}/edit','edit');
        Route::put('users/{id}/edit','update');
        Route::delete('users/{id}/delete','destroy');
    }
);

Route::post('/webhook',[StripeController::class,'handleWebhook']);

Route::controller(TransactionController::class)->group(
    function(){
        Route::get('transactions','index');
        Route::get('transactions/{email}','show');
        Route::get('transactions/{email}/all','getAll');
    }
);