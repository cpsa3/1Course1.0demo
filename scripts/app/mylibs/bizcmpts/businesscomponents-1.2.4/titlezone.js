var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.TitleZone = function (opt_html) {
    businesscomponents.previewandreports.TitleZone.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.TitleZone.html)[0]);
    this._titles = new businesscomponents.previewandreports.Titles();
    this._titles.replaceTo($(this._element).find('[gi~="ctnTitle"]')[0]);
    this.$_ctnContent = $($(this._element).find('[gi~="ctnContent"]')[0]);
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.TitleZone, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.TitleZone, {
    setTitles: function (titles) {
        this._titles.setTitles(titles);
    },
    setContent: function (contentHtml) {
        this.$_ctnContent.html(contentHtml);
    },
    setContentClass: function (cssName) {
        this.$_ctnContent.addClass(cssName);
    }

});
businesscomponents.previewandreports.TitleZone.html =
     '<div >' +
        '<div  gi="ctnTitle"></div>' +
        '<div  gi="ctnContent"></div>' +
    '</div>';