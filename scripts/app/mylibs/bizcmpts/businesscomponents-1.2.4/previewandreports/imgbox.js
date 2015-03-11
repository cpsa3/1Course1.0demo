var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.ImgBox = function (opt_html) {
    businesscomponents.previewandreports.ImgBox.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.ImgBox.html)[0]);

    this._imgTxt = new toot.ui.Label($(this._element).find('[gi~="imgtxt"]')[0]);
    this._imgBox = $(this._element).find('[gi~="imgbox"]')[0];

    this._imgBoxScore = null;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.ImgBox, toot.ui.Component);

toot.extendClass(businesscomponents.previewandreports.ImgBox, {
    _init: function () {

    },
    setImgBoxID: function (id) {
        $(this._imgBox).attr("id", id);
    },
    setImgBoxScore: function (score) {
        //百分比分数
        this._imgBoxScore = parseInt(score * 100);
    },
    getImgTxt: function () { return this._imgTxt; },
    getImgBox: function () { return this._imgBox; },

    getImgBoxId: function () { return $(this._imgBox).attr("id"); },
    getImgBoxScore: function () {
        return this._imgBoxScore;
    },

    //调用drawChart方法：渲染图表控件 位置：scripts/report/reportcharts.js
    drawChart: function () {
        var imgId = this.getImgBoxId();
        var imgScore = this.getImgBoxScore();
        var imgWidth = 61;
        drawChart(imgId, imgWidth, imgScore);
    },
    setContainerClass: function (className) {
        $(this._element).addClass(className);
    },
    setImgClass: function (className) {
        $(this._imgBox).addClass(className);
    }
});
businesscomponents.previewandreports.ImgBox.html =
    '<div >' +
        '<div  gi="imgbox"></div>' +
        '<span class="ImgTxt" gi="imgtxt"></span>' +
        '</div>';



