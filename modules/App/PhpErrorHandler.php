<?php

$ci['phpErrorHandler'] = function ($ci) 
{
    return function ($request, $response, $error) use ($ci) 
    {
        $message = 'Something went wrong!';

        if (is_dev()) {
            $message = $error->getMessage();
        }

        return $ci['response']
            ->withStatus(500)
            ->withHeader('Content-Type', 'text/html')
            ->write($message);
    };
};