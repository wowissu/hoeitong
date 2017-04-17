<?php

include 'di.php';

$app->get('/company', function ($req, $res, $args) use($app)
{
    $Company = $this->company;

    view('Company/home.twig', [
        'test' => 'test123'
    ]);
});