var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.BadFaith = function (opt_html) {
    businesscomponents.previewandreports.BadFaith.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.BadFaith.html)[0]);
    this._titles = $(this._element).find('[gi~="BadFaithTitle"]');
    this._content = $(this._element).find('[gi~="BadfaithContent"]');
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.BadFaith, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.BadFaith, {
    _init: function () {
        this._content.hide();
    },
    setTitles: function (titles) {
        this._titles.html(titles);
        this._content.show();
    },
    setContainerClass: function (className) {
        $(this._element).addClass(className);
    }

});
businesscomponents.previewandreports.BadFaith.html =
    '<div>' +
        '<div class="ReportNewSBox5 clearfix"  gi="BadfaithContent">' +
        	'<div class="Textbox1">BadFaith</div>' +
            '<div class="Textbox2" gi="BadFaithTitle"></div>' +
        '</div>' +
    '</div>'