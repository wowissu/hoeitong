<?php


$app->group('/api', function () use($app)
{
    include 'modules/Object/api.php';
    include 'modules/Company/api.php';
    include 'modules/Tab/api.php';
});

$app->group('/template', function () use($app)
{
    include 'modules/Object/templates.php';
    include 'modules/Company/templates.php';
    include 'modules/Tab/templates.php';
});

$app->get('/[{path:.*}]', function ($req, $res, $args) use($app)
{

    $basePath = $req->getUri()->getBasePath();

    view('overall/base.twig', [
        'basePath' => $basePath
    ]);
});