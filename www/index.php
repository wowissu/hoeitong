<?php

ini_set('display_errors', 1);

define("__PDIR__", dirname(__DIR__));

require __PDIR__ . '/vendor/autoload.php';
require __PDIR__ . '/includes/helpers.php';

// env tool
$dotenv = new \Dotenv\Dotenv(__PDIR__);
$dotenv->load();

// gen App
$ci = new \Slim\Container();

// slim settings
$ci->settings = require(__PDIR__ . '/config/slim.config.php');

$app = new \Slim\App($ci);

// load modules
require __PDIR__ . '/modules.App.php';
require __PDIR__ . '/modules.php';

$app->run();