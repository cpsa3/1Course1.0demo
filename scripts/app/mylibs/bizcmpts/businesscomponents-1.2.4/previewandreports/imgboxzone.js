//现在仅提供一个外部容器，为后期扩展做预留
var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.ImgBoxZone = function (opt_html) {
    businesscomponents.previewandreports.ImgBoxZone.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.ImgBoxZone.html)[0]);
    //    this._titles = new businesscomponents.previewandreports.Titles();
    //    this._titles.replaceTo($(this._element).find('[gi~="ctnTitle"]')[0]);
    //    this._ctnContent = $(this._element).find('[gi~="ctnContent"]')[0];
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.ImgBoxZone, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.ImgBoxZone, {

});
businesscomponents.previewandreports.ImgBoxZone.html =
     '<div class="ReportCImgbox2_2 clearfix">' +
    '</div>';