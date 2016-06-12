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
use crm\config;

class showUpfile extends InputWidget
{
    public $model;
    public $_id;
    public $button_name;
    public $upfile_name;
    public $user;

    public function init()
    {
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
        $auth = new Auth(config\conf::$accessKey, config\conf::$secretKey);
        $bucketMgr = new BucketManager($auth);
        list($list, $marker, $err) = $bucketMgr->listFiles(config\conf::$bucket, $prefix, $marker, $limit);
        //计算
        $prefixs = [];
        if(!empty($list)) {
            foreach ($list as $data) {
                $data['link'] = 'http://'.config\conf::$domain.'/'.$data['key'];
                $prefixs[] = $data;
            }
        }
        $upload_qiniu_url = 'http://'.config\conf::$domain;
        return $this->render('show',['upload_qiniu_url'=>$upload_qiniu_url,'model'=>$this->model,'marker'=>$marker,'list'=>$prefixs,'_id'=>$this->_id, 'button_name'=>$this->button_name, 'upfile_name'=>$this->upfile_name]);
    }


}