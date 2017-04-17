<?php

$ci['notFoundHandler'] = function ($ci)
{
    //this is wrong, i'm not with http
    return function ($request, $response) use ($ci)
    {
        return $ci['response']
            ->withStatus(404)
            ->withHeader('Content-Type', 'text/text')
            ->write('Not Found');
    };
};