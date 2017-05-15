<?php
namespace Modules\Object\Models;

use Modules\App\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;
// use Modules\Tab\Models\Tab;
use Modules\Tab\Models\TabShip;

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

    public function tabs()
    {
        return $this->hasMany(TabShip::class, 'relate_id');
    }

    public function images()
    {
        return $this->hasMany(Images::class, 'object_id');
    }

    public function isMeterial() {
        return $this->where('type', self::TYPE_MATERIAL);
    }

    public function isProduct() {
        return $this->where('type', self::TYPE_PRODUCT);
    }

    public function isParts() {
        return $this->where('type', self::TYPE_PARTS);
    }

    public function isLink() {
        return $this->where('type', self::TYPE_LINK);
    }
}
