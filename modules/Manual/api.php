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
        if (!isset($files['image'])) {
            throw new Exception("required image file.");
        }

        $file = &$files['image'];

        $ext = is_image_extension($file->getClientMediaType());

        if ($ext === false) {
            throw new Exception("副檔名請使用.jpg .jpeg .png");
        }

        $date = date('Ymd');
        $month = date('Ym');
        $filename = uniqid();
        $filepath = join_paths('media', 'manual', 'images', $month, $date, $filename . $ext);
        $realStoragePath = base_path($filepath);
        $realStorageDir = dirname($realStoragePath);

        // 產生資料夾
        if (!is_dir($realStorageDir)) {
            mkdir($realStorageDir, 0777, true);
            chmod($realStorageDir, 0777);
        }

        // save
        $file->moveTo($realStoragePath);

        return $res->withJson([
            'success' => true,
            'uri' => $filepath
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
    $removed = $req->getParam('removed');
    $unlinked = [];

    foreach ($removed as $src) {
        if (is_file($src)) {
            if (unlink($src)) {
                $unlinked[] = $src;
            }
        }
    }

    return $res->withJson([
        'success' => true,
        'unlinked' => $unlinked
    ], 200);
});