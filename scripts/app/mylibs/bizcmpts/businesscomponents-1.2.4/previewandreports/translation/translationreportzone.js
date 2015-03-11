var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.translationReportZone = businesscomponents.previewandreports.translationReportZone || {};

businesscomponents.previewandreports.translationReportZone = function (opt_html) {
    businesscomponents.previewandreports.translationReportZone.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.translationReportZone.html)[0]);
    //    this._title = $(this._element).find('[gi~="title"]')[0];
    this._titlectn = new businesscomponents.previewandreports.TitlesHorizontalZone();
    this._titlectn.replaceTo($(this._element).find('[gi~="title"]')[0]);
    this._answerctn = new businesscomponents.previewandreports.TitlesHorizontalZone();
    this._answerctn.replaceTo($(this._element).find('[gi~="answer"]')[0]);
    this._suggestAnswerctn = new businesscomponents.previewandreports.TitlesHorizontalZone();
    this._suggestAnswerctn.replaceTo($(this._element).find('[gi~="suggestAnswer"]')[0]);
    this._correctCtn = $(this._element).find('[gi~="correct"]')[0];
    this._correctTitleCtn = $(this._element).find('[gi~="correctTitle"]')[0];

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.translationReportZone, toot.view.Item);
toot.extendClass(businesscomponents.previewandreports.translationReportZone, {
    _init_manageEvents: function () {
        businesscomponents.previewandreports.translationReportZone.superClass._init_manageEvents.call(this);
    },
    _render: function () {
        businesscomponents.previewandreports.translationReportZone.superClass._render.call(this);
    },
    updateUIByModel: function () {
        if (!this._model) {
            return;
        }
        //题目
        this._titlectn.setTitle("题目");
        this._titlectn.setContent(this._model.getQuestion().getOriginal());
        //学生答案
        if (this._model.getAnswer()) {
            this._answerctn.setTitle("学生回答");
            this._answerctn.setContent(this._model.getAnswer());
        }

        //标准答案
        if (this._model.getQuestion().getSuggestedAnswer()) {
            this._suggestAnswerctn.setTitle("标准答案");
            this._suggestAnswerctn.setContentClass("RightTipsbox4");
            this._suggestAnswerctn.setContent(this._model.getQuestion().getSuggestedAnswer());
        }

        //批改评分
        if (this._model.getCorrect()) {
            var correctTitle = new businesscomponents.previewandreports.Title();
            correctTitle.setTitle("评分");
            correctTitle.appendTo(this._correctTitleCtn);
            var commentTitle = new businesscomponents.previewandreports.Title();
            commentTitle.setTitle("评语");
            commentTitle.appendTo(this._correctTitleCtn);
            var correctzone = new businesscomponents.previewandreports.CorrectZone();
            correctzone.setRenderModel(0);
            correctzone.setScore(this._model.getCorrect()._score);
            correctzone.setCorrectComment([this._model.getCorrect()._comment]);
            correctzone.render();
            correctzone.appendTo(this._correctCtn);
        }

    }

});

businesscomponents.previewandreports.translationReportZone.html =
            '<div class="ReportNewSBox1">' +
                 '<div class="ReportNewSBox2 clearfix" gi="title"></div>' +
                 '<div class="ReportNewSBox2 clearfix" gi="answer"></div>' +
                 '<div class="ReportNewSBox2 clearfix" gi="suggestAnswer"></div>' +
                 '<div class="ReportNewSBox1" gi="correct">' +
                        '<div class="ReportNewSBox2 clearfix" gi="correctTitle"></div>' +
                 '</div>' +
            '<div>';