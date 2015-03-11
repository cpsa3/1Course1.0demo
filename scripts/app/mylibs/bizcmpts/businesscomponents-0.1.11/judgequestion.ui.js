var businesscomponents = businesscomponents || {};

businesscomponents.judgequestion = businesscomponents.judgequestion || {};

businesscomponents.judgequestion.ui = {};


businesscomponents.tempHtml = '<div class="copySelect marB10" style="width:96px;">' +
                                   '<div class="copySelectText copySelectOpen" gi="lblSelected title">答案</div>' +
                                   '<div class="copySelectBox copySelectBoxMH90 copyScroll" style="width:94px; display:block;" gi="ctnOptions options">' +
                                   '</div>' +
                                 '</div>';

//display
businesscomponents.judgequestion.ui.display = {};

businesscomponents.judgequestion.ui.display.Question = function () {
    businesscomponents.ui.RnRItem.call(this,
     $('<div class="clearfix marT10">' +
         '<div class="copySelect fl style3_left" style="width:108px;"></div><div class="fl style3_right"><div class="judgequestion_title"></div>' +
       '</div>').get(0), null);

    var _this = this;

    //    this._lblTitle = new toot.ui.Label($(this._element).find('div').get(0));
    this._rtdTitle = new businesscomponents.RichTextDisplay();
    this._rtdTitle.replaceTo($(this._element).find('.judgequestion_title')[0]);
    this._select = new businesscomponents.Select(businesscomponents.tempHtml);
    this._select.setUnselectedText("请作答");
    this._select.appendTo($(this._element).find('div')[0]);
    this._choiceMode = -1;

    for (var j = 0; j <= 2; j++) {
        var option = new businesscomponents.Option();
        this._select.add(option);
    }

    this._singleChoiceMode = false;
    this._choiceTitleVisible = true;

    this._countHasSelectedChoices = 0;
};
toot.inherit(businesscomponents.judgequestion.ui.display.Question, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.judgequestion.ui.display.Question, {
    updateUIByModel: function () {
        if (!this.getRequestModel())
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        this._countHasSelectedChoices = 0;
        if (this._singleChoiceMode)
            for (var i = 0, l = this.getRequestModel().getChoices().length; i < l; i++)
                if (this.getRequestModel().getChoices()[i].isInAnswer()) this._countHasSelectedChoices++;

        //        this._lblTitle.setText(this.getRequestModel().getTitle());
        //如果标题为null，显示为空
        if (this.getRequestModel().getTitle())
            this._rtdTitle.setHtml(this.getRequestModel().getTitle());
        else
            this._rtdTitle.setHtml("");
        var choiceAndResponses = [];
        for (var i = 0, l = this.getRequestModel().getChoices().length; i < l; i++) {
            var rnr = new businesscomponents.RequestAndResponse();
            this._model.getRequest().getChoices()[i].setTempIndex(this._model.getRequest().getTempIndex());
            rnr.setRequest(this._model.getRequest().getChoices()[i]);
            if (this._model.getResponse())
                rnr.setResponse(this._model.getResponse().getChoiceResponses()[i]);
            choiceAndResponses.push(rnr);
        }

        var _tempIndex = this.getRequestModel().getTempIndex();
        var temp = [['True', 'False', 'Not Given'], ['Yes', 'No', 'Not Given'], ['T', 'F', 'NG'], ['Y', 'N', 'NG']];

        for (var j = 0; j < this._select.getOptions().length; j++) {
            this._select.getOptions()[j].setText(temp[_tempIndex][j]);
        }
        if (this._model.getResponse()) {
            var choiceResponses = this._model.getResponse().getChoiceResponses();
            for (var i = 0, l = choiceResponses.length; i < l; i++) {
                if (choiceResponses[i].isSelected()) {
                    this._select.setSelectedIndex(i);
                    break;
                }
            }
        }
        //this._listChoice.setModelAndUpdateUI(choiceAndResponses);
    },
    updateModelByUI: function () {
        this._setResponseModelIfNull(businesscomponents.judgequestion.model.QuestionResponse);
        var responses = [];
        for (var j = 0; j <= 2; j++) {
            var choice = new businesscomponents.judgequestion.model.ChoiceResponse();
            choice.setSelected(j == this._select.getSelectedIndex());
            responses.push(choice);
        }
        this.getResponseModel().setChoiceResponses(responses);
    },

    _generatorChoice: function () {

    },

    isSingleChoiceMode: function () {
        return this._singleChoiceMode;
    },
    setSingleChoiceMode: function (open) {
        this._singleChoiceMode = open;
    },
    isChoiceTitleVisible: function () {
        return this._choiceTitleVisible;
    },
    //only sets the property, requires further ui refresh operations to update display
    setChoiceTitleVisible: function (visible) {
        this._choiceTitleVisible = visible;
    }
});

businesscomponents.judgequestion.ui.display.QuestionGroup = function () {
    businesscomponents.ui.BusinessComponentBase.call(this, $('<div class="marbom"><div></div><div></div></div>').get(0));
    //    this._lblTitle = new toot.ui.Label($(this._element).find('div').get(0));

    var _this = this;
    this._rtdTitle = new businesscomponents.RichTextDisplay('<div class="RichTextEditor"></div>');
    this._rtdTitle.replaceTo($(this._element).find('div')[0]);
    this._listQuestion = new businesscomponents.ui.List($(this._element).find('div').get(1), $(this._element).find('div').get(1),
           businesscomponents.judgequestion.ui.display.Question, businesscomponents.judgequestion.model.Question);
    this._listQuestion.setDefaultUIGenerator(function () {
        return _this._generatorQuestion();
    });

    this._parser.setRequest(businesscomponents.judgequestion.model.QuestionGroup.parse);
    this._parser.setResponse(businesscomponents.judgequestion.model.QuestionResponseGroup.parse);

    this._singleChoiceMode = false;
    this._choiceTitleVisible = true;
};

toot.inherit(businesscomponents.judgequestion.ui.display.QuestionGroup, businesscomponents.ui.BusinessComponentBase);
toot.extendClass(businesscomponents.judgequestion.ui.display.QuestionGroup, {
    updateUIByModel: function () {
        if (!this.getRequestModel())
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        this._rtdTitle.setHtml(this.getRequestModel().getTitle());

        var questionAndResponses = [];
        for (var i = 0, l = this.getRequestModel().getQuestions().length; i < l; i++) {
            this.getRequestModel().getQuestions()[i].setTempIndex(this.getRequestModel().getTempIndex());
            var rnr = new businesscomponents.RequestAndResponse();
            rnr.setRequest(this.getRequestModel().getQuestions()[i]);
            if (this.getResponseModel())
                rnr.setResponse(this.getResponseModel().getQuestionResponses()[i]);
            questionAndResponses.push(rnr);
        }
        this._listQuestion.setModelAndUpdateUI(questionAndResponses);
    },
    updateModelByUI: function () {
        this._setResponseModelIfNull(businesscomponents.judgequestion.model.QuestionResponseGroup);
        var responses = [];
        for (var i = 0, l = this._listQuestion.updateAndGetModelByUI().length; i < l; i++)
            responses.push(this._listQuestion.updateAndGetModelByUI()[i].getResponse());
        this.getResponseModel().setQuestionResponses(responses);
    },

    _generatorQuestion: function () {
        var uiQuestion = new businesscomponents.judgequestion.ui.display.Question();
        uiQuestion.setSingleChoiceMode(this._singleChoiceMode);
        uiQuestion.setChoiceTitleVisible(this._choiceTitleVisible);
        return uiQuestion;
    },

    isSingleChoiceMode: function () {
        return this._singleChoiceMode;
    },
    setSingleChoiceMode: function (open) {
        this._singleChoiceMode = open;
    },
    isChoiceTitleVisible: function () {
        return this._choiceTitleVisible;
    },
    //only sets the property, requires further ui refresh operations to update display
    setChoiceTitleVisible: function (visible) {
        this._choiceTitleVisible = visible;
    },

    getRightWrong: function () {
        if (!(this.getRequestModel() && this.getResponseModel()))
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        var questionGroupAndRespnose = new businesscomponents.judgequestion.model.QuestionGroupAndResponse();
        questionGroupAndRespnose.setRequest(this.getRequestModel());
        questionGroupAndRespnose.setResponse(this.getResponseModel());

        return questionGroupAndRespnose.getRightWrong();
    }
});
