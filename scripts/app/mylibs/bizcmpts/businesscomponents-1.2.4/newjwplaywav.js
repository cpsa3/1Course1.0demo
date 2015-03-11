//自定义ui，页面元素简单，无开始，暂停等按钮。
//如需求需要后面另行扩展

var businesscomponents = businesscomponents || {};
businesscomponents.NewMyJwplayWav = function (opt_html) {
    var _this = this;
    this._audioContainer = (Math.random() * (0 - 100) + 100).toString();
    businesscomponents.NewMyJwplayWav.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.NewMyJwplayWav.html(this._audioContainer))[0]);
    //完成回调
    this._compCall = null;
    this._audioId = 0;
    this._$curTime = $(this._element).find('[gi~="curTime"]');
    this._$totalTime = $(this._element).find('[gi~="totalTime"]');
    this._$position = $(this._element).find('[gi~="position"]');
    this._$playContainer = $(this._element).find('[gi~="playContainer"]');
    //按钮
    this._btnPlay = new toot.ui.Button($(this._element).find('[gi~="btnplay"]')[0]);
    this._btnStop = new toot.ui.Button($(this._element).find('[gi~="btnstop"]')[0]);
    this._btnPause = new toot.ui.Button($(this._element).find('[gi~="btnpause"]')[0]);
    this._btnPause.setVisible(false);
    //绑定事件处理函数
    toot.connect(this._btnPlay, "action", this, this._onBtnPlayAction);
    toot.connect(this._btnStop, "action", this, this._onBtnStopAction);
    toot.connect(this._btnPause, "action", this, this._onBtnPauseAction);
    this._playCount = 0;
    this._isFirstPlay = true;
    this._isPlay = false;
    this._isStop = false;
    this._playStatus = 0;
    this.totalTimer = null;
    this.curTimer = null;
    this.duration = 0;
    this._fistBind = true;
};
toot.inherit(businesscomponents.NewMyJwplayWav, toot.ui.Component);
toot.defineEvent(businesscomponents.NewMyJwplayWav, ["playCountChange", "fistPlay"]);
toot.extendClass(businesscomponents.NewMyJwplayWav, {
    _onBtnPlayAction: function () {
        this._isStop = false;
        this._isPlay = true;
        if (this._playStatus == 0) {
            this._playStatus = 1;
            this._playCount++;
            toot.fireEvent(this, "playCountChange");
        }
        else {
            //            this._playStatus = 0;
        }
        this._btnPlay.setVisible(false);
        this._btnPause.setVisible(true);
        this.play();
        if (this._isFirstPlay) {
            toot.fireEvent(this, "fistPlay");
            this._isFirstPlay = false;
        }


    },
    _onBtnPauseAction: function () {
        this.pause();
        this._btnPlay.setVisible(true);
        this._btnPause.setVisible(false);
    },
    _onBtnStopAction: function () {
        this._isStop = true;
        this._fistBind = true;
        if (this._isPlay) {
            //            this._playCount++;
            this._playStatus = 0;
            this._isPlay = false;
        }
        this._btnPlay.setVisible(true);
        this._btnPause.setVisible(false);
        this.stop();
    },
    getPlayCount: function () {
        return this._playCount;
    },
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
            flashplayer: "/content3/Scripts/jwplayer/player.swf",
            width: '1',
            height: '1',
            //            skin: "/content3/Scripts/jwplayer/skin/skinFull.xml",
            file: urlAudio,
            //            provider: 'sound',
            controlbar: 'bottom',
            autostart: false
        });

        jwplayer(_this._audioContainer).onPlay(function () {
            if (_this._fistBind) {
                if (_this._playCall) {
                    _this._playCall();

                    _this.curTimer = setInterval(function () {
                        if (_this._isStop) {
                            clearInterval(_this.curTimer);
                            _this._$curTime.html(_this._parseTimeData(0));
                            _this._$position.css("width", 0 + "%");
                        }
                        else {
                            _this._timeCall();
                        }

                    }, 1000);
                    _this._fistBind = false;
                }
            }
        });

        jwplayer(_this._audioContainer).onComplete(function () {

            clearInterval(_this.curTimer);
            clearInterval(_this.totalTimer);
            //播放完成复原
            _this._$position.css("width", 0 + "%");
            _this._$curTime.html(_this._parseTimeData(0));
            _this._playStatus = 0;
            _this._fistBind = true;
            //播放完成
            //            _this._playCount++;
            _this._btnPlay.setVisible(true);
            _this._btnPause.setVisible(false);
            _this._isPlay = false;
            //            toot.fireEvent(_this, "playCountChange");
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
        this._$curTime.html(_this._parseTimeData(jwplayer(_this._audioContainer).getPosition() + 1));

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
    stopRefactor: function () {
        this._isStop = true;
        this._fistBind = true;
        if (this._isPlay) {
            //            this._playCount++;
            this._playStatus = 0;
            this._isPlay = false;
        }
        this._btnPlay.setVisible(true);
        this._btnPause.setVisible(false);
        this.stop();
    },
    startPlay: function () {
        this._isStop = false;
        this._isPlay = true;
        if (this._playStatus == 0) {
            this._playStatus = 1;
            this._playCount++;
            toot.fireEvent(this, "playCountChange");
        }
        else {
            //            this._playStatus = 0;
        }
        this._btnPlay.setVisible(false);
        this._btnPause.setVisible(true);
        this.play();
        if (this._isFirstPlay) {
            toot.fireEvent(this, "fistPlay");
            this._isFirstPlay = false;
        }
    },
    play: function () {
        var _this = this;
        if (jwplayer(_this._audioContainer)) {
            jwplayer(_this._audioContainer).play();
        }
    },
    pause: function () {
        var _this = this;
        if (jwplayer(_this._audioContainer)) {
            jwplayer(_this._audioContainer).pause();
        }
    },
    clear: function () {
        clearInterval(this.curTimer);
        clearInterval(this.totalTimer);
    }
});
businesscomponents.NewMyJwplayWav.html = function (audioContainer) {

    var html =
     '<div  class="scheduleOuter3 clearfix">' +
        '<div class="fl"><button class="btn10Play" gi="btnplay"></button></div>' +
        '<div class="fl"><button class="btn10Pause" gi="btnpause"></button></div>' +
        '<div class="fl"><button class="btn10Stop" gi="btnstop"></button></div>' +
        '<div style="z-index:-1;position:relative;"><div id="' + audioContainer + '" ></div></div>' +
        '<div class="fl scheduleTips2" gi="curTime">0:00</div>' +
        '<div class="fl schedulebox" gi="playContainer">' +
            '<div class="scheduleBg"></div>' +
            '<div class="scheduleUpper" gi="position" style="width:0%;"></div>' +
        '</div>' +
        '<div class="fl scheduleTips2" gi="totalTime"></div>' +
     '</div>';
    return html;
};