<?php
/**
 * 公司工廠列表轉換
 *
 *     忽略 keywords
 *     將 tel & fax 分到另一張表
 *
 */


use Modules\Company\Models\Factory;
use Modules\Company\Models\Company;
use Modules\Company\Models\Phones;

$app->get('/company/trans', function ($req, $res, $args)
{

    $companies = [];
    $companies_phones = [];

    $factory = Factory::each(function ($row) use(&$companies, &$companies_phones)
    {
        // dd($row->toArray());

        $companies[] = [
            'id' => $row->fty_id,
            'title' => $row->name,
            'address' => $row->address,
            'email' => $row->email,
            'summary' => $row->memo,
            'contactor' => $row->contacter,
            'created_at' => $row->created_at,
            'updated_at' => $row->updated_at
        ];

        // phones
        $row->tel = json_decode($row->tel) ?: [];
        $row->fax = json_decode($row->fax) ?: [];

        foreach ($row->tel as $phone) {
            $companies_phones[] = [
                'company_id' => $row->fty_id,
                'type' => 0,
                'phone' => $phone
            ];
        }

        foreach ($row->fax as $phone) {
            $companies_phones[] = [
                'company_id' => $row->fty_id,
                'type' => 1,
                'phone' => $phone
            ];
        }
    });

    Company::insert($companies);
    Phones::insert($companies_phones);
});