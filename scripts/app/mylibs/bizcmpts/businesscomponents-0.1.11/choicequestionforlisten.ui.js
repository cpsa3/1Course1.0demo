var businesscomponents = businesscomponents || {};

businesscomponents.choicequestion = businesscomponents.choicequestion || {};

businesscomponents.choicequestion.ui = {};

businesscomponents.choicequestion.ui.edit = {};

businesscomponents.choicequestion.ui.choiceTitles = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

businesscomponents.choicequestion.ui.ChoiceMode = {
    Single: 1,
    Multi: 2
}

//选项集合
businesscomponents.choicequestion.ui.edit.ChoiceList = function (element, elementContainer, elementBtnAdd) {
    businesscomponents.ui.List.call(this, element, elementContainer,
        businesscomponents.choicequestion.ui.edit.Choice, businesscomponents.choicequestion.model.Choice);

    var option = new businesscomponents.ui.ListOptions();
    //默认值 用于添加
    option.setDefaultModelGenerator(businesscomponents.choicequestion.ui.edit.createDefaultModelChoice);
    //添加按钮
    option.setBtnAdd(new toot.ui.Button(elementBtnAdd));
    //绑定
    businesscomponents.choicequestion.ui.edit.ChoiceList.superClass.setOption.call(this, option);
};
toot.inherit(businesscomponents.choicequestion.ui.edit.ChoiceList, businesscomponents.ui.List);
toot.extendClass(businesscomponents.choicequestion.ui.edit.ChoiceList, {
    //删除操作
    _onItemActionDel: function (sender) {
        businesscomponents.choicequestion.ui.edit.ChoiceList.superClass._onItemActionDel.call(this, sender);
        this.updateModelByUI();
        this.updateUIByModel();
    },
    //添加操作
    _onBtnAddAction: function () {
        businesscomponents.choicequestion.ui.edit.ChoiceList.superClass._onBtnAddAction.call(this);
        this.updateModelByUI();
        this.updateUIByModel();
    }
});

//display
businesscomponents.choicequestion.ui.display = {};

businesscomponents.choicequestion.ui.display.Choice = function () {
    businesscomponents.ui.RnRItem.call(this,
      $('<tr><td class="style1"><input type="checkbox" class="check" /><input type="radio" class="check" /><span></span></td><td></td></tr>').get(0), null);
    this._cbInAnswer = $(this._element).find('input').get(0);
    this._rdoInAnswer = $(this._element).find('input').get(1);
    this._lblTitle = new toot.ui.Label($(this._element).find('span').get(0));
    this._lblContent = new toot.ui.Label($(this._element).find('td').get(1));

    this._choiceMode = -1;
    businesscomponents.choicequestion.ui.display.Choice.thisClass._setChoiceMode.call(this, businesscomponents.choicequestion.ui.ChoiceMode.Multi);
};
toot.inherit(businesscomponents.choicequestion.ui.display.Choice, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.choicequestion.ui.display.Choice, {
    updateUIByModel: function () {
        if (!this.getRequestModel())
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        this._cbInAnswer.checked = false;
        this._lblContent.setText(this.getRequestModel().getContent());

        if (this.getResponseModel()) {
            this._cbInAnswer.checked = this.getResponseModel().isSelected();
            this._rdoInAnswer.checked = this.getResponseModel().isSelected();
        }
    },
    updateModelByUI: function () {
        this._setResponseModelIfNull(businesscomponents.choicequestion.model.ChoiceResponse);

        if (this._choiceMode == businesscomponents.choicequestion.ui.ChoiceMode.Single)
            this.getResponseModel().setSelected(this._rdoInAnswer.checked);
        else
            this.getResponseModel().setSelected(this._cbInAnswer.checked);
    },
    updateUIByIdx: function () {
        //set title by the idx
        var titles = businesscomponents.choicequestion.ui.choiceTitles;
        this._lblTitle.setText(titles[this._idx] ? titles[this._idx] + ". " : null);
    },

    getChoiceMode: function () {
        return this._choiceMode;
    },
    _setChoiceMode: function (mode) {
        this._choiceMode = mode;
        if (this._choiceMode == businesscomponents.choicequestion.ui.ChoiceMode.Single) {
            $(this._cbInAnswer).hide();
            $(this._rdoInAnswer).show();
        }
        else {
            $(this._cbInAnswer).show();
            $(this._rdoInAnswer).hide();
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

businesscomponents.choicequestion.ui.display.Question = function (choice) {
    businesscomponents.ui.RnRItem.call(this,
     $(
     '<div class="contentbox">' +
         '<div class="readbox2 doingbox2"> ' +
         '<label></label>' +
         '<table border="0" cellpadding="0" cellspacing="0"></table>' +
     '</div></div>'
     ).get(0), null);

    var _this = this;
    this.choice = choice
    this._tipImg = $('<img src="/Content/ToeflExam/images/icon_ListenAgain.gif" class="ListenAgain">').get(0);
    //修改为富文本显示 by xp
    //    this._lblTitle = new toot.ui.Label($(this._element).find('label').get(0));

    this._lblTitle = $(this._element).find('label').get(0);
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
toot.inherit(businesscomponents.choicequestion.ui.display.Question, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.choicequestion.ui.display.Question, {
    updateUIByModel: function () {
        if (!this.getRequestModel()) {
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;
        }

        if (this.choice == 2) {
            $(this._element).find('table').eq(0).before(this._tipImg);
        }

        this._countHasSelectedChoices = 0;
        if (this._singleChoiceMode)
            for (var i = 0, l = this.getRequestModel().getChoices().length; i < l; i++)
                if (this.getRequestModel().getChoices()[i].isInAnswer()) this._countHasSelectedChoices++;
        //修改为富文本显示 by xp
        //        this._lblTitle.setText(this.getRequestModel().getTitle());
        $(this._lblTitle).html(this.getRequestModel().getTitle());
        var choiceAndResponses = [];
        for (var i = 0, l = this.getRequestModel().getChoices().length; i < l; i++) {
            var rnr = new businesscomponents.RequestAndResponse();
            rnr.setRequest(this._model.getRequest().getChoices()[i]);
            if (this._model.getResponse())
                rnr.setResponse(this._model.getResponse().getChoiceResponses()[i]);
            choiceAndResponses.push(rnr);
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
    setChoiceTitleVisible: function (visible) {
        this._choiceTitleVisible = visible;
    },
    getRightWrong: function () {
        if (!(this.getRequestModel() && this.getResponseModel()))
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;
        var q = new businesscomponents.choicequestion.model.QuestionAndResponse();
        q.setRequest(this.getRequestModel());
        q.setResponse(this.getResponseModel());
        return q.getRightWrong();
    },
    //add getCountHasSelectedChoices by xp
    getCountHasSelectedChoices: function () {
        return this._countHasSelectedChoices;
    }
});

businesscomponents.choicequestion.ui.display.QuestionGroup = function () {
    businesscomponents.ui.BusinessComponentBase.call(this, $('<div class="contentbox"><div>').get(0));
    this._listQuestion = new businesscomponents.ui.List($(this._element).find('div').get(0), $(this._element).find('div').get(0),
           businesscomponents.choicequestion.ui.display.Question, businesscomponents.choicequestion.model.Question);

    this._parser.setRequest(businesscomponents.choicequestion.model.QuestionGroup.parse);
    this._parser.setResponse(businesscomponents.choicequestion.model.QuestionResponseGroup.parse);
};
toot.inherit(businesscomponents.choicequestion.ui.display.QuestionGroup, businesscomponents.ui.BusinessComponentBase);
toot.extendClass(businesscomponents.choicequestion.ui.display.QuestionGroup, {
    updateUIByModel: function () {
        if (!this.getRequestModel())
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;
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
        this._setResponseModelIfNull(businesscomponents.choicequestion.model.QuestionResponseGroup);
        var responses = [];
        for (var i = 0, l = this._listQuestion.updateAndGetModelByUI().length; i < l; i++)
            responses.push(this._listQuestion.updateAndGetModelByUI()[i].getResponse());
        this.getResponseModel().setQuestionResponses(responses);
    },

    getRightWrong: function () {
        if (!(this.getRequestModel() && this.getResponseModel()))
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        var questionGroupAndRespnose = new businesscomponents.choicequestion.model.QuestionGroupAndResponse();
        questionGroupAndRespnose.setRequest(this.getRequestModel());
        questionGroupAndRespnose.setResponse(this.getResponseModel());

        return questionGroupAndRespnose.getRightWrong();
    }
});