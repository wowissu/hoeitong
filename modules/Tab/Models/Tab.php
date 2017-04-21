<?php
namespace Modules\Tab\Models;

use \Modules\App\BaseModel;

/**
 *
 */
class Tab extends BaseModel
{
    protected $table = 'tabs';
    protected $fillable = ['title'];
}
