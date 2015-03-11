
var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.choicequestion = businesscomponents.previewandreports.choicequestion || {};

businesscomponents.previewandreports.choicequestion.Choice = function (opt_html) {
    businesscomponents.previewandreports.choicequestion.Choice.superClass.constructor.call(this,
               $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.choicequestion.Choice.html)[0]);
    this._cbInAnswer = new businesscomponents.CheckBox();
    this._cbInAnswer.setDisable(true);
    this._cbInAnswer.replaceTo($(this._element).find('[gi~="anchorCBInAnswer"]')[0]);
    this._radioInAnswer = $(this._element).find('[gi~="radioAnswer"]')[0];
    this._lblTitle = new toot.ui.Label($(this._element).find('[gi~="lblTitle"]')[0]);
    this._lblContent = new toot.ui.Label($(this._element).find('[gi~="lblContent"]')[0]);
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.previewandreports.choicequestion.Choice, toot.view.Item);
toot.extendClass(businesscomponents.previewandreports.choicequestion.Choice, {
    updateUIByIdx: function () {
        //set title by the idx
        if (this._idx < 26)
            this._lblTitle.setText(String.fromCharCode(0x41 + this._idx));
        else
            this._lblTitle.setText(null);
    },

    updateUIByModel: function () {
        //UI遍历为第一层逻辑
        //        if (this._model && this._model.getChannelQ()) {
        //            //            this._lblTitle.setText(this._model.getChannelQ().getTitle());
        //        }
        //        else {
        //            this._lblTitle.setText(null);
        //        }

        if (this._model && this._model.getChannelQ()) {
            this._lblContent.setText(this._model.getChannelQ().getContent());
        }
        else {
            this._lblContent.setText(null);
        }

        if (this._model && this._model.getChannelA() && this._model.getRenderingType() != models.previewandreports.RenderingType.Preview) {
            //是radio
            if (this._radioMode) {
                $(this._radioInAnswer).show();
                this._cbInAnswer.setVisible(false);
                if (this._model.getChannelA().isSelected()) {
                    $(this._radioInAnswer).addClass("radioboxStyle2").removeClass("radioboxStyle");
                }
                else {
                    $(this._radioInAnswer).addClass("radioboxStyle").removeClass("radioboxStyle2");
                }


            }
            else {
                $(this._radioInAnswer).hide();
                this._cbInAnswer.setVisible(true);
                this._cbInAnswer.setChecked(this._model.getChannelA().isSelected());
            }


        }
        else {
            if (this._radioMode) {
                $(this._radioInAnswer).show();
                $(this._radioInAnswer).addClass("radioboxStyle").removeClass("radioboxStyle2");
                this._cbInAnswer.setVisible(false);
            }
            else {
                $(this._radioInAnswer).hide();
                this._cbInAnswer.setVisible(true);
            }
            //            this._cbInAnswer.setChecked(false);
        }
    },
    _radioMode: false,
    isRadioMode: function () {
        return this._radioMode;
    },
    setRadioMode: function (mode) {
        if (this._radioMode == mode) return;
        this._radioMode = mode;
    }

});
businesscomponents.previewandreports.choicequestion.Choice.html =
                        '<tr><td class="style1"><span gi="anchorCBInAnswer"></span><span gi="radioAnswer"></span><label gi="lblTitle"></label></td><td gi="lblContent"></td></tr>';



businesscomponents.previewandreports.choicequestion.ChoiceList = function (opt_html) {
    businesscomponents.previewandreports.choicequestion.ChoiceList.superClass.constructor.call(this,
                       $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.choicequestion.ChoiceList.html)[0], null,
                       businesscomponents.previewandreports.choicequestion.Choice, models.previewandreports.RenderingType, null);
    this._elementContainer = this._element;
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.previewandreports.choicequestion.ChoiceList, toot.view.List);
toot.extendClass(businesscomponents.previewandreports.choicequestion.ChoiceList, {
    _initializeItem: function () {
        var item = businesscomponents.previewandreports.choicequestion.ChoiceList.superClass._initializeItem.call(this);
        //radio mode
        item.setRadioMode(this._radioMode);
        return item;
    },
    updateUIByModel: function () {
        //判断是否单选
        this.initRadioMode();
        businesscomponents.previewandreports.choicequestion.ChoiceList.superClass.updateUIByModel.call(this);


    },
    _radioMode: false,
    initRadioMode: function () {
        this._inAnswerCount = 0;

        if (this.getModel()) {
            for (var i = 0; i < this.getModel().length; i++) {
                if (this.getModel()[i].getChannelQ().isInAnswer()) {
                    this._inAnswerCount++;
                }
            }

        }

        if (this._inAnswerCount > 1) {
            this._radioMode = false;
        } else {
            this._radioMode = true;
        }

    }
});

businesscomponents.previewandreports.choicequestion.ChoiceList.html = '<table border="0" cellpadding="0" cellspacing="0" class="clear"></table>';


businesscomponents.previewandreports.choicequestion.Question = function (opt_html) {
    businesscomponents.previewandreports.choicequestion.Question.superClass.constructor.call(this,
               $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.choicequestion.Question.html)[0]);
    this._lblIndex = new toot.ui.Label($(this._element).find('[gi~="lblIndex"]')[0]);
    this._$rtTitle = $(this._element).find('[gi~="rtTitle"]');
    this._choiceList = new businesscomponents.previewandreports.choicequestion.ChoiceList();
    this._choiceList.replaceTo($(this._element).find('[gi~="anchorChoiceList"]')[0]);
    this._$showJudgement = $(this._element).find('[gi~="showJudgement"]');
    this._lblJudgement = new toot.ui.Label($(this._element).find('[gi~="lblJudgement"]')[0]);
    //分析和评语
    this._txtAnalysis = new toot.ui.TextBox($(this._element).find('[gi~="txtAnalysis"]')[0]);
    this._txtComment = new toot.ui.TextBox($(this._element).find('[gi~="txtComment"]')[0]);
    //分析和评语默认都是隐藏的
    this._txtAnalysis.setVisible(false);
    this._txtComment.setVisible(false);
    this._isListenAgain = false;
    //判断这题是否正确
    this._isRight = false;
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.previewandreports.choicequestion.Question, toot.view.Item);
toot.extendClass(businesscomponents.previewandreports.choicequestion.Question, {
    _correct: true,
    isCorrect: function () {
        return this._correct;
    },

    setIsListenAgain: function () {
        this._isListenAgain = true;
    },
    updateUIByModel: function () {

        if (this._model && (this._model.getRenderingType() == models.previewandreports.RenderingType.Preview || this._model.getRenderingType() == models.previewandreports.RenderingType.WebReprot || this._model.getRenderingType() == models.previewandreports.RenderingType.PdfReport || this._model.getRenderingType() == models.previewandreports.RenderingType.DisplayFinish)) {
            //UI遍历为第一层逻辑
            if (this._model && this._model.getChannelQ())
            //如果是重听回答题后面加个小图标
                if (this._isListenAgain) {
                    this._$rtTitle.html(this._model.getChannelQ().getTitle());
                    this._$rtTitle.find("p").last().append(businesscomponents.previewandreports.choicequestion.Question.listenAgainHtml);
                } else {
                    this._$rtTitle.html(this._model.getChannelQ().getTitle());
                }
            else
                this._$rtTitle.html(null);

            var choices = [];
            if (this._model && this._model.getChannelQ()) {
                var choicesQ = this._model.getChannelQ().getChoices();
                if (choicesQ) {
                    for (var i = 0, l = choicesQ.length; i < l; i++) {
                        var choice = new models.previewandreports.RenderingItem();
                        choice.setRenderingType(this._model.getRenderingType());
                        choice.setChannelQ(choicesQ[i]);
                        choices.push(choice);
                    }
                }
            }
            if (this._model) {
                if (this._model.getChannelA()) {
                    var choicesA = this._model.getChannelA().getChoiceResponses();
                    if (choicesA) {
                        for (var i = 0, l = choicesA.length; i < l; i++) {
                            choices[i].setChannelA(choicesA[i]);
                        }
                    }
                }
                else {
                    for (var i = 0; i < choices.length; i++) {
                        choices[i].setChannelA(null);
                    }
                }
            }

            this._choiceList.setModelAndUpdateUI(choices);

            var isCorrect = null;
            var isNullChoice = true;
            var isNullAnswer = true;
            var rightAnswers = [];
            if (choices.length > 0 && this._model.getRenderingType() != models.previewandreports.RenderingType.Preview) {
                isCorrect = 1; //1表示正确，0表示错误，2表示未作答
                //没有任何答案
                for (var i = 0, l = choices.length; i < l; i++) {
                    if (choices[i].getChannelA()) {
                        isNullAnswer = false;
                        break;
                    }
                }
                //没有任何勾选
                for (var i = 0, l = choices.length; i < l; i++) {
                    if (choices[i].getChannelA()) {
                        if (choices[i].getChannelA().isSelected()) {
                            isNullChoice = false;
                            break;
                        }
                    }
                }

                for (var i = 0, l = choices.length; i < l; i++) {
                    if (choices[i].getChannelQ().isInAnswer()) {
                        rightAnswers.push(String.fromCharCode(0x41 + i));
                    }
                    if (choices[i].getChannelQ()) {
                        if (choices[i].getChannelA()) {
                            if (choices[i].getChannelQ().isInAnswer() != choices[i].getChannelA().isSelected())
                                isCorrect = 0;
                        }
                    }
                }
            }

            if (isCorrect == null) {
                this._$showJudgement.hide();
                return;
            }
            else if (isCorrect == 1) {
                this._$showJudgement.show();
                this._$showJudgement.addClass("RightTipsbox3").removeClass("WrongTipsbox3");
                this._lblJudgement.setText("回答正确！正确答案：" + rightAnswers.join(" "));
            }
            else if (isCorrect == 0) {
                this._$showJudgement.show();
                this._$showJudgement.addClass("WrongTipsbox3").removeClass("RightTipsbox3");
                this._lblJudgement.setText("回答错误！正确答案：" + rightAnswers.join(" "));
            }
            else {
                this._$showJudgement.show();
                this._$showJudgement.addClass("WrongTipsbox3").removeClass("RightTipsbox3");
                this._lblJudgement.setText("未作答！正确答案：" + rightAnswers.join(" "));
            }
            //一题都没勾选
            if (isNullChoice) {
                this._$showJudgement.show();
                this._$showJudgement.addClass("WrongTipsbox3").removeClass("RightTipsbox3");
                this._lblJudgement.setText("未作答！正确答案：" + rightAnswers.join(" "));
                return;
            }
            //没有答案项
            if (isNullAnswer) {
                this._$showJudgement.show();
                this._$showJudgement.addClass("WrongTipsbox3").removeClass("RightTipsbox3");
                this._lblJudgement.setText("未作答！正确答案：" + rightAnswers.join(" "));
                return;
            }
        }

        else if (this._model && this._model.getRenderingType() == models.previewandreports.RenderingType.StudentAnalysis) {
            //显示评语
            this._txtAnalysis.setVisible(true);
            this._renderAnswer();
        }
        else if (this._model && this._model.getRenderingType() == models.previewandreports.RenderingType.StudentView) {
            //显示评语
            this._txtAnalysis.setVisible(true);
            this._txtComment.setVisible(true);
            this._renderAnswer();
        }
        else if (this._model && this._model.getRenderingType() == models.previewandreports.RenderingType.TeacherAnalysisView) {
            //显示评语
            this._txtAnalysis.setVisible(true);
            this._txtComment.setVisible(true);
            this._renderAnswer();
        }

    },
    updateModelByUI: function () {
        var model = this._model || new models.previewandreports.RenderingItem()
        model.setChannelSA(this.getAnalysis());
        model.setChannelTA(this.getComment());
        return model;
    },
    //获取分析内容
    getAnalysis: function () {
        return this._txtAnalysis.getValue();
    },
    //获取评语内容
    getComment: function () {
        return this._txtComment.getValue();
    },
    //渲染答案:注：给批注和分析使用，为了尽最大程度的不影响原来逻辑，单独冗余一份
    _renderAnswer: function () {
        //渲染批注

        if (this._model && (this._model.getRenderingType() == models.previewandreports.RenderingType.StudentView || this._model.getRenderingType() == models.previewandreports.RenderingType.TeacherAnalysisView)) {
            this._txtAnalysis.setValue(this._model.getChannelSA() == "" ? "无" : this._model.getChannelSA());
            $(this._txtAnalysis.getElement()).addClass("ReporStudentextarea");
            $(this._txtAnalysis.getElement()).attr("disabled", true);
            if (this._model.getRenderingType() == models.previewandreports.RenderingType.TeacherAnalysisView) {
                this._txtComment.setValue(this._model.getChannelTA());
            }
            else {
                if (!this._model.getChannelTA()) {
                    this._txtComment.setVisible(false);
                } 
                else {
                    //this._txtComment.setValue(!this._model.getChannelTA() ? "等待老师批改" : this._model.getChannelTA());
                    this._txtComment.setValue(this._model.getChannelTA());
                    $(this._txtComment.getElement()).addClass("ReporStudentextarea");
                    $(this._txtComment.getElement()).attr("disabled", true);
                }
                
            }
        }
        //渲染答案
        if (this._model && this._model.getChannelQ())
        //如果是重听回答题后面加个小图标
            if (this._isListenAgain) {
                this._$rtTitle.html(this._model.getChannelQ().getTitle());
                this._$rtTitle.find("p").last().append(businesscomponents.previewandreports.choicequestion.Question.listenAgainHtml);
            } else {
                this._$rtTitle.html(this._model.getChannelQ().getTitle());
            }
        else
            this._$rtTitle.html(null);

        var choices = [];
        if (this._model && this._model.getChannelQ()) {
            var choicesQ = this._model.getChannelQ().getChoices();
            if (choicesQ) {
                for (var i = 0, l = choicesQ.length; i < l; i++) {
                    var choice = new models.previewandreports.RenderingItem();
                    choice.setRenderingType(this._model.getRenderingType());
                    choice.setChannelQ(choicesQ[i]);
                    choices.push(choice);
                }
            }
        }
        if (this._model) {
            if (this._model.getChannelA()) {
                var choicesA = this._model.getChannelA().getChoiceResponses();
                if (choicesA) {
                    for (var i = 0, l = choicesA.length; i < l; i++) {
                        choices[i].setChannelA(choicesA[i]);
                    }
                }
            }
            else {
                for (var i = 0; i < choices.length; i++) {
                    choices[i].setChannelA(null);
                }
            }
        }

        this._choiceList.setModelAndUpdateUI(choices);

        var isCorrect = null;
        var isNullChoice = true;
        var isNullAnswer = true;
        var rightAnswers = [];
        if (choices.length > 0) {
            isCorrect = 1; //1表示正确，0表示错误，2表示未作答
            //没有任何答案
            for (var i = 0, l = choices.length; i < l; i++) {
                if (choices[i].getChannelA()) {
                    isNullAnswer = false;
                    break;
                }
            }
            //没有任何勾选
            for (var i = 0, l = choices.length; i < l; i++) {
                if (choices[i].getChannelA()) {
                    if (choices[i].getChannelA().isSelected()) {
                        isNullChoice = false;
                        break;
                    }
                }
            }

            for (var i = 0, l = choices.length; i < l; i++) {
                if (choices[i].getChannelQ().isInAnswer()) {
                    rightAnswers.push(String.fromCharCode(0x41 + i));
                }
                if (choices[i].getChannelQ()) {
                    if (choices[i].getChannelA()) {
                        if (choices[i].getChannelQ().isInAnswer() != choices[i].getChannelA().isSelected())
                            isCorrect = 0;
                    }
                }
            }
        }

        if (isCorrect == null) {
            this._$showJudgement.hide();
            return;
        }
        else if (isCorrect == 1) {
            this._$showJudgement.show();
            this._$showJudgement.addClass("RightTipsbox3").removeClass("WrongTipsbox3");
            if (this._model.getRenderingType() == models.previewandreports.RenderingType.StudentView || this._model.getRenderingType() == models.previewandreports.RenderingType.TeacherAnalysisView) {
                 this._lblJudgement.setText("回答正确！正确答案：" + rightAnswers.join(" "));
            } 
            else {
                 this._lblJudgement.setText("回答正确！");
            }          
            this._isRight = true;
        }
        else if (isCorrect == 0) {
            this._$showJudgement.show();
            this._$showJudgement.addClass("WrongTipsbox3").removeClass("RightTipsbox3");
            if (this._model.getRenderingType() == models.previewandreports.RenderingType.StudentView || this._model.getRenderingType() == models.previewandreports.RenderingType.TeacherAnalysisView) {
                  this._lblJudgement.setText("回答错误！正确答案：" + rightAnswers.join(" "));
            }
            else {
                  this._lblJudgement.setText("回答错误！");
            }               
            this._isRight = false;
        }
        else {
            this._$showJudgement.show();
            this._$showJudgement.addClass("WrongTipsbox3").removeClass("RightTipsbox3");
            if (this._model.getRenderingType() == models.previewandreports.RenderingType.StudentView || this._model.getRenderingType() == models.previewandreports.RenderingType.TeacherAnalysisView) {
                 this._lblJudgement.setText("未作答！正确答案：" + rightAnswers.join(" "));
            }
            else {
                 this._lblJudgement.setText("未作答！");
            }      
            this._isRight = false;
        }
        //一题都没勾选
        if (isNullChoice) {
            this._$showJudgement.show();
            this._$showJudgement.addClass("WrongTipsbox3").removeClass("RightTipsbox3");
            if (this._model.getRenderingType() == models.previewandreports.RenderingType.StudentView || this._model.getRenderingType() == models.previewandreports.RenderingType.TeacherAnalysisView) {
                 this._lblJudgement.setText("未作答！正确答案：" + rightAnswers.join(" "));
            }
            else {
                 this._lblJudgement.setText("未作答！");
            }      
            this._isRight = false;
            return;
        }
        //没有答案项
        if (isNullAnswer) {
            this._$showJudgement.show();
            this._$showJudgement.addClass("WrongTipsbox3").removeClass("RightTipsbox3");
            if (this._model.getRenderingType() == models.previewandreports.RenderingType.StudentView || this._model.getRenderingType() == models.previewandreports.RenderingType.TeacherAnalysisView) {
                 this._lblJudgement.setText("未作答！正确答案：" + rightAnswers.join(" "));
            }
            else {
                 this._lblJudgement.setText("未作答！");
            }      
            this._isRight = false;
            return;
        }
    },
    //验证
    Validate: function () {
        if (this._model.getRenderingType() == models.previewandreports.RenderingType.StudentAnalysis) {

            if (!this._isRight) {
                if (this.getAnalysis().trim() == "") {

                    return false;
                }
            }
        }
        return true;
    }
});

businesscomponents.previewandreports.choicequestion.Question.listenAgainHtml = '<span class="ReportLRepeatIcon" title="重听回答题"></span>'

businesscomponents.previewandreports.choicequestion.Question.html =
                  '<div class="ReportNewAbox clearfix">' +
                    '<span class="NumStyle" gi="lblIndex"></span>' +
                    '<div class="AboxInner">' +
                      '<div class="QboxInner RichTextEditor" gi="rtTitle"></div>' +
                      '<table gi="anchorChoiceList"></table>' +
                      '<div class="RightTipsbox3 clearfix" gi="showJudgement"><em></em><div class="fl" gi="lblJudgement"></div></div>' +
                      '<textarea class="Reportextarea" placeholder="请输入分析" gi="txtAnalysis" ></textarea>' +
                      '<textarea class="Reportextarea" placeholder="请输入评语" gi="txtComment"></textarea>' +
                    '</div>' +
                  '';


businesscomponents.previewandreports.choicequestion.QuestionList = function (opt_html) {
    businesscomponents.previewandreports.choicequestion.QuestionList.superClass.constructor.call(this,
                       $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.choicequestion.QuestionList.html)[0], null,
                       businesscomponents.previewandreports.choicequestion.Question, models.previewandreports.RenderingItem, null);
    this._elementContainer = this._element;
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.previewandreports.choicequestion.QuestionList, toot.view.List);
businesscomponents.previewandreports.choicequestion.QuestionList.html = '<div></div>'


businesscomponents.previewandreports.choicequestion.QuestionGroup = function (opt_html) {
    businesscomponents.previewandreports.choicequestion.QuestionGroup.superClass.constructor.call(this,
                                   $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.choicequestion.QuestionGroup.html)[0]);
    this._$rtTitle = $(this._element).find('[gi~="rtTitle"]');
    this._questionList = new businesscomponents.previewandreports.choicequestion.QuestionList();
    this._questionList.replaceTo($(this._element).find('[gi~="anchorQuestionList"]')[0]);
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.previewandreports.choicequestion.QuestionGroup, toot.view.ViewBase);
toot.extendClass(businesscomponents.previewandreports.choicequestion.QuestionGroup, {
    updateUIByModel: function () {
        if (this._model && this._model.getChannelQ()) {
            this._$rtTitle.html(this._model.getChannelQ().getTitle());
        }
        else {
            this._$rtTitle.html(null);
        }

        var questions = [];
        if (this._model && this._model.getChannelQ()) {
            var questionsQ = this._model.getChannelQ().getQuestions();
            if (questionsQ) {
                for (var i = 0, l = questionsQ.length; i < l; i++) {
                    var question = new models.previewandreports.RenderingItem();
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
})
businesscomponents.previewandreports.choicequestion.QuestionGroup.html =
                                            '<div class="ReportNewAboxOuter">' +
                                              '<div class="ReportNewQboxinner"><div class="RichTextEditor" gi="rtTitle"></div></div>' +
                                              '<div gi="anchorQuestionList"></div>' +
                                            '</div>'

