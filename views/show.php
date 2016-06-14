<?php

use yii\helpers\Url;
use yii\helpers\Html;
use crm\UpfileAsset;

$delete_url = Url::to(['crm/default/delete']);
$search_url = Url::to(['crm/default/search']);
$upload_url = Url::to(['crm/default/upload-file']);
$get_upload_file_name = Url::to(['crm/default/get-upload-file-name']);
UpfileAsset::register($this);
$base_url = Yii::$app->assetManager->getPublishedUrl('@crm/assets');
?>

<!-- Button trigger modal -->

<style>
    #fsUploadProgress{
        width: 96%;
        position: absolute;
        right: 36px;
        top: 35px;
        background-color: #fff;
        border: 1px solid #ccc;
        z-index: 3;
        display: none;
    }
</style>

<div class="row">
    <div class="col-sm-4 col-md-2" style="width:200px;">
        <div class="thumbnail">
            <div id="img_show" style="text-align: center;">
                <?php
                    if(!empty($model->$upfile_name)){
                        echo "<img src='".$model->$upfile_name."?imageView2/2/w/120/h/110/interlace/1/q/100'/>";
                    }
                ?>
            </div>
            <div class="caption" style="text-align: center;">
                <p>
                    <a href="###" class="btn btn-primary" role="button" data-toggle="modal" data-target="#<?=$_id?>"><?=$button_name?></a>
                    <a href="###" class="btn btn-default" role="button" id="img_remove">移除</a>
                </p>
            </div>
        </div>
    </div>
</div>

<?= Html::activeHiddenInput($model,$upfile_name,['id'=>'input_name']) ?>
<!-- Modal modal fade  -->
<div class=" modal fade bs-example-modal-lg" id="<?=$_id?>" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <input type="hidden" name="marker" id="marker" value="<?=$marker?>">
    <input type="hidden" id="domain" value="<?=$upload_qiniu_url?>">
    <input type="hidden" id="uptoken_url" value="<?=Url::to(['crm/default/get-token'])?>">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <!-- 上部区域 -->
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">云资源管理器</h4>
            </div>
            <!-- 上部区域end -->

            <div class="modal-center">
                <div class="row" style="margin:0;">
                    <!-- 左边区域 -->
                    <ul class="ul_list col-md-2">
                        <li><a href="javascript:void(0);" data-content="image"> 图片 </a></li>
                        <li><a href="javascript:void(0);" data-content="video"> 视频 </a></li>
                        <li><a href="javascript:void(0);" data-content="audio"> 音频 </a></li>
                        <li><a href="javascript:void(0);" data-content="other"> 文件 </a></li>
                    </ul>
                    <!-- 左边区域end -->

                    <!-- 中间区域 -->
                    <div class="col-md-10">
                        <div id="container" style="top: 9px;left:10px;height: 26px;">
                            <a class="btn btn-primary" id="pickfiles" href="###" style="position: absolute;right:40px;" >
                                <i class="glyphicon glyphicon-plus"></i>
                                <span>选择文件</span>
                            </a>
                            <div id="fsUploadProgress"></div>
                        </div>
                        <div id="container" class="image_list_div">
                            <ul class="image_list_ul">
                                <?php
                                if(!empty($list)){
                                    foreach($list as $_list){
                                        ?>
                                        <li>
                                            <div class="div_center">
                                                <a href="javascript:void(0);">X</a>
                                                <?php
                                                    $type = substr($_list['key'],0,5);
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
                                                            $pic = $_list['link'];// . '?imageView2/2/w/120/h/110/interlace/1/q/100'; //获取上传成功后的文件的Url
                                                            break;
                                                    }
                                                ?>
                                                <img data-src="<?=$pic;?>" src="<?=$pic.'?imageView2/2/w/120/h/110/interlace/1/q/100';?>">
                                                <span><?=$_list['key']?></span>
                                                <strong class="glyphicon glyphicon-ok-circle" aria-hidden="true"></strong>
                                            </div>
                                        </li>
                                        <?php
                                    }
                                }
                                ?>
                            </ul>

                            <?php if(!empty($marker)){?>
                                <a href="javascript:void(0);" id="loading" class="btn btn-default btn-xs btn-block">loading</a>
                            <?php }?>
                        </div>
                    </div>

                    <!-- 中间区域end -->

                </div>
            </div>

            <!-- 上传组件 -->
            <div class="modal-footer">
                <div id="container" style="text-align: center;">
                    <input type="button" class="btn btn-primary" id="btn_upload" value="取消选择">
                    <input type="button" class="btn btn-primary" id="button" disabled="disabled" value="确定选择">
                </div>
            </div>
            <!-- 上传组件end -->
        </div>
    </div>
</div>


<script>
    var base_url = '<?=$base_url?>';
    var upload_url = '<?=$upload_url?>';
    var delete_url = '<?=$delete_url?>';
    var search_url = '<?=$search_url?>';
    var get_upload_file_name = '<?=$get_upload_file_name?>';
    var upload_qiniu_url = '<?=$upload_qiniu_url?>';
</script>