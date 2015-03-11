var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.InitialView = function (opt_html) {
    businesscomponents.editors.InitialView.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.InitialView.html)[0]);
    this._lbl1 = new toot.ui.Label($(this._element).find('[gi~="lbl1"]')[0]);
    this._lbl2 = new toot.ui.Label($(this._element).find('[gi~="lbl2"]')[0]);
    this._$lbl3 = $(this._element).find('[gi~="lbl3"]');
    this._lbl1.setText("添加");
    var $LayoutboxClass = $($(this._element).find('[gi~="LayoutboxClass"]'));
    this._elementLayoutBox = $LayoutboxClass.length > 0 ? $LayoutboxClass[0] : this._element;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.InitialView, toot.ui.Component);
toot.extendClass(businesscomponents.editors.InitialView, {

    _render: function () {
        businesscomponents.editors.InitialView.superClass._render.call(this);
        this._renderHeight();
    },

    _height: 50,
    _lineHeight: 50,
    _paddingTop: null,
    getHeight: function () {
        return this._height;
    },
    setHeight: function (height) {
        this._height = height;
        this._lineHeight = height;
        this._renderHeight();
    },
    setLineHeight: function (lineHeight) {
        this._lineHeight = lineHeight;
        this._renderHeight();
    },
    setPaddingTop: function (paddingTop) {
        this._paddingTop = paddingTop;
        this._renderPadding();
    },
    
    setLayoutboxClass: function (className) {
        this._element.style.height = '';
        this._element.style.lineHeight = '';
        $(this._elementLayoutBox).attr("class", className);
    },
    _renderHeight: function () {
        this._element.style.height = this._height + "px";
        this._element.style.lineHeight = this._lineHeight + "px";
    },
    _renderPadding: function () {
        this._element.style.paddingTop = this._paddingTop + "px";
    },


    getLbl1: function () { return this._lbl1; },
    getLbl2: function () { return this._lbl2; },
    getLbl3: function () { return this._lbl3; },
    getLbl3Obj: function () { return this._$lbl3; },
    setLb12: function (text) { this._lbl2.setText(text); }
});
businesscomponents.editors.InitialView.html = '<div class="marB10 NotfilledS2"><span class="colorGray"><span class="font20">+</span><span gi="lbl1"></span></span><span gi="lbl2"></span><div gi="lbl3" class="colorGray textbox2"><div></div>';
