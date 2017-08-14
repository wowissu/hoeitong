<?php

/**
 * Object Api
 */
use Carbon\Carbon;
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
        ])
        ->orderBy('id', 'desc')
        ->orderBy('title')
        ->get();

    return $res->withJson([
        'success' => $object->count() > 0,
        'data' => $object
    ], 200);
});

$app->get('/object/search', function ($req, $res, $args) use($app)
{
    $text = (string)$req->getQueryParam('text');

    try {
        // DB::enableQueryLog();
        // if (is_string($text) && strlen($text)) {} else {}

        $tabs = Tab::where('title', 'ILIKE', $text)->where('ship_count', '>', 0)->with('ship')->get();

        $objects = Object::whereIn('type', [Object::TYPE_MATERIAL, Object::TYPE_LINK])
            ->where(function ($qry) use($tabs, $text) {
                $qry->where('title', 'ILIKE', "%{$text}%")
                    ->orWhere('spec', 'ILIKE', "%{$text}%")
                    ->orWhere('model', 'ILIKE', "%{$text}%")
                    ->when($tabs, function ($qry) use($tabs)
                    {
                        $ships = $tabs->reduce(function ($carry, $row)
                        {
                            $carry = $carry->merge($row->ship);
                            return $carry;
                        }, collect([]));

                        if ($ships->count()) {
                            $qry->orWhere(function ($qry) use($ships)
                            {
                                $qry->whereIn('id', $ships->pluck('relate_id'));
                            });
                        }

                        return $qry;
                    });
            })
            ->with('parent')
            ->orderBy('type', 'ASC')
            ->orderBy('created_at')
            ->get();

        return $res->withJson([
            'success' => true,
            'data' => $objects
        ], 200);

    } catch (Exception $e) {
        return $res->withJson([
            'error' => true,
            'message' => $e->getMessage()
        ], 400);
    }


});

// get object by id
$app->get('/object/{id}', function ($req, $res, $args) use($app)
{
    $objectId = $args['id'];

    try {

        $target = Object::with(['images', 'tabs'])
            ->nodes($objectId)
            ->orderBy('type')
            ->orderBy('created_at')
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

            if (isset($userpost['children'])) {
                Object::flattenTreeNode($userpost, function (&$node, $parent) {
                    if ($parent['id']) {
                        if ((!$node['id']) && $node['deleted_at']) {
                            return;
                        }

                        $node['parent_id'] = $parent['id'];

                        $n             = Object::findOrNew($node['id']);
                        $n->type       = filter_var($node['type'], FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE);
                        $n->relate_id  = filter_var($node['relate_id'], FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE);
                        $n->parent_id  = filter_var($node['parent_id'], FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE);
                        $n->manual_id  = filter_var($node['manual_id'], FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE);
                        $n->title      = filter_var($node['title'], FILTER_SANITIZE_STRING, FILTER_NULL_ON_FAILURE);
                        $n->model      = filter_var($node['model'], FILTER_SANITIZE_STRING, FILTER_NULL_ON_FAILURE);
                        $n->summary    = filter_var($node['summary'], FILTER_SANITIZE_STRING, FILTER_NULL_ON_FAILURE);
                        $n->spec       = filter_var($node['spec'], FILTER_SANITIZE_STRING, FILTER_NULL_ON_FAILURE);
                        $n->amount     = filter_var($node['amount'], FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE) ?: 0;
                        $n->deleted_at = $node['deleted_at'] ? new Carbon($node['deleted_at']) : null;

                        if ($n->save()) {
                            $node['id'] = $n->id;
                        }
                    }
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

// create product
$app->post('/object/create/product', function ($req, $res, $args) use($app)
{
    try {

        return $res->withJson([
            'success' => true,
            'data' => Object::create([
                'title' => '新成品',
                'type' => Object::TYPE_PRODUCT
            ])
        ], 200);

    } catch (Exception $e) {

        return $res->withJson([
            'error' => true,
            'message' => $e->getMessage()
        ], 400);

    }
});

// create product
$app->post('/object/create/material', function ($req, $res, $args) use($app)
{
    try {

        return $res->withJson([
            'success' => true,
            'data' => Object::create([
                'title' => '新材料',
                'type' => Object::TYPE_MATERIAL
            ])
        ], 200);

    } catch (Exception $e) {

        return $res->withJson([
            'error' => true,
            'message' => $e->getMessage()
        ], 400);

    }
});