//sat语法的插句题 Create by xiaobao 14/3/6

var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.choicelocationquestion = businesscomponents.editors.choicelocationquestion || {};

businesscomponents.editors.choicelocationquestion.Choice = function (opt_html) {
    businesscomponents.editors.choicelocationquestion.Choice.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.choicelocationquestion.Choice.html)[0]);
    this._lblTitle = new toot.ui.Label($(this._element).find('[gi~="lblTitle"]')[0]);
    this._cbInAnswer = new businesscomponents.CheckBox();
    this._cbInAnswer.insertBefore(this._lblTitle.getElement());
    this._radioInAnswer = null;

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.choicelocationquestion.Choice, toot.view.Item);
toot.extendClass(businesscomponents.editors.choicelocationquestion.Choice, {

    _init_manageEvents: function () {
        businesscomponents.editors.choicelocationquestion.Choice.superClass._init_manageEvents.call(this);
        toot.connect([this._cbInAnswer], "change", this, function () {
            this.updateModelByUI();
            toot.fireEvent(this, "change");
        });
    },

    _render: function () {
        businesscomponents.editors.choicelocationquestion.Choice.superClass._render.call(this);
        this._renderRadioMode();
    },

    updateUIByModel: function () {
        if (!this._model) {
            if (this._radioMode)
                this._radioInAnswer.setChecked(false);
            else
                this._cbInAnswer.setChecked(false);
            //            this._txtContent.setValue(null);
            return;
        }

        if (this._radioMode)
            this._radioInAnswer.setChecked(this._model.isInAnswer());
        else
            this._cbInAnswer.setChecked(this._model.isInAnswer());
        //        this._txtContent.setValue(this._model.getContent());
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.choicequestion.Choice();

        if (this._radioMode)
            this._model.setInAnswer(this._radioInAnswer.isChecked());
        else
            this._model.setInAnswer(this._cbInAnswer.isChecked());
        //用models.components.choicequestion.Choice的model
        this._model.setContent(null);
    },
    updateUIByIdx: function () {
        //set title by the idx 只需要到 E
        if (this._idx < 5)
            this._lblTitle.setText(String.fromCharCode(0x41 + this._idx));
        else
            this._lblTitle.setText(null);
    },

    _radioMode: false,
    isRadioMode: function () {
        return this._radioMode;
    },
    setRadioMode: function (mode) {
        if (this._radioMode == mode) return;
        this._radioMode = mode;
        this._renderRadioMode();
    },
    _renderRadioMode: function () {
        if (this._radioMode) {
            this._cbInAnswer.setVisible(false);
            if (!this._radioInAnswer) {
                this._radioInAnswer = new businesscomponents.Radio();
                this._radioInAnswer.insertBefore(this._cbInAnswer.getElement());
            }
            this._radioInAnswer.setVisible(true);
        }
        else {
            this._cbInAnswer.setVisible(true);
            if (this._radioInAnswer) this._radioInAnswer.setVisible(false);
        }
        this.updateUIByModel();
    },
    getCBInAnswer: function () { return this._cbInAnswer },
    getRadioInAnswer: function () { return this._radioInAnswer },
    getLblTitle: function () { return this._lblTitle }
});

businesscomponents.editors.choicelocationquestion.Choice.html =
                                               '<div class="fl optionbox">' +
                                                 '<label gi="lblTitle"></label>' +
                                               '</div>';

businesscomponents.editors.choicelocationquestion.QuestionGroup = function (opt_html) {
    businesscomponents.editors.choicelocationquestion.QuestionGroup.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.choicequestion.QuestionGroup.html)[0]);

    this._tabs = new businesscomponents.Tabs();
    //切换时更换选中标签页
    this._tabs._switchWhenScroll = true;
    //设置分页模式
    this._tabs.setPagingMode(businesscomponents.Tabs.PagingMode.Pages);

    this._tabs.setSwitchToNewAdded(true);
    this._tabs.appendTo(this._element);

    this._question = new businesscomponents.editors.choicelocationquestion.Question();
    this._question.appendTo(this._element);
    //    this._listChoice = new businesscomponents.editors.choicequestion.ChoiceList();
    //    this._listChoice.appendTo($(this._element).find('[gi~="listChoice"]')[0]);

    //for validation on tabs switch
    this._currentValidator = null;
    //for blur validator (this._currentBlurValidator) to compare
    this._currentValidatedFalseModel = null;
    //for validation on choice checkbox and textbox change
    this._currentBlurValidator = null;

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.choicelocationquestion.QuestionGroup, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.choicelocationquestion.QuestionGroup, {

    getTabs: function () { return this._tabs },
    getQuestion: function () { return this._question },


    _init_manageEvents: function () {
        businesscomponents.editors.choicelocationquestion.QuestionGroup.superClass._init_manageEvents.call(this);
        toot.connect(this._tabs, "switch", this, this._onTabsSwitch);
        toot.connect(this._tabs, "add", this, this._onTabsAdd);
        toot.connect(this._tabs, "remove", this, this._onTabsRemove);
        toot.connect(this._tabs, "drag", this, this._onTabsDrag);

        toot.connect(this._tabs, "beforeSwitch", this, this._onTabsBeforeAddOrSwitch);
        toot.connect(this._tabs, "beforeAdd", this, this._onTabsBeforeAddOrSwitch);

        toot.connect(this._question, "change", this, this._onListChoiceChange);
    },
    _init_render: function () {
        businesscomponents.editors.choicelocationquestion.QuestionGroup.superClass._init_render.call(this);
        this._removeValidationInfo();
    },


    updateUIByModel: function () {
        if (this._model) {
            if (!this._model.getQuestions() || (this._model.getQuestions() && this._current > this._model.getQuestions().length - 1))
                this._current = -1;

            //            if (this._current == -1) {
            //                this.getQuestion().getSatRichTextLocationMarker().setVisible(false);
            //                this.getQuestion().getListChoice().setVisible(false);
            //            }
            //            else {
            //                this.getQuestion().getSatRichTextLocationMarker().setVisible(false);
            //                this.getQuestion().getListChoice().setVisible(false);
            //            }

            //            this.getQuestion().getSatRichTextLocationMarker().setModelAndUpdateUI(this._model.getTitle());

            var count = this._model.getQuestions() ? this._model.getQuestions().length : 0;
            var dMin = 0;
            if (count != 0)
                dMin = Math.floor(this._current / this._tabs.getMaxTabs()) * this._tabs.getMaxTabs();
            dMin = dMin < 0 ? 0 : dMin;
            this._tabs.setState(count, dMin, this._current);

            //            if (this._current == -1) this._rtQuestionTitle.setModelAndUpdateUI(null);
            //            else this._rtQuestionTitle.setModelAndUpdateUI(this._model.getQuestions()[this._current].getTitle());
            //            if (this._current == -1) {
            //                this.getQuestion().getListChoice().setModelAndUpdateUI(null);
            //            }
            //            else {
            //                this.getQuestion().getListChoice().setModelAndUpdateUI(this._model.getQuestions()[this._current].getChoices());
            //            }
            this.getQuestion().setModelAndUpdateUI(this._model.getQuestions()[this._current]);

            //the last one cannot be removed
            if (this._model.getQuestions()) {
                if (this._model.getQuestions().length == 1)
                    this._tabs.getTabs()[0].setBtnCloseVisible(false);
                else if (this._model.getQuestions().length > 1)
                    this._tabs.getTabs()[0].setBtnCloseVisible(true);
            }
        }
        else {
            this._current = -1;
            this._tabs.setState(0, 0, -1);
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.choicequestion.QuestionGroup();
        //        this._model.setTitle(this._rtTitle.updateAndGetModelByUI());
        if (this._current != -1) {
            this._model.getQuestions()[this._current].setTitle(this._question.getSatRichTextLocationMarker().getText());
            var chocies = this._question.updateAndGetModelByUI().getChoices();
            this._model.getQuestions()[this._current].setChoices(chocies ? chocies.concat([]) : null);
            this._model.getQuestions()[this._current].setLocations(this._question.updateAndGetModelByUI().getLocations());
            //            this._model.getQuestions()[this._current](this._question.updateAndGetModelByUI());
        }
    },

    _current: -1,
    getCurrent: function () {
        return this._current;
    },
    setCurrent: function (current) {
        if (this._current == current) return;
        this._current = current;
        this.updateUIByModel();
    },


    setAtLeastOneChoiceSelectedValidationHighlighted: function (hightlight) {
        this.getQuestion()._listChoice.setAtLeastOneChoiceSelectedValidationHighlighted(hightlight);
        //        if (hightlight) this._$validation_atLeastOneChoiceSelected.show();
        //        else this._$validation_atLeastOneChoiceSelected.hide();
    },
    _removeValidationInfo: function () {
        this._currentValidatedFalseModel = null;
        this.setAtLeastOneChoiceSelectedValidationHighlighted(false);
        //        if (this._listChoice.getItems())
        //            for (var i = 0, l = this._listChoice.getItems().length; i < l; i++)
        //                this._listChoice.getItems()[i].getTxtContent().setValidationHightlighted(false);
    },
    _onTabsBeforeAddOrSwitch: function (sender, e) {
        this.updateModelByUI();
        var result = true;
        if (this._current != -1 && this._currentValidator) {
            this._currentValidator.setUI(this);
            this._currentValidator.setShowMsg(true);
            result = this._currentValidator.validate();
        }
        if (!result) {
            //create the _currentValidatedFalseModel ( COPY )
            this._currentValidatedFalseModel = new models.components.choicequestion.Question();
            var question = this._model.getQuestions()[this.getCurrent()];
            this._currentValidatedFalseModel.setTitle(question.getTitle());
            if (question.getChoices()) {
                this._currentValidatedFalseModel.setChoices([]);
                for (var i = 0, l = question.getChoices().length; i < l; i++) {
                    var choice = new models.components.choicequestion.Choice();
                    choice.setInAnswer(question.getChoices()[i].isInAnswer());
                    choice.setContent(question.getChoices()[i].getContent());
                    this._currentValidatedFalseModel.getChoices().push(choice);
                }
            }

            e.preventDefault = true;
        }
    },
    _onListChoiceChange: function (sender, e) {
        if (e.type == "itemChange") {
            this.updateModelByUI();
            if (this._currentBlurValidator && this._currentValidatedFalseModel) {
                this._currentBlurValidator.setUI(this);
                this._currentBlurValidator.setShowMsg(false);
                this._currentBlurValidator.setValidatedFalseModel(this._currentValidatedFalseModel);
                this._currentBlurValidator.validate();
            }
        }
        //增加最小选项
        else if (e.type == "remove" || e.type == "add") {


            if (!this._listChoice.getModel() || this._listChoice.getModel().length == 0)
                this.setAtLeastOneChoiceSelectedValidationHighlighted(false);
        }
        else if (e.type = "radioChange") {
            this.setAtLeastOneChoiceSelectedValidationHighlighted(false);
        }
    },


    _onTabsSwitch: function () {
        this._removeValidationInfo();
        this.updateModelByUI();
        this._current = this._tabs.getCurrent();
        this.updateUIByModel();
        //        this._updateModelByUI_QuestoinByIdx(this._tabs.getCurrentBefore());
        //        this._updateUIByModel_QuestionByIdx(this._tabs.getCurrent());
    },
    _onTabsAdd: function () {
        //        if (this._tabs.getCurrentBefore() != -1)
        //            this._updateModelByUI_QuestoinByIdx(this._tabs.getCurrentBefore());


        this._removeValidationInfo();
        this.updateModelByUI();
        this._question.clear();
        if (!this._model) this._model = new models.components.choicelocationgroup.QuestionGroup();
        if (!this._model.getQuestions()) this._model.setQuestions([]);

        //default with 4 choices
        var question = new models.components.choicelocationgroup.Question();
        question.setChoices([]);
        for (var i = 0; i < this.getChoiceCountWhenTabAdds(); i++) {
            question.getChoices().push(new models.components.choicelocationgroup.Choice());
        }

        this._model.getQuestions().push(question);
        this._current = this._tabs.getCurrent();
        this.updateUIByModel();
        //        this._updateUIByModel_QuestionByIdx(this._model.getQuestions().length - 1);
    },
    _onTabsRemove: function (sender, e) {
        this._removeValidationInfo();
        this.updateModelByUI();
        this._model.getQuestions().splice(e.idx, 1);
        this._current = this._current < this._model.getQuestions().length ? this._current : this._model.getQuestions().length - 1;
        this.updateUIByModel();
    },
    _onTabsDrag: function (sender, e) {
        this.updateModelByUI();
        var question = this._model.getQuestions().splice(e.originalIndex, 1)[0];
        this._model.getQuestions().splice(e.newIndex, 0, question);
        this._current = this._tabs.getCurrent();
    },

    getCurrentValidator: function () {
        return this._currentValidator;
    },
    setCurrentValidator: function (validator) {
        this._currentValidator = validator;
    },
    getCurrentBlurValidator: function () {
        return this._currentBlurValidator;
    },
    setCurrentBlurValidator: function (validator) {
        this._currentBlurValidator = validator;
    },
    _singleModel: true,
    getSingleModel: function () {
        return this._singleModel;
    },
    setSingleModel: function (singleModel) {
        if (this._singleModel == singleModel) return;
        this._singleModel = singleModel;
    },
    getChoiceCountWhenTabAdds: function () {
        return this._choiceCountWhenTabAdds;
    },
    setChoiceCountWhenTabAdds: function (choiceCount) {
        if (this._choiceCountWhenTabAdds == choiceCount) return;
        this._choiceCountWhenTabAdds = choiceCount;
    }
});
businesscomponents.editors.choicelocationquestion.QuestionGroup.html =
                                                      '<div class="fl L2">' +

                                                      '</div>';



businesscomponents.editors.choicelocationquestion.ChoiceList = function (opt_html) {
    businesscomponents.editors.choicelocationquestion.ChoiceList.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.choicelocationquestion.ChoiceList.html)[0], null,
                      businesscomponents.editors.choicelocationquestion.Choice, models.components.choicequestion.Choice, null);

    this._elementContainer = $(this._element).find('[gi~="ctnChoice"]')[0];
    //    this._nonItemElements = [$(this._element).find('[gi~="nonItem"]')[0]];
    //    this._elementInsertBefore = $(this._element).find('[gi~="nonItem"]')[0];
    //    this._btnAdd = new toot.ui.Button($(this._element).find('[gi~="btnAdd"]')[0]);

    this._radioGroup = null;

    this._$validation_atLeastOneChoiceSelected = $(this._element).find('[gi~="validation_atLeastOneChoiceSelected"]');

    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.choicelocationquestion.ChoiceList, toot.view.List);
toot.extendClass(businesscomponents.editors.choicelocationquestion.ChoiceList, {

    _init_render: function () {
        businesscomponents.editors.choicelocationquestion.ChoiceList.superClass._init_render.call(this);
        this.removeValidationInfo();
    },

    _initializeItem: function () {
        var item = businesscomponents.editors.choicelocationquestion.ChoiceList.superClass._initializeItem.call(this);
        //        item.getTxtContent().setValidationHightlighted(false);
        //radio mode
        item.setRadioMode(this._radioMode);
        if (item.isRadioMode()) item.getRadioInAnswer().setGroup(this._radioGroup);
        return item;
    },

    _disposeItem: function (item) {
        //radio mode
        if (item.isRadioMode()) item.getRadioInAnswer().setGroup(null);
        businesscomponents.editors.choicelocationquestion.ChoiceList.superClass._disposeItem.call(this, item);
    },

    setAtLeastOneChoiceSelectedValidationHighlighted: function (hightlight) {
        if (hightlight) this._$validation_atLeastOneChoiceSelected.show();
        else this._$validation_atLeastOneChoiceSelected.hide();
    },
    removeValidationInfo: function () {
        this.setAtLeastOneChoiceSelectedValidationHighlighted(false);
        //        if (this._items)
        //            for (var i = 0, l = this._items.length; i < l; i++)
        //                this._items[i].getTxtContent().setValidationHightlighted(false);
    },
    //    _singleModel: true,
    //    getSingleModel: function () {
    //        return this._singleModel;
    //    },
    //    setSingleModel: function (singleModel) {
    //        if (this._singleModel == singleModel) return;
    //        this._singleModel = singleModel;
    //    },
    //    //设置是否支持选项删除(Modify By XiaoBao)
    //    _isDelItem: true,
    //    setIsDelItem: function (isDelItem) {
    //        if (this._isDelItem == isDelItem) return;
    //        this._isDelItem = isDelItem;
    //    },
    //    getIsDelItem: function () {
    //        return this._isDelItem;
    //    },
    updateUIByModel: function () {
        businesscomponents.editors.choicelocationquestion.ChoiceList.superClass.updateUIByModel.call(this);
        //        if (this._singleModel && this._model && this._model.length < 2 && this._model.length > 0) {
        //            this._items[0].getBtnDel().setVisible(false);
        //        } else if (this._singleModel && this._model) {
        //            this._items[0].getBtnDel().setVisible(true);
        //        }
        //        if (!this._isDelItem && this._model && this._model.length > 0) {
        //            if (this._items && this._items.length > 0) {
        //                for (var i = 0; i < this._items.length; i++) {
        //                    this._items[i].getBtnDel().setVisible(false);
        //                }
        //            }
        //        }
    },


    _radioMode: false,
    isRadioMode: function () {
        return this._radioMode;
    },
    setRadioMode: function (mode) {
        this._radioMode = mode;
        this._renderRadioMode();
    },
    _renderRadioMode: function () {
        if (this._radioMode) {
            if (!this._radioGroup) this._radioGroup = new businesscomponents.RadioGroup();
            toot.connect(this._radioGroup, "change", this, this._onRadioGroupChange);
        }
        else {
            if (this._radioGroup) toot.disconnect(this._radioGroup, "change", this, this._onRadioGroupChange);
        }
        this._updateItemsRadioMode();
        this.updateUIByModel();
    },
    _updateItemsRadioMode: function () {
        if (this._items) {
            for (var i = 0, l = this._items.length; i < l; i++) {
                item.setRadioMode(this._radioMode);
                if (item.isRadioMode()) item.getRadioInAnswer().setGroup(this._radioGroup);
            }
        }
    },
    _onRadioGroupChange: function (sender, e) {
        toot.fireEvent(this, "beforeChange");

        this.updateModelByUI();
        toot.fireEvent(this, "change",
                { type: "radioChange",
                    checkedIndex: sender.getCheckedIndex(),
                    checkedBeforeIndex: sender.getCheckedBeforeIndex()
                }
        );
    }

});
businesscomponents.editors.choicelocationquestion.ChoiceList.html = '<div class="ChoiceboxGroupOuter">' +
                                                               '<div class="marT10 ChoiceboxGroup clearfix taskSatChoicePatch" gi="ctnChoice">' +
                                                               '</div>' +
                                                               '<div class="ChoiceboxError2" style="display:none;" gi="validation_atLeastOneChoiceSelected">' +
                                                               '</div>' +
                                                            '</div>';



businesscomponents.editors.choicelocationquestion.Question = function (opt_html) {
    businesscomponents.editors.choicelocationquestion.Question.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.choicelocationquestion.Question.html)[0]);
    //富文本框
    this._srtlm = new businesscomponents.editors.SatRichTextLocationMarker();
    this._srtlm.appendTo(this._element);
    this._srtlm.initializeEditor();
    //选项列表
    this._listChoice = new businesscomponents.editors.choicelocationquestion.ChoiceList();
    //    this._listChoice.setSingleModel(false);
    this._listChoice.appendTo(this._element);

    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.choicelocationquestion.Question, toot.view.ViewBase);
toot.defineEvent(businesscomponents.editors.choicelocationquestion.Question, ["change"]);
toot.extendClass(businesscomponents.editors.choicelocationquestion.Question, {
    updateUIByModel: function () {
        if (this._model) {
            if (this._model.getTitle()) {
                this._srtlm.setText(this._model.getTitle());
                this._srtlm.getSaveBtnBox().hide();
                this._srtlm.getPee().setVisible(true);
                this._srtlm.getRtd().setVisible(true);
                this._srtlm.getRte().setVisible(false);
                this._srtlm.setModelAndUpdateUI(this._model.getLocations());

            }
            else {
                this._srtlm.setText(null);
            }

            this._listChoice.setModelAndUpdateUI(this._model.getChoices());
            if (this._model.getChoices()) {
                this.getSatRichTextLocationMarker().setCurrentMark(this._model.getChoices().length);
                this.getSatRichTextLocationMarker().setFlgNO(this._model.getChoices().length - 1);
            }
            else {
                this.getSatRichTextLocationMarker().setCurrentMark(0);
                this.getSatRichTextLocationMarker().setFlgNO(-1);
            }


            //            if (this._model.getChoices().length >= 5) {
            //                this.getSatRichTextLocationMarker().unbindMouseDownOnEditorFn();
            //            }
            //            else {
            //                this.getSatRichTextLocationMarker().bindMouseDownOnEditorFn();
            //            }

        }
        else {
            this._srtlm.setText(null);
            this._listChoice.setModelAndUpdateUI(null);
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.choicelocationgroup.Question();
        this._model.setTitle(this._srtlm.getText());
        var choices = this._listChoice.updateAndGetModelByUI();
        this._model.setChoices(choices ? choices.concat([]) : null);
        this._model.setLocations(this._srtlm.updateAndGetModelByUI());
        //        this._model.setLocationCount(this._srtlm.getFlgNO());
    },
    _init_manageEvents: function () {
        businesscomponents.editors.choicelocationquestion.QuestionGroup.superClass._init_manageEvents.call(this);
        toot.connect(this._srtlm, "change", this, this._srtlmChange);

        toot.connect(this._listChoice, "change", this, this._onListChoiceChange);
    },
    _srtlmChange: function () {
        this._listChoice.setVisible(true);
        var count = this._srtlm.getFlgNO();
        var choices = null;
        if (count >= 0) {
            choices = [];
            for (var i = 0, l = count; i <= l; i++) {
                var choice = new models.components.choicequestion.Choice();
                choice.setContent(null);
                choices.push(choice);
            }
        }
        //        this.getSatRichTextLocationMarker().setCurrentMark(choices.length);
        this._listChoice.setModelAndUpdateUI(choices);

        //        if (count == 0) this._qInsert.getListChoice().removeValidationInfo();
        //        alert("add");
    },
    _onListChoiceChange: function (sender, e) {
        toot.fireEvent(this, "change", e);
    },
    getSatRichTextLocationMarker: function () { return this._srtlm },
    getListChoice: function () { return this._listChoice },
    clear: function () {
        this.getSatRichTextLocationMarker().getRtd().setVisible(false);
        this.getSatRichTextLocationMarker().getRte().setVisible(true);
        this.getSatRichTextLocationMarker().getSaveBtnBox().show();
        this.getSatRichTextLocationMarker().getPee().setVisible(false);
        this.getSatRichTextLocationMarker().getBtnMark().setEnabled(false);
        this.getSatRichTextLocationMarker().getBtnUnmark().setEnabled(false);
        this.getSatRichTextLocationMarker().setFlgNO(-1);
        this.getListChoice().setModelAndUpdateUI(null);
        this.getSatRichTextLocationMarker().bindMouseDownOnEditorFn();
        this._srtlm.setText(null);
        this._srtlm.setModel(null);
    }
});
businesscomponents.editors.choicelocationquestion.Question.html = '<div></div>'; 