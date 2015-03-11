//
/*
* 功能:试卷名称和学生姓名title
* 作者:小潘
* 日期:20130802
*/
var businesscomponents = businesscomponents || {};

businesscomponents.correctors = businesscomponents.correctors || {};

businesscomponents.correctors.Zone2 = function(opt_html) {
    businesscomponents.correctors.Zone2.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.correctors.Zone2.html)[0]);

    this._lblTitle = new toot.ui.Label($(this._element).find('[gi~="titleBox"]')[0]);
   
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.correctors.Zone2, toot.ui.Component);
toot.extendClass(businesscomponents.correctors.Zone2, {
    getLblTitle: function() { return this._lblTitle; }
});
businesscomponents.correctors.Zone2.html =
    '<div class="complete clearfix">' +
        '<div  class="titleStyle1 clear" gi="titleBox">' +
        '</div>' +
        '</div>';
