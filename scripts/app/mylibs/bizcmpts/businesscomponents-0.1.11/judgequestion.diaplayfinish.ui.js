var businesscomponents = businesscomponents || {};

businesscomponents.judgequestion = businesscomponents.judgequestion || {};

businesscomponents.judgequestion.ui = businesscomponents.judgequestion.ui || {};

//displayFinish
businesscomponents.judgequestion.ui.displayfinish = {};

businesscomponents.judgequestion.ui.displayfinish.Choice = function () {
    businesscomponents.ui.RnRItem.call(this,
      $('<tr><td><input type="checkbox" class="check" /></td><td></td></tr>').get(0), null);
    this._elementRightOrWrong = $(this._element).find('div').get(0);
    this._cbInAnswer = $(this._element).find('input').get(0); this._cbInAnswer.disabled = true;
    this._lblTitle = new toot.ui.Label($(this._element).find('td').get(1));

    this._choiceMode = -1;
};
toot.inherit(businesscomponents.judgequestion.ui.displayfinish.Choice, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.judgequestion.ui.displayfinish.Choice, {
    updateUIByModel: function () {
        //        if (!(this.getRequestModel() && this.getResponseModel()))
        //            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        if (this.getResponseModel()) {
            this._cbInAnswer.checked = this.getResponseModel().isSelected();
        }
    },
    updateUIByIdx: function () {
    },

    getChoiceMode: function () {
        return this._choiceMode;
    },
    _setChoiceMode: function (mode) {
        this._choiceMode = mode;
        if (this._choiceMode == businesscomponents.judgequestion.ui.ChoiceMode.Single) {
            $(this._cbInAnswer).hide();
        }
        else {
            $(this._cbInAnswer).show();
        }
    },
    setChoiceMode: function (mode) {
        if (this._choiceMode == mode) return;
        this._setChoiceMode(mode);
    },

    getCheckboxInAnswer: function () {
        return this._cbInAnswer;
    },
    getRadioInAnswer: function () {
        return this._rdoInAnswer;
    },
    getLblTitle: function () {
        return this._lblTitle;
    },
    getLblContent: function () {
        return this._lblContent;
    }
});

businesscomponents.judgequestion.ui.displayfinish.Question = function () {
    businesscomponents.ui.RnRItem.call(this, $('<div class="clearfix" style="text-align:start"><span class="fl"></span></div>').get(0), null);

    var _this = this;

    this._lblTitle = $(this._element).find('span').eq(0);
    this._radioName = "businesscomponents-radio-" + (Math.random() + "").substring(2) + (Math.random() + "").substring(2);

    this._singleChoiceMode = false;
    this._choiceTitleVisible = true;

    this._countHasSelectedChoices = 0;
};
toot.inherit(businesscomponents.judgequestion.ui.displayfinish.Question, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.judgequestion.ui.displayfinish.Question, {
    updateUIByModel: function () {
        //        if (!(this.getRequestModel() && this.getResponseModel()))
        //            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;
        this._lblTitle.html(this._model.getRequest().getTitle());
        //        var choiceAndResponses = [];
        //        if (this.getRequestModel().getChoices()) {
        //            for (var i = 0, l = this.getRequestModel().getChoices().length; i < l; i++) {
        //                var rnr = new businesscomponents.RequestAndResponse();
        //                rnr.setRequest(this.getRequestModel().getChoices()[i]);
        //                if (this.getResponseModel().getChoiceResponses()) {
        //                    rnr.setResponse(this.getResponseModel().getChoiceResponses()[i]);
        //                }
        //                choiceAndResponses.push(rnr);
        //            }
        //        }
        //this._listChoice.setModelAndUpdateUI(choiceAndResponses);

        var questionAndResponse = new businesscomponents.judgequestion.model.QuestionAndResponse();
        questionAndResponse.setRequest(this.getRequestModel());
        questionAndResponse.setResponse(this.getResponseModel());
        var rightAnswer = "";
        var userAnswer = "";

        var temp = [['True', 'False', 'Not Given'], ['Yes', 'No', 'Not Given'], ['T', 'F', 'NG'], ['Y', 'N', 'NG']];
        var _tempIndex = this.getRequestModel().getTempIndex();

        if (this.getRequestModel().getChoices()) {
            for (var i = 0, l = this.getRequestModel().getChoices().length; i < l; i++) {
                if (this.getRequestModel().getChoices()[i].isInAnswer()) {
                    rightAnswer += temp[_tempIndex][i];
                }
            }
        }

        if (this.getResponseModel().getChoiceResponses()) {
            for (var i = 0, l = this.getResponseModel().getChoiceResponses().length; i < l; i++) {
                if (this.getResponseModel().getChoiceResponses()[i].isSelected()) {
                    userAnswer += temp[_tempIndex][i];
                }
            }
        }

   


        var hasAtLeastOneChoiceSelected = false;
        if (this.getResponseModel().getChoiceResponses()) {
            for (var i = 0, l = this.getResponseModel().getChoiceResponses().length; i < l; i++) {
                if (this.getResponseModel().getChoiceResponses()[i].isSelected()) { hasAtLeastOneChoiceSelected = true; break; }
            }
        }

        if (!this.getRequestModel().getChoices()) {
            var elementRightAnswer = '<span class="fl AnswerStyle1_2" >未作答</span>';
        }
        else {
            if (!hasAtLeastOneChoiceSelected)
                var elementRightAnswer = '<span class="fl AnswerStyle1_2" >' + userAnswer + '</span><span class="fl AnswerStyle1_1" >' + rightAnswer + '</span>';
            else if (questionAndResponse.isRight())
                var elementRightAnswer = '<span class="fl AnswerStyle1_1" >' + userAnswer + '</span>';
            else
                var elementRightAnswer = '<span class="fl AnswerStyle1_2" >' + userAnswer + '</span><span class="fl AnswerStyle1_1" >' + rightAnswer + '</span>';
        }
        $(this._element).append(elementRightAnswer);
    },

    _generatorChoice: function () {
        var uiChoice = new businesscomponents.judgequestion.ui.displayfinish.Choice();
        uiChoice.getLblTitle().setVisible(this._choiceTitleVisible);

        return uiChoice;
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

businesscomponents.judgequestion.ui.displayfinish.QuestionGroup = function () {
    businesscomponents.ui.BusinessComponentBase.call(this, $('<div><div></div><div></div></div>').get(0));
    //    this._lblTitle = new toot.ui.Label($(this._element).find('div').get(0));

    this._lblTitleOne = new toot.ui.Label($(this._element).find('div').get(0));
    this._listQuestion = new businesscomponents.ui.List($(this._element).find('div').get(1), $(this._element).find('div').get(1),
           businesscomponents.judgequestion.ui.displayfinish.Question, businesscomponents.judgequestion.model.Question);

    this._parser.setRequest(businesscomponents.judgequestion.model.QuestionGroup.parse);
    this._parser.setResponse(businesscomponents.judgequestion.model.QuestionResponseGroup.parse);
};
toot.inherit(businesscomponents.judgequestion.ui.displayfinish.QuestionGroup, businesscomponents.ui.BusinessComponentBase);
toot.extendClass(businesscomponents.judgequestion.ui.displayfinish.QuestionGroup, {
    updateUIByModel: function () {
        if (!(this.getRequestModel() && this.getResponseModel()))
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        //        this._lblTitle.setText(this._model.getRequest().getTitle());

        //set the first line of title to bold
        var title = this.getRequestModel().getTitle();
        $(this._lblTitleOne.getElement()).html(title);

        var questionAndResponses = [];
        for (var i = 0, l = this._model.getRequest().getQuestions().length; i < l; i++) {
            var rnr = new businesscomponents.RequestAndResponse();
            this.getRequestModel().getQuestions()[i].setTempIndex(this.getRequestModel().getTempIndex());
            rnr.setRequest(this._model.getRequest().getQuestions()[i]);
            rnr.setResponse(this._model.getResponse().getQuestionResponses()[i]);
            questionAndResponses.push(rnr);
        }
        this._listQuestion.setModelAndUpdateUI(questionAndResponses);
    }
});
