var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.choicewithimgquestion = businesscomponents.editors.choicewithimgquestion || {};

businesscomponents.editors.choicewithimgquestion.Choice = function (opt_html) {
    businesscomponents.editors.choicewithimgquestion.Choice.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.choicewithimgquestion.Choice.html)[0]);
    //删除图片按钮
    this._btnClear = new toot.ui.Button($(this._element).find('[gi~="btnDelImg"]')[0]);
    this._btnClear.setVisible(false);
    //选项A~E
    this._lblTitle = new toot.ui.Label($(this._element).find('[gi~="lblTitle"]')[0]);
    //选项按钮
    this._radioInAnswer = new businesscomponents.Radio();
    this._radioInAnswer.insertBefore(this._lblTitle.getElement());
    //文本框
    this._txtContent = new toot.ui.TextBox($(this._element).find('[gi~="txtContent"]')[0]);
    this._txtContent.setValidationHightlightedStyleConfig({ open: "textstyle2_error", closed: "textstyle2" });
    this._oldTxt = "";
    this._mark = String.fromCharCode(0x25E9);
    this._index = -1;
    this._imgId = 0;
    this._imgName = "";
    //上传图片按钮
    this._btnUpload = new toot.ui.Button($(this._element).find('[gi~="btnUpload"]')[0]);
    this._btnUpload.setEnabledStyleConfig({ enabled: "btnUploadimg", disabled: "btnUploadimgDone" });
    //图片名
    this._lblImgName = new toot.ui.Label($(this._element).find('[gi~="lblImgName"]')[0]);
    this._lblImgName.setVisible(false);
    //    this._radioInAnswer = null;
    //提醒条
    this._msgBar = null;

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.choicewithimgquestion.Choice, toot.view.Item);
toot.extendClass(businesscomponents.editors.choicewithimgquestion.Choice, {

    _init_manageEvents: function () {
        businesscomponents.editors.choicewithimgquestion.Choice.superClass._init_manageEvents.call(this);
        //改变内容，勾选，清空按钮都会触发change
        toot.connect([this._txtContent, this._radioInAnswer], "change", this, function () {
            this.updateModelByUI();
            toot.fireEvent(this, "change");
        });
        toot.connect(this._btnClear, "action", this, this._btnClearAction);

        //文本框输入事件
        $(this._txtContent.getElement()).bind("keyup", { _this: this }, this._txtChange);
        //        $(this._txtContent.getElement()).bind("keypress ", { _this: this }, this._txtKeydown);
        //为了绕过上传导致无法获取当前文本框位置
        $(this._txtContent.getElement()).bind("click", { _this: this }, this._txtIndexChange);
        $(this._txtContent.getElement()).bind("keyup", { _this: this }, this._txtIndexChange);
        //后的焦点的事件
        //        $(this._txtContent.getElement()).bind("focus", { _this: this }, this._txtfoucs);
        //文本框值变动事件
        $(this._txtContent.getElement()).bind("change", { _this: this }, this._txtChange);
        //鼠标移至上面的事件mouseover
        //        $(this._txtContent.getElement()).bind("mouseover", { _this: this }, this._txtChange);
        var _this = this;
        //        var onSubmit = function (file, ext) {
        //            _this._onSubmit(file, ext);
        //        }
        var onComplete = function (file, response) {
            _this._onComplete(file, response);
        }
        //绑定上传
        new AjaxUpload($(_this._btnUpload.getElement()), {
            action: '/Common/UploadImage',
            name: 'file',
            onSubmit: function (file, ext) {
                if (!(ext && /^(jpg|jpeg|bmp|png)$/.test(ext.toLowerCase()))) {
                    var msg = '上传图片类型不符，系统支持bmp、jpg、jpeg、png图片文件';
                    if (_this._msgBar)
                        _this._msgBar.setMessage(msg, true);
                    else
                        alert(msg);
                    //                    alert(msg);
                    return false;
                }
            },
            onComplete: onComplete,
            onError: _this._onError
        });

    },
    //    _txtfoucs: function (e) {
    //        var _this = e.data._this;
    //        alert($(this).val());
    //    },
    //    _txtKeydown: function (e) {
    //        alert("1");
    //        var _this = e.data._this;
    //        if (_this._oldTxt && e.keyCode == 17 && _this._oldTxt.indexOf(_this._mark) == -1 && _this._oldTxt.indexOf(_this._mark) != _this._oldTxt.lastIndexOf(_this._mark)) {
    //            _this._txtContent.setValue(_this._oldTxt);
    //            return;
    //        }
    //    },
    _render: function () {
        businesscomponents.editors.choicewithimgquestion.Choice.superClass._render.call(this);
        //        this._renderRadioMode();
    },

    updateUIByModel: function () {
        this._radioInAnswer.setChecked(false);
        //            else
        //                this._cbInAnswer.setChecked(false);
        //        this._txtContent.setValue(null);
        this._btnUpload.setEnabled(true);
        this._lblImgName.setVisible(false);
        this._lblImgName.setText("");
        this._imgName = "";
        this._imgId = 0;
        $(this._btnUpload.getElement()).attr("disabled", false);
        this._btnClear.setVisible(false);
        if (!this._model) {
            //            if (this._radioMode)

            return;
        }
        //        if (this._radioMode)
        this._radioInAnswer.setChecked(this._model.isInAnswer());
        //        else
        //            this._cbInAnswer.setChecked(this._model.isInAnswer());
        this._txtContent.setValue(this._model.getContent());
        if (this._model.getImgId()) {
            this._imgName = this._model.getImgName();
            this._imgId = this._model.getImgId();
            this._lblImgName.setVisible(true);
            this._lblImgName.setText(this._model.getImgName());
            this._btnUpload.setEnabled(false);
            $(this._btnUpload.getElement()).attr("disabled", "disabled");
            this._btnClear.setVisible(true);
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.choicewithimgquestion.ImgChoice();

        //        if (this._radioMode)
        this._model.setInAnswer(this._radioInAnswer.isChecked());
        //        else
        //            this._model.setInAnswer(this._cbInAnswer.isChecked());
        this._model.setContent(this._txtContent.getValue());
        this._model.setImgId(this._imgId);
        this._model.setImgName(this._imgName);
    },
    updateUIByIdx: function () {
        //set title by the idx
        if (this._idx < 26)
            this._lblTitle.setText(String.fromCharCode(0x41 + this._idx));
        else
            this._lblTitle.setText(null);
    },
    //上传事件
    _onSubmit: function (file, ext) {
        if (!(ext && /^(jpg|jpeg|bmp|png)$/.test(ext.toLowerCase()))) {
            var msg = '上传图片类型不符，系统支持bmp、jpg、jpeg、png图片文件';
            //            if (_this._msgBar) _this._msgBar.setMessage(msg, true);
            //            else alert(msg);
            alert(msg);
            return false;
        }
    },
    //上传完成事件
    _onComplete: function (file, response) {
        try {
            var response = JSON.parse(response);
        }
        catch (e) { }
        //        var index = this._position(this._txtContent.getElement());
        //取出文本老内容
        this._oldTxt = this._txtContent.getValue();
        //生成新的字符串
        var newTxt = this._oldTxt.substring(0, this._index) + this._mark + this._oldTxt.substring(this._index);
        this._txtContent.setValue(newTxt);
        //        this._insertAtCaret(this._txtContent.getElement(), this._mark);
        //显示文件名和删除按钮
        this._lblImgName.setVisible(true);
        //        if (response.fileName && response.fileName.length >= 12) {
        //            this._lblImgName.setText(response.fileName.substring(0, 12) + "...");
        //        }
        //        else {
        this._lblImgName.setText(response.fileName);

        //        }
        this._btnClear.setVisible(true);
        //设置上传按钮不可用
        this._btnUpload.setEnabled(false);
        $(this._btnUpload.getElement()).attr("disabled", "disabled");
        //设置图片id
        this._imgId = response.id;
        this._imgName = response.fileName;
        //更新model
        this.updateModelByUI();

    },
    //上传失败
    _onError: function (file, errorCode) {
        switch (errorCode) {
            case "497":
                toot.fireEvent(_this, "sessionOut");
                //                alert("error497");
                break;
            case "498":
                toot.fireEvent(_this, "sessionOut");
                //                alert("error498");
                break;
            case "499":
            case "500":
                var msg = "未知错误，通知系统管理员";
                if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                else alert(msg);
                //                alert("error500");
                break;
            default:
                break;
        }

        greedyint.dialog.unLock();
    },
    //获取标识位置
    _position: function (el) {
        //        var el = el.get(0);
        var pos = 0;
        if ('selectionStart' in el) {
            pos = el.selectionStart;
        } else if ('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    },
    _insertAtCaret: function (obj, str) {
        if (document.selection) {
            obj.focus();
            var sel = document.selection.createRange();
            sel.text = str;
            sel.select();
            obj.focus();
        } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
            var startPos = obj.selectionStart,
		            endPos = obj.selectionEnd,
		            cursorPos = startPos,
		            tmpStr = obj.value;
            obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
            cursorPos += str.length;
            obj.selectionStart = obj.selectionEnd = cursorPos;
        } else {
            obj.value += str;
        }
    },
    _btnClearAction: function () {
        this._imgId = 0;
        this._lblImgName.setText("");
        this._lblImgName.setVisible(false);
        this._btnClear.setVisible(false);
        if (this._oldTxt.indexOf(this._mark) != -1) {
            this._txtContent.setValue(this._oldTxt.substring(0, this._oldTxt.indexOf(this._mark)) + this._oldTxt.substring(this._oldTxt.indexOf(this._mark) + 1));
        } else {
            this._txtContent.setValue(this._oldTxt);

        }

        this._btnUpload.setEnabled(true);
        $(this._btnUpload.getElement()).attr("disabled", false);
        this.updateModelByUI();
        toot.fireEvent(this, "change");
    },
    _txtChange: function (e) {
        //        alert("1");
        var _this = e.data._this;
        var changeValue = _this._txtContent.getValue();
        _this._oldTxt = changeValue;
        //        var mark = String.fromCharCode(0x25E9);
        if (changeValue.indexOf(_this._mark) == -1) {
            _this._lblImgName.setText("");
            _this._lblImgName.setVisible(false);
            _this._btnClear.setVisible(false);
            _this._btnUpload.setEnabled(true);
            $(_this._btnUpload.getElement()).attr("disabled", false);
            _this._imgId = 0;
        }
        _this.updateModelByUI();
        toot.fireEvent(_this, "change");
    },
    _txtIndexChange: function (e) {
        var _this = e.data._this;
        _this._index = _this._position(_this._txtContent.getElement());
    },
    getBtnDel: function () { return this._btnDel },
    getCBInAnswer: function () { return this._cbInAnswer },
    getRadioInAnswer: function () { return this._radioInAnswer },
    getLblTitle: function () { return this._lblTitle },
    getTxtContent: function () { return this._txtContent },
    setMessageBar: function (msgBar) {
        this._msgBar = msgBar;
    }
});

businesscomponents.editors.choicewithimgquestion.Choice.html =
                                               '<div class="marT10 ChoiceboxGroup  clearfix">' +
                                                 '<div class="fl optionbox" >' +
                                                    '<label gi="lblTitle">A</label>' +
                                                 '</div>' +
                                                 '<div class="fr taskSatChoicePatch2">' +
                                                   '<input type="text" class="textstyle2" gi="txtContent">' +
                                                   '<button class="btnUploadimg" gi="btnUpload"></button>' +
                                                   '<div class="uploadFilebox">' +
                                                     '<span class="uploadText" gi="lblImgName">...12345001.jpg</span>' +
                                                     '<span class="closeItem3" gi="btnDelImg"></span>' +
                                                   '</div>' +
                                                 '</div>' +
                                               '</div>';


businesscomponents.editors.choicewithimgquestion.QuestionGroup = function (opt_html) {
    businesscomponents.editors.choicewithimgquestion.QuestionGroup.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.choicewithimgquestion.QuestionGroup.html)[0]);

    this._rtTitle = new businesscomponents.editors.RichText();
    this._rtTitle.replaceTo($(this._element).find('[gi~="anchorTitle"]')[0]);
    this._rtTitle.getInitialView().getLbl2().setText("题目要求");
    //    this._rtTitle.setConfigFile('/content3/Scripts/ckeditorconfigs/choicewithimgquestion.js');
    // 雅思听力&阅读&听力2 题组要求&选择题题目要求 可增加图片
    this._rtTitle.setConfigFile('/content3/Scripts/ckeditorconfigs/imageTopic.js');
    this._rtTitle.setAttachCKFinder(true);
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
    //    this._rtQuestionTitle.setConfigFile('/content3/Scripts/ckeditorconfigs/choicewithimgquestion.js');
    // 雅思听力&阅读 选择题题干 可增加图片
    this._rtQuestionTitle.setConfigFile('/content3/Scripts/ckeditorconfigs/imageTopic.js');
    this._rtQuestionTitle.setAttachCKFinder(true);
    this._listChoice = new businesscomponents.editors.choicewithimgquestion.ChoiceList();
    this._listChoice.replaceTo($(this._element).find('[gi~="listChoice"]')[0]);

    //for validation on tabs switch
    this._currentValidator = null;
    //for blur validator (this._currentBlurValidator) to compare
    this._currentValidatedFalseModel = null;
    //for validation on choice checkbox and textbox change
    this._currentBlurValidator = null;
    //选项默认值
    this._choiceCountWhenTabAdds = 5;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.choicewithimgquestion.QuestionGroup, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.choicewithimgquestion.QuestionGroup, {

    getRTTitle: function () { return this._rtTitle },
    getTabs: function () { return this._tabs },
    getRTQuetionTitle: function () { return this._rtQuestionTitle },
    getListChoice: function () { return this._listChoice },

    _init_manageEvents: function () {
        businesscomponents.editors.choicewithimgquestion.QuestionGroup.superClass._init_manageEvents.call(this);
        toot.connect(this._tabs, "switch", this, this._onTabsSwitch);
        toot.connect(this._tabs, "add", this, this._onTabsAdd);
        toot.connect(this._tabs, "remove", this, this._onTabsRemove);
        toot.connect(this._tabs, "drag", this, this._onTabsDrag);

        toot.connect(this._tabs, "beforeSwitch", this, this._onTabsBeforeAddOrSwitch);
        toot.connect(this._tabs, "beforeAdd", this, this._onTabsBeforeAddOrSwitch);

        toot.connect(this._listChoice, "change", this, this._onListChoiceChange);
    },
    _init_render: function () {
        businesscomponents.editors.choicewithimgquestion.QuestionGroup.superClass._init_render.call(this);
        this._removeValidationInfo();
    },


    updateUIByModel: function () {
        if (this._model) {
            if (!this._model.getQuestions() || (this._model.getQuestions() && this._current > this._model.getQuestions().length - 1))
                this._current = -1;

            if (this._current == -1) {
                this._rtQuestionTitle.setVisible(false);
                this._listChoice.setVisible(false);
            }
            else {
                this._rtQuestionTitle.setVisible(true);
                this._listChoice.setVisible(true);
            }

            //            this._rtTitle.setModelAndUpdateUI(this._model.getTitle());

            var count = this._model.getQuestions() ? this._model.getQuestions().length : 0;
            var dMin = 0;
            if (count != 0)
                dMin = Math.floor(this._current / this._tabs.getMaxTabs()) * this._tabs.getMaxTabs();
            dMin = dMin < 0 ? 0 : dMin;
            this._tabs.setState(count, dMin, this._current);

            if (this._current == -1) this._rtQuestionTitle.setModelAndUpdateUI(null);
            else this._rtQuestionTitle.setModelAndUpdateUI(this._model.getQuestions()[this._current].getTitle());
            if (this._current == -1) this._listChoice.setModelAndUpdateUI(null);
            else this._listChoice.setModelAndUpdateUI(this._model.getQuestions()[this._current].getChoices());

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
            this._listChoice.setVisible(false);

            this._rtTitle.setModelAndUpdateUI(null);
            this._tabs.setState(0, 0, -1);
            this._rtQuestionTitle.setModelAndUpdateUI(null);
            this._listChoice.setModelAndUpdateUI(null);
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.choicewithimgquestion.QuestionGroup();
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
        //        this.setAtLeastOneChoiceSelectedValidationHighlighted(false);
        this._listChoice.setAtLeastOneChoiceSelectedValidationHighlighted(false);
        if (this._listChoice.getItems())
            for (var i = 0, l = this._listChoice.getItems().length; i < l; i++)
                this._listChoice.getItems()[i].getTxtContent().setValidationHightlighted(false);
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
            this._currentValidatedFalseModel = new models.components.choicewithimgquestion.Question();
            var question = this._model.getQuestions()[this.getCurrent()];
            this._currentValidatedFalseModel.setTitle(question.getTitle());
            if (question.getChoices()) {
                this._currentValidatedFalseModel.setChoices([]);
                for (var i = 0, l = question.getChoices().length; i < l; i++) {
                    var choice = new models.components.choicewithimgquestion.ImgChoice();
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
        if (!this._model) this._model = new models.components.choicewithimgquestion.QuestionGroup();
        if (!this._model.getQuestions()) this._model.setQuestions([]);

        //default with 4 choices
        var question = new models.components.choicewithimgquestion.Question();
        question.setChoices([]);
        for (var i = 0; i < this.getChoiceCountWhenTabAdds(); i++) {
            question.getChoices().push(new models.components.choicewithimgquestion.ImgChoice());
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
    setListMessageBar: function (msgBar) {
        //        this._msgBar = msgBar;
        this._listChoice.setMessageBar(msgBar);
    }

});
businesscomponents.editors.choicewithimgquestion.QuestionGroup.html =
                                                      '<div>' +
                                                        '<div gi="anchorTitle"></div><div gi="anchorTabs"></div><div gi="anchorQuestionTitle"></div>' +
                                                        '<div gi="listChoice">' +
                                                        '</div>' +
                                                      '</div>';



businesscomponents.editors.choicewithimgquestion.ChoiceList = function (opt_html) {
    businesscomponents.editors.choicewithimgquestion.ChoiceList.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.choicewithimgquestion.ChoiceList.html)[0], null,
                      businesscomponents.editors.choicewithimgquestion.Choice, models.components.choicewithimgquestion.ImgChoice, null);

    this._elementContainer = $(this._element).find('[gi~="ctnChoice"]')[0];
    this._nonItemElements = [$(this._element).find('[gi~="nonItem"]')[0]];
    this._elementInsertBefore = $(this._element).find('[gi~="nonItem"]')[0];
    //    this._btnAdd = new toot.ui.Button($(this._element).find('[gi~="btnAdd"]')[0]);

    this._radioGroup = null;
    this._msgBar = null;
    this._$validation_atLeastOneChoiceSelected = $(this._element).find('[gi~="validation_atLeastOneChoiceSelected"]');

    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.choicewithimgquestion.ChoiceList, toot.view.List);
toot.extendClass(businesscomponents.editors.choicewithimgquestion.ChoiceList, {

    _init_render: function () {
        businesscomponents.editors.choicewithimgquestion.ChoiceList.superClass._init_render.call(this);
        this.removeValidationInfo();
    },

    _initializeItem: function () {
        var item = businesscomponents.editors.choicewithimgquestion.ChoiceList.superClass._initializeItem.call(this);
        item.getTxtContent().setValidationHightlighted(false);
        //radio mode
        //        item.setRadioMode(this._radioMode);
        //        if (item.isRadioMode()) 
        item.getRadioInAnswer().setGroup(this._radioGroup);
        return item;
    },

    _disposeItem: function (item) {
        //radio mode
        item.getRadioInAnswer().setGroup(null);
        businesscomponents.editors.choicewithimgquestion.ChoiceList.superClass._disposeItem.call(this, item);
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
    //    //是否保留一个选项，默认为开启，by xp
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
        businesscomponents.editors.choicewithimgquestion.ChoiceList.superClass.updateUIByModel.call(this);
        if (this._singleModel && this._model && this._model.length < 2 && this._model.length > 0) {
            this._items[0].getBtnDel().setVisible(false);
        } else if (this._singleModel && this._model) {
            this._items[0].getBtnDel().setVisible(true);
        }
        //设置每一项的提示框
        if (this._msgBar && this._model && this._model.length > 0) {
            if (this._items && this._items.length > 0) {
                for (var i = 0; i < this._items.length; i++) {
                    this._items[i].setMessageBar(this._msgBar);
                }
            }
        }
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
                //                item.setRadioMode(this._radioMode);
                item.getRadioInAnswer().setGroup(this._radioGroup);
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
    },
    setMessageBar: function (msgBar) {
        this._msgBar = msgBar;
    }

});
businesscomponents.editors.choicewithimgquestion.ChoiceList.html = '<div>' +
                                                               '<div class="ChoiceboxGroupOuter" gi="ctnChoice">' +
                                                                 '<div class="ChoiceboxError" style="display:block;" gi="nonItem validation_atLeastOneChoiceSelected"></div>' +
                                                               '</div>' +
//                                                               '<div class="marT10 ChoiceboxGroup clearfix">' +
//                                                                 '<div class="NotfilledS2 StyleW3 StyleH2 fr" gi="btnAdd"><span class="colorGray font24">+</span></div>' +
//                                                               '</div>' +
                                                            '</div>';



businesscomponents.editors.choicewithimgquestion.Question = function (opt_html) {
    businesscomponents.editors.choicewithimgquestion.Question.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.choicewithimgquestion.Question.html)[0]);

    this._rtQuestionTitle = new businesscomponents.editors.RichText();
    this._rtQuestionTitle.appendTo(this._element);
    this._rtQuestionTitle.getInitialView().getLbl2().setText(" 题目题干");
    this._rtQuestionTitle.setConfigFile('/content3/Scripts/ckeditorconfigs/choicequestion.js');

    this._listChoice = new businesscomponents.editors.choicewithimgquestion.ChoiceList();
    //    this._listChoice.setSingleModel(false);
    this._listChoice.appendTo(this._element);

    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.choicewithimgquestion.Question, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.choicewithimgquestion.Question, {
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
        if (!this._model) this._model = new models.components.choicewithimgquestion.Question();
        this._model.setTitle(this._rtQuestionTitle.updateAndGetModelByUI());
        var choices = this._listChoice.updateAndGetModelByUI();
        this._model.setChoices(choices ? choices.concat([]) : null);
    },

    getRTQuestionTitle: function () { return this._rtQuestionTitle },
    getListChoice: function () { return this._listChoice }
});
businesscomponents.editors.choicewithimgquestion.Question.html = '<div></div>';