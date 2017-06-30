<?php
namespace Modules\Object\Collections;

/**
*
*/
class ObjectCollection extends \Illuminate\Database\Eloquent\Collection
{
    public function tree($callback=null, $parentField='parent_id')
    {
        $map = $this->keyBy('id');

        if ($map->count() > 1) {
            $map->map(function ($row, $id) use($map, $parentField) {
                $parentId = $row->{$parentField};

                if ($map->has($parentId)) {
                    $parent = $map->get($parentId);

                    if (is_a($parent->children, 'Illuminate\Support\Collection')) {} else {
                        $parent->children = new ObjectCollection([]);
                    }

                    $parent->children->push($map->get($id));
                }

                return $row;
            });
        }

        if (is_callable($callback)) {
            return $callback($map);
        } else {
            return $map->values();
        }
    }
}