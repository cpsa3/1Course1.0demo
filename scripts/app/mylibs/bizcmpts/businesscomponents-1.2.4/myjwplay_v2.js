//自定义ui，页面元素简单，无开始，暂停等按钮。
//如需求需要后面另行扩展

var businesscomponents = businesscomponents || {};
businesscomponents.MyJwplayV2 = function (opt_html) {
    var _this = this;
    this._audioContainer = (Math.random() * (0 - 100) + 100).toString();

    businesscomponents.MyJwplayV2.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.MyJwplayV2.html(this._audioContainer))[0]);
    this._urls = [];
    //完成回调
    this._compCall = null;
    this._finishCall = null;
    this._audioIds = [];
    this._$title = $(this._element).find('[gi~="title"]');
    this._$curTime = $(this._element).find('[gi~="curTime"]');
    this._$totalTime = $(this._element).find('[gi~="totalTime"]');
    this._$position = $(this._element).find('[gi~="position"]');
    this._$playContainer = $(this._element).find('[gi~="playContainer"]');
    this.totalTimer = null;
    this.curTimer = null;
    this.index = 0;
    this.duration = 0;
    this._fileNames = [];
    this._finish = false;
};
toot.inherit(businesscomponents.MyJwplayV2, toot.ui.Component);
toot.extendClass(businesscomponents.MyJwplayV2, {
    _playAudio: function () {
        for (var i = 0; i < this._audioIds.length; i++) {
            var _this = this;
            var url = '/Common/GetRealUrl';
            var data = {};
            data.id = this._audioIds[i];
            var ajax = {
                url: url,
                data: data,
                type: 'POST',
                dataType: 'json',
                cache: false,
                async: false,
                success: function (json) {
                    _this._urls.push(json.url);
                }
            };
            $.ajax(ajax);
        }

        //alert(_this._urls[0]);
        setTimeout(function () {
            _this._bindAudio(_this._urls[0]);
            if (_this._urls.length == 1) {
                _this.setCompCall(_this._finishCall);
            }
            _this._$title.html(_this._fileNames[0]);
        }, 10);
        var _this = this;
        setInterval(function () {
            if (_this._finish) {
                _this._finish = false;
                _this.index++;
                _this._$title.html(_this._fileNames[_this.index]);
                if (_this._urls[_this.index]) {
                    if (_this.index == (_this._urls.length - 1)) {
                        _this.setCompCall(_this._finishCall);
                    }
                    _this._bindAudio(_this._urls[_this.index]);
                }
            }
        }, 1000)
        //_this._bindAudio(json.url);
        //        alert(_this._urls);
    },
    _bindAudio: function (urlAudio) {
        var _this = this;
        jwplayer(_this._audioContainer).setup({
            flashplayer: "/Scripts/libs/jwplayer/player.swf",
            width: '1',
            height: '1',
            skin: "/Scripts/libs/jwplayer/skin/skinFull.xml",
            file: urlAudio,
            provider: 'sound',
            controlbar: 'bottom',
            autostart: true
        });

        jwplayer(_this._audioContainer).onPlay(function () {
            if (_this._playCall) {
                _this._playCall();
                _this.curTimer = setInterval(function () {
                    _this._timeCall();
                }, 1000)
            }
        });

        jwplayer(_this._audioContainer).onComplete(function () {
            clearInterval(_this.curTimer);
            clearInterval(_this.totalTimer);
            _this._$position.css("width", 100 + "%");
            _this._$curTime.html(_this._parseTimeData(_this.duration));      
            _this._finish = true;
            if (_this._compCall)
                _this._compCall();
        });
        //        jwplayer(_this._audioContainer).onTime(function () {
        //            if (_this._timeCall)
        //                _this._timeCall();
        //        });
    },
    //每秒钟调整进度条
    _timeCall: function () {
        var _this = this;
        if (_this._$curTime.html() == _this._$totalTime.html()) {
            return;
        }
        var p = jwplayer(_this._audioContainer).getPosition();
        var d = jwplayer(_this._audioContainer).getDuration();
        var p1 = parseInt((p / d) * 100);
        this._$position.css("width", p1 + "%");
        this._$curTime.html(_this._parseTimeData(jwplayer(_this._audioContainer).getPosition()));

    },
    _playCall: function () {
        var _this = this;
        this._$curTime.html("00:00");
        this._updateTotalTime();
    },
    _parseTimeData: function (timeStr) {

        var second = Math.floor(timeStr % 60);             // 计算秒     
        var minite = Math.floor((timeStr / 60) % 60);      //计算分 
        var hour = Math.floor((timeStr / 60) / 60);        //计算小时
        var Str = "";

        if (hour > 0) {
            Str += hour + ":";
        }
        if (minite < 10) {
            Str += "0" + minite + ":";
        } else {
            Str += minite + ":";
        }

        if (second < 10) {
            Str += "0" + second;
        } else {
            Str += second;
        }
        return Str;
    },
    _updateTotalTime: function () {
        var _this = this;
        this.totalTimer = setInterval(function () {
            if (jwplayer(_this._audioContainer).getDuration() > 0) {
                _this.duration = jwplayer(_this._audioContainer).getDuration();
                _this._$totalTime.html(_this._parseTimeData(_this.duration));
            }

        }, 1000);
    },
    setWidth: function (width) {
        this._$playContainer.width(width);
    },
    setAudioIds: function (audioIds) {
        var tempAudioIds = [];
        for (var i = 0; i < audioIds.length; i++) {
            if (audioIds[i]) {
                tempAudioIds.push(audioIds[i]);
            }
        }
        this._audioIds = tempAudioIds;
        this._playAudio();
    },
    setAudioFileNames: function (fileNames) {
        var tempFileNames = [];

        //过滤文件名
        for (var i = 0; i < fileNames.length; i++) {
            if (fileNames[i]) {
                var pos = fileNames[i].lastIndexOf(".");
                if (pos >= 0) {
                    pos = fileNames[i].lastIndexOf(".")
                    fileNames[i] = fileNames[i].substr(0, pos)
                }
                tempFileNames.push(fileNames[i]);
            }
        }
        this._fileNames = tempFileNames;
    },
    setCompCall: function (compCall) {
        this._compCall = compCall;
    },
    stop: function () {
        var _this = this;
        if (jwplayer(_this._audioContainer)) {
            jwplayer(_this._audioContainer).stop();
        }
    },
    play: function () {
        var _this = this;
        if (jwplayer(_this._audioContainer)) {
            jwplayer(_this._audioContainer).play();
        }
    },
    setFinish: function (finishCall) {
        this._finishCall = finishCall;
    }
});
businesscomponents.MyJwplayV2.html = function (audioContainer) {

    var html = '<div><div class="webtitlebox1" gi="title">Lecture 1</div>' +
    '<div id="' + audioContainer + '">' +
                    '</div>' +
     '<div class="fl scheduleTips2" gi="curTime">0:00</div>' +
            '<div class="fl schedulebox scheduleW2" gi="playContainer">' +
                '<div class="scheduleBg"></div>' +
                '<div class="scheduleUpper" gi="position" style="width:0%;"></div>' +
            '</div>' +
            '<div class="fl scheduleTips2" gi="totalTime"></div></div>';
    return html;
};