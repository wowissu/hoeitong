<?php

/**
 * Tab Api
 */
use Illuminate\Database\Capsule\Manager as DB;
use Modules\Tab\Models\Tab;

$app->group('/tab', function () use($app)
{
    $app->get('/search/{query:.*}', function ($req, $res, $args) use($app)
    {
        $query = $args['query'];

        $tabs = Tab::where('title', 'LIKE', "%{$query}%")->orderby('ship_count', 'desc')->get();

        return $res->withJson([
            'success' => true,
            'data' => $tabs
        ], 200);
    });
});