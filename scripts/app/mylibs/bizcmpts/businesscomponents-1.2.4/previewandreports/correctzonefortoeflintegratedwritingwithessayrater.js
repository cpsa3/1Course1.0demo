var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.CorrectZoneForToeflIntegratedWritingWithEssayRater = function (opt_html) {
    businesscomponents.previewandreports.CorrectZoneForToeflIntegratedWritingWithEssayRater.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.CorrectZoneForToeflIntegratedWritingWithEssayRater.html)[0]);
    this.$_ctnScore = $($(this._element).find('[gi~="ctnScore"]')[0]);
    this.$_ctnCorrectComment = $($(this._element).find('[gi~="ctnCorrectComment"]')[0]);
    this.$_ctnAutoCorrectComment = $($(this._element).find('[gi~="ctnAutoCorrectComment"]')[0]);
    this.$_splitline = $($(this._element).find('[gi~="splitline"]')[0]);
    this.$_splitline.hide();
    this._renderModel = 0; //默认是仅渲染批改，不显示机批
    this._correctComment = null;
    this._autoCorrectComment = null;

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.CorrectZoneForToeflIntegratedWritingWithEssayRater, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.CorrectZoneForToeflIntegratedWritingWithEssayRater, {
    setScore: function (score) {
        this.$_ctnScore.html(score);
    },
    setCorrectComment: function (commentArray) {
        this._correctComment = commentArray;

    },
    setAutoCorrectComment: function (autoCorrectComment) {
        this._autoCorrectComment = autoCorrectComment;
    },
    setRenderModel: function (model) {
        if (model == this._renderModel) {
            return;
        }
        this._renderModel = model;
    },
    render: function () {
        if (this._correctComment && this._correctComment.length > 0) {
            //            for (var i = 0; i < this._correctComment.length; i++) {
            //                var item = new businesscomponents.previewandreports.CommentItemForToeflIntegratedWritingWithEssayRater();
            //                item.setHtml(this._correctComment[i]);
            //                this.$_ctnCorrectComment.append(item.getElement());
            //            }
            this.$_ctnCorrectComment.html(this._correctComment);
        }
        //判断是否有机批
        if (this._renderModel == 0) {
            //如果是仅有人批，至此结束
            return;
        }
        // 显示黑线
        this.$_splitline.show();
        //渲染机批
        if (this._autoCorrectComment) {

            this.$_ctnAutoCorrectComment.html(this._autoCorrectComment);

        }
    }

});
businesscomponents.previewandreports.CorrectZoneForToeflIntegratedWritingWithEssayRater.html =
     ' <div class="ReportNewSBox3S clearfix">' +
        '<div class="ReportNewSBox3L">' +
            '<div class="ReportNewSScore" gi="ctnScore">4.5</div>' +
        '</div>' +
        '<div class="ReportNewSBox3R">' +
            '<div gi="ctnCorrectComment"></div>' +
            '<div class="ReportCHR2" gi="splitline"><!--分割线--></div>' +
            '<div gi="ctnAutoCorrectComment"></div>' +
        '</div>' +
    '</div>';
businesscomponents.previewandreports.CommentItemForToeflIntegratedWritingWithEssayRater = function (opt_html) {
    businesscomponents.previewandreports.CommentItemForToeflIntegratedWritingWithEssayRater.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.CommentItemForToeflIntegratedWritingWithEssayRater.html)[0]);
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.CommentItemForToeflIntegratedWritingWithEssayRater, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.CommentItemForToeflIntegratedWritingWithEssayRater, {
    setHtml: function (html) {
        html = html.replace(/\n/g, "<br/>");
        $(this._element).html(html);
    }

});
businesscomponents.previewandreports.CommentItemForToeflIntegratedWritingWithEssayRater.html = '<li></li>';

