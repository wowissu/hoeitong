<?php

$app->group('/api', function () use($app)
{
    include 'modules/Manual/api.php';
    include 'modules/Object/api.php';
    include 'modules/Company/api.php';
    include 'modules/Tab/api.php';

})->add(function ($req, $res, $next) {

    $csrfToken = $req->getHeader('X-CSRF-TOKEN')[0];

    if ( csrf_verify($csrfToken) ) {

        return $next($req, $res);

    } else {

        die("不合法途徑: csrf-token 失效。");

    }
});

// $app->group('/template', function () use($app)
// {
//     include 'modules/Object/templates.php';
//     include 'modules/Company/templates.php';
//     include 'modules/Tab/templates.php';
// });

$app->get('/[{path:.*}]', function ($req, $res, $args) use($app)
{
    $uri = $req->getUri();

    view('overall/base.twig', [
        'csrf_token' => uniqid(),
        'baseUrl' => $uri->getBaseUrl(),
        'basePath' => $uri->getBasePath()
    ]);
});