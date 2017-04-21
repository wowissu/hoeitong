<?php
namespace Modules\Object\Models;

use \Modules\App\BaseModel;

/**
 *
 */
class Object extends BaseModel
{
    protected $table = 'object';

    public $timestamps = true;

    const TYPE_MATERIAL = 1; // 材料
    const TYPE_PRODUCT  = 2; // 成品
    const TYPE_PARTS    = 3; // 部位
    const TYPE_LINK     = 4; // 關聯

}
