var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.CorrectZone = function (opt_html) {
    businesscomponents.previewandreports.CorrectZone.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.CorrectZone.html)[0]);
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
toot.inherit(businesscomponents.previewandreports.CorrectZone, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.CorrectZone, {
    setScore: function (score) {
        this.$_ctnScore.html(score);
    },
    setCorrectComment: function (commentArray) {
        this._correctComment = commentArray;

    },
    setAutoCorrectComment: function (autoCorrectCommentArray) {
        this._autoCorrectComment = autoCorrectCommentArray;
    },
    setRenderModel: function (model) {
        if (model == this._renderModel) {
            return;
        }
        this._renderModel = model;
    },
    getScoreElement:function() {
        return this.$_ctnScore;
    },
    render: function () {
        var flg = 1;
        if (this._correctComment && this._correctComment.length > 0) {
            for (var i = 0; i < this._correctComment.length; i++) {
                if (this._correctComment[i]) {
                    flg = 0;
                    var item = new businesscomponents.previewandreports.CommentItem();
                    item.setHtml(this._correctComment[i]);
                    this.$_ctnCorrectComment.append(item.getElement());
                }
                
            }
        }
        //判断是否有机批
        if (this._renderModel == 0) {
            //如果是仅有人批，至此结束
            // 隐藏黑线
//            this.$_splitline.hide();
            return;
        }
        // 显示黑线
        if (flg == 0)
        {
        this.$_splitline.show();
    }
        //渲染机批
        if (this._autoCorrectComment && this._autoCorrectComment.length > 0) {
            for (var i = 0; i < this._autoCorrectComment.length; i++) {
                var item = new businesscomponents.previewandreports.CommentItem();
                item.setHtml(this._autoCorrectComment[i]);
                this.$_ctnAutoCorrectComment.append(item.getElement());
            }
        }
    }

});
businesscomponents.previewandreports.CorrectZone.html =
     ' <div class="ReportNewSBox3S clearfix">' +
        '<div class="ReportNewSBox3L">' +
            '<div class="ReportNewSScore" gi="ctnScore">4.5</div>' +
        '</div>' +
        '<div class="ReportNewSBox3R">' +
            '<ul class="ReportCList2" gi="ctnCorrectComment"></ul>' +
            '<div class="ReportCHR2" gi="splitline" style="display:none"><!--分割线--></div>' +
            '<ul class="ReportCList2" gi="ctnAutoCorrectComment"></ul>' +
        '</div>' +
    '</div>';

//评语项
businesscomponents.previewandreports.CommentItem = function (opt_html) {
    businesscomponents.previewandreports.CommentItem.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.CommentItem.html)[0]);
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.CommentItem, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.CommentItem, {
    setHtml: function (html) {
        html = html.replace(/</g, "&lt;");
        html = html.replace(/>/g, "&gt;");

        html = html.replace(/ /g, "&nbsp;");
        html = html.replace(/\b&nbsp;/g, " ");
        html = html.replace(/\r\n|\r|\n/g, "<br>");
        $(this._element).html(html);
    }

});
businesscomponents.previewandreports.CommentItem.html = '<li></li>';
