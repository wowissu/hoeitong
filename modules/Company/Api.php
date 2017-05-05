<?php

use Modules\Company\Models\Company;
use Modules\Company\Models\Phones;
use Modules\Company\Exceptions\CompanyNotFound;

$app->get('/company[/{id}]', function ($req, $res, $args) use($app)
{
    try {

        $company = Company::with('phones');

        if (isset($args['id'])) {
            $companyId = $args['id'];
            $company = $company->find($companyId);

            if (is_null($company)) {
                throw new CompanyNotFound($companyId);
            }
        } else {
            $company = $company->get();
        }

        return $res->withJson($company, 200);

    } catch (CompanyNotFound $e) {

        return $res->withJson("false", 400);

    }
});


$app->post('/company/update', function ($req, $res, $args) use ($app)
{
    $userpost = $req->getParsedBody();

    try {

        $company = Company::findOrFail($userpost['id']);

        $company->id = $userpost['id'];
        $company->title = $userpost['title'];
        $company->email = $userpost['email'];
        $company->summary = $userpost['summary'];
        $company->address = $userpost['address'];
        $company->owner = $userpost['owner'];

        $company->save();

        Phones::where('company_id', $company->id)->delete();

        foreach ($userpost['phones'] as $key => $phone) {
            $phone['company_id'] = $company->id;

            $p = Phones::findOrNew($phone['id']);

            $p->company_id = $company->id;
            $p->contactor  = $phone['contactor'];
            $p->phone      = $phone['phone'];
            $p->type       = $phone['type'];

            $p->save();
        }

    } catch (Exception $e) {

        dd($e);
    }
});