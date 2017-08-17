<?php

use Carbon\Carbon;
use Modules\Object\Models\Manual;

/*
 * 先設定一個object 只有一個 ｍanual
 */

$app->post('/manual/image/upload', function ($req, $res, $args) use($app)
{
    $files = $req->getUploadedFiles();

    try {
        if ( !isset($files['image']) ) {
            throw new Exception("required image file.");
        }

        $file = &$files['image'];

        $ext = get_extension($file->getClientMediaType());

        if ($ext === false) {
            throw new Exception("副檔名請使用.jpg .jpeg .png");
        }

        $date       = date('Ymd');
        $month      = date('Ym');
        $filename   = uniqid();
        $filepath   = strtr('{month}/{date}/{filename}{ext}', [
            '{month}'    => $month,
            '{date}'     => $date,
            '{filename}' => $filename,
            '{ext}'      => $ext
        ]);
        $urlpath    = "images/manual/{$filepath}";
        $storageDir = dirname($urlpath);


        if ( !is_dir($storageDir) ) {
            mkdir($storageDir, 0777, true);
            chmod($storageDir, 0777);
        }

        $file->moveTo( wwwpath($urlpath) );

        return $res->withJson([
            'success' => true,
            'link' => $urlpath,
            'path' => $urlpath
        ], 200);

    } catch (Exception $e) {

        return $res->withJson([
            'error' => true,
            'message' => $e->getMessage()
        ], 400);

    }
});


$app->delete('/manual/image/delete', function ($req, $res, $args) use($app)
{
    $src = $req->getParam('src');

    if (is_file($src)) {
        unlink($src);
    }

    return $res->withJson([
        'success' => true,
        'unlink' => $src
    ], 200);
});