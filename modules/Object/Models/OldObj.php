<?php
namespace Modules\Object\Models;

use \Modules\App\BaseModel;

/**
 *
 */
class OldObj extends BaseModel
{
    protected $connection = 'mysql';
    protected $table = 'object';

    public function providers(){
        return $this->hasMany('\\Modules\\Object\\Models\\ObjectProviderRelation', 'obj_id');
    }
}
