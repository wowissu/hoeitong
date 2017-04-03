<?php 

$ci['errorHandler'] = function ($ci) 
{
    return function ($request, $response, $exception) use ($ci) 
    {
        $message = 'Something went wrong!';

        if (is_dev()) {
            $message = $exception->getMessage();
        }

        return $ci['response']->withStatus(500)
                             ->withHeader('Content-Type', 'text/html')
                             ->write($message);
    };
};