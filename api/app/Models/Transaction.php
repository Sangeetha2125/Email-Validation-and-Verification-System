<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;
    
    protected $table = 'transactions';

    protected $fillable = [
        'email',
        'payment_id',
        'package',
        'transaction_date',
        'transaction_status',
        'start_date',
        'end_date',
        'status'
    ];

}
