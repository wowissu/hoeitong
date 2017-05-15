<?php
namespace Modules\Tab\Models;

use \Modules\App\BaseModel;

/**
 *
 */
class TabShip extends BaseModel
{
    protected $table = 'tab_ship';

    public function tab()
    {
        return $this->hasOne(Tab::class, 'id', 'tab_id');
    }
}
