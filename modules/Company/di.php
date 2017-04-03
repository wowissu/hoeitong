<?php 

$ci['company'] = function ($ci) 
{
    return new class($ci) extends \Modules\App\ModelExtend
    {
        protected $table = 'company';

        function __construct(\Slim\Container $ci)
        {
            parent::__construct($ci);
        }
    };
};