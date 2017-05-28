<?php

/**
 * Object Api
 */
use Illuminate\Database\Capsule\Manager as DB;
use Modules\Object\Models\Object;
use Modules\Tab\Models\TabShip;
use Modules\Tab\Models\Tab;
use Modules\Object\Models\Image;
use Modules\Company\Models\Company;
use Modules\Company\Exceptions\CompanyNotFound;

// get MATERIAL and PRODUCT List
$app->get('/object', function ($req, $res, $args) use($app)
{
    $object = Object::with(['images', 'tabs'])
        ->whereIn('type', [
            Object::TYPE_MATERIAL,
            Object::TYPE_PRODUCT
        ])->get();

    return $res->withJson([
        'success' => $object->count() > 0,
        'data' => $object
    ], 200);
});

$app->get('/object/{id}/nodes', function ($req, $res, $args) use($app)
{
    $objectId = $args['id'];
    $obj = Object::where('parent_id', $objectId)
                ->orWhere('relate_id', $objectId)
                ->get()->toArray();

    $map = array_combine(array_column($obj, 'id'), $obj);
    $output = [];

    foreach ($map as $objId => $objVal) {
        $parentId = $objVal['parent_id'];

        if (isset($map[$parentId])) {
            $map[$parentId]['children'][] = &$map[$objId];
        }

        if (
            $objVal['relate_id'] == $objectId &&
            $objVal['parent_id'] == $objectId
        ) {
            $output[] = &$map[$objId];
        }
    }

    return $res->withJSON([
        'success' => true,
        'data' => $output
    ]);
});

// get object by id
$app->get('/object/{id}[/{query:.*}]', function ($req, $res, $args) use($app)
{
    try {
        $obj = Object::where('id', $args['id']);
        $query = $args['query'];

        if (strpos($query, 'tabs') > -1) {
            $obj->with('tabs');
        }

        if (strpos($query, 'images') > -1) {
            $obj->with('images');
        }

        return $res->withJson([
            'success' => true,
            'data' => $obj->first()
        ], 200);

    } catch (Exception $e) {

        return $res->withJson([
            'error' => true,
            'message' => $e->getMessage()
        ], 400);

    }
});

// put object by id
$app->put('/object/{id}', function ($req, $res, $args) use($app)
{
    $userpost = $req->getParams();

    try {

        $obj = Object::findOrFail($userpost['id']);

        DB::transaction(function () use ($userpost, &$obj)
        {
            $obj->title = $userpost['title'];
            $obj->summary = $userpost['summary'] ?: null;
            $obj->model = $userpost['model'] ?: null;
            $obj->spec = $userpost['spec'] ?: null;

            $obj->save();


            // TabShip::where('relate_id', $obj->id)->delete(); // remove all tabs
            // Image::where('object_id', $obj->id)->delete(); // remove all images

            if (is_array($userpost['tabs'])) {
                $old = $obj->tabs->pluck('title')->toArray();
                $new = array_column($userpost['tabs'], 'title');

                $addtabs = array_diff($new, $old);
                $removetabs = array_diff($old, $new);

                foreach ($addtabs as $tab) {
                    $tab = Tab::firstOrCreate(['title' => $tab]);

                    if ($tab) {
                        $tab->shipWith($obj->id);
                    }
                }

                Tab::whereIn('title', $removetabs)->get()->each(function ($row) use($obj)
                {
                    $row->unship($obj->id);
                });
            }
        });

        return $res->withJson([
            'success' => true,
            'data' => Object::where('id', $obj->id)->with(['tabs', 'images'])->first()
        ], 200);


    } catch (Exception $e) {

        return $res->withJson([
            'error' => true,
            'message' => $e->getMessage()
        ], 400);

    }
});

// put object by id
$app->post('/object/create', function ($req, $res, $args) use($app)
{
    $userpost = $req->getParams();
    dd($userpost);
});

// delete object by id
$app->delete('/object/{id}', function ($req, $res, $args) use($app)
{

});

// create object