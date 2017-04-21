<?php


$app->group('/api', function () use($app)
{
    include 'modules/Company/Api.php';
});

$app->group('/template', function () use($app)
{
    include 'modules/Company/Template.php';
});

$app->get('/[{path:.*}]', function ($req, $res, $args) use($app)
{

    $basePath = $req->getUri()->getBasePath();

    view('overall/base.twig', [
        'basePath' => $basePath
    ]);
});