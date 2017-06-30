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

// get object by id
$app->get('/object/{id}', function ($req, $res, $args) use($app)
{
    $objectId = $args['id'];

    try {

        $target = Object::with(['images', 'tabs'])
            ->nodes($objectId)
            ->get()
            ->tree(function ($map) use($objectId)
            {
                return $map->get($objectId);
            });

        return $res->withJson([
            'success' => true,
            'data' => $target
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
            $obj->title   = $userpost['title'];
            $obj->summary = $userpost['summary'] ?: null;
            $obj->model   = $userpost['model'] ?: null;
            $obj->spec    = $userpost['spec'] ?: null;
            $obj->save();

            if (is_array($userpost['tabs'])) {
                $old = $obj->tabs->pluck('title');
                $new = collect($userpost['tabs'])->pluck('title');

                // create tabs if not exists
                $new->diff($old)->each(function ($tabTitle) use($obj)
                {
                    if ($tab = Tab::firstOrCreate(['title' => $tabTitle])) {
                        $tab->shipWith($obj->id);
                    }
                });

                // remove tabs
                Tab::whereIn('title', $old->diff($new))
                    ->get()
                    ->each(function ($row) use($obj)
                    {
                        $row->unship($obj->id);
                    });
            }
        });

        return $res->withJson([
            'success' => true,
            'data' => Object::with(['tabs', 'images'])
                ->nodes($obj->id)
                ->get()
                ->tree(function ($map) use($obj)
                {
                    return $map->get($obj->id);
                })
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
$app->delete('/object/{id}/delete', function ($req, $res, $args) use($app)
{
    try {
        $o = Object::findOrFail($args['id']);

        if ($o->delete()) {
            return $res->withJson([
                'success' => true,
                'data' => $o->toArray()
            ], 200);
        }
    } catch (Exception $e) {
        return $res->withJson([
            'error' => true,
            'message' => $e->getMessage()
        ], 400);
    }
});

// recover object by id
$app->put('/object/{id}/recover', function ($req, $res, $args) use($app)
{
    try {
        $o = Object::withTrashed()->findOrFail($args['id']);

        if ($o->restore()) {
            return $res->withJson([
                'success' => true,
                'data' => $o->toArray()
            ], 200);
        }
    } catch (Exception $e) {
        return $res->withJson([
            'error' => true,
            'message' => $e->getMessage()
        ], 400);
    }
});

//