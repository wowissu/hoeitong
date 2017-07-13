<?php
namespace Modules\Object\Models;

use Modules\App\BaseModel;

use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\Object\Collections\ObjectCollection;
use Modules\Tab\Models\TabShip;
// use Modules\Tab\Models\Tab;

/**
 *
 */
class Object extends BaseModel
{
    use SoftDeletes;

    protected $table = 'object';
    public $timestamps = true;

    const TYPE_MATERIAL = 1; // 材料
    const TYPE_PRODUCT  = 2; // 成品
    const TYPE_PARTS    = 3; // 部位
    const TYPE_LINK     = 4; // 關聯

    protected $fillable = ['id', 'title', 'type'];

    public function tabs()
    {
        return $this->hasMany(TabShip::class, 'relate_id')
            ->join('tabs', 'tab_ship.tab_id', '=', 'tabs.id')
            ->select('tab_ship.id', 'relate_id', 'ship_count', 'tab_id', 'title');
    }

    public function images()
    {
        return $this->hasMany(Images::class, 'object_id');
    }

    public function parent()
    {
        return $this->hasOne(self::class, 'id', 'parent_id');
    }

    public function scopeNodes($qry, $objectId)
    {
        return $qry->where('id', $objectId)
            ->orWhere('lineage', '<@', "root.{$objectId}");
    }

    /**
     * Create a new Eloquent Collection instance.
     *
     * @param  array  $models
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function newCollection(array $models = [])
    {
        return new ObjectCollection($models);
    }

    public static function flattenTreeNode(&$parent, $callback=null, $childkey='children', $map=[])
    {
        $map[] = &$parent;
        $children = &$parent[$childkey];

        $callback = is_callable($callback) ? $callback : (function () {});

        if (is_array($children) && count($children)) {
            foreach ($children as $key => $row) {
                $callback($children[$key], $parent);
                $map = self::flattenTreeNode($children[$key], $callback, $childkey, $map);
            }
        }

        return $map;
    }
}


