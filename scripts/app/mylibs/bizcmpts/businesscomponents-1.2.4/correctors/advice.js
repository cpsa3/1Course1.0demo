//
/*
* 功能:作文机批-综合建议dom
* 作者:小潘
* 日期:20130807 15:54
*/
var businesscomponents = businesscomponents || {};

businesscomponents.correctors = businesscomponents.correctors || {};

businesscomponents.correctors.Advice = function (opt_html) {
    businesscomponents.correctors.Advice.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.correctors.Advice.html)[0]);

    this._scorebox = new toot.ui.Label($(this._element).find('[gi~="Scorebox"]')[0]);
    this._suggestionBox = $(this._element).find('[gi~="SuggestionBox"]')[0];
    this._ctnSuggestion = $(this._element).find('[gi~="ctnSuggestion"]')[0];
    this._$ctnTitle = $($(this._element).find('[gi~="ctnTitle"]'));
    var $LayoutboxClass = $($(this._element).find('[gi~="LayoutboxClass"]'));
    //外围div找不到
    this._elementLayoutBox = $LayoutboxClass.length > 0 ? $LayoutboxClass[0] : this._element;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.correctors.Advice, toot.ui.Component);
toot.extendClass(businesscomponents.correctors.Advice, {

    setLayoutboxClass: function (className) {
        $(this._elementLayoutBox).attr("class", className);
    },
    getScorebox: function () { return this._scorebox; },
    getSuggestionBox: function () { return this._suggestionBox; },
    setTitle: function (title) {
        this._$ctnTitle.html(title);
    },
    getCtnSuggestion: function () { return this._ctnSuggestion; }
});
businesscomponents.correctors.Advice.html =
    '<div class="hasBottomHeaderDiv clearfix" gi="LayoutboxClass">' +
        '<div class="resultTitleSpanStyle" gi="ctnTitle" >综合建议</div>' +
        '<div class="resultScoreStyle">机改得分<span class="ReportScorebox" gi="Scorebox"></span></div>' +
        '<div class="alignL marT10">' +
        '<span class="font14 fontb">总体点评</span>' +
        '<div class="listSuggestion" gi="ctnSuggestion">' +
        '<ul gi="SuggestionBox">' +
        '</ul>' +
        '</div>' +
        '</div>' +
        '</div>';