<?php

$ci['view'] = function ($ci) use($app)
{
    $view = new \Slim\Views\Twig('../templates', [
        // 'cache' => 'path/to/cache'
    ]);

    // Instantiate and add Slim specific extension
    $basePath = rtrim(str_ireplace('index.php', '', $ci['request']->getUri()->getBasePath()), '/');
    $view->addExtension(new Slim\Views\TwigExtension($ci['router'], $basePath));

    return $view;
};


function view($file, $appendData=[])
{
    global $ci;

    return $ci->view->render($ci['response'], $file, $appendData);
}