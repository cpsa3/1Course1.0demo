/*
*User: 小潘
*Date: 2014年9月11日 11:56:02
*Desc: 视频组件 预览UI
*/

var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.Video = businesscomponents.previewandreports.Video || {};

businesscomponents.previewandreports.Video = function(optHtml) {
    businesscomponents.previewandreports.Video.superClass.constructor.call(this, $(optHtml !== undefined ? optHtml : businesscomponents.previewandreports.Video.html)[0]);

    this._videoBox = $(this._element).find('[gi~="videoDisplay"]')[0];

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.Video, toot.view.Item);

toot.extendClass(businesscomponents.previewandreports.Video, {
    setupPlayer: function(url, showSlider) {
        GreedyPlayer(this._videoBox.id).setup({
            width: '800',
            height: '600',
            file: url,
            autoplay: false,
            isShowSlider: showSlider
        });
    }
});

businesscomponents.previewandreports.Video.html =
    '<div class="ReportNewQbox">' +
    '<div class="clearfix" >' +
    '<div gi="videoDisplay" id="videoDisplay"></div>' +
    '</div>' +
    '<div>';