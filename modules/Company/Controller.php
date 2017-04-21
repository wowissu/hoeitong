<?php

namespace Modules\Company;


/**
*
*/
class Controller
{
    public static $_this;
    public static $_ci;


    function __construct(\Interop\Container\ContainerInterface $ci)
    {
        self::$_this = $this;
        self::$_ci = $ci;

        $ci['company'] = function ($ci)
        {
            return self::$_this;
        };
    }

    function home ($req, $res, $args)
    {
        global $ci;


        dd($this);
    }
}


