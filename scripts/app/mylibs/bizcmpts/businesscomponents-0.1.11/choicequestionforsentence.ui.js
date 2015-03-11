var businesscomponents = businesscomponents || {};

businesscomponents.choicequestionforsentence = businesscomponents.choicequestionforsentence || {};

businesscomponents.choicequestionforsentence.ui = {};

businesscomponents.choicequestionforsentence.ui.display = {};

businesscomponents.choicequestionforsentence.ui.display.ChoiceQuestion = function () {
    businesscomponents.ui.RnRItem.call(this,
     $('<div class="marbom">' +
         'Look at the numbers 1,2,3,4...,that indicate where the following sentence could be added to the passage.<br><br>' +
         '<b></b><br><br>' +
         'Where would the sentence best fit?' +
         '<table border="0" cellpadding="0" cellspacing="0"></table>' +
         '<table border="0" cellpadding="0" cellspacing="0"></table>' +
       '</div>').get(0), null);

    var _this = this;

    this._lblTitle = $($(this._element).find('b').get(0));
    this._listChoice = new businesscomponents.ui.List($(this._element).find('table').get(0), $(this._element).find('table').get(0),
                businesscomponents.choicequestion.ui.display.Choice, businesscomponents.choicequestion.model.QuestionResponse);
    this._listChoice.setDefaultUIGenerator(function () {
        return _this._generatorChoice();
    });

    this._radioName = "businesscomponents-radio-" + (Math.random() + "").substring(2) + (Math.random() + "").substring(2);

    this._singleChoiceMode = false;
    this._choiceTitleVisible = true;

    this._countHasSelectedChoices = 0;
};
toot.inherit(businesscomponents.choicequestionforsentence.ui.display.ChoiceQuestion, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.choicequestionforsentence.ui.display.ChoiceQuestion, {
    updateUIByModel: function () {
        if (!this.getRequestModel())
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        this._countHasSelectedChoices = 0;
        if (this._singleChoiceMode)
            if (this.getRequestModel().getChoices()) {
                for (var i = 0, l = this.getRequestModel().getChoices().length; i < l; i++)
                    if (this.getRequestModel().getChoices()[i].isInAnswer()) this._countHasSelectedChoices++;
            }
        this._lblTitle.html(this.getRequestModel().getTitle());
        var choiceAndResponses = [];
        if (this.getRequestModel().getChoices()) {
            for (var i = 0, l = this.getRequestModel().getChoices().length; i < l; i++) {
                var rnr = new businesscomponents.RequestAndResponse();
                rnr.setRequest(this._model.getRequest().getChoices()[i]);
                if (this._model.getResponse())
                    rnr.setResponse(this._model.getResponse().getChoiceResponses()[i]);
                choiceAndResponses.push(rnr);
            }
        }
        if (this._singleChoiceMode)
            this._listChoice.setModelAndUpdateUI(null);
        this._listChoice.setModelAndUpdateUI(choiceAndResponses);
    },
    updateModelByUI: function () {
        this._setResponseModelIfNull(businesscomponents.choicequestion.model.QuestionResponse);
        var responses = [];
        for (var i = 0, l = this._listChoice.updateAndGetModelByUI().length; i < l; i++)
            responses.push(this._listChoice.updateAndGetModelByUI()[i].getResponse());
        this.getResponseModel().setChoiceResponses(responses);
    },

    _generatorChoice: function () {
        var uiChoice = new businesscomponents.choicequestion.ui.display.Choice();
        uiChoice.getRadioInAnswer().name = this._radioName;
        uiChoice.getLblTitle().setVisible(this._choiceTitleVisible);
        uiChoice.setChoiceMode((this._singleChoiceMode && this._countHasSelectedChoices == 1) ?
          businesscomponents.choicequestion.ui.ChoiceMode.Single : businesscomponents.choicequestion.ui.ChoiceMode.Multi);

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


businesscomponents.choicequestionforsentence.ui.display.ChoiceQuestion2 = function () {
    businesscomponents.ui.RnRItem.call(this,
     $('<div class="marbom">' +
         'Look at the <span gi="lblChoiceCount"></span> squares <span class="textStyle4">[</span><span class="IconStyle1"></span><span class="textStyle4">]</span> that indicate where the following sentence could be added to the passage.<br><br>' +
         '<div gi="sentence" class="textStyle5"></div><br><br>' +
         'Where would the sentence best fit? Click on a square to add the sentence to the passge. ' +
         '<table border="0" cellpadding="0" cellspacing="0"></table>' +
         '<table border="0" cellpadding="0" cellspacing="0"></table>' +
       '</div>').get(0), null);

    var _this = this;

    this._lblChoiceCount = new toot.ui.Label($(this._element).find('[gi~="lblChoiceCount"]')[0]);
    this._$sentence = $(this._element).find('[gi~="sentence"]');
};
toot.inherit(businesscomponents.choicequestionforsentence.ui.display.ChoiceQuestion2, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.choicequestionforsentence.ui.display.ChoiceQuestion2, {
    updateUIByModel: function () {
        if (!this.getRequestModel())
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        this._$sentence.html(this.getRequestModel().getTitle());
        var choiceCount = this.getRequestModel().getChoices() ? this.getRequestModel().getChoices().length : 0;
        this._lblChoiceCount.setText(choiceCount);
    }
});


businesscomponents.choicequestionforsentence.ui.displayfinish = {};

businesscomponents.choicequestionforsentence.ui.displayfinish.ChoiceQuestion = function () {
    businesscomponents.ui.RnRItem.call(this,
     $('<div>' +
         'Look at the numbers 1,2,3,4...,that indicate where the following sentence could be added to the passage.<br><br>' +
         '<b></b><br><br>' +
         'Where would the sentence best fit?' +
         '<table border="0" cellpadding="0" cellspacing="0"></table>' +
       '</div>').get(0), null);

    var _this = this;

    this._lblTitle = new toot.ui.Label($(this._element).find('b').get(0));
    this._listChoice = new businesscomponents.ui.List($(this._element).find('table').get(0), $(this._element).find('table').get(0),
                businesscomponents.choicequestion.ui.displayfinish.Choice, businesscomponents.choicequestion.model.QuestionResponse);
    this._listChoice.setDefaultUIGenerator(function () {
        return _this._generatorChoice();
    });

    this._radioName = "businesscomponents-radio-" + (Math.random() + "").substring(2) + (Math.random() + "").substring(2);

    this._singleChoiceMode = false;
    this._choiceTitleVisible = true;

    this._countHasSelectedChoices = 0;
};
toot.inherit(businesscomponents.choicequestionforsentence.ui.displayfinish.ChoiceQuestion, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.choicequestionforsentence.ui.displayfinish.ChoiceQuestion, {
    updateUIByModel: function () {
        if (!(this.getRequestModel() && this.getResponseModel()))
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        this._countHasSelectedChoices = 0;
        if (this._singleChoiceMode)
            for (var i = 0, l = this.getRequestModel().getChoices().length; i < l; i++)
                if (this.getRequestModel().getChoices()[i].isInAnswer()) this._countHasSelectedChoices++;

        this._lblTitle.setText(this._model.getRequest().getTitle());
        var choiceAndResponses = [];
        if (this.getRequestModel().getChoices()) {
            for (var i = 0, l = this.getRequestModel().getChoices().length; i < l; i++) {
                var rnr = new businesscomponents.RequestAndResponse();
                rnr.setRequest(this.getRequestModel().getChoices()[i]);
                rnr.setResponse(this.getResponseModel().getChoiceResponses()[i]);
                choiceAndResponses.push(rnr);

            }
        }
        this._listChoice.setModelAndUpdateUI(choiceAndResponses);

        var questionAndResponse = new businesscomponents.choicequestion.model.QuestionAndResponse();
        questionAndResponse.setRequest(this.getRequestModel());
        questionAndResponse.setResponse(this.getResponseModel());
        var rightAnswer = "";
        if (this.getRequestModel().getChoices()) {
            for (var i = 0, l = this.getRequestModel().getChoices().length; i < l; i++)
                if (this.getRequestModel().getChoices()[i].isInAnswer())
                    rightAnswer += businesscomponents.choicequestion.ui.choiceTitles[i];
        }
        var hasAtLeastOneChoiceSelected = false;
        for (var i = 0, l = this.getResponseModel().getChoiceResponses().length; i < l; i++)
            if (this.getResponseModel().getChoiceResponses()[i].isSelected()) { hasAtLeastOneChoiceSelected = true; break; }

        if (!hasAtLeastOneChoiceSelected)
            var elementRightAnswer = $('<div class="icoW">未作答！<span class="space5"></span>正确答案：' + rightAnswer + '</div>').get(0);
        else if (questionAndResponse.isRight())
            var elementRightAnswer = $('<div class="icoR">回答正确！<span class="space5"></span>正确答案：' + rightAnswer + '</div>').get(0);
        else
            var elementRightAnswer = $('<div class="icoW">回答错误！<span class="space5"></span>正确答案：' + rightAnswer + '</div>').get(0);
        this._element.appendChild(elementRightAnswer);
    },

    _generatorChoice: function () {
        var uiChoice = new businesscomponents.choicequestion.ui.displayfinish.Choice();
        uiChoice.getRadioInAnswer().name = this._radioName;
        uiChoice.getLblTitle().setVisible(this._choiceTitleVisible);
        uiChoice.setChoiceMode((this._singleChoiceMode && this._countHasSelectedChoices == 1) ?
          businesscomponents.choicequestion.ui.ChoiceMode.Single : businesscomponents.choicequestion.ui.ChoiceMode.Multi);

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