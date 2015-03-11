var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.judgequestion = businesscomponents.editors.judgequestion || {};

businesscomponents.editors.judgequestion.Choice = function (opt_html) {
    businesscomponents.editors.judgequestion.Choice.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.judgequestion.Choice.html)[0]);
    this._$ctnCheck = $(this._element).find('[gi~="ctnCheck"]');
    this._cbInAnswer = new businesscomponents.CheckBox();
    this._cbInAnswer.appendTo(this._$ctnCheck[0]);
    this._lblTitle = new toot.ui.Label($(this._element).find('[gi~="lblTitle"]')[0]);

    this._radioInAnswer = null;

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.judgequestion.Choice, toot.view.Item);
toot.extendClass(businesscomponents.editors.judgequestion.Choice, {

    _init_manageEvents: function () {
        businesscomponents.editors.judgequestion.Choice.superClass._init_manageEvents.call(this);
    },
    _render: function () {
        businesscomponents.editors.judgequestion.Choice.superClass._render.call(this);
        this._renderRadioMode();
    },
    updateUIByModel: function () {
        if (!this._model) {
            if (this._radioMode)
                this._radioInAnswer.setChecked(false);
            else
                this._cbInAnswer.setChecked(false);

            return;
        }

        if (this._radioMode)
            this._radioInAnswer.setChecked(this._model.isInAnswer());
        else
            this._cbInAnswer.setChecked(this._model.isInAnswer());

        this._cbInAnswer.setChecked(this._model.isInAnswer());
    },
    updateModelByUI: function () {
        if (!this._model) {
            this._model = new models.components.judgequestion.Choice();
        }


        if (this._radioMode)
            this._model.setInAnswer(this._radioInAnswer.isChecked());
        else
            this._model.setInAnswer(this._cbInAnswer.isChecked());

    },
    updateUIByIdx: function () {
        //set title by the idx
        //var temp = [['True', 'False', 'Not Given'], ['Yes', 'No', 'Not Given'], ['T', 'F', 'NG'], ['Y', 'N', 'NG']];
        //this._lblTitle.setText(temp[0][this._idx]);
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
    getBtnDel: function () { return this._btnDel },
    getCBInAnswer: function () { return this._cbInAnswer },
    getRadioInAnswer: function () { return this._radioInAnswer },
    getLblTitle: function () { return this._lblTitle }
});

businesscomponents.editors.judgequestion.Choice.html =
                                               '<div class="marT10 ChoiceboxGroup clearfix">' +
                                                 '<div class="optionbox" ><span gi="ctnCheck"></span><label gi="lblTitle">TRUE</label></div>' +
                                               '</div>';


businesscomponents.tempHtml = '<div class="copySelect marB10" style="width:96px;">' +
                                   '<div class="copySelectText copySelectOpen" gi="lblSelected title">答案</div>' +
                                   '<div class="copySelectBox copySelectBoxMH90 copyScroll" style="width:94px; display:block;" gi="ctnOptions options">' +
                                   '</div>' +
                                 '</div>';
businesscomponents.editors.judgequestion.QuestionGroup = function (opt_html) {
    businesscomponents.editors.judgequestion.QuestionGroup.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.judgequestion.QuestionGroup.html)[0]);

    this._rtTitle = new businesscomponents.editors.RichText();
    this._rtTitle.replaceTo($(this._element).find('[gi~="anchorTitle"]')[0]);
    this._rtTitle.getInitialView().getLbl2().setText("题目要求");
    this._rtTitle.setConfigFile('/content3/Scripts/ckeditorconfigs/choicequestion.js');

    this._tabs = new businesscomponents.Tabs();
    //切换时更换选中标签页
    this._tabs._switchWhenScroll = true;
    //设置分页模式
    this._tabs.setPagingMode(businesscomponents.Tabs.PagingMode.Pages);

    this._tabs.setSwitchToNewAdded(true);
    this._tabs.replaceTo($(this._element).find('[gi~="anchorTabs"]')[0]);

    this._rtQuestionTitle = new businesscomponents.editors.RichText();
    this._rtQuestionTitle.replaceTo($(this._element).find('[gi~="anchorQuestionTitle"]')[0]);
    this._rtQuestionTitle.getInitialView().getLbl2().setText("题干");
    this._rtQuestionTitle.setConfigFile('/content3/Scripts/ckeditorconfigs/choicequestion.js');

    //    this._$validation_atLeastOneChoiceSelected = $(this._element).find('[gi~="validation_atLeastOneChoiceSelected"]');

    //    this._listChoice = new toot.view.List($(this._element).find('[gi~="listChoice"]')[0], $(this._element).find('[gi~="listChoice-ctn"]')[0],
    //                       businesscomponents.editors.judgequestion.Choice, models.components.judgequestion.Choice, [this._$validation_atLeastOneChoiceSelected[0]]);
    this._listChoice = new businesscomponents.editors.judgequestion.ChoiceList();
    this._listChoice.replaceTo($(this._element).find('[gi~="anchorListChoice"]')[0]);

    this._select = new businesscomponents.Select(businesscomponents.tempHtml);
    this._select.setUnselectedText("答案选项1");
    this._select.appendTo($(this._element).find('[gi~="tempSelect"]')[0]);

    for (var j = 0; j <= 3; j++) {
        var option = new businesscomponents.Option();
        option.setText("答案选项" + (j + 1) + "");
        this._select.add(option);
    }

    //for validation on tabs switch
    this._currentValidator = null;
    //for blur validator (this._currentBlurValidator) to compare
    this._currentValidatedFalseModel = null;
    //for validation on choice checkbox and textbox change
    this._currentBlurValidator = null;
    //选项默认值
    this._choiceCountWhenTabAdds = 4;
    if (this.constructor == arguments.callee) {
        this._init();
    }
    //下拉框是否触发下面选项变化 by xp 2014年3月7日 10:00:17
    this._isRenderChoices = true;


};
toot.inherit(businesscomponents.editors.judgequestion.QuestionGroup, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.judgequestion.QuestionGroup, {
    getRTTitle: function () { return this._rtTitle },
    getTabs: function () { return this._tabs },
    getRTQuetionTitle: function () { return this._rtQuestionTitle },
    getListChoice: function () { return this._listChoice },

    _init_manageEvents: function () {
        businesscomponents.editors.judgequestion.QuestionGroup.superClass._init_manageEvents.call(this);
        toot.connect(this._tabs, "switch", this, this._onTabsSwitch);
        toot.connect(this._tabs, "add", this, this._onTabsAdd);
        toot.connect(this._tabs, "remove", this, this._onTabsRemove);
        toot.connect(this._tabs, "drag", this, this._onTabsDrag);

        toot.connect(this._tabs, "beforeSwitch", this, this._onTabsBeforeAddOrSwitch);
        toot.connect(this._tabs, "beforeAdd", this, this._onTabsBeforeAddOrSwitch);

        toot.connect(this._listChoice, "change", this, this._onListChoiceChange);

        toot.connect(this._select, "change", this, this._onSelectTemplate);
    },
    _init_render: function () {
        businesscomponents.editors.judgequestion.QuestionGroup.superClass._init_render.call(this);
        this._removeValidationInfo();
    },


    updateUIByModel: function () {
        if (this._model) {
            if (!this._model.getQuestions() || (this._model.getQuestions() && this._current > this._model.getQuestions().length - 1))
                this._current = -1;

            if (this._current == -1) {
                this._rtQuestionTitle.setVisible(false);
                this._listChoice.setVisible(false);
            } else {
                this._rtQuestionTitle.setVisible(true);
                this._listChoice.setVisible(true);
            }

            this._rtTitle.setModelAndUpdateUI(this._model.getTitle());
            var count = this._model.getQuestions() ? this._model.getQuestions().length : 0;
            var dMin = 0;
            if (count != 0)
                dMin = Math.floor(this._current / this._tabs.getMaxTabs()) * this._tabs.getMaxTabs();
            this._tabs.setState(count, dMin, this._current);

            if (this._current == -1) {
                this._rtQuestionTitle.setModelAndUpdateUI(null);
            } else {
                this._rtQuestionTitle.setModelAndUpdateUI(this._model.getQuestions()[this._current].getTitle());
            }

            if (this._current == -1) {
                this._listChoice.setModelAndUpdateUI(null);
            } else {
                this._listChoice.setModelAndUpdateUI(this._model.getQuestions()[this._current].getChoices());
            }
            //定位选项
            this._select.setSelectedIndex(this._model.getTempIndex())
            //the last one cannot be removed
            if (this._model.getQuestions()) {
                if (this._model.getQuestions().length == 1)
                    this._tabs.getTabs()[0].setBtnCloseVisible(false);
                else if (this._model.getQuestions().length > 1)
                    this._tabs.getTabs()[0].setBtnCloseVisible(true);
            }
        } else {
            this._current = -1;
            this._rtQuestionTitle.setVisible(false);
            this._listChoice.setVisible(false);

            this._rtTitle.setModelAndUpdateUI(null);
            this._tabs.setState(0, 0, -1);
            this._rtQuestionTitle.setModelAndUpdateUI(null);
            this._listChoice.setModelAndUpdateUI(null);
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.judgequestion.QuestionGroup();
        this._model.setTitle(this._rtTitle.updateAndGetModelByUI());

        if (this._current != -1) {
            this._model.getQuestions()[this._current].setTitle(this._rtQuestionTitle.updateAndGetModelByUI());
            var chocies = this._listChoice.updateAndGetModelByUI();
            this._model.getQuestions()[this._current].setChoices(chocies ? chocies.concat([]) : null);
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
        this._listChoice.setAtLeastOneChoiceSelectedValidationHighlighted(hightlight);
        //        if (hightlight) this._$validation_atLeastOneChoiceSelected.show();
        //        else this._$validation_atLeastOneChoiceSelected.hide();
    },
    _removeValidationInfo: function () {
        this._currentValidatedFalseModel = null;
        this._listChoice.setAtLeastOneChoiceSelectedValidationHighlighted(false);
        //        this.setAtLeastOneChoiceSelectedValidationHighlighted(false);
    },
    _onTabsBeforeAddOrSwitch: function (sender, e) {
        this.updateModelByUI();
        var result = true;
        if (this._currentValidator) {
            this._currentValidator.setUI(this);
            this._currentValidator.setShowMsg(true);
            result = this._currentValidator.validate();
        }
        if (!result) {
            //create the _currentValidatedFalseModel ( COPY )
            this._currentValidatedFalseModel = new models.components.judgequestion.Question();
            var question = this._model.getQuestions()[this.getCurrent()];
            this._currentValidatedFalseModel.setTitle(question.getTitle());
            if (question.getChoices()) {
                this._currentValidatedFalseModel.setChoices([]);
                for (var i = 0, l = question.getChoices().length; i < l; i++) {
                    var choice = new models.components.judgequestion.Choice();
                    choice.setInAnswer(question.getChoices()[i].isInAnswer());
                    choice.setContent(question.getChoices()[i].getContent());
                    this._currentValidatedFalseModel.getChoices().push(choice);
                }
            }

            e.preventDefault = true;
        }
    },
    _onSelectTemplate: function (sender, e) {
        if (!this._model) this._model = new models.components.judgequestion.QuestionGroup();
        this._model.setTempIndex(sender._selectedIndex);
        this.renderChoices();
    },
    renderChoices: function () {

        if (this._isRenderChoices) {
            if (!this._model) return false;
            var _templateIndex = this._model.getTempIndex();

            //set title by the idx
            var temp = [['True', 'False', 'Not Given'], ['Yes', 'No', 'Not Given'], ['T', 'F', 'NG'], ['Y', 'N', 'NG']];
            var items = this._listChoice._items;
            if (items != null) {
                for (var i = 0, l = items.length; i < l; i++) {
                    items[i].getLblTitle().setText(temp[_templateIndex][i]);
                }
            }
        } else {
            var items = this._listChoice._items;
            for (var j = 0; j < items.length; j++) {
                
                if (j<26) {
                    items[j].getLblTitle().setText(String.fromCharCode(0x41 + j));
                } else {
                    items[j].getLblTitle().setText(null);
                }
            }
        }

        //this._lblTitle.setText(temp[0][this._idx]);

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

            if (this._singleModel && this._listChoice.getModel() && this._listChoice.getModel().length < 2) {
                this._listChoice._items[0].getBtnDel().setVisible(false);
            } else if (this._singleModel && this._listChoice.getModel()) {
                this._listChoice._items[0].getBtnDel().setVisible(true);
            }

            if (!this._listChoice.getModel() || this._listChoice.getModel().length == 0)
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
        if (!this._model) this._model = new models.components.judgequestion.QuestionGroup();
        if (!this._model.getQuestions()) this._model.setQuestions([]);

        //default with 4 choices
        var question = new models.components.judgequestion.Question();
        question.setChoices([]);
        for (var i = 0; i < this.getChoiceCountWhenTabAdds(); i++) {
            var choice = new models.components.judgequestion.Choice();
            choice.setInAnswer(false)
            question.getChoices().push(choice);
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
    //是否保留一个选项，默认为开启，by xp
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
    },
    setIsRenderChoices: function (value) {
        this._isRenderChoices = value;
    }

});
businesscomponents.editors.judgequestion.QuestionGroup.html =
                                                      '<div>' +
                                                        '<div gi="anchorTitle" class="marB10"></div>' +
                                                        '<div gi="tempSelect" class="marB10"></div>' +
                                                        '<div gi="anchorTabs"></div>' +
                                                        '<div gi="anchorQuestionTitle"></div>' +
                                                        '<div gi="anchorListChoice">' +
//                                                        '<div gi="listChoice">' +
//                                                          '<div class="ChoiceboxGroupOuter2" gi="listChoice-ctn">' +
//                                                            '<div class="ChoiceboxError" style="display:block;" gi="validation_atLeastOneChoiceSelected"></div>' +
//                                                          '</div>' +
//                                                          '' +
//                                                          '<div class="marT10 ChoiceboxGroup clearfix">' +
//                                                          '</div>' +
//                                                        '</div>' +
                                                        '</div>';



businesscomponents.editors.judgequestion.ChoiceList = function (opt_html) {
    businesscomponents.editors.judgequestion.ChoiceList.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.judgequestion.ChoiceList.html)[0], null,
                      businesscomponents.editors.judgequestion.Choice, models.components.judgequestion.Choice, null);

    this._elementContainer = $(this._element).find('[gi~="ctnChoice"]')[0];
    this._nonItemElements = [$(this._element).find('[gi~="nonItem"]')[0]];
    this._elementInsertBefore = $(this._element).find('[gi~="nonItem"]')[0];
    this._btnAdd = new toot.ui.Button($(this._element).find('[gi~="btnAdd"]')[0]);
    this._btnAdd.setVisible(false);
    this._$validation_atLeastOneChoiceSelected = $(this._element).find('[gi~="validation_atLeastOneChoiceSelected"]');
    this._radioGroup = null;

    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.judgequestion.ChoiceList, toot.view.List);
toot.extendClass(businesscomponents.editors.judgequestion.ChoiceList, {

    _init_render: function () {
        businesscomponents.editors.judgequestion.ChoiceList.superClass._init_render.call(this);
        this.removeValidationInfo();
    },

    _initializeItem: function () {
        var item = businesscomponents.editors.judgequestion.ChoiceList.superClass._initializeItem.call(this);
        //        item.getTxtContent().setValidationHightlighted(false);
        //radio mode
        item.setRadioMode(this._radioMode);
        if (item.isRadioMode()) item.getRadioInAnswer().setGroup(this._radioGroup);

        return item;
    },
    _disposeItem: function (item) {
        //radio mode
        if (item.isRadioMode()) item.getRadioInAnswer().setGroup(null);
        businesscomponents.editors.choicequestion.ChoiceList.superClass._disposeItem.call(this, item);
    },
    setAtLeastOneChoiceSelectedValidationHighlighted: function (hightlight) {
        if (hightlight) this._$validation_atLeastOneChoiceSelected.show();
        else this._$validation_atLeastOneChoiceSelected.hide();
    },
    removeValidationInfo: function () {
        this.setAtLeastOneChoiceSelectedValidationHighlighted(false);
        if (this._items)
            for (var i = 0, l = this._items.length; i < l; i++)
                this._items[i].getTxtContent().setValidationHightlighted(false);
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
                var item = this._items[i];
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
businesscomponents.editors.judgequestion.ChoiceList.html = '<div>' +
                                                               '<div class="ChoiceboxGroupOuter2" gi="ctnChoice">' +
                                                                 '<div class="ChoiceboxError" style="display:block;" gi="nonItem validation_atLeastOneChoiceSelected"></div>' +
                                                               '</div>' +
                                                               '<div class="marT10 ChoiceboxGroup clearfix">' +
                                                                 '<div class="NotfilledS2 StyleW3 StyleH2 fr" gi="btnAdd"><span class="colorGray font24">+</span></div>' +
                                                               '</div>' +
                                                            '</div>';



businesscomponents.editors.judgequestion.Question = function (opt_html) {
    businesscomponents.editors.judgequestion.Question.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.judgequestion.Question.html)[0]);

    this._rtQuestionTitle = new businesscomponents.editors.RichText();
    this._rtQuestionTitle.appendTo(this._element);
    this._rtQuestionTitle.getInitialView().getLbl2().setText(" 题目题干");
    this._rtQuestionTitle.setConfigFile('/content3/Scripts/ckeditorconfigs/choicequestion.js');

    this._listChoice = new businesscomponents.editors.judgequestion.ChoiceList();

    //    this._listChoice.setSingleModel(false);
    this._listChoice.appendTo(this._element);

    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.judgequestion.Question, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.judgequestion.Question, {
    updateUIByModel: function () {
        if (this._model) {
            this._rtQuestionTitle.setModelAndUpdateUI(this._model.getTitle());
            this._listChoice.setModelAndUpdateUI(this._model.getChoices());
        }
        else {
            this._rtQuestionTitle.setModelAndUpdateUI(null);
            this._listChoice.setModelAndUpdateUI(null);
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.judgequestion.Question();
        this._model.setTitle(this._rtQuestionTitle.updateAndGetModelByUI());
        var choices = this._listChoice.updateAndGetModelByUI();
        this._model.setChoices(choices ? choices.concat([]) : null);
    },

    getRTQuestionTitle: function () { return this._rtQuestionTitle },
    getListChoice: function () { return this._listChoice }
});
businesscomponents.editors.judgequestion.Question.html = '<div></div>'; 
