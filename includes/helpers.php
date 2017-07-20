<?php


if ( !function_exists( 'dd' ) ) {
    function dd($output)
    {
        dump($output);
        exit;
    }
}


if ( !function_exists( 'env' ) ) {
    function env($name, $defval = null)
    {
        return isset($_ENV[$name]) ? $_ENV[$name] : $defval;
    }
}


if ( !function_exists( 'is_dev' ) && function_exists( 'env' ) ) {
    function is_dev()
    {
        return env('ENV') == 'dev';
    }
}
