<?php

/**
 * slim settings
 */
return [

    'db' => require 'db.config.php',

    /**
     * The protocol version used by the Response object.
     *
     * https://www.slimframework.com/docs/objects/response.html
     */
    'httpVersion' => '1.1',

    /**
     * Size of each chunk read from the Response body when sending to the browser.
     */
    'responseChunkSize' => '4096',

    /**
     * If false, then no output buffering is enabled.
     * If 'append' or 'prepend', then any echo or print statements are captured and are either appended or prepended to the Response returned from the route callable.
     */
    'outputBuffering' => 'append',

    /**
     * When true, the route is calculated before any middleware is executed.
     * This means that you can inspect route parameters in middleware if you need to.
     */
    'determineRouteBeforeAppMiddleware' => false,

    /**
     * When true, additional information about exceptions are displayed by the default error handler.
     *
     * https://www.slimframework.com/docs/handlers/error.html
     */
    'displayErrorDetails' => (bool)getenv('DISPLAY_ERRORS'),

    /**
     * When true, Slim will add a Content-Length header to the response.
     * If you are using a runtime analytics tool, such as New Relic, then this should be disabled.
     */
    'addContentLengthHeader' => true,

    /**
     * Filename for caching the FastRoute routes.
     * Must be set to to a valid filename within a writeable directory.
     * If the file does not exist, then it is created with the correct cache information on first run.
     * Set to false to disable the FastRoute cache system.
     */
    'routerCacheFile' => false,
];