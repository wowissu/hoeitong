<?php

$app->get('/tab/panel.html', function () use($app) {
    return view('Tab/tabpanel.twig');
});