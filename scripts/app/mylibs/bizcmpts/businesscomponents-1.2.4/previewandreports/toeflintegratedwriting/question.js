var businesscomponents = businesscomponents || {};

businesscomponents.toeflIntegratedWriting = businesscomponents.toeflIntegratedWriting || {};

businesscomponents.toeflIntegratedWriting.Question = function (opt_html) {
    businesscomponents.toeflIntegratedWriting.Question.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.toeflIntegratedWriting.Question.html)[0]);

    this._elementContainer = $(this._element).find('[gi~="container"]')[0];
    var $LayoutboxClass = $($(this._element).find('[gi~="LayoutboxClass"]'));

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.toeflIntegratedWriting.Question, toot.ui.Component);
toot.extendClass(businesscomponents.toeflIntegratedWriting.Question, {
    getElementContainer: function () { return this._elementContainer; }
});

businesscomponents.toeflIntegratedWriting.Question.html =
    '<div class="hasBottomDiv" gi="LayoutboxClass" >' +
    '<div class="hasBottomMarT30 alignL"  gi="container">aaaaaaa' +
    '</div>' +
    '</div>';

