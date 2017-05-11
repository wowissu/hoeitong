<?php

error_reporting(E_ALL & ~E_NOTICE);

// error handle
include 'modules/App/PhpErrorHandler.php';
include 'modules/App/NotFoundHandler.php';
include 'modules/App/SystemErrorHandler.php';

// database
include 'modules/App/Database.php';

// template
include 'modules/App/Template.php';