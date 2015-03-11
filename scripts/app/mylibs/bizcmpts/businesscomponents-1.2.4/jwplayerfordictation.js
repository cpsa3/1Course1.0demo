/*
*User: 小潘
*Date: 2015年1月27日 18:06:09
*Desc: 只适用与听写题组
*/
var businesscomponents = businesscomponents || {};
businesscomponents.JwPlayerForDictation = function(opt_html) {

    //jwplayer 使用唯一的id
    this._audioContainer = (Math.random() * (0 - 100) + 100).toString();
    businesscomponents.JwPlayerForDictation.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.JwPlayerForDictation.html(this._audioContainer))[0]);
    //音频地址
    this._audioUrl = "";
    //当前时间
    this._$curTime = $(this._element).find('[gi~="curTime"]');
    //总时长
    this._$totalTime = $(this._element).find('[gi~="totalTime"]');
    //播放进度
    this._$position = $(this._element).find('[gi~="position"]');
    //播放器区域
    this._$playContainer = $(this._element).find('[gi~="playContainer"]');
    //按钮
    this._btnPlay = new toot.ui.Button($(this._element).find('[gi~="btnplay"]')[0]);
    this._btnPause = new toot.ui.Button($(this._element).find('[gi~="btnpause"]')[0]);
    this._btnPause.setVisible(false);
    //绑定事件处理函数
    toot.connect(this._btnPlay, "action", this, this._onBtnPlayAction);
    toot.connect(this._btnPause, "action", this, this._onBtnPauseAction);

    //播放次数
    this._playCount = 0;

    //是否正在播放
    this._isPlay = false;

    //是否停止状态
    this._isStop = false;

    //播放状态
    this._playStatus = 0;
    //总时长计时器
    this.totalTimer = null;
    //当前时间计时器 
    this.curTimer = null;
    //播放进度
    this.duration = 0;
    //是否第一次绑定
    this._fistBind = true;
};
toot.inherit(businesscomponents.JwPlayerForDictation, toot.ui.Component);
//声明事件
toot.defineEvent(businesscomponents.JwPlayerForDictation, ["playCountChange", "playAudio"]);
toot.extendClass(businesscomponents.JwPlayerForDictation, {
    //播放事件
    _onBtnPlayAction: function() {
        this._isStop = false;
        this._isPlay = true;
        if (this._playStatus == 0) {
            this._playStatus = 1;
            this._playCount++;
            toot.fireEvent(this, "playCountChange");
        }
        this._btnPlay.setVisible(false);
        this._btnPause.setVisible(true);
        this.play();
        toot.fireEvent(this, "playAudio");

    },
    //暂停事件
    _onBtnPauseAction: function() {
        this.pause();
        this._btnPlay.setVisible(true);
        this._btnPause.setVisible(false);
    },
    //获得播放次数
    getPlayCount: function() {
        return this._playCount;
    },

    _bindAudio: function() {
        //清楚之前的计时器
        this.clear();
        //将时间置空
        this.playerInit();

        jwplayer(this._audioContainer).setup({
            flashplayer: "/Scripts/libs/jwplayer/player.swf",
            width: '1',
            height: '1',
            skin: "/Scripts/libs/jwplayer/skin/skinFull.xml",
            file: this._audioUrl,
            provider: 'sound',
            controlbar: 'bottom',
            autostart: false
        });


        jwplayer(this._audioContainer).onPlay(
            $.proxy(function() {
                if (this._fistBind) {
                    if (this._playCall) {
                        this._playCall();

                        this.curTimer = setInterval(
                            $.proxy(
                                function() {
                                    if (this._isStop) {
                                        clearInterval(this.curTimer);
                                        this._$curTime.html(this._parseTimeData(0));
                                        this._$position.css("width", 0 + "%");
                                    } else {
                                        this._timeCall();
                                    }

                                }, this), 1000);
                        this._fistBind = false;
                    }
                }
            }, this)
        );

        jwplayer(this._audioContainer).onComplete(
            $.proxy(function() {

                clearInterval(this.curTimer);
                clearInterval(this.totalTimer);
                //播放完成复原
                this._$position.css("width", 0 + "%");
                this._$curTime.html(this._parseTimeData(0));
                this._playStatus = 0;
                this._fistBind = true;

                this._btnPlay.setVisible(true);
                this._btnPause.setVisible(false);
                this._isPlay = false;

            }, this)
        );

    },
    //播放初始化
    playerInit: function() {
        this._$curTime.html(this._parseTimeData(0));
        this._$position.css("width", 0 + "%");
        this._fistBind = true;
        this._playStatus = 0;
        this._isPlay = false;
        this._btnPlay.setVisible(true);
        this._btnPause.setVisible(false);
    },
    //每秒钟调整进度条
    _timeCall: function() {
        if (this._$curTime.html() == this._$totalTime.html()) {
            return;
        }
        if (jwplayer(this._audioContainer)) {
            var p = jwplayer(this._audioContainer).getPosition();
            var d = jwplayer(this._audioContainer).getDuration();
            var p1 = parseInt((p / d) * 100);
            this._$position.css("width", p1 + "%");
            this._$curTime.html(this._parseTimeData(jwplayer(this._audioContainer).getPosition() + 1));
        }


    },
    _playCall: function() {
        this._$curTime.html("00:00");
        this._updateTotalTime();
    },
    //转换时间
    _parseTimeData: function(timeStr) {

        var second = Math.floor(timeStr % 60); // 计算秒     
        var minite = Math.floor((timeStr / 60) % 60); //计算分 
        var hour = Math.floor((timeStr / 60) / 60); //计算小时
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
    //运行总时长计时器
    _updateTotalTime: function() {
        this.totalTimer = setInterval(
            $.proxy(function() {
                if (jwplayer(this._audioContainer) && jwplayer(this._audioContainer).getDuration() > 0) {
                    this.duration = jwplayer(this._audioContainer).getDuration();
                    this._$totalTime.html(this._parseTimeData(this.duration));
                }

            }, this), 1000);
    },
    //设置播放地址，初始化播放器
    setAudioUrl: function(url) {
        this._audioUrl = url;
        this._bindAudio();
    },
    //播放
    play: function() {
        if (jwplayer(this._audioContainer)) {
            var state = jwplayer(this._audioContainer).getState();
            if (state == jwplayer.api.events.state.PLAYING || state == jwplayer.api.events.state.BUFFERING) {

            } else {
                jwplayer(this._audioContainer).play();
                this._btnPlay.setVisible(false);
                this._btnPause.setVisible(true);
                this._isPlay = true;
            }

        }
    },
    //暂停
    pause: function() {
        if (jwplayer(this._audioContainer)) {
            var state = jwplayer(this._audioContainer).getState();
            if (state == jwplayer.api.events.state.PLAYING || state == jwplayer.api.events.state.BUFFERING) {
                jwplayer(this._audioContainer).pause();
                this._btnPlay.setVisible(true);
                this._btnPause.setVisible(false);
                this._isPlay = false;
            }

        }
    },
    //播放停止
    stop: function() {
        if (jwplayer(this._audioContainer)) {
            jwplayer(this._audioContainer).stop();
        }
    },
    //停止播放，所有变量置为初始值
    stopRefactor: function() {
        this._isStop = true;
        this._fistBind = true;
        this._playStatus = 0;
        this._isPlay = false;
        this._btnPlay.setVisible(true);
        this._btnPause.setVisible(false);
        this.stop();
    },

    //清除计时器
    clear: function() {
        clearInterval(this.curTimer);
        clearInterval(this.totalTimer);
    },
    //播放 并改变按钮状态
    playController: function() {
        this.play();


    },
    //暂停播放 并改变按钮状态
    pauseController: function() {
        this.pause();

    },
    //获取当前播放状态  true为正在播放 false为不在播放
    getIsPlay: function() {
        return this._isPlay;
    }
});

businesscomponents.JwPlayerForDictation.html = function(audioContainer) {
    var html =
        '<div  class="scheduleOuter3 clearfix">' +
            '<div class="fl"><button class="btn10Play" gi="btnplay"></button></div>' +
            '<div class="fl"><button class="btn10Pause" gi="btnpause"></button></div>' +
            '<div id="' + audioContainer + '"></div>' +
            '<div class="fl scheduleTips2" gi="curTime">00:00</div>' +
            '<div class="fl schedulebox" gi="playContainer">' +
            '<div class="scheduleBg"></div>' +
            '<div class="scheduleUpper" gi="position" style="width:0%;"></div>' +
            '</div>' +
            '<div class="fl scheduleTips2" gi="totalTime"></div>' +
            '</div>';
    return html;
};