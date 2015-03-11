//
/*
* 功能:作文机批-综合建议dom
* 作者:小潘
* 日期:20130802
*/
var businesscomponents = businesscomponents || {};

businesscomponents.correctors = businesscomponents.correctors || {};

businesscomponents.correctors.Zone3 = function (opt_html) {
    businesscomponents.correctors.Zone3.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.correctors.Zone3.html)[0]);

    this._elementContainer = $(this._element).find('[gi~="container"]')[0];
    var $LayoutboxClass = $($(this._element).find('[gi~="LayoutboxClass"]'));
    //外围div找不到
    this._elementLayoutBox = $LayoutboxClass.length > 0 ? $LayoutboxClass[0] : this._element;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.correctors.Zone3, toot.ui.Component);
toot.extendClass(businesscomponents.correctors.Zone3, {
    setContainerClass: function (className) {
        $(this._elementContainer).attr("class", className);
    },
    setLayoutboxClass: function (className) {
        $(this._elementLayoutBox).attr("class", className);
    },
    
    getElementContainer: function () { return this._elementContainer; }
});
businesscomponents.correctors.Zone3.html =
    '<div class="hasBottomDiv" gi="LayoutboxClass" >' +
    '<div class="hasBottomMarT30 alignL"  gi="container">' +
    '</div>' +
    '</div>';

