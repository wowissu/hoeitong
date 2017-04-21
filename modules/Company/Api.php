<?php

use Modules\Company\Models\Company;


$app->get('/company', function ($req, $res, $args) use($app)
{
    $companies = Company::get();

    dd($companies->first());
});