<?php

namespace App\Http\Controllers;

use App\Models\Lists;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Jobs\ListCsvProcess;
use Illuminate\Support\Facades\Cache;

class ListsController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }
    /**
     * Display a listing of the resource.
     * API end point: /api/lists?sort=id&&sort_type=desc&&limit=10
     * Method:GET
     */
    public function index(Request $request)
    {
        $query = Lists::query();
        $queryParams = request()->query->all();
        $sort = (isset($queryParams['sort']))?$queryParams['sort']:'id';
        $sort_type = (isset($queryParams['sort_type']))?$queryParams['sort_type']:'desc';
        $limit=(isset($queryParams['limit']))?$queryParams['limit']:5;
        $user=(isset($queryParams['user']))?$queryParams['user']:0;

        unset($queryParams['sort']);
        unset($queryParams['sort_type']);
        unset($queryParams['limit']);
        unset($queryParams['page']);
        unset($queryParams['user']);

        foreach ($queryParams as $field_name => $field_value) {
            $query->where($field_name, $field_value);
        }

        if($user == 0){
            $lists = $query->orderBY($sort,$sort_type)->paginate($limit);
        }
        else{
            $lists = $query->where('user_id',$user)->orderBY($sort,$sort_type)->paginate($limit);
        }

        if($lists->count() > 0){
            return $this->successResponse($lists, 'Lists Successfully Fetched');
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
     * API end point: /api/lists/
     * Method:POST
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'name'=> 'required|string',
            'file' => 'required|mimetypes:text/csv,text/plain,application/csv,text/comma-separated-values',
        ]);
        if($validator->fails()){
            return $this->errorResponse($message=$validator->messages(),$code=422);
        }
        else{
            try {
                if($request->hasFile('file')) {
                    $fileName = time().'_'.$request->file->getClientOriginalName();
                    $filePath = $request->file('file')->storeAs('uploads', $fileName, 'public');
                    $file_path = 'app/public/' . $filePath;
                    $file_path = storage_path($file_path);
                    $list = Lists::create([
                        'name' => $request->name,
                        'file_path' => $file_path,
                        'status'=> 'processing',
                        'user_id'=> $request->user_id
                    ]);
                    ListCsvProcess::dispatch($list);
                    if($list){
                        return $this->successResponse($list, 'List created successfully');
                    }
                    else{
                        return $this->errorResponse($message="Something Went Wrong",$code=500);
                    }
                }
                else{
                    return $this->errorResponse($message="Something Went Wrong",$code=500);
                }
            }
            catch (\Exception $e) {

            return $this->errorResponse($message=$e->getMessage(),$code=500);

            }

    }}
    /**
     * Display the specified resource.
     * API end point: /api/lists/{id}
     * Method:GET
     */
    public function show(Lists $lists,$id)
    {
        $list = $lists::find($id);
        if($list){

            return $this->successResponse($list, 'List details');
        }
        else{
            return $this->errorResponse($message="No Such List Found",$code=404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     * API end point: /api/lists/{id}/edit
     * Method:GET
     */
    public function edit(Lists $lists,$id)
    {
        $list = $lists::find($id);
        if($list){
            return $this->successResponse($list, 'List details');
        }
        else{
            return $this->errorResponse($message="No Such List Found",$code=404);
        }
    }

    /**
     * Update the specified resource in storage.
     * API end point: /api/lists/{id}/edit
     * Method:PUT
     */
    public function update(Request $request,$id)
    {
        $list = Lists::find($id);
        if($list){
            $list->update([
                'name' => $request->name,
                'total' => $request->total,
                'progress' => $request->progress,
                'status'=>$request->status
            ]);
            return $this->successResponse($list, 'List updated successfully');
        }
        else{
            return $this->errorResponse($message="No Such List Found",$code=404);
        }

    }

    public function getTotalCount(Lists $lists, $id)
    {
        $cacheKey = 'total_count_' . $id;
        $cachedTotal = Cache::get($cacheKey);
    
        if ($cachedTotal !== null) {
            return $this->successResponse($cachedTotal, 'Total Count Retrieved from Cache');
        }

        $userLists = $lists::where(['user_id' => $id])->get('total');
        $total = 0;
        foreach ($userLists as $list) {
            $total += $list->total;
        }
    
        if ($userLists) {
            Cache::put($cacheKey, $total, now()->addHour());
            return $this->successResponse($total, 'List Total Calculated');
        }
        else {
            return $this->errorResponse('No User List Found', 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     * API end point: /api/lists/{id}/delete
     * Method:Delete
     */
    public function destroy(Lists $lists,$id)
    {
        $list = $lists::find($id);
        if($list){
            $list->delete();
            return $this->successResponse(['list' => Null], 'List deleted successfully');
        }
        else{
            return $this->errorResponse($message="No Such List Found",$code=404);
        }
    }

    //public function listprocess(Lists $lists,Request $request){
    // /**
    // * import csv.
    // * API end point: /api/lists/listprocess?listid=10
    // * Method:GET
    // */
    //    $queryParams = request()->query->all();
    //    $listid = $queryParams['listid'];
    //    $list = $lists::findorFail($listid);
    //    if($list){
    //        ListCsvProcess::dispatch($list);
    //        return $this->successResponse($data=null,$message='List imported successfully');
    //    }
    //    else{
    //        return $this->errorResponse($message="No Such List Found",$code=404);
    //    }
    //}/*
//
}
