<?php

namespace App\Http\Controllers;

use App\Models\ListsResults;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Lists;
use Illuminate\Support\Facades\Cache;
use Listhelper;

class ListResultsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $listresults = ListsResults::all();
        if($listresults->count() > 0){
            return $this->successResponse($listresults, 'List Results Successfully Fetched');
        }
        else{
            return $this->errorResponse($message="No Records Found",$code=404);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'list_id'=>'required',

        ]);
        if($validator->fails()){
            return $this->errorResponse($message=$validator->messages(),$code=422);
        }
        else{
            $listresult = ListsResults::create([
            'list_id'=>$request->list_id,
            'valid_path'=>$request->valid_path,
            'valid_count'=>$request->valid_count,
            'invalid_path'=>$request->invalid_path,
            'invalid_count'=>$request->invalid_count,
            'domain_path'=>$request->domain_path,
            'domain_count'=>$request->domain_count,
            'spam_path'=>$request->spam_path,
            'spam_count'=>$request->spam_count,
            ]);
            if($listresult){
                return $this->successResponse($listresult, 'List result created successfully');
            }
            else{
                return $this->errorResponse($message="Something Went Wrong",$code=500);
            }

        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ListsResults $listresults,$id)
    {
        $listresult = $listresults::find($id);
        if($listresult){
            return $this->successResponse($listresult, 'List Result details');
        }
        else{
            return $this->errorResponse($message="No Such List Result Found",$code=404);
        }
    }

    public function viewTop(Lists $lists,ListsResults $listresults,$id)
    {
        $userLists = $lists::where(['user_id'=>$id,'status'=>'completed'])->orderBY('id','desc')->limit(5)->get(['id','name']);
        
        $userResults = array();

        foreach ($userLists as $list) {
            $results = $listresults::where(['list_id' => $list->id])->get();
            foreach ($results as $result) {
                $result->name = $list->name;
                $userResults[] = $result;
            }
        }

        if ($userLists->count() > 0) {
            return $this->successResponse($userResults, 'List Result details');
        }
        else {
            return $this->errorResponse('No Such List Result Found', 404);
        }
    }

    public function getValidCount(Lists $lists,ListsResults $listresults,$id)
    {
        $cacheKey = 'valid_count_' . $id;
        $cachedValid = Cache::get($cacheKey);

        if($cachedValid!==null){
            return $this->successResponse($cachedValid, 'Valid Count Retrieved from Cache');
        }

        $userLists = $lists::where(['user_id' => $id, 'status' => 'completed'])->get(['id']);

        $valid = $listresults::whereIn('list_id', $userLists->pluck('id')->toArray())->sum('valid_count');

        if ($userLists) {
            Cache::put($cacheKey, $valid, now()->addHour());
            return $this->successResponse($valid, 'Valid Count Calculated');
        }
        else {
            return $this->errorResponse('No User List Found', 404);
        }
    }

    public function getInvalidCount(Lists $lists,ListsResults $listresults,$id)
    {
        $cacheKey = 'invalid_count_' . $id;
        $cachedInvalid = Cache::get($cacheKey);

        if($cachedInvalid!==null){
            return $this->successResponse($cachedInvalid, 'Invalid Count Retrieved from Cache');
        }

        $userLists = $lists::where(['user_id' => $id, 'status' => 'completed'])->get(['id']);

        $invalid = $listresults::whereIn('list_id', $userLists->pluck('id')->toArray())->sum('invalid_count');

        if ($userLists) {
            Cache::put($cacheKey, $invalid, now()->addHour());
            return $this->successResponse($invalid, 'Invalid Count Calculated');
        }
        else {
            return $this->errorResponse('No User List Found', 404);
        }
    }

    public function getDomainCount(Lists $lists,ListsResults $listresults,$id)
    {
        $cacheKey = 'domain_count_' . $id;
        $cachedDomain = Cache::get($cacheKey);

        if($cachedDomain!==null){
            return $this->successResponse($cachedDomain, 'Domain Count Retrieved from Cache');
        }

        $userLists = $lists::where(['user_id' => $id, 'status' => 'completed'])->get(['id']);

        $domain = $listresults::whereIn('list_id', $userLists->pluck('id')->toArray())->sum('domain_count');

        if ($userLists) {
            Cache::put($cacheKey, $domain, now()->addHour());
            return $this->successResponse($domain, 'Domain Count Calculated');
        }
        else {
            return $this->errorResponse('No User List Found', 404);
        }
    }

    public function getRoleCount(Lists $lists,ListsResults $listresults,$id)
    {
        $cacheKey = 'role_count_' . $id;
        $cachedRole = Cache::get($cacheKey);

        if($cachedRole!==null){
            return $this->successResponse($cachedRole, 'Valid Count Retrieved from Cache');
        }

        $userLists = $lists::where(['user_id' => $id, 'status' => 'completed'])->get(['id']);

        $role = $listresults::whereIn('list_id', $userLists->pluck('id')->toArray())->sum('role_count');

        if ($userLists) {
            Cache::put($cacheKey, $role, now()->addHour());
            return $this->successResponse($role, 'Role Count Calculated');
        }
        else {
            return $this->errorResponse('No User List Found', 404);
        }
    }

    public function getSpamCount(Lists $lists,ListsResults $listresults,$id)
    {
        $cacheKey = 'spam_count_' . $id;
        $cachedSpam = Cache::get($cacheKey);

        if($cachedSpam!==null){
            return $this->successResponse($cachedSpam, 'Spam Count Retrieved from Cache');
        }

        $userLists = $lists::where(['user_id' => $id, 'status' => 'completed'])->get(['id']);

        $spam = $listresults::whereIn('list_id', $userLists->pluck('id')->toArray())->sum('spam_count');

        if ($userLists) {
            Cache::put($cacheKey, $spam, now()->addHour());
            return $this->successResponse($spam, 'Spam Count Calculated');
        }
        else {
            return $this->errorResponse('No User List Found', 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ListsResults $listresults,$id)
    {
        $listresult = $listresults::find($id);
        if($listresult){
            return $this->successResponse($listresult, 'List Result details');
        }
        else{
            return $this->errorResponse($message="No Such List Result Found",$code=404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,$id)
    {
        $validator = Validator::make($request->all(),[
            'list_id'=>'required',
        ]);
        if($validator->fails()){
            return $this->errorResponse($message=$validator->messages(),$code=422);
        }
        else{
            $listresult = ListsResults::findorFail($id);
            if($listresult){
                $listresult->update([
                    'list_id'=>$request->list_id,
                    'valid_path'=>$request->valid_path,
                    'valid_count'=>$request->valid_count,
                    'invalid_path'=>$request->invalid_path,
                    'invalid_count'=>$request->invalid_count,
                    'domain_path'=>$request->domain_path,
                    'domain_count'=>$request->domain_count,
                    'spam_path'=>$request->spam_path,
                    'spam_count'=>$request->spam_count,
                ]);
                return $this->successResponse($listresult, 'List Result updated successfully');
            }
            else{
                return $this->errorResponse($message="No Such List Result Found",$code=404);
            }

        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ListsResults $listresults,$id)
    {
        $listresult = $listresults::find($id);
        if($listresult){
            $listresult->delete();
            return $this->successResponse(['listresult' => Null], 'List result deleted successfully');
        }
        else{
            return $this->errorResponse($message="No Such List Result Found",$code=404);
        }

    }

    public function results(ListsResults $listsResults,$id)
    {
        $domain = request()->getHttpHost();
        $listresult = $listsResults::where('list_id',$id)->first();
        $listresult->valid_path = $domain . $listresult->valid_path;
        $listresult->invalid_path = $domain . $listresult->invalid_path;
        $listresult->domain_path = $domain . $listresult->domain_path;
        $listresult->spam_path = $domain . $listresult->spam_path;
        $listresult->role_path = $domain . $listresult->role_path;

        if($listresult){

            return $this->successResponse($listresult, 'List Result Details');
        }
        else{
            return $this->errorResponse($message="No Such List Result Found",$code=404);
        }
    }
}
