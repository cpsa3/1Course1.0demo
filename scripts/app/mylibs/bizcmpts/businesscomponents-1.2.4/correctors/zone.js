//
/*
* 功能:批改页zone
* 作者:小潘
* 日期:20130731
*/
var businesscomponents = businesscomponents || {};

businesscomponents.correctors = businesscomponents.correctors || {};

businesscomponents.correctors.Zone = function(opt_html) {
    businesscomponents.correctors.Zone.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.correctors.Zone.html)[0]);

    this._lblTitle = new toot.ui.Label($(this._element).find('[gi~="lblTitle"]')[0]);
    this._elementContainer = $(this._element).find('[gi~="container"]')[0];
    var $LayoutboxClass = $($(this._element).find('[gi~="LayoutboxClass"]'));
    //外围div找不到
    this._elementLayoutBox = $LayoutboxClass.length > 0 ? $LayoutboxClass[0] : this._element;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.correctors.Zone, toot.ui.Component);
toot.extendClass(businesscomponents.correctors.Zone, {

    setContainerClass: function (className) {
        $(this._elementContainer).attr("class", className);
    },
    setLayoutboxClass: function (className) {
        $(this._elementLayoutBox).attr("class", className);
    },
    getLblTitle: function() { return this._lblTitle; },
    getElementContainer: function() { return this._elementContainer; }
});
businesscomponents.correctors.Zone.html =
    '<div class="clearfix E_imgMax" gi="LayoutboxClass">' +
        '<div class="fl L1">' +
        '<div class="tagStyle3 font14">' +
        '<div class="textboxOuter" gi="boxClass"><div class="textboxInner" gi="lblTitle"></div></div>' +
        '</div>' +
        '</div>' +
        '<div class="fl L2" gi="container">' +
        '</div>' +
        '</div>';