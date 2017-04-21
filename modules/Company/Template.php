<?php

$app->get('/company.html', function () {
    view('Company/index.twig', []);
});