<?php

/**
 * Object Api
 */

use Illuminate\Database\Capsule\Manager as DB;
use Modules\Object\Models\Object;
use Modules\Company\Models\Company;
use Modules\Company\Exceptions\CompanyNotFound;

// get MATERIAL and PRODUCT List
$app->get('/object', function ($req, $res, $args) use($app)
{
    $object = Object::with('images')->whereIn('type', [
        Object::TYPE_MATERIAL,
        Object::TYPE_PRODUCT
    ])->get();

    return $res->withJson([
        'success' => $object->count() > 0,
        'data' => $object
    ], 200);
});

// get object by id
$app->get('/object/{id}[/{query:.*}]', function ($req, $res, $args) use($app)
{

});

// put object by id
$app->put('/object/{id}', function ($req, $res, $args) use($app)
{

});

// delete object by id
$app->delete('/object/{id}', function ($req, $res, $args) use($app)
{

});

// create object