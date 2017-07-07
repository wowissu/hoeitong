<?php
namespace Modules\Tab\Models;

use \Modules\App\BaseModel;

/**
 *
 */
class Tab extends BaseModel
{
    protected $table = 'tabs';
    protected $fillable = ['title'];

    public function ship()
    {
        return $this->hasMany(TabShip::class, 'tab_id');
    }

    public function shipWith($relateId)
    {
        return TabShip::firstOrCreate([
            'relate_id' => $relateId,
            'tab_id' => $this->id
        ]);
    }

    public function unship($relateId)
    {
        return TabShip::where('tab_id', $this->id)
            ->where('relate_id', $relateId)
            ->delete();
    }
}
