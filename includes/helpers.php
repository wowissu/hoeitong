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

if ( !function_exists( 'wwwpath' ) ) {
    function wwwpath($concat='')
    {
        return __WWWPATH__ . DIRECTORY_SEPARATOR . $concat;
    }
}

if ( !function_exists( 'get_extension' ) ) {
    function get_extension(string $imagetype)
    {
        static $types = [
            'image/bmp' => '.bmp',
            'image/cis-cod' => '.cod',
            'image/gif' => '.gif',
            'image/ief' => '.ief',
            'image/jpeg' => '.jpg',
            'image/pipeg' => '.jfif',
            'image/tiff' => '.tif',
            'image/x-cmu-raster' => '.ras',
            'image/x-cmx' => '.cmx',
            'image/x-icon' => '.ico',
            'image/x-portable-anymap' => '.pnm',
            'image/x-portable-bitmap' => '.pbm',
            'image/x-portable-graymap' => '.pgm',
            'image/x-portable-pixmap' => '.ppm',
            'image/x-rgb' => '.rgb',
            'image/x-xbitmap' => '.xbm',
            'image/x-xpixmap' => '.xpm',
            'image/x-xwindowdump' => '.xwd',
            'image/png' => '.png',
            'image/x-jps' => '.jps',
            'image/x-freehand' => '.fh',
        ];

        return $types[(string)$imagetype] ?: false;
    }
}


function csrf_token($token_name='csrf_token', $time=null)
{
    $token = uniqid();
    return setcookie($token_name, $token, $time) ? $token : null;
}

function csrf_verify($token, $token_name='csrf_token')
{
    return $_COOKIE[$token_name] === $token;
}