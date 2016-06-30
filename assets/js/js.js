/**
 * Created by lsq on 16-5-17.
 */
var arr=[];
$(function(){
    //将字符串json转换为json对象
    var config_obj = eval('(' + config_json + ')');
    $('.image_list_ul').delegate('li','click',function(){
        var url = $(this).find('img').attr('data-src');
        if(config_obj.select_more){
            if($(this).hasClass('on')){
                $(this).removeClass('on').find('strong').hide();
                arr.shift(url);
            }else{
                $(this).addClass('on').find('strong').show();
                arr.push(url);
            }
        }else{
            $(this).addClass('on').find('strong').show().end().siblings('li').removeClass('on').find('strong').hide()
            arr.shift(url);
            arr.push(url);
        }

        if(arr.length > 0){
            $('#button').removeAttr('disabled');
        }else{
            $('#button').attr('disabled','disabled');
        }
    });

    $('.image_list_ul').delegate('a','click',function(){
        if(confirm('确认要删除?')){
            var url = delete_url;
            var data = {'key':$(this).parents('li').find('span').text()};
            var This = $(this);
            $.get(url,data,function(json){
                This.parents('li').remove();
            });
        }
    });

    $('#button').on('click',function(){
        $("#img_show>ul").empty();
        var count=arr.length;
        if(config_obj.select_more){
            for(var i=0;i<count;i++){
                $("#img_show>ul").append("<li><a href='javascript:void(0);'>X</a><div style='width: 120px;height: 110px;overflow: hidden'><img src='"+arr[i]+"?imageView2/2/w/120/h/110/interlace/1/q/100'/></div></li>");
            }
        }else{
            $("#img_show>ul").html("<li><a href='javascript:void(0);'>X</a><div style='width: 120px;height: 110px;overflow: hidden'><img src='"+arr+"?imageView2/2/w/120/h/110/interlace/1/q/100'/></div></li>");
        }
        $('.img_ul').css({'width':count*150+'px','padding':'20px'});
        $('#input_name').val(arr);
        $('.close').click();
    });

    $('.ul_list li a').each(function(){
        $(this).on('click',function(){
            var url = search_url;
            var data = $(this).attr('data-content');
            var This = $(this);
            $.get(url,{'prefix':data},function(json){
                if(json.status){
                    $('.image_list_ul').html(json.data);
                }
            },'json');
        });
    });

    $('#search_input').on('blur',function(){
        var url = search_url;
        var data = $(this).val();
        $.get(url,{'prefix':data},function(json){
            if(json.status){
                $('.image_list_ul').html(json.data);
            }
        },'json');
    });

    $('#loading').on('click',function(){
        var url = search_url;
        var marker = $('#marker').val();
        var This = $(this);
        $.get(url,{'marker':marker},function(json){
            if(json.status){
                $('.image_list_ul').append(json.data);
                if(json.marker == ''){
                    This.hide();
                }else{
                    $('#marker').val(json.marker);
                }
            }
        },'json');
    });

    //取消选择
    $("#btn_upload").on("click",function(){
        $('.close').click();
    });

    //移除图片
    $("#img_remove").on("click",function(){

        $(".img_ul").html("");
        $("#input_name").val("");
        $('.img_ul').css({'padding':'0px'});
    });

    //删除选择的图片
    $('.img_ul').delegate('a','click',function(){
        var input_name_value=$("#input_name").val();
        var input_name_arr=input_name_value.split(',');
        var index=$(this).parent('li').index();
        input_name_arr.splice(index,1);
        var input_string=input_name_arr.join(",");
        $("#input_name").val(input_string);
        if(index==0){
            $('.img_ul').css({'padding':'0px'});
        }
        $(this).parent('li').remove();
    });

    /**
     * 为了解决bootstrap模态框无法触发input=file点击bug
     */
    $("#pickfiles").on("click",function(){
        var id = $(this).parents('#container').find("input[type=file]").click();
    })
});