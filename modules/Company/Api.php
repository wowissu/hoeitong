<?php

use Illuminate\Database\Capsule\Manager as DB;
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
                throw new CompanyNotFound("Not found company id: {$companyId}.");
            }
        } else {
            $company = $company->orderBy('id')->get();
        }

        return $res->withJson([
            'success' => true,
            'data' => $company
        ], 200);

    } catch (Exception $e) {

        return $res->withJson([
            'error' => true,
            'message' => $e->getMessage()
        ], 400);

    }
});

$app->delete('/company/{id}', function ($req, $res, $args) use($app)
{
    try {

        return $res->withJson([
            'success' => Company::where('id', $args['id'])->delete()
        ], 200);

    } catch (Exception $e) {

        return $res->withJson([
            'error' => true,
            'message' => $e->getMessage()
        ], 400);

    }
});

// 修改 company
$app->put('/company[/{id}]', function ($req, $res, $args) use ($app)
{
    $userpost = $req->getParams();

    try {
        // validate

        $company = Company::findOrFail($userpost['id']);

        DB::transaction(function () use ($userpost, &$company)
        {
            $company->title   = $userpost['title'];
            $company->email   = $userpost['email'];
            $company->summary = $userpost['summary'];
            $company->address = $userpost['address'];
            $company->owner   = $userpost['owner'];

            $company->save();

            Phones::where('company_id', $company->id)->delete();

            foreach ($userpost['phones'] as $key => $phone) {
                $company->phones->push(Phones::create([
                    'company_id' => $company->id,
                    'contactor'  => $phone['contactor'],
                    'phone'      => $phone['phone'],
                    'type'       => $phone['type']
                ]));
            }
        });

        return $res->withJson([
            'success' => true,
            'data' => $company->toArray()
        ], 200);

    } catch (Exception $e) {

        return $res->withJson([
            'error' => true,
            'message' => $e->getMessage()
        ], 400);
    }
});

$app->post('/company', function ($req, $res, $args) use ($app)
{
    $userpost = $req->getParams();

    try {

        // validate
        $company = new Company();

        DB::transaction(function () use ($userpost, &$company)
        {
            $company->title = $userpost['title'];
            $company->email = $userpost['email'];
            $company->summary = $userpost['summary'];
            $company->address = $userpost['address'];
            $company->owner = $userpost['owner'];

            $company->save();

            $phones = [];

            foreach ($userpost['phones'] as $key => $phone) {
                $company->phones->push(new Phones([
                    'company_id'=> $company->id,
                    'contactor' => $phone['contactor'],
                    'phone'     => $phone['phone'],
                    'type'      => $phone['type']
                ]));
            }

            Phones::insert($company->phones->toArray());
        });

        return $res->withJson([
            'success' => true,
            'data' => $company
        ], 200);

    } catch (Exception $e) {

        return $res->withJson([
            'error' => true,
            'message' => $e->getMessage(),
            'exception' => get_class($e)
        ], 400);

    }
});