var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.Zone = function (opt_html) {
    businesscomponents.editors.Zone.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.Zone.html)[0]);

    this._lblTitle = new toot.ui.Label($(this._element).find('[gi~="lblTitle"]')[0]);
    this._btnClose = new toot.ui.Button($(this._element).find('[gi~="btnClose"]')[0]); this._btnClose.setParent(this);
    this._elementContainer = $(this._element).find('[gi~="container"]')[0];

    this._btnClose.setVisible(false);

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.Zone, toot.ui.Component);
toot.extendClass(businesscomponents.editors.Zone, {
    getLblTitle: function () { return this._lblTitle },
    getBtnClose: function () { return this._btnClose },
    getElementContainer: function () { return this._elementContainer }
});
businesscomponents.editors.Zone.html =
                    '<div class="taskLayoutbox clearfix">' +
                      '<div class="fl L1">' +
                        '<div class="tagStyle1 font18 closeBox">' +
                          '<div class="textboxOuter"><div class="textboxInner" gi="lblTitle"></div></div>' +
                          '<span class="closeItem" gi="btnClose"></span>' +
                        '</div>' +
                      '</div>' +
                      '<div class="fl L2" gi="container">' +
                      '</div>' +
                    '</div>';
//托福综合写作
businesscomponents.editors.Zone.toeflIntegratedWritingWithEssayRaterHtml =
                    '<div class="taskLayoutbox clearfix">' +
                      '<div class="fl L1">' +
                        '<div class="tagStyle1 font18 closeBox" style="height:42px">' +
                          '<div class="textboxOuter"><div class="textboxInner" gi="lblTitle"></div></div>' +
                          '<span class="closeItem" gi="btnClose"></span>' +
                        '</div>' +
                      '</div>' +
                      '<div class="fl L2" gi="container" style="min-height:60px">' +
                      '</div>' +
                    '</div>';
