var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.TextInitialView = function (opt_html) {
    businesscomponents.editors.TextInitialView.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.TextInitialView.html)[0]);
    this._lbl1 = new toot.ui.Label($(this._element).find('[gi~="lbl1"]')[0]);
    this._lbl2 = new toot.ui.Label($(this._element).find('[gi~="lbl2"]')[0]);
    this._lbl1.setText("输入");
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.TextInitialView, toot.ui.Component);
toot.extendClass(businesscomponents.editors.TextInitialView, {

    _render: function () {
        businesscomponents.editors.TextInitialView.superClass._render.call(this);
        this._renderHeight();
    },

    _height: 50,
    getHeight: function () {
        return this._height;
    },
    setHeight: function (height) {
        this._height = height;
        this._renderHeight();
    },
    _renderHeight: function () {
        this._element.style.height = this._height + "px";
        this._element.style.lineHeight = this._height + "px";
    },

    getLbl1: function () { return this._lbl1; },
    getLbl2: function () { return this._lbl2; },
    setLb12: function (text) { this._lbl2.setText(text); }
});
businesscomponents.editors.TextInitialView.html = '<div class="marB10 NotfilledS1"><span class="colorGray" gi="lbl1"></span><span gi="lbl2"></span></div>';
businesscomponents.editors.TextInitialView.html2 = '<div class="marB10 NotfilledS1" style="width:820px;"><span class="colorGray" gi="lbl1"></span><span gi="lbl2"></span></div>';
businesscomponents.editors.TextInitialView.sathtml = '<div class="NotfilledS1 taskSatBoxPatch" style="height:140px; line-height:140px;"><span class="colorGray" gi="lbl1"></span><span gi="lbl2"></span></div>'