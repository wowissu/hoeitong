<?php
namespace Modules\Company\Models;

use \Modules\App\BaseModel;

/**
 *
 */
class Phones extends BaseModel
{
    protected $table = 'company_phones';
    protected $fillable = ['id', 'company_id', 'contactor', 'phone', 'type'];
}
