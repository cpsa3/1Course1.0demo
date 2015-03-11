var businesscomponents = businesscomponents || {};


businesscomponents.VersionTextConfirmBox = function (opt_html) {
    businesscomponents.VersionTextConfirmBox.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.VersionTextConfirmBox.html)[0]);

    this._btnClose = new toot.ui.Button($(this._element).find('[gi~="btnClose"]')[0]);
    this._btnChange = new toot.ui.Button($(this._element).find('[gi~="btnChange"]')[0]);

    this._timer = null;
    this._zIndex = 110;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.VersionTextConfirmBox, toot.ui.Component);
toot.defineEvent(businesscomponents.VersionTextConfirmBox, "cancle");
toot.defineEvent(businesscomponents.VersionTextConfirmBox, "confirm");
toot.extendClass(businesscomponents.VersionTextConfirmBox, {

    _init_manageEvents: function () {
        businesscomponents.VersionTextConfirmBox.superClass._init_manageEvents.call(this);
        toot.connect(this._btnClose, "action", this, this._onBtnCloseAction);
        toot.connect(this._btnChange, "action", this, this._onBtnChangeAction);
    },

    _onBtnCloseAction: function () {
        this.setVisible(false);
        toot.fireEvent(this, "cancle");
    },
    _onBtnChangeAction: function () {
        this.setVisible(false);
        toot.fireEvent(this, "confirm");
    }
});
businesscomponents.VersionTextConfirmBox.html =
    '  <div class="popupDialogBoxOuter popupDialogBoxOuterStyle1" >' +
        '<div class="popupDialogHead popupDialogHeadStyle1">' +
            '警告</div>' +
        '<dl class="popupDialogInner5">' +
            '<dd class="popupMsgBox popupMsgBoxPatch">' +
               '确定要更新关联项吗？<br>' +
                '更新将对以下全部关联内容生效，包括学员已经完成的内容和报告，且更新后不能恢复。' +
            '</dd>' +
        '</dl>' +
        '<div class="popupDialogFoot clearfix">' +
            '<button class="fl btnBack " gi="btnClose"> ' +
                '返回</button>' +
            '<button class="fr btnNext " gi="btnChange"> ' +
                '更新</button>' +
        '</div>' +
    '</div>';