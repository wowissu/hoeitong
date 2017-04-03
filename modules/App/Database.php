<?php 

// database
$ci['db'] = function ($ci)
{
    // $dbconfig = require('config.php');
    $dbconfig = $ci->settings['db'];

    $capsule = new \Illuminate\Database\Capsule\Manager;

    foreach ($dbconfig['connections'] as $cname => $connection)
    {
        $cname = $cname == $dbconfig['default'] ? 'default' : $cname;

        $capsule->addConnection($connection, $cname);
    }

    $capsule->setFetchMode($dbconfig['fetch']);
    $capsule->setAsGlobal();
    $capsule->bootEloquent();

    return $capsule;
};