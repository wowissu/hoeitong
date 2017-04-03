<?php

include 'di.php';

$app->get('/company', function ($req, $res, $args) 
{   
    $Company = $this->company;

    dd($Company()->get());

    view('Company/home.twig', [
        'test' => 'test123'
    ]);
});