<?php

$app->get('/object.html', function () use($app) {
    return view('Object/index.twig');
});