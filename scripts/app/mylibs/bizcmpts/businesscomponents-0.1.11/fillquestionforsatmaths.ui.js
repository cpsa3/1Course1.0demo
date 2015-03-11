/*
* 功能:SAT语法句子挑错选择题 做题页面UI
*create by xiaobao
* 
*/


var businesscomponents = businesscomponents || {};

businesscomponents.fillquestionForSATMaths = businesscomponents.fillquestionForSATMaths || {};

businesscomponents.fillquestionForSATMaths.ui = {};



businesscomponents.fillquestionForSATMaths.ui.ChoiceMode = {
    Single: 1,
    Multi: 2
};

//display 
businesscomponents.fillquestionForSATMaths.ui.display = {};


//extendClass -> businesscomponents.ui.RnRItem  注入ChoiceList
//item
//
businesscomponents.fillquestionForSATMaths.ui.display.Item = function (opt_html) {
    businesscomponents.fillquestionForSATMaths.ui.display.Item.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.fillquestionForSATMaths.ui.display.Item.html)[0]);
    //4个答案
    this._btnAnswer1 = new toot.ui.Button($(this._element).find('[gi~="lblAnswer1"]')[0]);
    this._btnAnswer2 = new toot.ui.Button($(this._element).find('[gi~="lblAnswer2"]')[0]);
    this._btnAnswer3 = new toot.ui.Button($(this._element).find('[gi~="lblAnswer3"]')[0]);
    this._btnAnswer4 = new toot.ui.Button($(this._element).find('[gi~="lblAnswer4"]')[0]);
    //所有选项
    this._btnChoice1 = new toot.ui.Button($(this._element).find('[gi~="btnChoice1"]')[0]);
    this._btnChoice2 = new toot.ui.Button($(this._element).find('[gi~="btnChoice2"]')[0]);
    this._btnChoice3 = new toot.ui.Button($(this._element).find('[gi~="btnChoice3"]')[0]);
    this._btnChoice4 = new toot.ui.Button($(this._element).find('[gi~="btnChoice4"]')[0]);
    this._btnChoice5 = new toot.ui.Button($(this._element).find('[gi~="btnChoice5"]')[0]);
    this._btnChoice6 = new toot.ui.Button($(this._element).find('[gi~="btnChoice6"]')[0]);
    this._btnChoice7 = new toot.ui.Button($(this._element).find('[gi~="btnChoice7"]')[0]);
    this._btnChoice8 = new toot.ui.Button($(this._element).find('[gi~="btnChoice8"]')[0]);
    this._btnChoice9 = new toot.ui.Button($(this._element).find('[gi~="btnChoice9"]')[0]);
    this._btnChoice12 = new toot.ui.Button($(this._element).find('[gi~="btnChoice12"]')[0]);
    //10表示/，11表示点.，
    this._btnChoice10 = new toot.ui.Button($(this._element).find('[gi~="btnChoice10"]')[0]);
    this._btnChoice10.setEnabledStyleConfig({ disabled: "Itembox ItemboxDis", enabled: "Itembox" });
    this._btnChoice11 = new toot.ui.Button($(this._element).find('[gi~="btnChoice11"]')[0]);
    this._btnChoice11.setEnabledStyleConfig({ disabled: "Itembox ItemboxDis", enabled: "Itembox" });
    this._btnChoice0 = new toot.ui.Button($(this._element).find('[gi~="btnChoice0"]')[0]);
    this._btnChoice0.setEnabledStyleConfig({ disabled: "Itembox ItemboxDis", enabled: "Itembox" });
    //选项盘
    this._$ctnChoice = $($(this._element).find('[gi~="ctnChoice"]')[0]);
    this._$ctnChoice.hide();
    //答案区域
    this._$ctnAnswer = $($(this._element).find('[gi~="ctnAnswer"]')[0]);
    //删除按钮btnDel
    this._btnDel = new businesscomponents.editors.DelButton($(this._element).find('[gi~="btnDel"]')[0]);
    this._btnDel.setVisible(false);
    //当前答案
    this._currentAnswer = -1;
    this._answer = [];
    //if (this.constructor == arguments.callee) this._init();
    this._init_manageEvents();

};
toot.inherit(businesscomponents.fillquestionForSATMaths.ui.display.Item, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.fillquestionForSATMaths.ui.display.Item, {

    _init_manageEvents: function () {
   //     businesscomponents.fillquestionForSATMaths.ui.display.Item.superClass._init_manageEvents.call(this);
        //答案点击事件
        toot.connect([this._btnAnswer1, this._btnAnswer2, this._btnAnswer3, this._btnAnswer4], "action", this, this._answerChange);
        toot.connect([this._btnChoice1, this._btnChoice2, this._btnChoice3, this._btnChoice4, this._btnChoice5, this._btnChoice6, this._btnChoice7, this._btnChoice8, this._btnChoice9, this._btnChoice10, this._btnChoice11, this._btnChoice12, this._btnChoice0], "action", this, this._answerChoice);
    },
    _answerChange: function (sender) {
        if (sender == this._btnAnswer1) {
            this._renderCtnChoice(1, $(sender.getElement()).text());
            this._currentAnswer = 1;
        }
        else if (sender == this._btnAnswer2) {
            this._renderCtnChoice(2, $(sender.getElement()).text());
            this._currentAnswer = 2;
        }
        else if (sender == this._btnAnswer3) {
            this._renderCtnChoice(2, $(sender.getElement()).text());
            this._currentAnswer = 3;
        }

        else if (sender == this._btnAnswer4) {
            this._renderCtnChoice(3, $(sender.getElement()).text());
            this._currentAnswer = 4;
        }

    },
    _answerChoice: function (sender) {
        this._$ctnChoice.hide();
        var answer = $(sender.getElement()).text();
        switch (this._currentAnswer) {
            case 1:
                $(this._btnAnswer1.getElement()).text(answer);
                break;
            case 2:
                //相当于全部恢复
                $(this._btnAnswer2.getElement()).text(answer);
                break;
            case 3:
                $(this._btnAnswer3.getElement()).text(answer);
                break;
            case 4:
                $(this._btnAnswer4.getElement()).text(answer);
                break;
        }
        //        发出事件
      //  toot.fireEvent(this, "change");
        //去掉红框
        //        if ($(this._btnAnswer1.getElement()).text() || $(this._btnAnswer2.getElement()).text() || $(this._btnAnswer3.getElement()).text() || $(this._btnAnswer4.getElement()).text()) {
        //            if (this._$ctnAnswer.hasClass("boxError")) {
        //                this._$ctnAnswer.removeClass("boxError")
        //            }
        //        }
    },
    //1表示第一个答案，2表示2~3答案，3表示答案4
    _renderCtnChoice: function (number, answer) {
        this._$ctnChoice.show();
        this._btnChoice0.setEnabled(true);
        this._btnChoice10.setEnabled(true);
        this._btnChoice11.setEnabled(true);
        //先判断点击的是哪个按钮
        //10表示(/)，11表示点(.)，
        switch (number) {
            case 1:
                this._btnChoice0.setEnabled(false);
                this._btnChoice10.setEnabled(false);
                break;
            case 2:
                //相当于全部恢复
                break;
            case 3:
                this._btnChoice10.setEnabled(false);
                break;
        }
        //渲染原有答案
        //移除所有答案渲染
        $(this._btnChoice1.getElement()).removeClass("ItemboxCurrent");
        $(this._btnChoice2.getElement()).removeClass("ItemboxCurrent");
        $(this._btnChoice3.getElement()).removeClass("ItemboxCurrent");
        $(this._btnChoice4.getElement()).removeClass("ItemboxCurrent");
        $(this._btnChoice5.getElement()).removeClass("ItemboxCurrent");
        $(this._btnChoice6.getElement()).removeClass("ItemboxCurrent");
        $(this._btnChoice7.getElement()).removeClass("ItemboxCurrent");
        $(this._btnChoice8.getElement()).removeClass("ItemboxCurrent");
        $(this._btnChoice9.getElement()).removeClass("ItemboxCurrent");
        $(this._btnChoice10.getElement()).removeClass("ItemboxCurrent");
        $(this._btnChoice11.getElement()).removeClass("ItemboxCurrent");
        $(this._btnChoice0.getElement()).removeClass("ItemboxCurrent");
        switch (answer) {
            case "":
                $(this._btnChoice12.getElement()).addClass("ItemboxCurrent");
                break;
            case "1":
                $(this._btnChoice1.getElement()).addClass("ItemboxCurrent");
                break;
            case "2":
                $(this._btnChoice2.getElement()).addClass("ItemboxCurrent");
                break;
            case "3":
                $(this._btnChoice3.getElement()).addClass("ItemboxCurrent");
                break;
            case "4":
                $(this._btnChoice4.getElement()).addClass("ItemboxCurrent");
                break;
            case "5":
                $(this._btnChoice5.getElement()).addClass("ItemboxCurrent");
                break;
            case "6":
                $(this._btnChoice6.getElement()).addClass("ItemboxCurrent");
                break;
            case "7":
                $(this._btnChoice7.getElement()).addClass("ItemboxCurrent");
                break;
            case "8":
                $(this._btnChoice8.getElement()).addClass("ItemboxCurrent");
                break;
            case "9":
                $(this._btnChoice9.getElement()).addClass("ItemboxCurrent");
                break;
            case "10":
                $(this._btnChoice10.getElement()).addClass("ItemboxCurrent");
                break;
            case "11":
                $(this._btnChoice11.getElement()).addClass("ItemboxCurrent");
                break;
            case "0":
                $(this._btnChoice0.getElement()).addClass("ItemboxCurrent");
                break;
        }
    },

    _render: function () {
        businesscomponents.fillquestionForSATMaths.ui.display.Item.superClass._render.call(this);
        //        this._renderRadioMode();
    },

    updateUIByModel: function () {
        if (this._model && this._model.getResponse()) {
            $(this._btnAnswer1.getElement()).text(this._model.getResponse().getAnswer()[0]);
            $(this._btnAnswer2.getElement()).text(this._model.getResponse().getAnswer()[1]);
            $(this._btnAnswer3.getElement()).text(this._model.getResponse().getAnswer()[2]);
            $(this._btnAnswer4.getElement()).text(this._model.getResponse().getAnswer()[3]);
        }
        else {
            $(this._btnAnswer1.getElement()).text("");
            $(this._btnAnswer2.getElement()).text("");
            $(this._btnAnswer3.getElement()).text("");
            $(this._btnAnswer4.getElement()).text("");
        }
    },
    updateModelByUI: function () {
        this._setResponseModelIfNull(models.components.fillquestionforsatmaths.ItemResponse);
        var answer = [];
        answer.push($(this._btnAnswer1.getElement()).text());
        answer.push($(this._btnAnswer2.getElement()).text());
        answer.push($(this._btnAnswer3.getElement()).text());
        answer.push($(this._btnAnswer4.getElement()).text());
        this._answer = answer;
        this.getResponseModel().setAnswer(answer);

    },
    setValidationHightlighted: function (isSetValidationHightlighted) {
        if (isSetValidationHightlighted) {
            this._$ctnAnswer.addClass("boxError");
        }
        else {
            this._$ctnAnswer.removeClass("boxError");
        }

    },
    getBtnDel: function () { return this._btnDel },
    getAnswer: function () { return this._answer }
});

businesscomponents.fillquestionForSATMaths.ui.display.Item.html =
                                               '<div class="marB10 clearfix">' +
                                                 '<div class="fl taskSatAnswerShow" gi="ctnAnswer">' +
                                                    '<span class="Itembox" gi="lblAnswer1"></span>' +
                                                    '<span class="Itembox" gi="lblAnswer2"></span>' +
                                                    '<span class="Itembox" gi="lblAnswer3"></span>' +
                                                    '<span class="Itembox" gi="lblAnswer4"></span>' +
                                                    '<div class="taskSatAnswerChoose" gi="ctnChoice">' +
                                                        '<div class="fl box1">' +
                                                            '<span class="Itembox" gi="btnChoice1">1</span>' +
                                                            '<span class="Itembox" gi="btnChoice2">2</span>' +
                                                            '<span class="Itembox" gi="btnChoice3">3</span>' +
                                                            '<span class="Itembox" gi="btnChoice10">/</span>' +
                                                            '<span class="Itembox" gi="btnChoice4">4</span>' +
                                                            '<span class="Itembox" gi="btnChoice5">5</span>' +
                                                            '<span class="Itembox" gi="btnChoice6">6</span>' +
                                                            '<span class="Itembox" gi="btnChoice11">.</span>' +
                                                            '<span class="Itembox" gi="btnChoice7">7</span>' +
                                                            '<span class="Itembox" gi="btnChoice8">8</span>' +
                                                            '<span class="Itembox" gi="btnChoice9">9</span>' +
                                                            '<span class="Itembox" gi="btnChoice0">0</span>' +
                                                        '</div>' +
                                                        '<div class="fl box2">' +
                                                            '<span class="Itembox" gi="btnChoice12"></span>' +
                                                        '</div>' +
                                                    '</div>' +
                                                 '</div>' +
                                                 '<span class="fl closeItem3" gi="btnDel"></span>' +
                                               '</div>';



businesscomponents.fillquestionForSATMaths.ui.display.Question = function (opt_html) {
    businesscomponents.ui.RnRItem.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.fillquestionForSATMaths.ui.display.Question.HTML)[0]);


    //questionTitle -》选择题 题干
    this._questionTitle = $(this._element).find('[gi~="questionTitle"]').get(0);

    //ui.display.ChoiceList   
    this._choice = new businesscomponents.fillquestionForSATMaths.ui.display.Item();
    this._choice.replaceTo($(this._element).find('[gi~="choiceBox"]')[0]);


};


toot.inherit(businesscomponents.fillquestionForSATMaths.ui.display.Question, businesscomponents.ui.RnRItem);
//define event 
toot.defineEvent(businesscomponents.fillquestionForSATMaths.ui.display.Question, ["change", "beforeChange"]);
toot.extendClass(businesscomponents.fillquestionForSATMaths.ui.display.Question, {
    updateUIByModel: function () {
        if (!this.getRequestModel()) {
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;
        }
        this._choice.setModelAndUpdateUI(null);

        //渲染题干
        $(this._questionTitle).html(this.getRequestModel().getTitle());

        //        this.renderListenImgState();

        //        var choiceAndResponses = [];
        //        for (var i = 0, l = this.getRequestModel().getItems().length; i < l; i++) {
        var rnr = new businesscomponents.RequestAndResponse();
        rnr.setRequest(this._model.getRequest().getItems()[0]); //只需要一个渲染就可以
        if (this._model.getResponse())
            rnr.setResponse(this._model.getResponse().getItemResponses());
        //        choiceAndResponses.push(rnr);
        //        }


        //渲染dom
        this._choice.setModelAndUpdateUI(rnr);

        //        //判断，渲染单选题、多选题样式 如果是多选题，插入选项个数
        //        if (this._listChoice.getRadioMode()) {
        //            $(this._isAnswerTipsBox).hide();
        //        } else {
        //            //插入待选项个数
        //            $(this._isAnswerCount).text(this.getCountHasSelectedChoices());
        //            $(this._isAnswerTipsBox).show();
        //        }


    },
    updateModelByUI: function () {
        this._setResponseModelIfNull(models.components.fillquestionforsatmaths.QuestionResponse);
        //        var responses = [];
        //        for (var i = 0, l = this._choice.updateAndGetModelByUI().length; i < l; i++)
        //        responses.push(this._choice.updateAndGetModelByUI().getResponse());
        this.getResponseModel().setItemResponses(this._choice.updateAndGetModelByUI().getResponse());
    },

    getRightWrong: function () {
        if (!(this.getRequestModel() && this.getResponseModel()))
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        var q = new businesscomponents.fillquestionforsatmaths.model.QuestionAndResponse();
        q.setRequest(this.getRequestModel());
        q.setResponse(this.getResponseModel());
        return q.getRightWrong();
    },
    getChoiceList: function () {
        return this._listChoice;
    },
    //获取标准答案个数
    getCountHasSelectedChoices: function () {
        //调用choiceList中的get方法
        return this._listChoice.getInAnswerCount();
    },
    getContentBox: function () {
        return this._contentBox;
    },
    _listenImgState: false,
    setReplayListenChoice: function (replayListen) {
        this._listenImgState = replayListen;
        this.renderListenImgState();
    }
});
businesscomponents.fillquestionForSATMaths.ui.display.Question.HTML = '<li>' +
                                                                            '<div class="fontn marB15" ><div gi="questionTitle" class="MarkboxStyle"></div></div>' +
                                                                            '<div gi="choiceBox">' +

                                                                            '</div>' +
                                                                          '</li>';


businesscomponents.fillquestionForSATMaths.ui.display.QuestionGroup = function (opt_html) {

    businesscomponents.ui.BusinessComponentBase.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.fillquestionForSATMaths.ui.display.QuestionGroup.html)[0]);
    var _this = this;

    this._listQuestion = new businesscomponents.ui.List(this._element, this._element,
        businesscomponents.fillquestionForSATMaths.ui.display.Question, models.components.fillquestionforsatmaths.Question);


    this._parser.setRequest(models.components.fillquestionforsatmaths.QuestionGroup.parse);
    this._parser.setResponse(models.components.fillquestionforsatmaths.QuestionResponseGroup.parse);

    this._singleChoiceMode = false;
    this._choiceTitleVisible = true;

    //    //选择题题组 文本
    //    this._title = '';

};
toot.inherit(businesscomponents.fillquestionForSATMaths.ui.display.QuestionGroup, businesscomponents.ui.BusinessComponentBase);
//define event 
toot.defineEvent(businesscomponents.fillquestionForSATMaths.ui.display.QuestionGroup, ["change", "beforechange"]);

toot.extendClass(businesscomponents.fillquestionForSATMaths.ui.display.QuestionGroup, {
    updateUIByModel: function () {
        if (!this.getRequestModel())
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;


        //        this._rtdTitle.setHtml(this.getRequestModel().getTitle() || '');
        //        this._title = this.getRequestModel().getTitle() || '';
        var questionAndResponses = [];
        for (var i = 0, l = this.getRequestModel().getQuestions().length; i < l; i++) {
            var rnr = new businesscomponents.RequestAndResponse();
            rnr.setRequest(this.getRequestModel().getQuestions()[i]);
            if (this.getResponseModel())
                rnr.setResponse(this.getResponseModel().getQuestionResponses()[i]);
            questionAndResponses.push(rnr);
        }
        this._listQuestion.setModelAndUpdateUI(questionAndResponses);
    },
    updateModelByUI: function () {
        this._setResponseModelIfNull(models.components.fillquestionforsatmaths.QuestionResponseGroup);
        var responses = [];
        for (var i = 0, l = this._listQuestion.updateAndGetModelByUI().length; i < l; i++)
            responses.push(this._listQuestion.updateAndGetModelByUI()[i].getResponse());
        this.getResponseModel().setQuestionResponses(responses);
    },

    //    _generatorQuestion: function () {
    //        var uiQuestion = new businesscomponents.fillquestionForSATMaths.ui.display.Question();
    //        return uiQuestion;
    //    },

    //    isSingleChoiceMode: function () {
    //        return this._singleChoiceMode;
    //    },
    //    setSingleChoiceMode: function (open) {
    //        this._singleChoiceMode = open;
    //    },
    //    isChoiceTitleVisible: function () {
    //        return this._choiceTitleVisible;
    //    },
    //    //only sets the property, requires further ui refresh operations to update display
    //    setChoiceTitleVisible: function (visible) {
    //        this._choiceTitleVisible = visible;
    //    },

    getRightWrong: function () {
        if (!(this.getRequestModel() && this.getResponseModel()))
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        var questionGroupAndRespnose = new businesscomponents.fillquestionforsatmaths.model.QuestionGroupAndResponse();
        questionGroupAndRespnose.setRequest(this.getRequestModel());
        questionGroupAndRespnose.setResponse(this.getResponseModel());

        return questionGroupAndRespnose.getRightWrong();
    },
    //    getListQuestion: function () {
    //        return this._listQuestion;
    //    },
    //    getTitle: function () {
    //        return this._title;
    //    },
    //设置有序列表起始序号
    setStartAttr: function (start) {
        $(this._element).attr('start', start);
    }
});

businesscomponents.fillquestionForSATMaths.ui.display.QuestionGroup.html = '<ol gi="choiceList" class="questionListOl"></ol>';




