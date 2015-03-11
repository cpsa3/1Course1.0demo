//听写专用
var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.TitleZones = function (opt_html) {
    businesscomponents.previewandreports.TitleZones.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.TitleZones.html)[0]);
    this._titles = new businesscomponents.previewandreports.TitlesForDictation();
    this._titles.replaceTo($(this._element).find('[gi~="ctnTitle"]')[0]);
    this._ctnContent = $(this._element).find('[gi~="ctnContent"]')[0];
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.TitleZones, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.TitleZones, {
    setTitles: function (playcount,usetime){
        this._titles.render(playcount,usetime);
    },
    getContent: function () {
        //        this.$_ctnContent.html(contentHtml);
        return this._ctnContent;
    },
    setContentClass: function (cssName) {
        $(this._ctnContent).addClass(cssName);
    }

});
businesscomponents.previewandreports.TitleZones.html =
     '<div class="ReportNewSBox1">' +
        '<div  gi="ctnTitle"></div>' +
        '<div  gi="ctnContent"></div>' +
    '</div>';