<?php

namespace crm;
use yii\web\AssetBundle;
use yii\web\YiiAsset;

/**
 * Description of AnimateAsset
 *
 * @author Misbahul D Munir <misbahuldmunir@gmail.com>
 * @since 2.5
 */
class UpfileAsset extends AssetBundle
{
    /**
     * @inheritdoc
     */
    public $sourcePath = '@crm/assets';
    /**
     * @inheritdoc
     */
    public $css = [
        'css/css.css',
        'css/main.css',
        'css/highlight.css',
    ];

    public $js = [
        'js/js.js',
        'js/plupload.full.min.js',
        'js/moxie.js',
        'js/plupload.dev.js',
        'js/zh_CN.js',
        'js/ui.js',
        'js/qiniu.js',
        'js/highlight.js',
//        'js/main.js',
        'js/multiple.js',
        'js/init.js',
    ];

//    public $publishOptions = [
//        '@crm/assets/image'
//    ];

    public $depends = [
        'yii\web\JqueryAsset',
        'yii\web\YiiAsset',
    ];

}
