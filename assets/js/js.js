/**
 * Created by lsq on 16-5-17.
 */
var arr=[];
$(function(){
    $('.image_list_ul').delegate('li','click',function(){
        var url = $(this).find('img').attr('src');
        $(this).addClass('on').find('strong').show().end().siblings('li').removeClass('on').find('strong').hide()
        arr.shift(url);
        arr.push(url);

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
        $('#input_name').val(arr);
        $("#img_show").html("<img src='"+arr+"'/>");
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

        $("#img_show").html("");
        $("#input_name").val("");
    });
});