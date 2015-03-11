var businesscomponents = businesscomponents || {}; 
businesscomponents.SpeakingTimeBar = function (optHtml) {
    businesscomponents.SpeakingTimeBar.superClass.constructor.call(this, $(optHtml !== undefined ? optHtml : businesscomponents.SpeakingTimeBar.html)[0]);

    this._lbTimes = new toot.ui.Label($(this._element).find('[gi~="lblMsg"]')[0]);
    this._lbUsage = new toot.ui.Label($(this._element).find('[gi~="lblUsage"]')[0]);
    this._lbTxt = new toot.ui.Label($(this._element).find('[gi~="lblTxt"]')[0]);
    this._timer = null;
    this.timeusage = 0;
    if (this.constructor == arguments.callee) 
        this._init();
   
};
toot.inherit(businesscomponents.SpeakingTimeBar, toot.ui.Component);
toot.extendClass(businesscomponents.SpeakingTimeBar, {
    _zIndex: 20000,
    _init_manageEvents: function () {
        var cthis = this;
        businesscomponents.SpeakingTimeBar.superClass._init_manageEvents.call(cthis);

    },
    start: function () {
        var cthis = this;
        cthis._timer = setInterval(function () {
            cthis.timeusage += 1;
            var second = Math.floor(parseInt(cthis.timeusage) % 60);    // 计算秒     
            var minite = Math.floor((parseInt(cthis.timeusage) / 60) % 60);      //计算分 
            if (minite < 10) {
                minite = "0" + minite;
            }
            if (second < 10) {
                second = "0" + second;
            }
            cthis._lbUsage.setText("00:" + minite + ":" + second + "");
        }, 1000);
    },
    stop: function () {
        var cthis = this;
        if (cthis._timer != null) {
            clearInterval(cthis._timer);
        }
    },
    setTimes: function (times) {
        this._lbTimes.setText(times);
    },
    getUsageTimes: function () {
        return this.timeusage;
    },
    setUsageTimes: function (timeusage) {
        var second = Math.floor(parseInt(timeusage) % 60);    // 计算秒     
        var minite = Math.floor((parseInt(timeusage) / 60) % 60);      //计算分 
        if (minite < 10) {
            minite = "0" + minite;
        }
        if (second < 10) {
            second = "0" + second;
        }
        this._lbUsage.setText("00:" + minite + ":" + second + "");
    },
    setTimesText:function(txt) {
        this._lbTxt.setText(txt);
    }
});
businesscomponents.SpeakingTimeBar.html = '<div class="RecordBarBoxOuter clearfix">'
                                                            + ' <div class="RecordBarBox">用时<span class="Textbox" gi="lblUsage" ></span></div>'
                                                            + ' <div class="RecordBarBox"><span gi="lblTxt">录音次数</span><span class="Textbox" gi="lblMsg"></span></div>'
                                                            + '  </div>';


//-----批改用到的

var businesscomponents = businesscomponents || {};
businesscomponents.CorrectSpeakingTimeBar = function (optHtml) {
    businesscomponents.CorrectSpeakingTimeBar.superClass.constructor.call(this, $(optHtml !== undefined ? optHtml : businesscomponents.CorrectSpeakingTimeBar.html)[0]);

    this._lbTimes = new toot.ui.Label($(this._element).find('[gi~="lblMsg"]')[0]);
    this._lbUsage = new toot.ui.Label($(this._element).find('[gi~="lblUsage"]')[0]);
    this._lbTxt = new toot.ui.Label($(this._element).find('[gi~="lblTxt"]')[0]);
    if (this.constructor == arguments.callee)
        this._init();

};
toot.inherit(businesscomponents.CorrectSpeakingTimeBar, toot.ui.Component);
toot.extendClass(businesscomponents.CorrectSpeakingTimeBar, {
    _zIndex: 20000,
    _init_manageEvents: function () {
        var cthis = this;
        businesscomponents.CorrectSpeakingTimeBar.superClass._init_manageEvents.call(cthis);

    }, 
    setTimes: function (times) {
        this._lbTimes.setText(times);
    },
    setTimesText:function(txt) {
        this._lbTxt.setText(txt);
    } ,
    setUsageTimes: function (timeusage) {
        var second = Math.floor(parseInt(timeusage) % 60);    // 计算秒     
        var minite = Math.floor((parseInt(timeusage) / 60) % 60);      //计算分 
        if (minite < 10) {
            minite = "0" + minite;
        }
        if (second < 10) {
            second = "0" + second;
        }
        this._lbUsage.setText("00:" + minite + ":" + second + "");
    },
    setUseTimeVisualable: function (isShow) {
        var useTimeUI = $(this._element).find(".marL20");
        if (isShow) {
            useTimeUI.show();
        }
        else {
            useTimeUI.hide();
        }
    }
});
businesscomponents.CorrectSpeakingTimeBar.html = '<div class="marT20 clearfix">'
                                                                                + '<span class="fl"><span gi="lblTxt">录音次数</span>:&nbsp;<b gi="lblMsg">1</b></span>'
                                                                                + '<span class="fl marL20">用时:&nbsp;<b  gi="lblUsage">00:00:26</b></span>'
                                                                                + '</div>';







