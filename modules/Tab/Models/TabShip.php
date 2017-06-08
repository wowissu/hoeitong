<?php
namespace Modules\Tab\Models;

use \Modules\App\BaseModel;

/**
 *
 */
class TabShip extends BaseModel
{
    protected $table = 'tab_ship';
    protected $fillable = ['relate_id', 'tab_id'];

    public function tab()
    {
        return $this->hasOne(Tab::class, 'id', 'tab_id');
    }
}
