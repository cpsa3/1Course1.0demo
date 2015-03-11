var businesscomponents = businesscomponents || {};


businesscomponents.MessageBar = function (opt_html) {
    businesscomponents.MessageBar.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.MessageBar.html)[0]);

    this._lblMsg = new toot.ui.Label($(this._element).find('[gi~="lblMsg"]')[0]);
    this._btnClose = new toot.ui.Button($(this._element).find('[gi~="btnClose"]')[0]);

    this._timer = null;

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.MessageBar, toot.ui.Component);
toot.extendClass(businesscomponents.MessageBar, {

    _zIndex: 20000,

    _msgDuration: null,
    getMsgDuration: function () {
        return this._msgDuration;
    },
    setMsgDuration: function (duration) {
        this._msgDuration = duration;
    },

    _init_manageEvents: function () {
        businesscomponents.MessageBar.superClass._init_manageEvents.call(this);
        toot.connect(this._btnClose, "action", this, this._onBtnCloseAction);
    },

    _onBtnCloseAction: function () {
        this.setVisible(false);
    },
    //duration 
    // null||undefined : will not auto-close
    // true : auto-close in msgDuration ( milliseconds )
    // int : auto-close in duration ( milliseconds )
    setMessage: function (msg, duration) {
        var _this = this;
        clearTimeout(this._timer);
        this._lblMsg.setText(msg);
        this.setVisible(true);
        duration = duration === true ? this._msgDuration : duration;
        if (duration != null)
            this._timer = setTimeout(function () {
                _this.setVisible(false);
            }, duration);

    }
});
businesscomponents.MessageBar.html =
    '<div class="errorTipsbox clearfix" style="width:600px; top:50px; left:50%; margin-left:-300px;">' +
        '<a href="#" class="errorClose" gi="btnClose"></a>' +
        '<em class="errorIco"></em><span gi="lblMsg"></span>' +
        '</div>';