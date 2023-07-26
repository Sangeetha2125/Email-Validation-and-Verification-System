<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Dotenv\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
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
        $query = User::query();
        $queryParams = request()->query->all();
        $sort = (isset($queryParams['sort']))?$queryParams['sort']:'name';
        $sort_type = (isset($queryParams['sort_type']))?$queryParams['sort_type']:'asc';
        $limit=(isset($queryParams['limit']))?$queryParams['limit']:5;
        $filter=(isset($queryParams['filter']))?$queryParams['filter']:'all';

        unset($queryParams['sort']);
        unset($queryParams['sort_type']);
        unset($queryParams['limit']);
        unset($queryParams['page']);
        unset($queryParams['filter']);

        foreach ($queryParams as $field_name => $field_value) {
            $query->where($field_name, $field_value);
        }

        if($filter=='all'){
            $users = $query->orderBY($sort,$sort_type)->paginate($limit);
        }
        else{
            $users = $query->where('status',$filter)->orderBY($sort,$sort_type)->paginate($limit);
        }

        if($users->count() > 0){
            return $this->successResponse($users, 'Users Successfully Fetched');
        }
        else{
            return $this->errorResponse($message="No Records Found",$code=404);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'status' => 'required',
            'role' => 'required'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => $request->status,
            'role' => $request->role
        ]);

        if($user){
            return $this->successResponse($user, 'User created successfully');
        }
        else{
            return $this->errorResponse($message="No Such User Found",$code=404);
        }
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
    public function show(User $users,string $id)
    {
        $user = $users::find($id);
        if($user){
            return $this->successResponse($user, 'User details');
        }
        else{
            return $this->errorResponse($message="No Such User Found",$code=404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $users,string $id)
    {
        $user = $users::find($id);
        if($user){
            return $this->successResponse($user, 'User details');
        }
        else{
            return $this->errorResponse($message="No Such User Found",$code=404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find($id);
        if($user){
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'status' => $request->status,
                'role' => $request->role
            ]);

            return $this->successResponse($user, 'User updated successfully');
        }
        else{
            return $this->errorResponse($message="No Such User Found",$code=404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $users,string $id)
    {
        $user = $users::find($id);
        if($user){
            $user->delete();
            return $this->successResponse(['user' => Null], 'User deleted successfully');
        }
        else{
            return $this->errorResponse($message="No Such User Found",$code=404);
        }
    }
}
