<?php

$app->get('/company/{id}', function ($req, $res, $args)
{
    dd($args);
    dd('company cli');
});