<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lists extends Model
{
    use HasFactory;
    protected $table = 'lists';
    protected $fillable = ['name','file_path','total','progress','status','user_id'];

    public function lists_results()
    {
        return $this->hasMany(ListsResults::class);
    }
}
