<?php

$app->get('/object.html', function () use($app) {
    return view('Object/index.twig');
});

$app->group('/object/profile', function () use($app)
{
    $app->get('/bone.html', function () use($app) {
        return view('Object/profile/bone.twig');
    });

    $app->get('/profile.html', function () use($app) {
        return view('Object/profile/profile.twig');
    });

    $app->get('/elements.html', function () use($app) {
        return view('Object/profile/elements.twig');
    });

    $app->get('/manual.html', function () use($app) {
        return view('Object/profile/manual.twig');
    });

    $app->get('/node.html', function () use($app) {
        return view('Object/profile/node.twig');
    });
});

