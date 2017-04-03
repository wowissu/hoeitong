<?php 

ini_set('display_errors', 1);

require 'vendor/autoload.php';

// helper
require 'includes/helpers.php';

// env tool
$dotenv = new \Dotenv\Dotenv(__DIR__);
$dotenv->load();

// gen App
$ci = new \Slim\Container();

// slim settings
$ci->settings = require('config/slim.config.php');

$app = new \Slim\App($ci);

// load modules
require 'modules.php';


$app->run();