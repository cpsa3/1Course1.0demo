
var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.judgequestion = businesscomponents.previewandreports.judgequestion || {};
//错误提示信息
businesscomponents.previewandreports.judgequestion.WrongTips = function (opt_html) {
    businesscomponents.previewandreports.judgequestion.WrongTips.superClass.constructor.call(this,
               $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.judgequestion.WrongTips.html)[0]);
    this._rightAnswer = new toot.ui.Label($(this._element).find('[gi~="rightAnswer"]')[0]);
    this._title = new toot.ui.Label($(this._element).find('[gi~="title"]')[0]);
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.previewandreports.judgequestion.WrongTips, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.judgequestion.WrongTips, {
    //1表示正确，0表示错误，2表示未作答
    setRightOrWorng: function (flg) {
        if (flg == 0) {
            $(this._element).removeClass("WrongTipsbox3").addClass("RightTipsbox3");
            this._title.setText("回答正确！");
        }
        else if (flg == 1) {
            $(this._element).removeClass("RightTipsbox3").addClass("WrongTipsbox3");
            this._title.setText("回答错误！正确答案：");
        }
        else if (flg == 2) {
          $(this._element).removeClass("RightTipsbox3").addClass("WrongTipsbox3");
            this._title.setText("未作答！正确答案：");
        }

    },
    setRightAnswer: function (rightAnswer) {
        this._rightAnswer.setText(rightAnswer);
    }
});


businesscomponents.previewandreports.judgequestion.WrongTips.html =
                        ' <div class="WrongTipsbox3 clearfix">' +
                            '<em></em>' +
                            '<div class="fl"><span gi="title"></span>' +
                                '<span class="fontb" gi="rightAnswer"></span>' +
                            '</div>' +
                         '</div>';
//题目
businesscomponents.previewandreports.judgequestion.Question = function (opt_html) {
    businesscomponents.previewandreports.judgequestion.Question.superClass.constructor.call(this,
               $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.judgequestion.Question.html)[0]);

    this._lblTitle = new toot.ui.Label($(this._element).find('[gi~="title"]')[0]);
    this._lbluserAnswer = new toot.ui.Label($(this._element).find('[gi~="userAnswer"]')[0]);
    this._wrongTips = new businesscomponents.previewandreports.judgequestion.WrongTips();
    this._wrongTips.replaceTo($(this._element).find('[gi~="WrongTips"]')[0]);
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.previewandreports.judgequestion.Question, toot.view.Item);
toot.extendClass(businesscomponents.previewandreports.judgequestion.Question, {
    updateUIByModel: function () {
        //UI遍历为第一层逻辑
        if (this._model) {
            if (this._model && this._model.getChannelQ())
                $(this._lblTitle.getElement()).html(this._model.getChannelQ().getTitle());
            else
                $(this._lblTitle.getElement()).html(null);

            //            var questionAndResponse = new businesscomponents.judgequestion.model.QuestionAndResponse();
            //            questionAndResponse.setRequest(this._model.getChannelQ());
            //            questionAndResponse.setResponse(this._model.getChannelA());
            var req = this._model.getChannelQ();
            //如果是Task预览将不做答案渲染
            if (this._model.getRenderingType() == models.previewandreports.RenderingType.Preview) {
                //隐藏错误提示信息
                this._wrongTips.setVisible(false);
                return false;
            }
            var res = this._model.getChannelA();
            this._wrongTips.setVisible(true);
            this.updateUIHandle(req, res);

        }
        else {
            $(this._lblTitle.getElement()).html(null);
            this._lbluserAnswer.setText("");
            this._wrongTips.setVisible(false);
        }
    },
    updateUIHandle: function (req, res) {
        //没有答案不做渲染
        if (!res) {
            this._lbluserAnswer.setText("未作答");
            $(this._lbluserAnswer.getElement()).attr("title", "未作答"); //设置title属性的值
            $(this._lbluserAnswer.getElement()).removeClass("AnswerStyle1_1").addClass("AnswerStyle1_2");
            this._wrongTips.setRightOrWorng(2);
            this._wrongTips.setRightAnswer(rightAnswer);
            return;
        }
        var rightAnswer = "";
        var userAnswer = "";

        var temp = [['True', 'False', 'Not Given'], ['Yes', 'No', 'Not Given'], ['T', 'F', 'NG'], ['Y', 'N', 'NG']];
        var _tempIndex = req.getTempIndex();

        if (req.getChoices()) {
            for (var i = 0, l = req.getChoices().length; i < l; i++) {
                if (req.getChoices()[i].isInAnswer()) {
                    rightAnswer += temp[_tempIndex][i];
                }
            }
        }

        if (res.getChoiceResponses()) {
            for (var i = 0, l = res.getChoiceResponses().length; i < l; i++) {
                if (res.getChoiceResponses()[i].isSelected()) {
                    userAnswer += temp[_tempIndex][i];
                }
            }
        }

        var hasAtLeastOneChoiceSelected = false;
        if (res.getChoiceResponses()) {
            for (var i = 0, l = res.getChoiceResponses().length; i < l; i++) {
                if (res.getChoiceResponses()[i].isSelected()) { hasAtLeastOneChoiceSelected = true; break; }
            }
        }

        if (!res.getChoiceResponses()) {
            this._lbluserAnswer.setText("未作答");
            $(this._lbluserAnswer.getElement()).attr("title", "未作答"); //设置title属性的值
            $(this._lbluserAnswer.getElement()).removeClass("AnswerStyle1_1").addClass("AnswerStyle1_2");
            this._wrongTips.setRightOrWorng(2);
            this._wrongTips.setRightAnswer(rightAnswer);
        }
        else {

            var isRight = true;
            for (var i = 0, l = req.getChoices().length; i < l; i++) {
                if (req.getChoices()[i].isInAnswer() != res.getChoiceResponses()[i].isSelected()) {
                    isRight = false;
                    break;
                }
            }

            if (!hasAtLeastOneChoiceSelected) {
                //错
                this._lbluserAnswer.setText("未作答");
                $(this._lbluserAnswer.getElement()).attr("title", "未作答"); //设置title属性的值
                $(this._lbluserAnswer.getElement()).removeClass("AnswerStyle1_1").addClass("AnswerStyle1_2");
                this._wrongTips.setRightOrWorng(2);
                this._wrongTips.setRightAnswer(rightAnswer);
            }
            //                else if (questionAndResponse.isRight()) {
            else if (isRight) {
                //对
                this._lbluserAnswer.setText(userAnswer);
                $(this._lbluserAnswer.getElement()).attr("title", userAnswer); //设置title属性的值
                $(this._lbluserAnswer.getElement()).removeClass("AnswerStyle1_2").addClass("AnswerStyle1_1");
                this._wrongTips.setRightOrWorng(0);
                //                    this._wrongTips.setRightAnswer(rightAnswer);
            }
            else {
                //错
                this._lbluserAnswer.setText(userAnswer);
                $(this._lbluserAnswer.getElement()).attr("title", userAnswer); //设置title属性的值
                $(this._lbluserAnswer.getElement()).removeClass("AnswerStyle1_1").addClass("AnswerStyle1_2");
                this._wrongTips.setRightOrWorng(1);
                this._wrongTips.setRightAnswer(rightAnswer);
            }
        }
    }
});
businesscomponents.previewandreports.judgequestion.Question.html =
                   '<div class="ReportNewAbox clearfix">' +
                      '<span class="NumStyle"></span>' +
                      '<div class="AboxInner">' +
                           '<div class="clearfix">' +
                                '<span class="RichTextEditor fl" gi="title"></span>' +
                                '<span class="AnswerStyle1_1 fl" title="T" gi="userAnswer">T</span>' +
                           '</div>' +
                        '<div gi="WrongTips"></div>' +
                   '</div>';
//题目组
businesscomponents.previewandreports.judgequestion.QuestionList = function (opt_html) {
    businesscomponents.previewandreports.judgequestion.QuestionList.superClass.constructor.call(this,
                       $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.judgequestion.QuestionList.html)[0], null,
                       businesscomponents.previewandreports.judgequestion.Question, models.previewandreports.RenderingItem, null);
    this._elementContainer = this._element;
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.previewandreports.judgequestion.QuestionList, toot.view.List);
businesscomponents.previewandreports.judgequestion.QuestionList.html = '<div></div>'

//题目
businesscomponents.previewandreports.judgequestion.QuestionGroup = function (opt_html) {
    businesscomponents.previewandreports.judgequestion.QuestionGroup.superClass.constructor.call(this,
               $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.judgequestion.QuestionGroup.html)[0]);
    this._lblTitle = $(this._element).find('[gi~="title"]');
    this._questionList = new businesscomponents.previewandreports.judgequestion.QuestionList();
    this._questionList.replaceTo($(this._element).find('[gi~="questionList"]')[0]);
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.previewandreports.judgequestion.QuestionGroup, toot.view.ViewBase);
toot.extendClass(businesscomponents.previewandreports.judgequestion.QuestionGroup, {
    updateUIByModel: function () {
        if (this._model && this._model.getChannelQ()) {
            this._lblTitle.html(this._model.getChannelQ().getTitle());
        }
        else {
            this._lblTitle.html(null);
        }

        var questions = [];
        if (this._model && this._model.getChannelQ()) {
            var questionsQ = this._model.getChannelQ().getQuestions();
            if (questionsQ) {
                for (var i = 0, l = questionsQ.length; i < l; i++) {
                    var question = new models.previewandreports.RenderingItem();
                    questionsQ[i].setTempIndex(this._model.getChannelQ().getTempIndex());
                    question.setRenderingType(this._model.getRenderingType());
                    question.setChannelQ(questionsQ[i]);
                    questions.push(question);
                }
            }
        }
        if (this._model && this._model.getChannelA()) {
            var questionsA = this._model.getChannelA().getQuestionResponses();
            if (questionsA) {
                for (var i = 0, l = questionsA.length; i < l; i++) {
                    questions[i].setChannelA(questionsA[i]);
                }
            }
        }
        this._questionList.setModelAndUpdateUI(questions);
    }
});
businesscomponents.previewandreports.judgequestion.QuestionGroup.html =
                   '<div class="ReportNewAboxOuter">' +
                      '<div class="ReportNewQboxinner" gi="title"></div>' +
                      '<div class="AboxInner"  gi="questionList"></div>' +
                   '</div>';

