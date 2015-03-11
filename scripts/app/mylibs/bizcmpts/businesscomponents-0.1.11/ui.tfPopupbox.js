var businesscomponents = businesscomponents || {};

businesscomponents.ui = businesscomponents.ui || {};

businesscomponents.ui.TfPopupbox = function (opt_html) {
    var _this = this;
    businesscomponents.ui.TfPopupbox.superClass.constructor.call(this, $(opt_html === undefined ?
        '<div class="TTPopupbox2" id="TTPopupbox">' +
            '<div class="TTPopupbox2Head" gi="ctnTitle"></div>' +
            '<div class="TTPopupbox2Mid alignL" gi="ctnDetail"></div>' +
            '<button class="btn2Return" gi="btnReturn"></button>' +
            '</div>'
        : opt_html).get(0));

    this._btnReturn = new toot.ui.Button($(this._element).find('[gi="btnReturn"]').get(0));
    this._$ctnTitle = $(this._element).find('[gi="ctnTitle"]');
    this._$ctnDetail = $(this._element).find('[gi="ctnDetail"]');

    toot.connect(this._btnReturn, "action", this, function () {
        $(this.getElement()).hide();
        toot.fireEvent(this, "actionReturn");
    });
    this.setVisible(false);
};
toot.inherit(businesscomponents.ui.TfPopupbox, toot.ui.Component);
toot.defineEvent(businesscomponents.ui.TfPopupbox, ["actionReturn"]);
toot.extendClass(businesscomponents.ui.TfPopupbox, {
    //设置标题
    setTitle: function (title) {
        this._$ctnTitle.html(title);
    },
    setDetail: function (detail) {
        this._$ctnDetail.html(detail);
    },
    setVisible: function (flg) {
        if (flg) {
            $(this.getElement()).show();
        }
        else {
            $(this.getElement()).hide();
        }

    }
});