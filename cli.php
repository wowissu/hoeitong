<?php

require 'vendor/autoload.php';
require 'includes/helpers.php';

// env tool
$dotenv = new \Dotenv\Dotenv(__DIR__);
$dotenv->load();

if (PHP_SAPI == 'cli') {
    $argv = $GLOBALS['argv'];

    array_shift($argv);

    $uri = array_shift($argv);

    if ($argv) {

        // dd($argv);

        $argstr = implode(' ', $argv);

        $args = [];

        preg_replace_callback('/((\-{2}(\w+)\s?\=\s?(\w+))|(\-(\w+)(\=|\s)(\w+))|(\-(\w+)))/', function ($matches) use(&$args)
        {
            switch (count($matches)) {
                case 5:
                    $args[$matches[3]] = $matches[4];
                break;
                case 9:
                    if (in_array(['false', 'true'], $matches[8])) {
                        $args[$matches[6]] = (bool)$matches[8];
                    } else if (is_numeric($matches[8])) {
                        $args[$matches[6]] = (int)$matches[8];
                    } else {
                        $args[$matches[6]] = $matches[8];
                    }
                break;
                case 11:
                    $args[$matches[10]] = true;
                break;
            }

            return '';
        }, $argstr);

        dump($argstr);
        dd($args);

        $uri .= ('?' . $args);

        dd($uri);
    }

    $env = \Slim\Http\Environment::mock([
        'REQUEST_URI' => '/' . $uri
    ]);

    $app = new \Slim\App([
        'settings' => require('config/slim.config.php'),
        'environment' => $env
    ]);

    $ci = $app->getContainer();

    require 'modules.App.php';
    require 'modules.cli.php';

    $app->run();
}