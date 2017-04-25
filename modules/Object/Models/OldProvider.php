<?php
namespace Modules\Object\Models;

use \Modules\App\BaseModel;

/**
 *
 */
class OldProvider extends BaseModel
{
    protected $connection = 'mysql';
    protected $table = 'objectProviderRelation';
}
