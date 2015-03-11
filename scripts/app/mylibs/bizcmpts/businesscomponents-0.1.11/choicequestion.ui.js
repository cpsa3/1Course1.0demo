var businesscomponents = businesscomponents || {};

businesscomponents.choicequestion = businesscomponents.choicequestion || {};

businesscomponents.choicequestion.ui = {};

businesscomponents.choicequestion.ui.choiceTitles = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

businesscomponents.choicequestion.ui.ChoiceMode = {
    Single: 1,
    Multi: 2
};
businesscomponents.choicequestion.ui.edit = {};

//edit
businesscomponents.choicequestion.ui.edit.Choice = function() {
    businesscomponents.ui.RnRItem.call(this,
        $('<div class="choosebox clearfix">' +
            '<span class="fl option3"><input type="checkbox" /><span>A. </span></span>' +
            '<span class="fl">' +
            '<textarea class="textarea PopupTAw3"></textarea>' +
            '</span>' +
            '<div class="toolbtn fl option4"><a href="#" class="close"></a></div>' +
            '</div>').get(0));
    this._cbInAnswer = $(this._element).find('input').get(0);
    this._lblTitle = new toot.ui.Label($(this._element).find('span').get(1));
    this._txtContent = new toot.ui.TextBox($(this._element).find('textarea').get(0));

    var option = new businesscomponents.ui.ItemOptions();
    option.setBtnDel(new toot.ui.Button($(this._element).find('a').get(0)));
    businesscomponents.choicequestion.ui.edit.Choice.superClass.setOption.call(this, option);

    this._elementBtnDel = $(this._element).find('a').get(0);
};
toot.inherit(businesscomponents.choicequestion.ui.edit.Choice, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.choicequestion.ui.edit.Choice, {
    updateUIByModel: function() {
        if (!this.getRequestModel()) {
            this._cbInAnswer.checked = false;
            this._txtContent.setValue(null);
            return;
        }

        this._cbInAnswer.checked = this.getRequestModel().isInAnswer();
        this._txtContent.setValue(this.getRequestModel().getContent());
    },
    updateModelByUI: function() {
        this._setRequestModelIfNull(businesscomponents.choicequestion.model.Choice);
        this.getRequestModel().setInAnswer(this._cbInAnswer.checked);
        this.getRequestModel().setContent(this._txtContent.getValue());
    },
    updateUIByIdx: function() {
        //set title by the idx
        var titles = businesscomponents.choicequestion.ui.choiceTitles;
        this._lblTitle.setText(titles[this._idx] ? titles[this._idx] + ". " : null);
    },

    getElementBtnDel: function() {
        return this._elementBtnDel;
    }
});


businesscomponents.choicequestion.ui.edit.ChoiceList = function(element, elementContainer, elementBtnAdd) {
    businesscomponents.ui.List.call(this, element, elementContainer,
        businesscomponents.choicequestion.ui.edit.Choice, businesscomponents.choicequestion.model.Choice);

    var option = new businesscomponents.ui.ListOptions();
    option.setDefaultModelGenerator(businesscomponents.choicequestion.ui.edit.createDefaultModelChoice);
    option.setBtnAdd(new toot.ui.Button(elementBtnAdd));
    businesscomponents.choicequestion.ui.edit.ChoiceList.superClass.setOption.call(this, option);
};
toot.inherit(businesscomponents.choicequestion.ui.edit.ChoiceList, businesscomponents.ui.List);
toot.extendClass(businesscomponents.choicequestion.ui.edit.ChoiceList, {
    _onItemActionDel: function(sender) {
        businesscomponents.choicequestion.ui.edit.ChoiceList.superClass._onItemActionDel.call(this, sender);
        this.updateModelByUI();
        this.updateUIByModel();
    },
    _onBtnAddAction: function() {
        businesscomponents.choicequestion.ui.edit.ChoiceList.superClass._onBtnAddAction.call(this);
        this.updateModelByUI();
        this.updateUIByModel();
    }
});

businesscomponents.choicequestion.ui.edit.Question = function() {
    businesscomponents.ui.RnRItem.call(this,
        $('<div class="addChoice">' +
            '<div class="clearfix"><div class="fr toolbtn"><a href="#" class="close"></a><a href="#" class="down"></a></div></div>' +
            '<div class="headbox clearfix">' +
            '<span class="fl option2">题干</span>' +
            '<textarea class="textarea PopupTAw4"></textarea>' +
            '</div>' +
            '<div></div>' +
            '<div class="addbtnbox">' +
            '<input type="button" value="增加选项" class="pooupbtn5 PopupTw1" onmouseover="this.className=\'pooupbtn5 PopupTw1 pooupbtn5_hover\'"' +
            'onmouseout="this.className=\'pooupbtn5 PopupTw1\'" />' +
            '</div>' +
            '</div>').get(0), null);
    this._txtTitle = new toot.ui.TextBox($(this._element).find('textarea').get(0));
    this._listChoice = new businesscomponents.choicequestion.ui.edit.ChoiceList($(this._element).find('div').get(3), $(this._element).find('div').get(3),
        $(this._element).find('input').get(0));

    //    this._elementBtnDel = $(this._element).find('a').get(0);
    //    this._elementBtnMin = $(this._element).find('a').get(1);
    this._elementBtnAddChoice = $(this._element).find('input').get(0);

    var option = new businesscomponents.ui.ItemOptions();
    this._btnDel = new toot.ui.Button($(this._element).find('a').get(0));
    this._btnMin = new toot.ui.Button($(this._element).find('a').get(1));
    option.setBtnDel(this._btnDel);
    option.setBtnMin(this._btnMin);
    //    option.getBtnMin().setVisible(false);
    businesscomponents.choicequestion.ui.edit.Question.superClass.setOption.call(this, option);

    businesscomponents.choicequestion.ui.edit.Question.superClass._setMinimized.call(this, false);

    this._choiceBtnDelVisible = false;
    businesscomponents.choicequestion.ui.edit.Question.thisClass._setChoiceBtnDelVisible.call(this, true);
};
toot.inherit(businesscomponents.choicequestion.ui.edit.Question, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.choicequestion.ui.edit.Question, {
    updateUIByModel: function() {
        if (!this.getRequestModel()) {
            this._txtTitle.setValue(null);
            this._listChoice.setModelAndUpdateUI(null);
            return;
        }

        this._txtTitle.setValue(this.getRequestModel().getTitle());

        if (this.getRequestModel().getChoices()) {
            var rnrChoices = [];
            for (var i = 0, l = this.getRequestModel().getChoices().length; i < l; i++) {
                var rnrChoice = new businesscomponents.RequestAndResponse();
                rnrChoice.setRequest(this.getRequestModel().getChoices()[i]);
                rnrChoices.push(rnrChoice);
            }
            this._listChoice.setModelAndUpdateUI(rnrChoices);
        } else
            this._listChoice.setModelAndUpdateUI(null);
    },
    updateModelByUI: function() {
        //reset validation
        this._validatedOK = true;
        this._setRequestModelIfNull(businesscomponents.choicequestion.model.Question);
        this.getRequestModel().setTitle(this._txtTitle.getValue());

        var choices = [];
        var rnrChoices = this._listChoice.updateAndGetModelByUI();
        if (rnrChoices) {
            for (var i = 0, l = rnrChoices.length; i < l; i++)
                choices.push(rnrChoices[i].getRequest());
            this.getRequestModel().setChoices(choices);
        } else
            this.getRequestModel().setChoices(null);

        var hasOneAtLeast = false;
        for (var i = 0, l = choices.length; i < l; i++)
            if (choices[i].isInAnswer()) {
                hasOneAtLeast = true;
                break;
            }
        //Set the validation only if the _validatedOK is true in order to keep the first false result.
        if (this._validatedOK && !hasOneAtLeast) {
            this._validatedOK = false;
            this._validationMsg = "选择题标准答案不能为空";
        }
    },
    _setMinimizedUI: function() {
        if (this._minimized) {
            var divs = $(this._element).children("div");
            divs[2].style.display = "none";
            divs[3].style.display = "none";
            this._option.getBtnMin().getElement().className = "down";
        } else {
            var divs = $(this._element).children("div");
            divs[2].style.display = "";
            divs[3].style.display = "";
            this._option.getBtnMin().getElement().className = "up";
        }
    },

    getBtnDel: function() {
        return this._btnDel;
    },
    getBtnMin: function() {
        return this._btnMin;
    },
    getElementBtnDel: function() {
        return this._btnDel.getElement();
    },
    getElementBtnMin: function() {
        return this._btnMin.getElement();
    },
    getElementBtnAddChoice: function() {
        return this._elementBtnAddChoice;
    },
    isChoiceBtnDelVisible: function() {
        return this._choiceBtnDelVisible;
    },
    _setChoiceBtnDelVisible: function(visible) {
        this._choiceBtnDelVisible = visible;
        if (this._choiceBtnDelVisible)
            this._listChoice.setDefaultUIGenerator(null);
        else
            this._listChoice.setDefaultUIGenerator(function() {
                var uiChoice = new businesscomponents.choicequestion.ui.edit.Choice();
                uiChoice.getElementBtnDel().style.display = "none";
                return uiChoice;
            });
    },
    setChoiceBtnDelVisible: function(visible) {
        if (this._choiceBtnDelVisible == visible) return;
        this._setChoiceBtnDelVisible(visible);
    }
});

businesscomponents.choicequestion.ui.edit.QuestionGroup = function() {
    businesscomponents.ui.BusinessComponentBase.call(this,
        $('<div class="Choicebox">' +
            '<div class="clearfix">' +
            '<div class="fr toolbtn">' +
            '<a href="#" class="close"></a>' +
            '<a href="#" class="down"></a>' +
            '</div>' +
            '<span class="titlestyle"></span>' +
            '</div>' +
            '<div class="headbox clearfix">' +
            '<span class="fl option1">题目要求</span>' +
            '<textarea class="textarea PopupTAw4"></textarea>' +
            '</div>' +
            '<div></div>' +
            '<div class="addbtnbox">' +
            '<input type="button" value="保存" class="pooupbtn5 PopupTw1" onmouseover="this.className=\'pooupbtn5 PopupTw1 pooupbtn5_hover\'"' +
            'onmouseout="this.className=\'pooupbtn5 PopupTw1\'" />' +
            '<input type="button" value="新增选择题" class="pooupbtn5 PopupTw1" onmouseover="this.className=\'pooupbtn5 PopupTw1 pooupbtn5_hover\'"' +
            'onmouseout="this.className=\'pooupbtn5 PopupTw1\'" />' +
            '</div>' +
            '</div>').get(0));
    this._txtTitle = new toot.ui.TextBox($(this._element).find('textarea').get(0));

    this._lblComponentTitle = new toot.ui.Label($(this._element).find('span').get(0));
    this._lblComponentTitle.setText("选择题");

    var option = new businesscomponents.ui.ListOptions();
    option.setDefaultModelGenerator(businesscomponents.choicequestion.ui.edit.createDefaultModelQuestion);
    option.setBtnAdd(new toot.ui.Button($(this._element).find('input').get(1)));
    this._listQuestion = new businesscomponents.ui.List($(this._element).find('div').get(3), $(this._element).find('div').get(3),
        businesscomponents.choicequestion.ui.edit.Question, businesscomponents.choicequestion.model.Question,
        option);

    this._btnDel = new toot.ui.Button($(this._element).find('a').get(0));
    this._btnMin = new toot.ui.Button($(this._element).find('a').get(1));

    var option = new businesscomponents.ui.ItemOptions();
    option.setBtnDel(this._btnDel);
    option.setBtnMin(this._btnMin);
    //    option.getBtnMin().setVisible(false);
    businesscomponents.choicequestion.ui.edit.QuestionGroup.superClass.setOption.call(this, option);

    businesscomponents.choicequestion.ui.edit.QuestionGroup.superClass._setMinimized.call(this, false);

    this._businessType = 2;
    this._parser.setRequest(businesscomponents.choicequestion.model.QuestionGroup.parse);

    this._btnSave = new toot.ui.Button($(this._element).find('input').get(0));
    this._btnSave.setVisible(false);
};
toot.inherit(businesscomponents.choicequestion.ui.edit.QuestionGroup, businesscomponents.ui.BusinessComponentBase);
toot.extendClass(businesscomponents.choicequestion.ui.edit.QuestionGroup, {
    updateUIByModel: function() {
        if (!this.getRequestModel()) {
            this._txtTitle.setValue(null);
            this._listQuestion.setModelAndUpdateUI(null);
            return;
        }

        this._txtTitle.setValue(this.getRequestModel().getTitle());

        var rnrQuestions = [];
        for (var i = 0, l = this.getRequestModel().getQuestions().length; i < l; i++) {
            var rnrQuestion = new businesscomponents.RequestAndResponse();
            rnrQuestion.setRequest(this.getRequestModel().getQuestions()[i]);
            rnrQuestions.push(rnrQuestion);
        }
        this._listQuestion.setModelAndUpdateUI(rnrQuestions);
    },
    updateModelByUI: function() {
        //reset the validation
        this._validatedOK = true;
        this._setRequestModelIfNull(businesscomponents.choicequestion.model.QuestionGroup);
        this.getRequestModel().setTitle(this._txtTitle.getValue());

        var questions = [];
        var rnrQuestions = this._listQuestion.updateAndGetModelByUI();
        for (var i = 0, l = rnrQuestions.length; i < l; i++)
            questions.push(rnrQuestions[i].getRequest());
        this.getRequestModel().setQuestions(questions);

        //validation
        if (this._validatedOK && !this._listQuestion.isValidatedOK()) {
            this._validatedOK = false;
            this._validationMsg = this._listQuestion.getValidationMsg();
        }
    },
    _setMinimizedUI: function() {
        if (this._minimized) {
            var divs = $(this._element).children("div");
            divs[1].style.display = "none";
            divs[2].style.display = "none";
            divs[3].style.display = "none";
            this._option.getBtnMin().getElement().className = "down";
            this._lblComponentTitle.setVisible(true);
        } else {
            var divs = $(this._element).children("div");
            divs[1].style.display = "";
            divs[2].style.display = "";
            divs[3].style.display = "";
            this._option.getBtnMin().getElement().className = "up";
            this._lblComponentTitle.setVisible(false);
        }
    },

    getBtnDel: function() {
        return this._btnDel;
    },
    getBtnMin: function() {
        return this._btnMin;
    }
});


//display
businesscomponents.choicequestion.ui.display = {};

businesscomponents.choicequestion.ui.display.Choice = function () {
    businesscomponents.ui.RnRItem.call(this,
        $('<tr><td class="style1"><input type="checkbox" class="marR5" /><input type="radio" class="marR5" /><span></span></td><td ><span></span></td></tr>').get(0), null);
    this._cbInAnswer = $(this._element).find('input').get(0);
    this._rdoInAnswer = $(this._element).find('input').get(1);
    this._lblTitle = new toot.ui.Label($(this._element).find('span').get(0));
    this._lblContent = new toot.ui.Label($(this._element).find('span').get(1));

    this._content = $(this._element).find('span').get(1);

    this._choiceMode = -1;
    businesscomponents.choicequestion.ui.display.Choice.thisClass._setChoiceMode.call(this, businesscomponents.choicequestion.ui.ChoiceMode.Multi);
};
toot.inherit(businesscomponents.choicequestion.ui.display.Choice, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.choicequestion.ui.display.Choice, {
    updateUIByModel: function() {
        if (!this.getRequestModel())
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        this._cbInAnswer.checked = false;
        this._lblContent.setText(this.getRequestModel().getContent());

        if (this.getResponseModel()) {
            this._cbInAnswer.checked = this.getResponseModel().isSelected();
            this._rdoInAnswer.checked = this.getResponseModel().isSelected();
        }
    },
    updateModelByUI: function() {
        this._setResponseModelIfNull(businesscomponents.choicequestion.model.ChoiceResponse);

        if (this._choiceMode == businesscomponents.choicequestion.ui.ChoiceMode.Single)
            this.getResponseModel().setSelected(this._rdoInAnswer.checked);
        else
            this.getResponseModel().setSelected(this._cbInAnswer.checked);
    },
    updateUIByIdx: function() {
        //set title by the idx
        if (this._idx < 26)
            this._lblTitle.setText(String.fromCharCode(0x41 + this._idx));
        else
            this._lblTitle.setText(null);
        //        var titles = businesscomponents.choicequestion.ui.choiceTitles;
        //        this._lblTitle.setText(titles[this._idx] ? titles[this._idx] + ". " : null);
    },

    getChoiceMode: function() {
        return this._choiceMode;
    },
    _setChoiceMode: function(mode) {
        this._choiceMode = mode;
        if (this._choiceMode == businesscomponents.choicequestion.ui.ChoiceMode.Single) {
            $(this._cbInAnswer).hide();
            $(this._rdoInAnswer).show();
        } else {
            $(this._cbInAnswer).show();
            $(this._rdoInAnswer).hide();
        }
    },
    setChoiceMode: function(mode) {
        if (this._choiceMode == mode) return;
        this._setChoiceMode(mode);
    },

    getCheckboxInAnswer: function() {
        return this._cbInAnswer;
    },
    getRadioInAnswer: function() {
        return this._rdoInAnswer;
    },
    getLblTitle: function() {
        return this._lblTitle;
    },
    getLblContent: function() {
        return this._lblContent;
    },
    //
    getContent: function () {
        return this._content;
    }
});

//add new choiceList ->businesscomponents.ui.List

businesscomponents.choicequestion.ui.display.ChoiceList = function(opt_html) {
    //很重要：初始化List  如果改model、choice在此修改
    var choiceBoxElement = $(opt_html !== undefined ? opt_html : businesscomponents.choicequestion.ui.display.ChoiceList.HTML)[0];
    businesscomponents.choicequestion.ui.display.ChoiceList.superClass.constructor.call(this, choiceBoxElement, choiceBoxElement, businesscomponents.choicequestion.ui.display.Choice, businesscomponents.choicequestion.model.QuestionResponse);
    this._inAnswerCount = 0;
};
toot.inherit(businesscomponents.choicequestion.ui.display.ChoiceList, businesscomponents.ui.List);
//define event 
toot.defineEvent(businesscomponents.choicequestion.ui.display.ChoiceList, ["change", "beforeChange"]);
toot.extendClass(businesscomponents.choicequestion.ui.display.ChoiceList, {
    //init  Item   
    _createItem: function () {
        var item = businesscomponents.choicequestion.ui.display.ChoiceList.superClass._createItem.call(this);
        //add style="cursor: pointer"  单击选项增加 

        $(item.getContent()).css("cursor", "pointer");

        //click event 
        toot.connect(item, "click", this, this._onItemClick);

        return item;

    },
    updateUIByModel: function () {

        businesscomponents.choicequestion.ui.display.ChoiceList.superClass.updateUIByModel.call(this);
        //判断是否单选
        if (this.getItems()) {
            this.isRadioMode();
        }
    },
    _disposeItem: function (item) {
        //销毁点击事件
        toot.disconnect(item, "click", this, this._onItemClick);
        businesscomponents.choicequestion.ui.display.ChoiceList.superClass._disposeItem.call(this, item);
    },
    //单击事件 
    _onItemClick: function (sender, e) {
        
        //点击文字时触发 e.target==sender.getContent  只有在单击文本才执行自定义函数  过滤checkbox、radio原生点击事件
        if (e.target == sender.getContent()) {
            if (this.getItems()) {
                var idx = this.getItems().indexOf(sender);
                if (this._radioMode) {
                    var cbInAnswer = sender.getRadioInAnswer();
                    for (var i = 0; i < this.getItems().length; i++) {
                        this.getItems()[i].getRadioInAnswer().checked = false;
                    }
                    cbInAnswer.checked = true;

                } else {
                    //多选模式，点击切换状态

                    var rdoInAnswer = sender.getCheckboxInAnswer();
                    rdoInAnswer.checked = !rdoInAnswer.checked;

                }

                this.updateModelByUI();
            }
        }
        
        //fireEvent 
        toot.fireEvent(this, "change", { type: "itemChange" });
    },

    _radioMode: false,
    getRadioMode: function () {
        return this._radioMode;
    },
    //根据items判断是否为单选
    isRadioMode: function () {
        if (this.getItems()) {
            this._inAnswerCount = 0;
            for (var i = 0; i < this.getItems().length; i++) {
                if (this.getItems()[i].getRequestModel().isInAnswer()) {
                    this._inAnswerCount++;
                }
            }
            if (this._inAnswerCount > 1) {
                this._radioMode = false;
            } else {
                this._radioMode = true;
            }
        }
        return this._radioMode;
    },
    //获取标准答案个数
    getInAnswerCount: function () {
        return this._inAnswerCount;
    }
});

businesscomponents.choicequestion.ui.display.ChoiceList.HTML = '<ul class="L2answerchoicebox2" gi="choiceBox"></ul>';


businesscomponents.choicequestion.ui.display.Question = function(opt_html) {
    businesscomponents.ui.RnRItem.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.choicequestion.ui.display.Question.html)[0]);

    var _this = this;

    this._lblTitle = $(this._element).find('div:first');
    this._choiceBox = $(this._element).find('table').get(0);
    this._listChoice = new businesscomponents.choicequestion.ui.display.ChoiceList(this._choiceBox);

//    this._listChoice = new businesscomponents.ui.List($(this._element).find('table').get(0), $(this._element).find('table').get(0),
//                businesscomponents.choicequestion.ui.display.Choice, businesscomponents.choicequestion.model.QuestionResponse);
    this._listChoice.setDefaultUIGenerator(function() {
        return _this._generatorChoice();
    });

    this._radioName = "businesscomponents-radio-" + (Math.random() + "").substring(2) + (Math.random() + "").substring(2);

    this._singleChoiceMode = false;
    this._choiceTitleVisible = true;

    this._countHasSelectedChoices = 0;


};
toot.inherit(businesscomponents.choicequestion.ui.display.Question, businesscomponents.ui.RnRItem);
//define event 
toot.defineEvent(businesscomponents.choicequestion.ui.display.Question, ["change", "beforechange"]);
toot.extendClass(businesscomponents.choicequestion.ui.display.Question, {
   
    updateUIByModel: function() {
        if (!this.getRequestModel())
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        this._countHasSelectedChoices = 0;
        if (this._singleChoiceMode) {
            for (var i = 0, l = this.getRequestModel().getChoices().length; i < l; i++) {
                if (this.getRequestModel().getChoices()[i].isInAnswer()) this._countHasSelectedChoices++;
            } 
        }

      this._lblTitle.html(this.getRequestModel().getTitle()||'');

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
    updateModelByUI: function() {
        this._setResponseModelIfNull(businesscomponents.choicequestion.model.QuestionResponse);
        var responses = [];
        for (var i = 0, l = this._listChoice.updateAndGetModelByUI().length; i < l; i++)
            responses.push(this._listChoice.updateAndGetModelByUI()[i].getResponse());
        this.getResponseModel().setChoiceResponses(responses);
    },

    _generatorChoice: function() {
        var uiChoice = new businesscomponents.choicequestion.ui.display.Choice();
        uiChoice.getRadioInAnswer().name = this._radioName;
        uiChoice.getLblTitle().setVisible(this._choiceTitleVisible);
        uiChoice.setChoiceMode((this._singleChoiceMode && this._countHasSelectedChoices == 1) ?
            businesscomponents.choicequestion.ui.ChoiceMode.Single : businesscomponents.choicequestion.ui.ChoiceMode.Multi);

        return uiChoice;
    },

    isSingleChoiceMode: function() {
        return this._singleChoiceMode;
    },
    setSingleChoiceMode: function(open) {
        this._singleChoiceMode = open;
    },
    isChoiceTitleVisible: function() {
        return this._choiceTitleVisible;
    },
    //only sets the property, requires further ui refresh operations to update display
    setChoiceTitleVisible: function(visible) {
        this._choiceTitleVisible = visible;
    }
});
businesscomponents.choicequestion.ui.display.Question.html1 = '<div class="marbom"><div></div>' +
    '<table border="0" cellpadding="0" cellspacing="0"></table>' +
    '</div>';

businesscomponents.choicequestion.ui.display.Question.html = '<div class="clearfix marT10"><div></div>' +
    '<table border="0" cellpadding="0" cellspacing="0"></table>' +
    '</div>';



//注入display.question

businesscomponents.choicequestion.ui.display.QuestionGroup = function(opt_html) {

    businesscomponents.ui.BusinessComponentBase.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.choicequestion.ui.display.QuestionGroup.html)[0]);
    //    this._lblTitle = new toot.ui.Label($(this._element).find('div').get(0));

    var _this = this;

//    this._lblTitleOne = new toot.ui.Label($(this._element).find('div').get(0)); 
//    this._lblTitleOne.getElement().style.fontWeight = "bold";
    //    this._lblTitleTwo = new toot.ui.Label($(this._element).find('div').get(1));

    this._rtdTitle = new businesscomponents.RichTextDisplay(businesscomponents.RichTextDisplay.html1);
    this._rtdTitle.replaceTo($(this._element).find('div')[0]);    


    this._listQuestion = new businesscomponents.ui.List($(this._element).find('div').get(2), $(this._element).find('div').get(2),
        businesscomponents.choicequestion.ui.display.Question, businesscomponents.choicequestion.model.Question);
    this._listQuestion.setDefaultUIGenerator(function() {
        return _this._generatorQuestion();
    });

    this._parser.setRequest(businesscomponents.choicequestion.model.QuestionGroup.parse);
    this._parser.setResponse(businesscomponents.choicequestion.model.QuestionResponseGroup.parse);

    this._singleChoiceMode = false;
    this._choiceTitleVisible = true;

};
toot.inherit(businesscomponents.choicequestion.ui.display.QuestionGroup, businesscomponents.ui.BusinessComponentBase);
//define event 
toot.defineEvent(businesscomponents.choicequestion.ui.display.QuestionGroup, ["change", "beforechange"]);

toot.extendClass(businesscomponents.choicequestion.ui.display.QuestionGroup, {

    updateUIByModel: function() {
        if (!this.getRequestModel())
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        //        this._lblTitle.setText(this.getRequestModel().getTitle());

        //removed
        //set the first line of title to bold 
        //        var title = this.getRequestModel().getTitle();
        //        if (!title) {
        //            this._lblTitleOne.setText("");
        //            //            this._lblTitleTwo.setVisible(false);
        //        }
        //        else {
        //            var lines = title.split(/\r\n|\r|\n/);
        //            if (lines.length <= 1) {
        //                this._lblTitleOne.setText(title);
        //                //                this._lblTitleTwo.setVisible(false);
        //            }
        //            else {
        //                this._lblTitleOne.setText(lines[0]);
        //                lines.splice(0, 1);
        //                //                this._lblTitleTwo.setText(lines.join('\r\n'));
        //            }
        //        }

        this._rtdTitle.setHtml(this.getRequestModel().getTitle()||'');

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
    updateModelByUI: function() {
        this._setResponseModelIfNull(businesscomponents.choicequestion.model.QuestionResponseGroup);
        var responses = [];
        for (var i = 0, l = this._listQuestion.updateAndGetModelByUI().length; i < l; i++)
            responses.push(this._listQuestion.updateAndGetModelByUI()[i].getResponse());
        this.getResponseModel().setQuestionResponses(responses);
    },

    _generatorQuestion: function() {
        var uiQuestion = new businesscomponents.choicequestion.ui.display.Question();
        uiQuestion.setSingleChoiceMode(this._singleChoiceMode);
        uiQuestion.setChoiceTitleVisible(this._choiceTitleVisible);
        return uiQuestion;
    },

    isSingleChoiceMode: function() {
        return this._singleChoiceMode;
    },
    setSingleChoiceMode: function(open) {
        this._singleChoiceMode = open;
    },
    isChoiceTitleVisible: function() {
        return this._choiceTitleVisible;
    },
    //only sets the property, requires further ui refresh operations to update display
    setChoiceTitleVisible: function(visible) {
        this._choiceTitleVisible = visible;
    },

    getRightWrong: function() {
        if (!(this.getRequestModel() && this.getResponseModel()))
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        var questionGroupAndRespnose = new businesscomponents.choicequestion.model.QuestionGroupAndResponse();
        questionGroupAndRespnose.setRequest(this.getRequestModel());
        questionGroupAndRespnose.setResponse(this.getResponseModel());

        return questionGroupAndRespnose.getRightWrong();
    }
});

businesscomponents.choicequestion.ui.display.QuestionGroup.html = '<div class="marbom"><div></div><div></div><div></div></div>';
businesscomponents.choicequestion.ui.display.QuestionGroup.html1 = '<div class="clearfix marT10"><div></div><div></div><div></div></div>';

//displayFinish
businesscomponents.choicequestion.ui.displayfinish = {};

businesscomponents.choicequestion.ui.displayfinish.Choice = function() {
    businesscomponents.ui.RnRItem.call(this,
        $('<tr><td class="style1"><input type="checkbox" class="check" /><input type="radio" class="check" /><span></span></td><td></td></tr>').get(0), null);
    this._elementRightOrWrong = $(this._element).find('div').get(0);
    this._cbInAnswer = $(this._element).find('input').get(0);
    this._cbInAnswer.disabled = true;
    this._rdoInAnswer = $(this._element).find('input').get(1);
    this._rdoInAnswer.disabled = true;
    this._lblTitle = new toot.ui.Label($(this._element).find('span').get(0));
    this._lblContent = new toot.ui.Label($(this._element).find('td').get(1));

    this._choiceMode = -1;
    businesscomponents.choicequestion.ui.displayfinish.Choice.thisClass._setChoiceMode.call(this, businesscomponents.choicequestion.ui.ChoiceMode.Multi);
};
toot.inherit(businesscomponents.choicequestion.ui.displayfinish.Choice, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.choicequestion.ui.displayfinish.Choice, {
    updateUIByModel: function() {
        if (!(this.getRequestModel() && this.getResponseModel()))
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        this._lblContent.setText(this.getRequestModel().getContent());
        this._cbInAnswer.checked = this.getResponseModel().isSelected();
        this._rdoInAnswer.checked = this.getResponseModel().isSelected();
        //        if (this.getRequestModel().isInAnswer() == this.getResponseModel().isSelected())
        //            this._elementRightOrWrong.className = "icoR";
        //        else
        //            this._elementRightOrWrong.className = "icoW";
    },
    updateUIByIdx: function() {
        //set title by the idx
        var titles = businesscomponents.choicequestion.ui.choiceTitles;
        this._lblTitle.setText(titles[this._idx] ? titles[this._idx] + ". " : null);
    },

    getChoiceMode: function() {
        return this._choiceMode;
    },
    _setChoiceMode: function(mode) {
        this._choiceMode = mode;
        if (this._choiceMode == businesscomponents.choicequestion.ui.ChoiceMode.Single) {
            $(this._cbInAnswer).hide();
            $(this._rdoInAnswer).show();
        } else {
            $(this._cbInAnswer).show();
            $(this._rdoInAnswer).hide();
        }
    },
    setChoiceMode: function(mode) {
        if (this._choiceMode == mode) return;
        this._setChoiceMode(mode);
    },

    getCheckboxInAnswer: function() {
        return this._cbInAnswer;
    },
    getRadioInAnswer: function() {
        return this._rdoInAnswer;
    },
    getLblTitle: function() {
        return this._lblTitle;
    },
    getLblContent: function() {
        return this._lblContent;
    }
});

businesscomponents.choicequestion.ui.displayfinish.Question = function() {
    businesscomponents.ui.RnRItem.call(this, $('<div><div></div><table border="0" cellpadding="0" cellspacing="0"></table></div>').get(0), null);

    var _this = this;

    //    this._lblTitle = new toot.ui.Label($(this._element).find('div').get(0));
    this._rtdTitle = new businesscomponents.RichTextDisplay();
    this._rtdTitle.replaceTo($(this._element).find('div')[0]);
    this._listChoice = new businesscomponents.ui.List($(this._element).find('table').get(0), $(this._element).find('table').get(0),
        businesscomponents.choicequestion.ui.displayfinish.Choice, businesscomponents.choicequestion.model.QuestionResponse);
    this._listChoice.setDefaultUIGenerator(function() {
        return _this._generatorChoice();
    });

    this._radioName = "businesscomponents-radio-" + (Math.random() + "").substring(2) + (Math.random() + "").substring(2);

    this._singleChoiceMode = false;
    this._choiceTitleVisible = true;

    this._countHasSelectedChoices = 0;
};
toot.inherit(businesscomponents.choicequestion.ui.displayfinish.Question, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.choicequestion.ui.displayfinish.Question, {
    updateUIByModel: function() {
        if (!(this.getRequestModel() && this.getResponseModel()))
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        this._countHasSelectedChoices = 0;
        if (this._singleChoiceMode)
            for (var i = 0, l = this.getRequestModel().getChoices().length; i < l; i++)
                if (this.getRequestModel().getChoices()[i].isInAnswer()) this._countHasSelectedChoices++;

        //        this._lblTitle.setText(this._model.getRequest().getTitle());
        this._rtdTitle.setHtml(this._model.getRequest().getTitle());
        var choiceAndResponses = [];
        for (var i = 0, l = this.getRequestModel().getChoices().length; i < l; i++) {
            var rnr = new businesscomponents.RequestAndResponse();
            rnr.setRequest(this.getRequestModel().getChoices()[i]);
            rnr.setResponse(this.getResponseModel().getChoiceResponses()[i]);
            choiceAndResponses.push(rnr);

        }
        this._listChoice.setModelAndUpdateUI(choiceAndResponses);

        var questionAndResponse = new businesscomponents.choicequestion.model.QuestionAndResponse();
        questionAndResponse.setRequest(this.getRequestModel());
        questionAndResponse.setResponse(this.getResponseModel());
        var rightAnswer = "";
        for (var i = 0, l = this.getRequestModel().getChoices().length; i < l; i++)
            if (this.getRequestModel().getChoices()[i].isInAnswer())
                rightAnswer += businesscomponents.choicequestion.ui.choiceTitles[i];

        var hasAtLeastOneChoiceSelected = false;
        for (var i = 0, l = this.getResponseModel().getChoiceResponses().length; i < l; i++)
            if (this.getResponseModel().getChoiceResponses()[i].isSelected()) {
                hasAtLeastOneChoiceSelected = true;
                break;
            }

        if (!hasAtLeastOneChoiceSelected)
            var elementRightAnswer = $('<div class="icoW">未作答！<span class="space5"></span>正确答案：' + rightAnswer + '</div>').get(0);
        else if (questionAndResponse.isRight())
            var elementRightAnswer = $('<div class="icoR">回答正确！<span class="space5"></span>正确答案：' + rightAnswer + '</div>').get(0);
        else
            var elementRightAnswer = $('<div class="icoW">回答错误！<span class="space5"></span>正确答案：' + rightAnswer + '</div>').get(0);
        this._element.appendChild(elementRightAnswer);
    },

    _generatorChoice: function() {
        var uiChoice = new businesscomponents.choicequestion.ui.displayfinish.Choice();
        uiChoice.getRadioInAnswer().name = this._radioName;
        uiChoice.getLblTitle().setVisible(this._choiceTitleVisible);
        uiChoice.setChoiceMode((this._singleChoiceMode && this._countHasSelectedChoices == 1) ?
            businesscomponents.choicequestion.ui.ChoiceMode.Single : businesscomponents.choicequestion.ui.ChoiceMode.Multi);

        return uiChoice;
    },

    isSingleChoiceMode: function() {
        return this._singleChoiceMode;
    },
    setSingleChoiceMode: function(open) {
        this._singleChoiceMode = open;
    },
    isChoiceTitleVisible: function() {
        return this._choiceTitleVisible;
    },
    //only sets the property, requires further ui refresh operations to update display
    setChoiceTitleVisible: function(visible) {
        this._choiceTitleVisible = visible;
    }
});

businesscomponents.choicequestion.ui.displayfinish.QuestionGroup = function() {
    businesscomponents.ui.BusinessComponentBase.call(this, $('<div><div></div><div></div><div></div></div>').get(0));
    //    this._lblTitle = new toot.ui.Label($(this._element).find('div').get(0));
    this._rtdTitle = new businesscomponents.RichTextDisplay();
    this._rtdTitle.replaceTo($(this._element).find('div')[0]);

    this._lblTitleOne = new toot.ui.Label($(this._element).find('div').get(0));
    this._lblTitleOne.getElement().style.fontWeight = "bold";
    this._lblTitleTwo = new toot.ui.Label($(this._element).find('div').get(1));

    this._listQuestion = new businesscomponents.ui.List($(this._element).find('div').get(2), $(this._element).find('div').get(2),
        businesscomponents.choicequestion.ui.displayfinish.Question, businesscomponents.choicequestion.model.Question);

    this._parser.setRequest(businesscomponents.choicequestion.model.QuestionGroup.parse);
    this._parser.setResponse(businesscomponents.choicequestion.model.QuestionResponseGroup.parse);
};
toot.inherit(businesscomponents.choicequestion.ui.displayfinish.QuestionGroup, businesscomponents.ui.BusinessComponentBase);
toot.extendClass(businesscomponents.choicequestion.ui.displayfinish.QuestionGroup, {
    updateUIByModel: function() {
        if (!(this.getRequestModel() && this.getResponseModel()))
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        //        this._lblTitle.setText(this._model.getRequest().getTitle());

        //set the first line of title to bold
        //        var title = this.getRequestModel().getTitle();
        this._rtdTitle.setHtml(this.getRequestModel().getTitle());
        if (!title) {
            this._lblTitleOne.setText("");
            this._lblTitleTwo.setVisible(false);
        } else {
            var lines = title.split(/\r\n|\r|\n/);
            if (lines.length <= 1) {
                this._lblTitleOne.setText(title);
                this._lblTitleTwo.setVisible(false);
            } else {
                this._lblTitleOne.setText(lines[0]);
                lines.splice(0, 1);
                this._lblTitleTwo.setText(lines.join('\r\n'));
            }
        }


        var questionAndResponses = [];
        for (var i = 0, l = this._model.getRequest().getQuestions().length; i < l; i++) {
            var rnr = new businesscomponents.RequestAndResponse();
            rnr.setRequest(this._model.getRequest().getQuestions()[i]);
            rnr.setResponse(this._model.getResponse().getQuestionResponses()[i]);
            questionAndResponses.push(rnr);
        }
        this._listQuestion.setModelAndUpdateUI(questionAndResponses);
    }
});


//edit default

businesscomponents.choicequestion.ui.edit.choiceDefaultNum = 3;

businesscomponents.choicequestion.ui.edit.createDefaultModelChoice = function() {
    var rnr = new businesscomponents.RequestAndResponse();
    rnr.setRequest(new businesscomponents.choicequestion.model.Choice());
    return rnr;
};
businesscomponents.choicequestion.ui.edit.createDefaultModelQuestion = function() {

    var question = new businesscomponents.choicequestion.model.Question();
    question.setChoices([]);
    for (var i = 0; i < businesscomponents.choicequestion.ui.edit.choiceDefaultNum; i++) {
        question.getChoices().push(businesscomponents.choicequestion.ui.edit.createDefaultModelChoice().getRequest());
    }
    var rnr = new businesscomponents.RequestAndResponse();
    rnr.setRequest(question);
    return rnr;
};
businesscomponents.choicequestion.ui.edit.createDefaultModelQuestionGroup = function() {

    var questionGroup = new businesscomponents.choicequestion.model.QuestionGroup();
    questionGroup.setQuestions([]);
    questionGroup.getQuestions().push(businesscomponents.choicequestion.ui.edit.createDefaultModelQuestion().getRequest());

    var rnr = new businesscomponents.RequestAndResponse();
    rnr.setRequest(questionGroup);
    return rnr;
};
businesscomponents.choicequestion.ui.edit.createDefaultUIQuestionGroup = function() {
    var ui = new businesscomponents.choicequestion.ui.edit.QuestionGroup();
    ui.setModelAndUpdateUI(businesscomponents.choicequestion.ui.edit.createDefaultModelQuestionGroup());
    return ui;
};