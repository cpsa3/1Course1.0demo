var businesscomponents = businesscomponents || {};

businesscomponents.ui = businesscomponents.ui || {};

businesscomponents.ui.Timerbar = function(opt_html) {
    businesscomponents.ui.Timerbar.superClass.constructor.call(this, $(opt_html === undefined ?
        '<div class="fr">' +
            '<input type="button" class="pooupbtn8 fl" gi="btnShowTimer" value="Show Timer" />' +
            '<input type="button" class="pooupbtn8 fl" gi="btnHideTimer" value="Hide Timer" />' +
            '<div gi="ctnTimer" class="showTimertext"><span gi="lblTimer">00:00:00</span></div>' +
            '</div>'
        : opt_html).get(0));

    this._btnShowTimer = new toot.ui.Button($(this._element).find('[gi="btnShowTimer"]').get(0));
    this._btnHideTimer = new toot.ui.Button($(this._element).find('[gi="btnHideTimer"]').get(0));
    this._$ctnTimer = $(this._element).find('[gi="ctnTimer"]');
    this._lblTimer = new toot.ui.Label($(this._element).find('[gi="lblTimer"]').get(0));

    toot.connect(this._btnShowTimer, "action", this, function() {
        this.setTimerVisible(true);
    });
    toot.connect(this._btnHideTimer, "action", this, function() {
        this.setTimerVisible(false);
    });

    this.setTimerVisible(true);
};
toot.inherit(businesscomponents.ui.Timerbar, toot.ui.Component);
toot.extendClass(businesscomponents.ui.Timerbar, {
    setTimerVisible: function(visible) {
        if (visible) {
            this._btnShowTimer.setVisible(false);
            this._btnHideTimer.setVisible(true);
            this._$ctnTimer.show();
        } else {
            this._btnShowTimer.setVisible(true);
            this._btnHideTimer.setVisible(false);
            this._$ctnTimer.hide();
        }
    },
    //time in sec
    setTime: function(time) {
        var sec = time % 60;
        var min = (time % 3600 - time % 60) / 60;
        var hr = (time - time % 3600) / 3600;
        this._lblTimer.setText((hr < 10 ? "0" + hr : hr) + ":" + (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec));
    }
});

businesscomponents.ui.Timerbar.ieltDisplayTimerbarHtml = '<dd class="fr BtnBoxStyle">' +
    '<button class="btnTimer2_1" gi="btnShowTimer" title="显示限时" ></button>' +
    '<div class="timerTxt" gi="ctnTimer"><span gi="lblTimer">00:00:00</span></div>' +
    '<button class="btnTimer2_2" gi="btnHideTimer" title="隐藏限时"></button>' +
    '</dd>';

//托福改版之后timebar样式 by xp 2013年12月19日 12:47:10
//调用例子： _this._timerbar = new businesscomponents.ui.Timerbar(businesscomponents.ui.Timerbar.toefDisplayTimerbarHtml);
businesscomponents.ui.Timerbar.toefDisplayTimerbarHtml = '<span class="timer">' +
    '<button gi="btnHideTimer"  class="hideTime"></button>' +
    '<span  gi="ctnTimer"><span gi="lblTimer" class="timenum">00:00:00</span></span>' +
    '<button  gi="btnShowTimer" class="showTime"></button></span>';