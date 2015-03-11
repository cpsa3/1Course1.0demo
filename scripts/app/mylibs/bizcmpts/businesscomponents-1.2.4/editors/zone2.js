var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.Zone2 = function(opt_html) {
    businesscomponents.editors.Zone2.superClass.constructor.call(this, opt_html ? $(opt_html)[0] : $(businesscomponents.editors.Zone2.html)[0]);
    var $elementContainer = $($(this._element).find('[gi~="EmentContainer"]'));
    //外围div找不到
    this._elementContainer = $elementContainer.length > 0 ? $elementContainer[0] : this._element;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.Zone2, toot.ui.Component);
toot.extendClass(businesscomponents.editors.Zone2, {
    getElementContainer: function() { return this._elementContainer; }
});
businesscomponents.editors.Zone2.html =
    '<div class="taskLayoutbox2 clearfix" gi="EmentContainer">' +
    '</div>';

businesscomponents.editors.Zone2.html2 =
    '<div class="taskLayoutbox3 clearfix" gi="EmentContainer">' +
    '</div>';