var businesscomponents = businesscomponents || {};

businesscomponents.toeflWriting = businesscomponents.toeflWriting || {};

businesscomponents.toeflWriting.Question = function (opt_html) {
    businesscomponents.toeflWriting.Question.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.toeflWriting.Question.html)[0]);

    this._elementContainer = $(this._element).find('[gi~="container"]')[0];
    var $LayoutboxClass = $($(this._element).find('[gi~="LayoutboxClass"]'));

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.toeflWriting.Question, toot.ui.Component);
toot.extendClass(businesscomponents.toeflWriting.Question, {
    getElementContainer: function () { return this._elementContainer; }
});

businesscomponents.toeflWriting.Question.html =
    '<div class="hasBottomDiv" gi="LayoutboxClass" >' +
    '<div class="hasBottomMarT30 alignL"  gi="container">aaaaaaa' +
    '</div>' +
    '</div>';

