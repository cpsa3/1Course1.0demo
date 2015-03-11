var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.fillquestionforsatmaths = businesscomponents.editors.fillquestionforsatmaths || {};

businesscomponents.editors.fillquestionforsatmaths.Item = function (opt_html) {
    businesscomponents.editors.fillquestionforsatmaths.Item.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.fillquestionforsatmaths.Item.html)[0]);
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
    if (this.constructor == arguments.callee) this._init();

};
toot.inherit(businesscomponents.editors.fillquestionforsatmaths.Item, toot.view.Item);
toot.extendClass(businesscomponents.editors.fillquestionforsatmaths.Item, {

    _init_manageEvents: function () {
        businesscomponents.editors.fillquestionforsatmaths.Item.superClass._init_manageEvents.call(this);
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
        if (answer != "") {
            this.setValidationHightlighted(false);
        }
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
        toot.fireEvent(this, "change");
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
        businesscomponents.editors.fillquestionforsatmaths.Item.superClass._render.call(this);
        //        this._renderRadioMode();
    },

    updateUIByModel: function () {
        if (this._model && this._model.getAnswer().length > 0) {
            $(this._btnAnswer1.getElement()).text(this._model.getAnswer()[0]);
            $(this._btnAnswer2.getElement()).text(this._model.getAnswer()[1]);
            $(this._btnAnswer3.getElement()).text(this._model.getAnswer()[2]);
            $(this._btnAnswer4.getElement()).text(this._model.getAnswer()[3]);
            //            var temp = "";
            //            for (var i = 0; i < this._model.getAnswer().length; i++) {
            //                temp += this._model.getAnswer()[i];
            //            }
            //            if (temp == "") {
            //                this.setValidationHightlighted(true);
            //            }
            //            else {
            //                this.setValidationHightlighted(false);

            //            }
        }
        else {
            this.setValidationHightlighted(false);
            $(this._btnAnswer1.getElement()).text("");
            $(this._btnAnswer2.getElement()).text("");
            $(this._btnAnswer3.getElement()).text("");
            $(this._btnAnswer4.getElement()).text("");
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = models.components.fillquestionforsatmaths.Item();
        var answer = [];
        answer.push($(this._btnAnswer1.getElement()).text());
        answer.push($(this._btnAnswer2.getElement()).text());
        answer.push($(this._btnAnswer3.getElement()).text());
        answer.push($(this._btnAnswer4.getElement()).text());
        this._answer = answer;
        this._model.setAnswer(answer);
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

businesscomponents.editors.fillquestionforsatmaths.Item.html =
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


businesscomponents.editors.fillquestionforsatmaths.QuestionGroup = function (opt_html) {
    businesscomponents.editors.fillquestionforsatmaths.QuestionGroup.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.fillquestionforsatmaths.QuestionGroup.html)[0]);

    //    this._rtTitle = new businesscomponents.editors.RichText();
    //    this._rtTitle.replaceTo($(this._element).find('[gi~="anchorTitle"]')[0]);
    //    this._rtTitle.getInitialView().getLbl2().setText("题目要求");
    //    //    this._rtTitle.setConfigFile('/content3/Scripts/ckeditorconfigs/fillquestionforsatmaths.js');
    //    // 雅思听力&阅读&听力2 题组要求&选择题题目要求 可增加图片
    //    this._rtTitle.setConfigFile('/content3/Scripts/ckeditorconfigs/imageTopic.js');
    //    this._rtTitle.setAttachCKFinder(true);
    this._tabs = new businesscomponents.Tabs();
    //切换时更换选中标签页
    this._tabs._switchWhenScroll = true;
    //设置分页模式
    this._tabs.setPagingMode(businesscomponents.Tabs.PagingMode.Pages);

    this._tabs.setSwitchToNewAdded(true);
    this._tabs.replaceTo($(this._element).find('[gi~="anchorTabs"]')[0]);

    this._rtQuestionTitle = new businesscomponents.editors.RichText();
    this._rtQuestionTitle.getInitialView().getLbl2().setText("题干");
    this._rtQuestionTitle.setConfigFile('/content3/Scripts/ckeditorconfigs/imageupload.js');
    this._rtQuestionTitle.setAttachCKFinder(true);
    this._rtQuestionTitle.replaceTo($(this._element).find('[gi~="anchorQuestionTitle"]')[0]);

    this._listItem = new businesscomponents.editors.fillquestionforsatmaths.ItemList();
    this._listItem.replaceTo($(this._element).find('[gi~="listItems"]')[0]);

    //for validation on tabs switch
    this._currentValidator = null;
    //for blur validator (this._currentBlurValidator) to compare
    this._currentValidatedFalseModel = null;
    //for validation on choice checkbox and textbox change
    this._currentBlurValidator = null;
    //选项默认值
    this._itemCountWhenTabAdds = 5;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.fillquestionforsatmaths.QuestionGroup, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.fillquestionforsatmaths.QuestionGroup, {

    getRTTitle: function () { return this._rtTitle },
    getTabs: function () { return this._tabs },
    getRTQuetionTitle: function () { return this._rtQuestionTitle },
    getListChoice: function () { return this._listItem },

    _init_manageEvents: function () {
        businesscomponents.editors.fillquestionforsatmaths.QuestionGroup.superClass._init_manageEvents.call(this);
        toot.connect(this._tabs, "switch", this, this._onTabsSwitch);
        toot.connect(this._tabs, "add", this, this._onTabsAdd);
        toot.connect(this._tabs, "remove", this, this._onTabsRemove);
        toot.connect(this._tabs, "drag", this, this._onTabsDrag);

        toot.connect(this._tabs, "beforeSwitch", this, this._onTabsBeforeAddOrSwitch);
        toot.connect(this._tabs, "beforeAdd", this, this._onTabsBeforeAddOrSwitch);

        toot.connect(this._listItem, "change", this, this._onListChoiceChange);
    },
    _init_render: function () {
        businesscomponents.editors.fillquestionforsatmaths.QuestionGroup.superClass._init_render.call(this);
        this._removeValidationInfo();
    },


    updateUIByModel: function () {
        if (this._model) {
            if (!this._model.getQuestions() || (this._model.getQuestions() && this._current > this._model.getQuestions().length - 1))
                this._current = -1;

            if (this._current == -1) {
                this._rtQuestionTitle.setVisible(false);
                this._listItem.setVisible(false);
            }
            else {
                this._rtQuestionTitle.setVisible(true);
                this._listItem.setVisible(true);
            }

            //            this._rtTitle.setModelAndUpdateUI(this._model.getTitle());

            var count = this._model.getQuestions() ? this._model.getQuestions().length : 0;
            var dMin = 0;
            if (count != 0)
                dMin = Math.floor(this._current / this._tabs.getMaxTabs()) * this._tabs.getMaxTabs();
            dMin = dMin < 0 ? 0 : dMin;
            this._tabs.setState(count, dMin, this._current);

            if (this._current == -1)
                this._rtQuestionTitle.setModelAndUpdateUI(null);
            else
                this._rtQuestionTitle.setModelAndUpdateUI(this._model.getQuestions()[this._current].getTitle());
            if (this._current == -1)
                this._listItem.setModelAndUpdateUI(null);
            else
                this._listItem.setModelAndUpdateUI(this._model.getQuestions()[this._current].getItems());

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

            this._rtQuestionTitle.setVisible(false);
            this._listItem.setVisible(false);

            //            this._rtTitle.setModelAndUpdateUI(null);
            this._tabs.setState(0, 0, -1);
            this._rtQuestionTitle.setModelAndUpdateUI(null);
            this._listItem.setModelAndUpdateUI(null);
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.fillquestionforsatmaths.QuestionGroup();
        //        this._model.setTitle(this._rtTitle.updateAndGetModelByUI());
        if (this._current != -1) {
            this._model.getQuestions()[this._current].setTitle(this._rtQuestionTitle.updateAndGetModelByUI());
            var items = this._listItem.updateAndGetModelByUI();
            this._model.getQuestions()[this._current].setItems(items ? items.concat([]) : null);
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
        //        this._listItem.setAtLeastOneChoiceSelectedValidationHighlighted(hightlight);
        //        if (hightlight) this._$validation_atLeastOneChoiceSelected.show();
        //        else this._$validation_atLeastOneChoiceSelected.hide();
    },
    _removeValidationInfo: function () {
        this._currentValidatedFalseModel = null;
        //        this.setAtLeastOneChoiceSelectedValidationHighlighted(false);
        //        this._listChoice.setAtLeastOneChoiceSelectedValidationHighlighted(false);
        //        if (this._listItem.getItems())
        //            for (var i = 0, l = this._listItem.getItems().length; i < l; i++)
        //                this._listItem.getItems()[i].getTxtContent().setValidationHightlighted(false);
    },
    _onTabsBeforeAddOrSwitch: function (sender, e) {
        this.updateModelByUI();
        var result = true;
        if (this._current != -1 && this._currentValidator) {
            this._currentValidator.setUI(this);
            this._currentValidator.setShowMsg(true);
            result = this._currentValidator.validate(true);
        }
        if (!result) {
            //create the _currentValidatedFalseModel ( COPY )
            //            this._currentValidatedFalseModel = new models.components.fillquestionforsatmaths.Question();
            //            var question = this._model.getQuestions()[this.getCurrent()];
            //            this._currentValidatedFalseModel.setTitle(question.getTitle());
            //            if (question.getChoices()) {
            //                this._currentValidatedFalseModel.setChoices([]);
            //                for (var i = 0, l = question.getChoices().length; i < l; i++) {
            //                    var choice = new models.components.fillquestionforsatmaths.Choice();
            //                    choice.setInAnswer(question.getChoices()[i].isInAnswer());
            //                    choice.setContent(question.getChoices()[i].getContent());
            //                    this._currentValidatedFalseModel.getChoices().push(choice);
            //                }
            //            }

            e.preventDefault = true;
        }
    },
    _onListChoiceChange: function (sender, e) {
        if (e.type == "itemChange") {
            this.updateModelByUI();
            //            if (this._currentValidator) {
            //                this._currentValidator.setUI(this);
            //                this._currentValidator.setShowMsg(false);
            //                //                this._currentBlurValidator.setValidatedFalseModel(this._currentValidatedFalseModel);
            //                this._currentValidator.validate(false);
            //            }
        }
        //增加最小选项
        else if (e.type == "remove" || e.type == "add") {


            //            if (!this._listChoice.getModel() || this._listChoice.getModel().length == 0)
            //                this.setAtLeastOneChoiceSelectedValidationHighlighted(false);
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
        if (!this._model) this._model = new models.components.fillquestionforsatmaths.QuestionGroup();
        if (!this._model.getQuestions()) this._model.setQuestions([]);

        //default with 4 choices
        var question = new models.components.fillquestionforsatmaths.Question();
        question.setItems([]);
        for (var i = 0; i < this.getItemCountWhenTabAdds(); i++) {
            question.getItems().push(new models.components.fillquestionforsatmaths.Item());
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
    getItemCountWhenTabAdds: function () {
        return this._itemCountWhenTabAdds;
    },
    setItemCountWhenTabAdds: function (itemCount) {
        if (this._itemCountWhenTabAdds == itemCount) return;
        this._itemCountWhenTabAdds = itemCount;
    },
    getListItem: function () {
        return this._listItem;
    }

});
businesscomponents.editors.fillquestionforsatmaths.QuestionGroup.html =
                                                      '<div>' +
                                                        '<div gi="anchorTitle"></div><div gi="anchorTabs"></div><div gi="anchorQuestionTitle"></div>' +
                                                        '<div gi="listItems" class="taskSatAnswerOuter">' +
                                                        '</div>' +
                                                      '</div>';


//list
businesscomponents.editors.fillquestionforsatmaths.ItemList = function (opt_html) {
    businesscomponents.editors.fillquestionforsatmaths.ItemList.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.fillquestionforsatmaths.ItemList.html)[0], null,
                      businesscomponents.editors.fillquestionforsatmaths.Item, models.components.fillquestionforsatmaths.Item, null);

    this._elementContainer = $(this._element).find('[gi~="ctnItem"]')[0];
    this._btnAdd = new toot.ui.Button($(this._element).find('[gi~="btnAdd"]')[0]);
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.fillquestionforsatmaths.ItemList, toot.view.List);
toot.extendClass(businesscomponents.editors.fillquestionforsatmaths.ItemList, {

    _init_render: function () {
        businesscomponents.editors.fillquestionforsatmaths.ItemList.superClass._init_render.call(this);
        this.removeValidationInfo();
    },

    //    _initializeItem: function () {
    //        var item = businesscomponents.editors.fillquestionforsatmaths.ItemList.superClass._initializeItem.call(this);
    //        toot.connect(item, "change", this, this._onAnswerChoice);
    //        return item;
    //    },

    _disposeItem: function (item) {
        businesscomponents.editors.fillquestionforsatmaths.ItemList.superClass._disposeItem.call(this, item);
    },

    setAtLeastOneChoiceSelectedValidationHighlighted: function (hightlight) {
        //        if (hightlight) this._$validation_atLeastOneChoiceSelected.show();
        //        else this._$validation_atLeastOneChoiceSelected.hide();
    },
    removeValidationInfo: function () {
        //        this.setAtLeastOneChoiceSelectedValidationHighlighted(false);
        //        if (this._items)
        //            for (var i = 0, l = this._items.length; i < l; i++)
        //                this._items[i].getTxtContent().setValidationHightlighted(false);
    },
    updateUIByModel: function () {
        businesscomponents.editors.fillquestionforsatmaths.ItemList.superClass.updateUIByModel.call(this);
        this._btnAdd.setVisible(true);
        if (this._model && this._model.length < 2 && this._model.length > 0) {
            this._items[0].getBtnDel().setVisible(false);
            //            toot.connect(this._items[0], "change", this, this._onAnswerChoice);
        }
        else if (this._model && this._model.length >= 5) {
            this._items[4].getBtnDel().setVisible(true);
            this._btnAdd.setVisible(false);
        }
        else if (this._model) {

            for (var i = 0; i < this._items.length; i++) {

                this._items[i].getBtnDel().setVisible(true);
                //                _init_manageEvents: function () {

                //    },
            }
        }
    }
    //    _onAnswerChoice: function (seder, e) {
    //        toot.fireEvent(this, "change", e);
    //    }

});
businesscomponents.editors.fillquestionforsatmaths.ItemList.html = '<div class="taskSatAnswerOuter">' +
                                                                           '<div  gi="ctnItem">' +
                                                                           '</div>' +
                                                                            '<div class="NotfilledS2" gi="btnAdd">' +
                                                                                '<span class="font24">+</span>' +
                                                                            '</div>' +
                                                                     '</div>';