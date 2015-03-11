//自定义ui，页面元素简单，无开始，暂停等按钮。
//如需求需要后面另行扩展

var businesscomponents = businesscomponents || {};
businesscomponents.MyJwplay = function (opt_html) {
    var _this = this;
    this._audioContainer = (Math.random() * (0 - 100) + 100).toString();
    businesscomponents.MyJwplay.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.MyJwplay.html(this._audioContainer))[0]);
    //完成回调
    this._compCall = null;
    this._audioId = 0;
    this._$curTime = $(this._element).find('[gi~="curTime"]');
    this._$totalTime = $(this._element).find('[gi~="totalTime"]');
    this._$position = $(this._element).find('[gi~="position"]');
    this._$playContainer = $(this._element).find('[gi~="playContainer"]');

    this.totalTimer = null;
    this.curTimer = null;
    this.duration = 0;
};
toot.inherit(businesscomponents.MyJwplay, toot.ui.Component);
toot.extendClass(businesscomponents.MyJwplay, {

    _playAudio: function () {
        var _this = this;
        var url = '/Common/GetRealUrl';
        var data = {};
        data.id = this._audioId || 0;
        var ajax = {
            url: url,
            data: data,
            type: 'POST',
            dataType: 'json',
            cache: false,
            success: function (json) {
                _this._bindAudio(json.url);
            }
        };
        $.ajax(ajax);
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
    setAudioId: function (audioId) {
        this._audioId = audioId;
        this._playAudio();
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
    }
});
businesscomponents.MyJwplay.html = function (audioContainer) {

    var html = '<div>' +
    '<div id="' + audioContainer + '">' +
                    '</div>' +
     '<div class="fl scheduleTips2" gi="curTime">0:00</div>' +
            '<div class="fl schedulebox scheduleW1" gi="playContainer">' +
                '<div class="scheduleBg"></div>' +
                '<div class="scheduleUpper" gi="position" style="width:0%;"></div>' +
            '</div>' +
            '<div class="fl scheduleTips2" gi="totalTime"></div></div>';
    return html;
};