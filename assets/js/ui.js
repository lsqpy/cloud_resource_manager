/*global plupload */
/*global qiniu */
function FileProgress(file, targetID) {
    this.fileProgressID = file.id;
    this.file = file;
    console.log(targetID);
    this.opacity = 100;
    this.height = 0;
    this.fileProgressWrapper = $('#' + this.fileProgressID);
    if (!this.fileProgressWrapper.length) {
        // <div class="progress">
        //   <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 20%">
        //     <span class="sr-only">20% Complete</span>
        //   </div>
        // </div>
        //创建外层div
        this.fileProgressWrapper = $("<ul style='list-style:none;margin:5px 10px;padding:0;'></ul>");
        var Wrappeer = this.fileProgressWrapper;
        Wrappeer.attr('id', this.fileProgressID).addClass('progressContainer');

        var progressText = $("<li style='width:37%;float:left;'></li>");
        progressText.addClass('progressName').text(file.name);


        var fileSize = plupload.formatSize(file.size).toUpperCase();
        var progressSize = $("<li style='width:8%;float:left;'></li>");
        progressSize.addClass("progressFileSize").text(fileSize);

        var progressBarTd = $("<li style='width:55%;float:left;'></li>");
        var progressBarBox = $("<div/>");
        progressBarBox.addClass('info');
        var progressBarWrapper = $("<div/>");
        progressBarWrapper.addClass("progress progress-striped");

        var progressBar = $("<div/>");
        progressBar.addClass("progress-bar progress-bar-info")
            .attr('role', 'progressbar')
            .attr('aria-valuemax', 100)
            .attr('aria-valuenow', 0)
            .attr('aria-valuein', 0)
            .width('0%');

        var progressBarPercent = $('<span class=sr-only />');
        progressBarPercent.text(fileSize);

        //var progressCancel = $('<a href=javascript:; />');
        //progressCancel.show().addClass('progressCancel').text('×');

        progressBar.append(progressBarPercent);
        progressBarWrapper.append(progressBar);
        progressBarBox.append(progressBarWrapper);
        //progressBarBox.append(progressCancel);

        var progressBarStatus = $('<div class="status text-center"/>');
        progressBarBox.append(progressBarStatus);
        progressBarTd.append(progressBarBox);

        Wrappeer.append(progressText);
        Wrappeer.append(progressSize);
        Wrappeer.append(progressBarTd);

        $('#' + targetID).append(Wrappeer);
    } else {
        this.reset();
    }

    this.height = this.fileProgressWrapper.offset().top;
    this.setTimer(null);
}

FileProgress.prototype.setTimer = function(timer) {
    this.fileProgressWrapper.FP_TIMER = timer;
};

FileProgress.prototype.getTimer = function(timer) {
    return this.fileProgressWrapper.FP_TIMER || null;
};

FileProgress.prototype.reset = function() {
    this.fileProgressWrapper.attr('class', "progress");
    this.fileProgressWrapper.find('.progress .progress-bar-info').attr('aria-valuenow', 0).width('0%').find('span').text('');
    this.appear();
};

FileProgress.prototype.setChunkProgess = function(chunk_size) {
    var chunk_amount = Math.ceil(this.file.size / chunk_size);
    if (chunk_amount === 1) {
        return false;
    }

    var viewProgess = $('<button class="btn btn-default">查看分块上传进度</button>');

    var progressBarChunkTr = $('<tr class="chunk-status-tr"><td colspan=3></td></tr>');
    var progressBarChunk = $('<div/>');
    for (var i = 1; i <= chunk_amount; i++) {
        var col = $('<div class="col-md-2"/>');
        var progressBarWrapper = $('<div class="progress progress-striped"></div>');

        var progressBar = $("<div/>");
        progressBar.addClass("progress-bar progress-bar-info text-left")
            .attr('role', 'progressbar')
            .attr('aria-valuemax', 100)
            .attr('aria-valuenow', 0)
            .attr('aria-valuein', 0)
            .width('0%')
            .attr('id', this.file.id + '_' + i)
            .text('');

        var progressBarStatus = $('<span/>');
        progressBarStatus.addClass('chunk-status').text();

        progressBarWrapper.append(progressBar);
        progressBarWrapper.append(progressBarStatus);

        col.append(progressBarWrapper);
        progressBarChunk.append(col);
    }

    if(!this.fileProgressWrapper.find('td:eq(2) .btn-default').length){
        this.fileProgressWrapper.find('td>div').append(viewProgess);
    }
    progressBarChunkTr.hide().find('td').append(progressBarChunk);
    progressBarChunkTr.insertAfter(this.fileProgressWrapper);

};

FileProgress.prototype.setProgress = function(percentage, speed, chunk_size) {
    this.fileProgressWrapper.attr('class', "progressContainer green");

    var file = this.file;
    var uploaded = file.loaded;

    var size = plupload.formatSize(uploaded).toUpperCase();
    var formatSpeed = plupload.formatSize(speed).toUpperCase();
    var progressbar = this.fileProgressWrapper.find('.progress').find('.progress-bar-info');
    if (this.fileProgressWrapper.find('.status').text() === '取消上传'){
        return;
    }
    this.fileProgressWrapper.find('.status').text("已上传: " + size + " 上传速度： " + formatSpeed + "/s");
    percentage = parseInt(percentage, 10);
    if (file.status !== plupload.DONE && percentage === 100) {
        percentage = 99;
    }

    progressbar.attr('aria-valuenow', percentage).css('width', percentage + '%');

    if (chunk_size) {
        var chunk_amount = Math.ceil(file.size / chunk_size);
        if (chunk_amount === 1) {
            return false;
        }
        var current_uploading_chunk = Math.ceil(uploaded / chunk_size);
        var pre_chunk, text;

        for (var index = 0; index < current_uploading_chunk; index++) {
            pre_chunk = $('#' + file.id + "_" + index);
            pre_chunk.width('100%').removeClass().addClass('alert-success').attr('aria-valuenow', 100);
            text = "块" + index + "上传进度100%";
            pre_chunk.next().html(text);
        }

        var currentProgessBar = $('#' + file.id + "_" + current_uploading_chunk);
        var current_chunk_percent;
        if (current_uploading_chunk < chunk_amount) {
            if (uploaded % chunk_size) {
                current_chunk_percent = ((uploaded % chunk_size) / chunk_size * 100).toFixed(2);
            } else {
                current_chunk_percent = 100;
                currentProgessBar.removeClass().addClass('alert-success');
            }
        } else {
            var last_chunk_size = file.size - chunk_size * (chunk_amount - 1);
            var left_file_size = file.size - uploaded;
            if (left_file_size % last_chunk_size) {
                current_chunk_percent = ((uploaded % chunk_size) / last_chunk_size * 100).toFixed(2);
            } else {
                current_chunk_percent = 100;
                currentProgessBar.removeClass().addClass('alert-success');
            }
        }
        currentProgessBar.width(current_chunk_percent + '%');
        currentProgessBar.attr('aria-valuenow', current_chunk_percent);
        text = "块" + current_uploading_chunk + "上传进度" + current_chunk_percent + '%';
        currentProgessBar.next().html(text);
    }

    this.appear();
};

FileProgress.prototype.setComplete = function(up, info) {

    var domain = up.getOption('domain');
    var res = $.parseJSON(info);
    var type = res.key.substr(0,5);

    switch(type){
        case 'other' :
            ///backend/web/assets/e558d40b/image/audio.png
            var sourceLink = base_url + '/image/other.jpg';
            break;
        case 'audio' :
            var sourceLink = base_url + '/image/audio.png';
            break;
        case 'video' :
            var sourceLink = base_url + '/image/video.jpg';
            break;
        default:
            var sourceLink = upload_qiniu_url + '/' + res.key; //获取上传成功后的文件的Url
            break;
    }

    var minSourceLink = sourceLink + '?imageView2/2/w/120/h/110/interlace/1/q/100'

    var html = "<li><div class='div_center'><a href='javascript:void(0);'>X</a><img data-src='"+sourceLink+"' src='"+minSourceLink+"'><span>"+res.key+"</span><strong class='glyphicon glyphicon-ok-circle' aria-hidden='true'></strong></div></li>";
    $('.image_list_ul').append(html);

};

FileProgress.prototype.setError = function() {
    this.fileProgressWrapper.find('td:eq(2)').attr('class', 'text-warning');
    this.fileProgressWrapper.find('td:eq(2) .progress').css('width', 0).hide();
    this.fileProgressWrapper.find('button').hide();
    this.fileProgressWrapper.next('.chunk-status-tr').hide();
};

FileProgress.prototype.setCancelled = function(manual) {
    var progressContainer = 'progressContainer';
    if (!manual) {
        progressContainer += ' red';
    }
    this.fileProgressWrapper.attr('class', progressContainer);
    this.fileProgressWrapper.find('td .progress').remove();
    this.fileProgressWrapper.find('td:eq(2) .btn-default').hide();
    this.fileProgressWrapper.find('td:eq(2) .progressCancel').hide();
};

FileProgress.prototype.setStatus = function(status, isUploading) {
    if (!isUploading) {
        this.fileProgressWrapper.find('.status').text(status).attr('class', 'status text-left');
    }
};

// 绑定取消上传事件
FileProgress.prototype.bindUploadCancel = function(up) {
    var self = this;
    if (up) {
        self.fileProgressWrapper.find('td:eq(2) .progressCancel').on('click', function(){
            self.setCancelled(false);
            self.setStatus("取消上传");
            self.fileProgressWrapper.find('.status').css('left', '0');
            up.removeFile(self.file);
        });
    }

};

FileProgress.prototype.appear = function() {
    if (this.getTimer() !== null) {
        clearTimeout(this.getTimer());
        this.setTimer(null);
    }

    if (this.fileProgressWrapper[0].filters) {
        try {
            this.fileProgressWrapper[0].filters.item("DXImageTransform.Microsoft.Alpha").opacity = 100;
        } catch (e) {
            // If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
            this.fileProgressWrapper.css('filter', "progid:DXImageTransform.Microsoft.Alpha(opacity=100)");
        }
    } else {
        this.fileProgressWrapper.css('opacity', 1);
    }

    this.fileProgressWrapper.css('height', '');

    this.height = this.fileProgressWrapper.offset().top;
    this.opacity = 100;
    this.fileProgressWrapper.show();

};
