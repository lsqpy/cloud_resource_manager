<?php
namespace crm;
use Qiniu\Auth;
use Qiniu\Storage\BucketManager;
use yii\base\Widget;
use yii\helpers\Html;
use yii\helpers\Url;
use yii\web\AssetBundle;
use yii\web\UploadedFile;
use yii\widgets\InputWidget;
use yii;

class showUpfile extends InputWidget
{
    public $model;
    public $_id;
    public $button_name;
    public $upfile_name;
    public $user;

    public $accessKey;
    public $secretKey;
    public $domain;
    public $bucket;

    public function init()
    {
        $this->accessKey = Yii::$app->getModule('crm')->accessKey;
        $this->secretKey = Yii::$app->getModule('crm')->secretKey;
        $this->domain = Yii::$app->getModule('crm')->domain;
        $this->bucket = Yii::$app->getModule('crm')->bucket;

        if($this->_id == null){
            $this->_id = "myModal";
        }
        if($this->button_name == null){
            $this->button_name = "选择图片";
        }
        if($this->upfile_name == null){
            $this->upfile_name = "upload";
        }
        if ($this->hasModel()) {
            $this->name = !empty(Html::getInputName($this->model, $this->attribute)) ? Html::getInputName($this->model, $this->attribute) : $this->upfile_name;
            $this->value = Html::getAttributeValue($this->model, $this->attribute);
        }
    }

    public function run()
    {
        $limit = 20;
        $prefix = '';
        $marker = '';
        $auth = new Auth($this->accessKey, $this->secretKey);
        $bucketMgr = new BucketManager($auth);
        list($list, $marker, $err) = $bucketMgr->listFiles($this->bucket, $prefix, $marker, $limit);
        //计算
        $prefixs = [];
        if(!empty($list)) {
            foreach ($list as $data) {
                $data['link'] = 'http://'.$this->domain.'/'.$data['key'];
                $prefixs[] = $data;
            }
        }
        $upload_qiniu_url = 'http://'.$this->domain;
        return $this->render('show',['upload_qiniu_url'=>$upload_qiniu_url,'model'=>$this->model,'marker'=>$marker,'list'=>$prefixs,'_id'=>$this->_id, 'button_name'=>$this->button_name, 'upfile_name'=>$this->upfile_name]);
    }


}