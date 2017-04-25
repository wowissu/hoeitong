<?php
namespace Modules\Company\Models;

use \Modules\App\BaseModel;

/**
 *
 */
class Company extends BaseModel
{
    protected $table = 'company';
    public $timestamps = true;

    public function phones ()
    {
        return $this->hasMany(Phones::class, 'company_id');
    }
}
