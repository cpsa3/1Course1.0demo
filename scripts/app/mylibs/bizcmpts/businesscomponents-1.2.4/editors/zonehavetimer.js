/**
* author :小潘
* time :2014年11月10日 15:10:49
* description : 固定Dom结构类 目前适用于通用题型
*/


var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.ZoneHaveTimer = function(opt_html) {
    businesscomponents.editors.ZoneHaveTimer.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.ZoneHaveTimer.html)[0]);

    this._lblTitle = new toot.ui.Label($(this._element).find('[gi~="lblTitle"]')[0]);
    this._btnClose = new toot.ui.Button($(this._element).find('[gi~="btnClose"]')[0]);
    this._btnClose.setParent(this);
    this._elementContainer = $(this._element).find('[gi~="container"]')[0];


    this._$timerHideBox = $(this._element).find('[gi~="timerHideBox"]');
    this._$timerShowBox = $(this._element).find('[gi~="timerShowBox"]');


    this._groupTime = new toot.ui.TextBox($(this._element).find('[gi~="groupTime"]')[0]);

    this._btnTimerHide = new toot.ui.Button($(this._element).find('[gi~="btnTimerHide"]')[0]);
    this._btnTimerShow = new toot.ui.Button($(this._element).find('[gi~="btnTimerShow"]')[0]);

    this._elementContainer = $(this._element).find('[gi~="container"]')[0];

    this._timerShow = false;

    if (this.constructor == arguments.callee) this._init();
};

toot.inherit(businesscomponents.editors.ZoneHaveTimer, toot.ui.Component);
toot.defineEvent(businesscomponents.editors.ZoneHaveTimer, ["beforeSwitch"]);
toot.extendClass(businesscomponents.editors.ZoneHaveTimer, {
    _init: function() {
        businesscomponents.editors.ZoneHaveTimer.superClass._init.call(this);
        this._btnClose.setVisible(false);
        this.renderTimer();
    },
    _init_manageEvents: function() {
        businesscomponents.editors.ZoneHaveTimer.superClass._init_manageEvents.call(this);
        toot.connect([this._btnTimerHide, this._btnTimerShow], "click", this, this._timerSwitch);
    },

    _timerSwitch: function(btn, event) {
        var e = { preventDefault: false };
        toot.fireEvent(this, "beforeSwitch", e);
        if (e.preventDefault) return;

        btn == this._btnTimerHide ? this._timerShow = true : this._timerShow = false;
        this.renderTimer();
    },
    getLblTitle: function() { return this._lblTitle; },
    getBtnClose: function() { return this._btnClose; },
    getBtnTimerHide: function() { return this._btnTimerHide; },
    getBtnTimerShow: function() { return this._btnTimerShow; },
    getGroupTime: function() { return this._groupTime; },
    getElementContainer: function() { return this._elementContainer; },
    getTimerShow: function() { return this._timerShow; },
    setTimerShow: function(isShow, time) {

        time ? this._groupTime.setValue(this.getSecondToTime(time)) : this._groupTime.setValue("");

        if (this._timerShow == isShow) {
            return;
        }
        this._timerShow = isShow;
        this.renderTimer();
    },
    renderTimer: function() {
        this._$timerHideBox.hide();
        this._$timerShowBox.hide();
        if (this._timerShow) {
            this._$timerShowBox.show();
//            this._groupTime.setFocused(true);
//            this._groupTime.setSelect();
        } else {
            this._$timerHideBox.show();
        }
    },
    validateTime: function() {
        var val = this._groupTime.getValue();
        if (!val.match(/^(0?[0-9]|1[0-2]):[0-5][0-9]:[0-5][0-9]$/)) {
            return { isTrue: false, errorMsg: StatusMessage[2954] };
        }
        //限时不能为0
        if (val == "00:00:00") {
            return { isTrue: false, errorMsg: StatusMessage[2955] };
        }
        return { isTrue: true };
    },
    getSecond: function() {
        var input = this._groupTime.getValue();
        var hh, mm, ss;
        try {
            var timeArray = input.split(":");
            if (timeArray.length < 3) {
                return input;
            }

            hh = parseInt(timeArray[0]);
            mm = parseInt(timeArray[1]);
            ss = parseInt(timeArray[2]);


            return hh * 3600 + mm * 60 + ss;
        } catch (e) {

        }
        return input;

    },
    getSecondToTime: function(input) {
        var hh, mm, ss;

        //特殊逻辑：传入的若为-1，约定好，返回字符串"N/A";
        //传入的若为-100，则返回字符串"无限时
        if (input == -1) {
            return "N/A";
        }
        if (input == -100) {
            return "无限时";
        }
        //传入的时间为空或小于0
        if (input == null || input < 0) {
            return input;
        }
        //得到小时
        hh = input / 3600 | 0;
        input = parseInt(input) - hh * 3600;
        if (parseInt(hh) < 10) {
            hh = "0" + hh;
        }
        //得到分
        mm = input / 60 | 0;
        //得到秒
        ss = parseInt(input) - mm * 60;
        if (parseInt(mm) < 10) {
            mm = "0" + mm;
        }
        if (ss < 10) {
            ss = "0" + ss;
        }
        return hh + ":" + mm + ":" + ss;
    }
});
businesscomponents.editors.ZoneHaveTimer.html =
    '<div class="taskLayoutbox clearfix">' +
    '<div class="fl L1">' +
    '<div class="tagStyle1 font18 closeBox">' +
    '<div class="textboxOuter"><div class="textboxInner" gi="lblTitle"></div></div>' +
    '<span class="closeItem" gi="btnClose"></span>' +
    '</div>' +
    '<div class="LimitedTime marT10" gi="timerHideBox">' +
    '<input type="button" class="BtnUnlimitedTime" gi="btnTimerHide"/>' +
    '<span class="LimitedTimeText1" >未开启</span>' +
    '</div>' +
    '<div class="LimitedTime marT10" gi="timerShowBox">' +
    '<input type="button" class="BtnLimitedTime" gi="btnTimerShow" />' +
    '<input class="LimitedTimeText2"  gi="groupTime" />' +
    '</div>' +
    '</div>' +
    '<div class="fl L2" gi="container">' +
    '</div>' +
    '</div>';