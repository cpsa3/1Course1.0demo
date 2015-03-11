var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.LevelImgBox = function (opt_html) {
    businesscomponents.previewandreports.LevelImgBox.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.LevelImgBox.html)[0]);

    this._imgTxt = new toot.ui.Label($(this._element).find('[gi~="imgtxt"]')[0]);
    this._imgBox = new toot.ui.Label($(this._element).find('[gi~="imgbox"]')[0]);

    this._imgBoxScore = null;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.LevelImgBox, toot.ui.Component);

toot.extendClass(businesscomponents.previewandreports.LevelImgBox, {
    _init: function () {

    },
    setImgBoxScore: function (score) {
        //百分比分数
        this._imgBoxScore = parseInt(score * 100);

        if (this._imgBoxScore <= 39) {
            this._imgTxt.setText("Weak");
            $(this._element).addClass("Imgbox_W");
        } else if (this._imgBoxScore <= 59) {
            this._imgTxt.setText("Limited");
            $(this._element).addClass("Imgbox_L");
        } else if (this._imgBoxScore <= 79) {
            this._imgTxt.setText("Fair");
            $(this._element).addClass("Imgbox_F");
        } else if (this._imgBoxScore <= 100) {
            this._imgTxt.setText("Good");
            $(this._element).addClass("Imgbox_G");
        }
    },
    getImgTxt: function () { return this._imgTxt; },
    getImgBox: function () { return this._imgBox; },

    getImgBoxScore: function () {
        return this._imgBoxScore;
    },
    setContainerClass: function (className) {
        $(this._element).addClass(className);
    },
    setImgClass: function (className) {
        $(this._imgBox).addClass(className);
    }
});
businesscomponents.previewandreports.LevelImgBox.html =
    '<dl class="ImgboxOuter2_3">' +
        '<dt class="ImgTxt2"><span gi="imgtxt"></span></dt>' +
        '<dd class="ImgTxt3"><span gi="imgbox"></span></dd>' +
    '</dl>';
