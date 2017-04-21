<?php
namespace Modules\Company\Models;

use \Modules\App\BaseModel;

/**
 *
 */
class Factory extends BaseModel
{
    protected $connection = 'mysql';
    protected $table = 'factory';
    protected $primaryKey = 'fty_id';
}
