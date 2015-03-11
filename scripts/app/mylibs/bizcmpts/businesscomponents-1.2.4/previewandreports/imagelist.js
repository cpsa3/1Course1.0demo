var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.ImageList = function (opt_html) {
    businesscomponents.previewandreports.ImageList.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.ImageList.html)[0]);
    this._$imageList = $(this._element).find('[gi~="imageList"]');
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.ImageList, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.ImageList, {
    setImageList: function (data) {
        var allImage = '';
        if (data) {
            for (var i = 0; i < data.length; i++) {
                allImage = allImage + businesscomponents.previewandreports.ImageList.imageHtml(data[i].getSrc());
            }
        }
        this._$imageList.html(allImage);
    },
    setImageListRefactor: function (urlArray) {
        var allImage = '';
        if (urlArray) {
            for (var i = 0; i < urlArray.length; i++) {
                allImage = allImage + businesscomponents.previewandreports.ImageList.imageHtml(urlArray[i]);
            }
        }
        this._$imageList.html(allImage);
    }
})
businesscomponents.previewandreports.ImageList.html = '<div>' +
   '<ul class="ReportAudioPicOuter clearfix" gi="imageList">' +
          '</ul>' +
    '</div>';

businesscomponents.previewandreports.ImageList.imageHtml = function (url) {
    return '<li><img src="' + url + '"></li>';
}