var businesscomponents = businesscomponents || {};

businesscomponents.ui = businesscomponents.ui || {};

businesscomponents.ui.TimerbarLeft = function (opt_html) {
    businesscomponents.ui.TimerbarLeft.superClass.constructor.call(this, $(opt_html === undefined ?
        '<div class="webTimerbox">' +
        '<span gi="lblTitle"></span>' +
        '<span gi="lblTimer" class="webTimerText">00:00:00</span>' +
            '</div>'
        : opt_html).get(0));
    this._lblTimer = new toot.ui.Label($(this._element).find('[gi="lblTimer"]').get(0));
    this._lblTitle = new toot.ui.Label($(this._element).find('[gi="lblTitle"]').get(0));
};
toot.inherit(businesscomponents.ui.TimerbarLeft, toot.ui.Component);
toot.extendClass(businesscomponents.ui.TimerbarLeft, {
    //time in sec
    setTime: function (time) {
        var sec = time % 60;
        var min = (time % 3600 - time % 60) / 60;
        var hr = (time - time % 3600) / 3600;
        this._lblTimer.setText((hr < 10 ? "0" + hr : hr) + ":" + (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec));
    },
    setTitleStr: function (titleStr) {
        this._lblTitle.setText(titleStr);
    }
});