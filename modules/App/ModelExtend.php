<?php
namespace Modules\App;

/**
 * 
 */
class ModelExtend
{
    function __construct(\Slim\Container $ci)
    {
        $this->ci = $ci;

        $this->db = $ci->db->table($this->table);
    }

    function __invoke()
    {
        return $this->ci->db->table($this->table);
    }
}
