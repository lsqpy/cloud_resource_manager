<?php

namespace crm;

/**
 * upfile module definition class
 */
class Module extends \yii\base\Module
{
    /**
     * @inheritdoc
     */
    public $controllerNamespace;// = 'crm\controllers';
    public $accessKey;// = 'IJdrd5XIuzjoBfEx8PC4knx4Fw8YcqaKl1_Ai69G';
    public $secretKey;// = '7z85lSb_fnlgusEmR0DGYzoIPNf7B1alonE0_pnl';
    public $domain;// = '7xt56r.com2.z0.glb.qiniucdn.com';
    public $bucket;// = 'public-test-bucket';
    public $select_more;// = 'public-test-bucket';

    /**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();

        // custom initialization code goes here
    }
}
