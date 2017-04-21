<?php

use Modules\Object\Models\Object;
use Modules\Object\Models\Image as ObjImage;
use Modules\Object\Models\Provider as ObjProvider;

use Modules\Object\Models\OldObj;
use Modules\Object\Models\OldProvider;

use Modules\Manual\Models\Manual;
use Modules\Tab\Models\Tab;
use Modules\Tab\Models\TabShip;

$app->get('/object/trans', function ($req, $res, $args)
{

    $this->db->table('manual')->delete();
    $this->db->table('object')->delete();
    $this->db->table('tabs')->delete();
    $this->db->table('tab_ship')->delete();


    $obj = [];
    $tabs = [];
    $images = [];
    $providerShip = [];
    // 0: 無, 1: 原料 2: 成品 3: 組成 4: 關聯

    /** 找出物件本身 */
    OldObj::get()->each(function ($row) use(&$obj, &$tabs, &$images, &$providerShip)
    {
        // dd($row->toArray()) ;

        $manual = null;

        if ($row->document) {
            $manual = new Manual();
            $manual->content = $row->document;
            $manual->save();
        }

        $obj[] = [
            'id'         => $row->id,
            'type'       => $row->type,
            'relate_id'  => $row->relate_id,
            'parent_id'  => $row->parent_id,
            'manual_id'  => @$manual ? $manual->id : null,
            'title'      => @$row->name ?: null,
            'model'      => @$row->model ?: null,
            'summary'    => @$row->detail ?: null,
            'spec'       => @$row->format ?: null,
            'amount'     => $row->amount,
            'created_at' => $row->created_at,
            'updated_at' => $row->updated_at,
            'deleted_at' => $row->deleted_at
        ];


        // provider
        if ($row->providerId) {
            $providerShip[] = [
                'object_id' => $row->id,
                'company_id' => $row->providerId,
            ];
        }

        // tabs
        $row->keywords = json_decode($row->keywords);
        foreach ($row->keywords as $keyword) {
            $tabs[$keyword][] = $row->id;
        }

        // image
        if ($row->image) {
            $images[] = [
                'object_id' => $row->id,
                'image' => $row->image
            ];
        }
    });

    Object::insert($obj);
    ObjImage::insert($images);


    // tabs
    $tabShips = [];
    foreach ($tabs as $title => $objs) {

        $tab = Tab::firstOrCreate(['title' => $title]);

        foreach ($objs as $objId) {
            $tabShips[] = [
                'tab_id' => $tab->id,
                'relate_id' => $objId
            ];
        }
    }
    TabShip::insert($tabShips);


    // object provider
    OldProvider::get()->each(function ($row) use(&$providerShip)
    {
        $providerShip[] = [
            'object_id' => $row->obj_id,
            'company_id' => $row->fty_id,
        ];
    });
    ObjProvider::insert($providerShip);
});