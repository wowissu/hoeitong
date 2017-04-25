<?php

use Modules\Company\Models\Company;
use Modules\Company\Exceptions\CompanyNotFound;


$app->get('/company[/{id}]', function ($req, $res, $args) use($app)
{
    $companies = [];

    try {

        if (isset($args['id'])) {
            $companyId = $args['id'];
            $data = Company::find($companyId)->with('phones');

            if (is_null($data)) {
                throw new CompanyNotFound($companyId);
            }

        } else {
            $data = Company::with('phones')->get();
        }

        // return $res->write($companies->toJson());

        return $res->withJson($data, 200);

    } catch (CompanyNotFound $e) {

        return $res->withJson("false", 400);

    }
});