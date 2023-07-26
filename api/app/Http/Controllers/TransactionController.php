<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
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
        $query = Transaction::query();
        $queryParams = request()->query->all();
        $sort = (isset($queryParams['sort']))?$queryParams['sort']:'id';
        $sort_type = (isset($queryParams['sort_type']))?$queryParams['sort_type']:'desc';
        $limit=(isset($queryParams['limit']))?$queryParams['limit']:5;

        unset($queryParams['sort']);
        unset($queryParams['sort_type']);
        unset($queryParams['limit']);
        unset($queryParams['page']);

        foreach ($queryParams as $field_name => $field_value) {
            $query->where($field_name, $field_value);
        }

        $subscriptions = $query->orderBY($sort,$sort_type)->paginate($limit);

        if($subscriptions->count() > 0){
            return $this->successResponse($subscriptions, 'Transactions Successfully Fetched');
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction,string $email)
    {
        $subscription = $transaction::where('email',$email)->first();
        if($subscription){
            return $this->successResponse($subscription, 'Subscription Details');
        }
        else{
            return $this->errorResponse($message="No Such Email Found",$code=404);
        }
    }

    public function getAll(Transaction $transaction,string $email)
    {
        $query = $transaction::where('email',$email);
        $queryParams = request()->query->all();
        $sort = (isset($queryParams['sort']))?$queryParams['sort']:'id';
        $sort_type = (isset($queryParams['sort_type']))?$queryParams['sort_type']:'desc';
        $limit=(isset($queryParams['limit']))?$queryParams['limit']:5;

        unset($queryParams['sort']);
        unset($queryParams['sort_type']);
        unset($queryParams['limit']);
        unset($queryParams['page']);

        foreach ($queryParams as $field_name => $field_value) {
            $query->where($field_name, $field_value);
        }

        $subscriptions = $query->orderBY($sort,$sort_type)->paginate($limit);

        if($subscriptions->count() > 0){
            return $this->successResponse($subscriptions, 'Transactions Successfully Fetched');
        }
        else{
            return $this->errorResponse($message="No Records Found",$code=404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
