//
/*
* 功能:错误百分比分析图
* 作者:小潘
* 日期:20130807 22:33
*/
var businesscomponents = businesscomponents || {};

businesscomponents.correctors = businesscomponents.correctors || {};

businesscomponents.correctors.ImgBox = function (opt_html) {
    businesscomponents.correctors.ImgBox.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.correctors.ImgBox.html)[0]);

    this._imgTxt = new toot.ui.Label($(this._element).find('[gi~="imgtxt"]')[0]);
    this._imgBox = $(this._element).find('[gi~="imgbox"]')[0];

    this._imgBoxScore = null;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.correctors.ImgBox, toot.ui.Component);

toot.extendClass(businesscomponents.correctors.ImgBox, {
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
    }
});
businesscomponents.correctors.ImgBox.html =
    '<div class="ImgboxOuter_2">' +
        '<div class="Imgbox2" gi="imgbox"></div>' +
        '<span class="analyseTitleFontStyle" gi="imgtxt"></span>' +
        '</div>';



