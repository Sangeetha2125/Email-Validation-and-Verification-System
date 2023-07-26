<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListsResults extends Model
{
    use HasFactory;
    protected $table = 'lists_results';
    protected $fillable = ['list_id','valid_path','valid_count',
    'invalid_path','invalid_count','domain_path',
    'domain_count','spam_path','spam_count'
    ];

    public function list()
    {
    return $this->belongsTo(Lists::class,'list_id');
    }
}
