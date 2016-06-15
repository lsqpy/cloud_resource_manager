<?php

namespace crm\controllers;

use Qiniu\Storage\BucketManager;
use yii;
use Qiniu\Auth;
use yii\web\Controller;


/**
 * Default controller for the `upfile` module
 * <?= showUpfile::widget(['model'=>$model,'upfile_name'=>'email'])?>
 */
class DefaultController extends Controller
{

    public $accessKey;
    public $secretKey;
    public $domain;
    public $bucket;

    public function init(){
        $this->accessKey = Yii::$app->getModule('crm')->accessKey;
        $this->secretKey = Yii::$app->getModule('crm')->secretKey;
        $this->domain = Yii::$app->getModule('crm')->domain;
        $this->bucket = Yii::$app->getModule('crm')->bucket;
    }

    /**
     * 删除文件
     * @param $key 删除文件的key
     */
    public function actionDelete($key){
        if(empty($key)){
            echo json_decode(['result'=>0,'data'=>'key必须填写!']);
        }

        //初始化Auth状态：
        $auth = new Auth($this->accessKey, $this->secretKey);

        //初始化BucketManager
        $bucketMgr = new BucketManager($auth);

        //删除$bucket 中的文件 $key
        $err = $bucketMgr->delete($this->bucket, $key);
        if ($err !== null) {
            echo json_encode(['result'=>0,'data'=>$err]);
        }else{
            echo json_encode(['result'=>1,'data'=>'']);
        }
    }


    /**
     * 搜索文件
     * @param string $prefix
     * @param string $marker
     * @param string $bucket
     * @param string $limit
     */
    public function actionSearch($prefix='', $marker='', $bucket='', $limit='20')
    {
        $auth = new Auth($this->accessKey, $this->secretKey);
        $bucketMgr = new BucketManager($auth);
        list($list, $marker, $err) = $bucketMgr->listFiles($this->bucket, $prefix, $marker, $limit);

        $data = [];
        if(!empty($list)){
            $base_url = Yii::$app->assetManager->getPublishedUrl('@crm/assets');
            foreach($list as $_data){
                $type = substr($_data['key'],0,5);
                switch($type){
                    case 'other' :
                        $pic = $base_url . '/image/other.jpg';
                        break;
                    case 'audio' :
                        $pic = $base_url . '/image/audio.png';
                        break;
                    case 'video' :
                        $pic = $base_url . '/image/video.jpg';
                        break;
                    default:
                        $pic = 'http://'.$this->domain.'/'.$_data['key'] . '?imageView2/2/w/120/h/110/interlace/1/q/100'; //获取上传成功后的文件的Url
                        break;
                }
                $data[] = "<li><div class='div_center'><a href='javascript:void(0);'>X</a><img src='".$pic."'><span>".$_data['key']."</span><strong class='glyphicon glyphicon-ok-circle' aria-hidden='true'></strong></div></li>";
            }
        }else{
            $data[] = "<center style='font-size:2em;'>未找到任何文件</center>";
        }
        echo json_encode(['status'=>1,'marker'=>$marker,'data'=>implode('',$data)]);
    }

    /**
     * 获取七牛token
     */
    public function actionGetToken(){
        $auth = new Auth($this->accessKey, $this->secretKey);
        $upToken = $auth->uploadToken($this->bucket);
        if(!empty($upToken)){
            echo json_encode(['uptoken'=>$upToken]);
        }
    }

    /**
     * 获取上传文件key名称
     */
    public function actionGetUploadFileName(){
        $data = Yii::$app->request->get();
        if(!empty($data['type']))
        {
            switch($data['type'])
            {
                case 'image/jpeg':
                case 'image/gif':
                case 'image/png':
                    $type = 'image';
                    break;
                case 'video/mpeg':
                case 'video/quicktime':
                case 'video/quicktime':
                case 'video/vnd.mpegurl':
                case 'video/x-msvideo':
                case 'video/x-sgi-movie':
                    $type = 'video';
                    break;
                case 'audio/basic':
                case 'audio/mpeg':
                case 'audio/midi':
                case 'audio/x-aiff':
                case 'audio/x-mpegurl':
                case 'audio/x-pn-realaudio':
                case 'audio/x-pn-realaudio-plugin':
                case 'audio/x-realaudio':
                case 'audio/x-wav':
                    $type = 'audio';
                    break;
                default:
                    $type = 'other';
                    break;
            }
            $data['keyname'] = $type.'-'.substr(md5($data['id'].$data['name'].$data['size'].mt_rand(10000,99999)),10,10);
            echo json_encode($data);
        }
    }

}
