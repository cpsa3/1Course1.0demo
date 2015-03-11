
var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.translationquestion = businesscomponents.previewandreports.translationquestion || {};

businesscomponents.previewandreports.translationquestion.Question = function (opt_html) {
    businesscomponents.previewandreports.translationquestion.Question.superClass.constructor.call(this,
        $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.translationquestion.Question.html)[0]);
    this._lblIndex = new toot.ui.Label($(this._element).find('[gi~="lblIndex"]')[0]);
    this._lblIndex.setVisible(false);
    // this._$content = $(this._element).find('[gi~="content"]');
    this._content = new businesscomponents.previewandreports.TextMarker();
    this._content.replaceTo($(this._element).find('[gi~="content"]')[0]);
    //    this._lblAnswer = new toot.ui.Label($(this._element).find('[gi~="lblAnswer"]')[0]);
    this._lblAnswer = new businesscomponents.previewandreports.TextMarker();
    this._lblAnswer.setMode(20);
    this._lblAnswer.replaceTo($(this._element).find('[gi~="lblAnswer"]')[0]);
    this._tzNoAnswer = new businesscomponents.previewandreports.TextZoon();
    this._tzNoAnswer.replaceTo($(this._element).find('[gi~="noAnswer"]')[0]);
    this._tzNoAnswer.setText('<div class="WrongTipsbox3 clearfix"><em></em><div class="fl">未作答！</div></div>');
    //this._$suggestedAnswer = $(this._element).find('[gi~="suggestedAnswer"]');
    this._suggestedAnswer = new businesscomponents.previewandreports.TextMarker();
    $(this._suggestedAnswer.getMarker().getElement()).addClass('ReportNewTrAbox2');
    this._suggestedAnswer.replaceTo($(this._element).find('[gi~="suggestedAnswer"]')[0]);

    this._lblScore = new toot.ui.Label($(this._element).find('[gi~="lblScore"]')[0]);
    this._lblComment = new toot.ui.Label($(this._element).find('[gi~="lblComment"]')[0]);
    this._lblCommentTitle = new toot.ui.Label($(this._element).find('[gi~="lblCommentTitle"]')[0]);
    this._lblCommentTitle.setText("评语");
    this._$correct = $(this._element).find('[gi~="correct"]');
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.translationquestion.Question, toot.view.Item);
toot.extendClass(businesscomponents.previewandreports.translationquestion.Question, {
    //    updateUIByIdx: function () {
    //        this._lblIndex.setText(this._idx + 1);
    //    },
    updateUIByModel: function () {
        if (this._model && this._model.getChannelQ()) {
            this._content.setModelAndUpdateUI(this._model.getChannelQ().getContent());
            //            this._$content.html(this._model.getChannelQ().getContent());
        } else {
            this._content.setModelAndUpdateUI(null);
            //   this._$content.html(null);
        }

        if (this._model && this._model.getRenderingType() != models.previewandreports.RenderingType.Preview) {
            if (this._model.getChannelA()) {
                this._lblAnswer.setVisible(true);
                this._tzNoAnswer.setVisible(false);
                //                this._lblAnswer.setText(this._model.getChannelA());
                this._lblAnswer.setModelAndUpdateUI(this._model.getChannelA());
            } else {
                this._lblAnswer.setVisible(false);
                this._tzNoAnswer.setVisible(true);
                // this._lblAnswer.setText(null);
                this._lblAnswer.setModelAndUpdateUI(null);
            }
        } else {
            this._lblAnswer.setVisible(false);
            this._tzNoAnswer.setVisible(false);
            // this._lblAnswer.setText(null);
            this._lblAnswer.setModelAndUpdateUI(null);
        }

        if (this._model && this._model.getChannelQ() && this._model.getRenderingType() != models.previewandreports.RenderingType.Preview) {
            if (this._model.getChannelQ().getSuggestedAnswer()) {
                //                this._$suggestedAnswer.html(this._model.getChannelQ().getSuggestedAnswer());
                //                this._$suggestedAnswer.show();
                this._suggestedAnswer.setModelAndUpdateUI(this._model.getChannelQ().getSuggestedAnswer());
                this._suggestedAnswer.setVisible(true);
            }
            else {
                //                this._$suggestedAnswer.html(null);
                //                this._$suggestedAnswer.hide();
                this._suggestedAnswer.setModelAndUpdateUI(null);
                this._suggestedAnswer.setVisible(false);
            }
        } else {
            this._suggestedAnswer.setModelAndUpdateUI(null);
            this._suggestedAnswer.setVisible(false);
            //            this._$suggestedAnswer.html(null);
            //            this._$suggestedAnswer.hide();
        }

        if (this._model && this._model.getChannelUC() && this._model.getRenderingType() != models.previewandreports.RenderingType.Preview) {
            var score = this._model.getChannelUC().getScore();
            if (score == "Good" || score == "Fair" || score == "Limited" || score == "Weak") {
                this._lblScore.setVisible(true);
                this._lblScore.setText(score);
                switch (score) {
                    case "Good":
                        this._lblScore.getElement().className = "ReportNewTrATips TypeGood Patch";
                        break;
                    case "Fair":
                        this._lblScore.getElement().className = "ReportNewTrATips TypeFair Patch";
                        break;
                    case "Limited":
                        this._lblScore.getElement().className = "ReportNewTrATips TypeLimited Patch";
                        break;
                    case "Weak":
                        this._lblScore.getElement().className = "ReportNewTrATips TypeWeak Patch";
                        break;
                    default:
                        this._lblScore.getElement().className = "ReportNewTrATips TypeFair Patch";
                        break;
                }
            } else {
                this._lblScore.setVisible(true);
                this._lblScore.setText(score);
                this._lblScore.getElement().title = score;
                this._lblScore.getElement().className = "ReportNewTrATips TypeGood Patch";
            }
        } else {
            this._lblScore.setVisible(false);
        }

        if (this._model && this._model.getChannelUC() && this._model.getRenderingType() != models.previewandreports.RenderingType.Preview) {
            if (this._model.getChannelUC().getComment()) {
                this._lblComment.setVisible(true);
                this._lblComment.setText(this._model.getChannelUC().getComment());
                this._lblCommentTitle.setVisible(true);
            } else {
                this._lblComment.setVisible(false);
                this._lblComment.setText(this._model.getChannelUC().getComment());
                this._lblCommentTitle.setVisible(false);
            }
        } else {
            this._lblComment.setVisible(false);
            this._lblComment.setText(null);
        }

        if (this._model && this._model.getChannelUC() && this._model.getRenderingType() != models.previewandreports.RenderingType.Preview) {
            this._$correct.show();
        } else {
            this._$correct.hide();
        }

        if (this._model && this._model.getRenderingType() != models.previewandreports.RenderingType.Preview && (this._model.getChannelSM() || this._model.getChannelTM())) {

            var questionMarks = [];
            if (this._model.getChannelSM()) questionMarks.push({ marks: this._model.getChannelSM().Content, group: 0, userType: 10, editable: false, info: this._model.getChannelSM() });
            if (this._model.getChannelTM()) questionMarks.push({ marks: this._model.getChannelTM().Content.question, group: 0, userType: 20, editable: false, info: this._model.getChannelTM() });
            this._content.updateMarksByData(questionMarks);

            if (this._model.getChannelTM())
                this._suggestedAnswer.updateMarksByData({ marks: this._model.getChannelTM().Content.suggestedAnswer, group: 0, userType: 20, editable: false, info: this._model.getChannelTM() });

            if (this._model.getChannelTM())
                this._lblAnswer.updateMarksByData({ marks: this._model.getChannelTM().Content.answer, group: 0, userType: 20, editable: false, info: this._model.getChannelTM() });

        }


    }
});
businesscomponents.previewandreports.translationquestion.Question.html =
    '<div class="ReportNewAbox clearfix">' +
    '<span class="NumStyle" gi="lblIndex"></span>' +
    '<div class="AboxInner">' +
    '<div class="QboxInner RichTextEditor" gi="content">' +
    '</div>' +
    '<div class="ReportNewTrAbox1" gi="lblAnswer">' +
    '</div>' +
    '<div gi="noAnswer"></div>' +
    '<div class="ReportNewTrAbox2 RichTextEditor" gi="suggestedAnswer">' +
    '</div>' +
    '<div class="ReportNewTrAbox3 clearfix" gi="correct">' +
    '<span class="ReportNewTrATips TypeGood" gi="lblScore"> </span> <span class="ReportNewTrAText1" gi="lblCommentTitle">' +
    '评语：</span>' +
    '<div class="ReportNewTrAText2" gi="lblComment">' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';


businesscomponents.previewandreports.translationquestion.QuestionGroup = function (opt_html) {
    businesscomponents.previewandreports.translationquestion.QuestionGroup.superClass.constructor.call(this,
        $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.translationquestion.QuestionGroup.html)[0]);
    this._$title = $(this._element).find('[gi~="title"]');
    this._listQuestions = new toot.view.List(this._element, this._element,
        businesscomponents.previewandreports.translationquestion.Question, models.core.RenderingItem,
        $(this._element).find('[gi~="nonItem"]').toArray());
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.translationquestion.QuestionGroup, toot.view.Item);
toot.extendClass(businesscomponents.previewandreports.translationquestion.QuestionGroup, {
    updateUIByModel: function () {
        if (this._model && this._model.getChannelQ()) {
            this._$title.html(this._model.getChannelQ().getTitle());
        } else {
            this._$title.html(null);
        }

        if (this._model && this._model.getChannelQ() && this._model.getChannelQ().getQuestions()) {
            var items = [];
            //是否题组打分
            if (this._model.getChannelUC() && this._model.getChannelUC().getCorrectItems()) {
                var isQuestionGroupMark = (this.getModel().getChannelQ().getQuestions().length != this.getModel().getChannelUC().getCorrectItems().length);
            }
            for (var i = 0, l = this._model.getChannelQ().getQuestions().length; i < l; i++) {
                var item = new models.previewandreports.RenderingItem();
                item.setRenderingType(this._model.getRenderingType());
                item.setChannelQ(this._model.getChannelQ().getQuestions()[i]);
                item.setChannelA(
                    (this._model.getChannelA() && this._model.getChannelA().getAnswers() && this._model.getChannelA().getAnswers()[i]) ?
                    this._model.getChannelA().getAnswers()[i] : null);
                if (isQuestionGroupMark) {
                    if (i == this.getModel().getChannelQ().getQuestions().length - 1) {
                        item.setChannelUC((this._model.getChannelUC() && this._model.getChannelUC().getCorrectItems() && this._model.getChannelUC().getCorrectItems()[0]) ?
                            this._model.getChannelUC().getCorrectItems()[0] : null);
                    }
                } else {
                    item.setChannelUC((this._model.getChannelUC() && this._model.getChannelUC().getCorrectItems() && this._model.getChannelUC().getCorrectItems()[i]) ?
                        this._model.getChannelUC().getCorrectItems()[i] : null);
                }

                if (this._model.getChannelSM()) {
                    item.setChannelSM((function (mark) {
                        var o = {};
                        for (var p in mark) { o[p] = mark[p]; }
                        o.Content = mark.Content[i];
                        return o;
                    })(this._model.getChannelSM()));
                }
                //                item.setChannelSM(this._model.getChannelSM()[i]);
                if (this._model.getChannelTM()) {
                    item.setChannelTM((function (mark) {
                        var o = {};
                        for (var p in mark) { o[p] = mark[p]; }
                        o.Content = mark.Content[i];
                        return o;
                    })(this._model.getChannelTM()));
                }
                //                item.setChannelTM(this._model.getChannelTM()[i]);

                items.push(item);
            }
            this._listQuestions.setModelAndUpdateUI(items);
        } else {
            this._listQuestions.setModelAndUpdateUI(null);
        }
    }
});
businesscomponents.previewandreports.translationquestion.QuestionGroup.html =
    '<div class="ReportNewAboxOuter marB20">' +
    '<div class="ReportNewQboxinner" gi="nonItem">' +
    '<div class="RichTextEditor" gi="title">' +
    '</div>' +
    '</div>' +
//                              '<div gi="listQuestions">' +
//                              '</div>' +
    '</div>';