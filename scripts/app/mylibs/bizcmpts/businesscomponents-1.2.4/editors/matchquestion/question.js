var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

//matchquestion其实是排序/概括题 由于历史原因名称没有改过来
businesscomponents.editors.matchquestion = businesscomponents.editors.matchquestion || {};

businesscomponents.editors.matchquestion.Choice = function (opt_html) {
    businesscomponents.editors.matchquestion.Choice.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.matchquestion.Choice.html)[0]);

    this._lblTitle = new toot.ui.Label($(this._element).find('[gi~="lblTitle"]')[0]);
    this._txtContent = new toot.ui.TextBox($(this._element).find('[gi~="txtContent"]')[0]);
    this._txtContent.setValidationHightlightedStyleConfig({ open: "textstyle2_error", closed: "textstyle2" });

    this._btnDel = new businesscomponents.editors.DelButton($(this._element).find('[gi~="btnDel"]')[0]);

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.matchquestion.Choice, toot.view.Item);
toot.extendClass(businesscomponents.editors.matchquestion.Choice, {

    _init_manageEvents: function () {
        businesscomponents.editors.matchquestion.Choice.superClass._init_manageEvents.call(this);
        toot.connect(this._txtContent, "change", this, function () {
            this.updateModelByUI();
            toot.fireEvent(this, "change");
        });
    },

    updateUIByModel: function () {
        if (this._model)
            this._txtContent.setValue(this._model.getContent());
        else
            this._txtContent.setValue(null);
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.matchquestion.Choice();
        this._model.setContent(this._txtContent.getValue());
    },
    updateUIByIdx: function () {
        this._lblTitle.setText((this._idx + 1) + "");
    },
    getBtnDel: function () { return this._btnDel },
    getTxtContent: function () { return this._txtContent }

});
businesscomponents.editors.matchquestion.Choice.html = '<div class="marT10 ChoiceboxGroup clearfix">' +
                                                         '<div class="fl optionbox2" gi="lblTitle"></div>' +
                                                         '<div class="fr closeBox">' +
                                                           '<input type="text" class="StyleW4" gi="txtContent">' +
                                                           '<span class="closeItem" gi="btnDel"></span>' +
                                                         '</div>' +
                                                       '</div>';


businesscomponents.editors.matchquestion.ChoiceList = function (opt_html) {
    businesscomponents.editors.matchquestion.ChoiceList.superClass.constructor.call(this,
            $(opt_html !== undefined ? opt_html : businesscomponents.editors.matchquestion.ChoiceList.html)[0], null,
            businesscomponents.editors.matchquestion.Choice, models.components.matchquestion.Choice);

    this._elementContainer = this._element;
    this._nonItemElements = [$(this._element).find('[gi~="nonItem"]')[0]];
    this._elementInsertBefore = $(this._element).find('[gi~="nonItem"]')[0];
    this._btnAdd = new toot.ui.Button($(this._element).find('[gi~="btnAdd"]')[0]);

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.matchquestion.ChoiceList, toot.view.List);
toot.extendClass(businesscomponents.editors.matchquestion.ChoiceList, {

    removeValidationInfo: function () {
        if (this._items)
            for (var i = 0, l = this._items.length; i < l; i++)
                this._items[i].getTxtContent().setValidationHightlighted(false);
    },
    updateUIByModel: function () {
        businesscomponents.editors.matchquestion.ChoiceList.superClass.updateUIByModel.call(this);
        if (this._model && this._model.length < 2) {
            this._items[0].getBtnDel().setVisible(false);
        } else if (this._model) {
            this._items[0].getBtnDel().setVisible(true);
        }
    }

});
businesscomponents.editors.matchquestion.ChoiceList.html = '<div class="ChoiceboxGroupOuter">' +
                                                             '<div class="marT10 ChoiceboxGroup clearfix" gi="nonItem">' +
                                                               '<div class="NotfilledS2 StyleW5 StyleH1 fr" gi="btnAdd"><span class="colorGray font24">+</span></div>' +
                                                             '</div>' +
                                                           '</div>';


businesscomponents.editors.matchquestion.TableOption = function (opt_html) {
    businesscomponents.editors.matchquestion.TableOption.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.matchquestion.TableOption.html)[0]);

    this._cb = new businesscomponents.CheckBox();
    this._cb.setUncheckedClass("notComplete");
    this._cb.setCheckedClass("isComplete");
    this._cb.replaceTo($(this._element).find('[gi~="anchorCB"]')[0]);
    this._lbl = new toot.ui.Label($(this._element).find('[gi~="lbl"]')[0]);
    this._lbl.setText("建立表格");

    this._cb1 = new businesscomponents.CheckBox();
    this._cb1.setUncheckedClass("notComplete");
    this._cb1.setCheckedClass("isComplete");
    this._cb1.setDisableClass("notCompleteDis");
    this._cb1.replaceTo($(this._element).find('[gi~="anchorCB1"]')[0]);
    this._lbl1 = new businesscomponents.Label($(this._element).find('[gi~="lbl1"]')[0]);
    this._lbl1.setText("左右排版");
    this._lbl1.setEnableClass("Fleftbox1");
    this._lbl1.setDisableClass("Fleftbox1 FormDis");
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.matchquestion.TableOption, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.matchquestion.TableOption, {
    getCB: function () { return this._cb },
    getLbl: function () { return this._lbl },
    getCB1: function () { return this._cb1 },
    getLbl1: function () { return this._lbl1 },
    _setCB1Visible: function (visibled) {
        this.getCB1().setVisible(visibled);
        this.getLbl1().setVisible(visibled);
    },
    updateUIByModel: function () {
        if (this._model) {
            if (this._model.getIsCreateTable()) {
                this.getCB().setChecked(true);
                this.getCB1().setDisable(true);
                this.getLbl1().setDisable(true);
            } else {
                this.getCB().setChecked(false);
                this.getCB1().setDisable(false);
                this.getLbl1().setDisable(false);
                if (this._model.getIsComposing()) {
                    this.getCB1().setChecked(true);
                } else {
                    this.getCB1().setChecked(false);
                }

            }
        } else {
            this.getCB1().setDisable(false);
            this.getLbl1().setDisable(false);
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new businesscomponents.editors.matchquestion.TableOption.Model();
        this._model.setIsCreateTable(this.getCB().isChecked());
        this._model.setIsComposing(this.getCB1().isChecked());
    }
});
businesscomponents.editors.matchquestion.TableOption.html = '<div class="marT20 marB20 clearfix"><div class="fl"><span gi="anchorCB"></span><span class="Fleftbox1" gi="lbl"></span></div><div class="fr" ><span gi="anchorCB1"></span><span class="Fleftbox1" gi="lbl1"></span></div></div>';

businesscomponents.editors.matchquestion.TableOption.Model = function () {
    this._isCreateTable = null;
    this._isComposing = null;
};
toot.extendClass(businesscomponents.editors.matchquestion.TableOption.Model, {
    getIsCreateTable: function () { return this._isCreateTable; },
    setIsCreateTable: function (isCreateTable) { this._isCreateTable = isCreateTable; },
    getIsComposing: function () { return this._isComposing; },
    setIsComposing: function (isComposing) { this._isComposing = isComposing; }
});

businesscomponents.editors.matchquestion.AnswerItem = function (opt_html) {
    businesscomponents.editors.matchquestion.AnswerItem.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.matchquestion.AnswerItem.html)[0]);

    this._select = new businesscomponents.Select();
    this._select.setUnselectedText("答案");
    this._select.appendTo($(this._element).find('[gi~="anchorSelect"]')[0]);
    this._btnDel = new toot.ui.Button($(this._element).find('[gi~="btnDel"]')[0]);

    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.matchquestion.AnswerItem, toot.view.Item);
toot.extendClass(businesscomponents.editors.matchquestion.AnswerItem, {
    updateUIByModel: function () {
        if (this._model)
            this._select.setSelectedIndex(this._model.getAnswer() == null ? -1 : this._model.getAnswer());
        else
            this._select.setSelectedIndex(-1);
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.matchquestion.AnswerItem();
        this._model.setAnswer(this._select.getSelectedIndex());
    },
    getSelect: function () { return this._select; },
    getBtnDel: function () { return this._btnDel; }
});
businesscomponents.editors.matchquestion.AnswerItem.html = '<div class="optionbox3 listStyleIco marB10 clearfix">' +
                                                         '<span gi="anchorSelect"></span>' +
                                                         '<span class="closeItem3 fl" gi="btnDel"></span>' +
                                                       '</div>';


businesscomponents.editors.matchquestion.TextItem = function (opt_html) {
    businesscomponents.editors.matchquestion.TextItem.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.matchquestion.TextItem.html)[0]);
    this._txt = new toot.ui.TextBox($(this._element).find('[gi~="txt"]')[0]);
    this._btnDel = new toot.ui.Button($(this._element).find('[gi~="btnDel"]')[0]);
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.matchquestion.TextItem, toot.view.Item);
toot.extendClass(businesscomponents.editors.matchquestion.TextItem, {
    updateUIByModel: function () {
        this._txt.setValue(this._model ? this._model.getText() : null);
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.matchquestion.AnswerItem();
        this._model.setText(this._txt.getValue());
    },
    getTxt: function () { return this._txt }
});
businesscomponents.editors.matchquestion.TextItem.html = '<div class="optionbox3_2 marB10 closeBox">' +
                                                           '<input type="text" class="textstyle2 StyleW8" gi="txt">' +
                                                           '<span class="closeItem" gi="btnDel"></span>' +
                                                         '</div>';


businesscomponents.editors.matchquestion.List = function (opt_html) {
    businesscomponents.editors.matchquestion.List.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.matchquestion.List.html)[0]);

    var _this = this;

    this._elementContainer = this._element;
    this._nonItemElements = [$(this._element).find('[gi~="nonItem"]')[0]];
    this._elementInsertBefore = $(this._element).find('[gi~="nonItem"]')[0];

    this._btnAddText = new toot.ui.Button($(this._element).find('[gi~="btnAddText"]')[0]);
    this._btnAddAnswer = new toot.ui.Button($(this._element).find('[gi~="btnAddAnswer"]')[0]);

    this._$formdis = $(this._element).find('[gi~="formdis"]');

    this._uiInitializers = null;
    this._uiUpdaters = null;

    this._poolTextItem = new toot.lib.Pool(businesscomponents.editors.matchquestion.TextItem);
    this._poolAnswerItem = new toot.lib.Pool(businesscomponents.editors.matchquestion.AnswerItem);

    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.matchquestion.List, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.matchquestion.List, {
    _init_manageEvents: function () {
        toot.view.List.superClass._init_manageEvents.call(this);
        toot.connect([this._btnAddText, this._btnAddAnswer], "action", this, this._onBtnAddAction);
    },

    _initializeItem: function (type) {
        if (type == "text")
            var item = this._poolTextItem.pop();
        else
            var item = this._poolAnswerItem.pop();
        if (this._uiInitializers)
            for (var i = 0, l = this._uiInitializers.length; i < l; i++)
                this._uiInitializers[i](item, { isNew: this._poolUI.isNewLastPoped() });
        toot.connect(item, "actionDel", this, this._onItemActionDel);
        toot.connect(item, "change", this, this._onItemChange);
        return item;
    },
    _disposeItem: function (item) {
        toot.disconnect(item, "actionDel", this, this._onItemActionDel);
        toot.disconnect(item, "change", this, this._onItemChange);
        if (item.constructor == businesscomponents.editors.matchquestion.TextItem)
            this._poolTextItem.push(item);
        else
            this._poolAnswerItem.push(item);
    },

    updateUIByModel: function () {
        if (this._items)
            for (var i = 0, l = this._items; i < l; i++) {
                var item = this._items[i];
                this._disposeItem(item);
            }

        if (this._model) {

            //create and/or delete Item by model
            this._items = [];
            for (var i = 0, l = this._model.length; i < l; i++) {
                if (this._model[i].getType() == models.components.matchquestion.ItemType.Text)
                    this._items.push(this._initializeItem("text"));
                else
                    this._items.push(this._initializeItem("answer"));
            }


            //update each item by corresponding model with same idx
            for (var i = 0, l = this._items.length; i < l; i++) {
                if (this._uiUpdaters)
                    for (var j = 0, m = this._uiUpdaters.length; j < m; j++)
                        this._uiUpdaters[j](this._items[i]);

                this._items[i].setModelAndUpdateUI(this._model[i]);
                //update idx related ui
                this._items[i].setIdxAndUpdateUI(i);
            }

            if (this._elementContainer.childNodes)
                for (var i = this._elementContainer.childNodes.length - 1; i >= 0; i--) {
                    var element = this._elementContainer.childNodes[i];
                    if (!this._nonItemElements || this._nonItemElements.indexOf(element) == -1)
                        this._elementContainer.removeChild(element);
                }

            if (this._elementInsertBefore)
                for (var i = 0, l = this._items.length; i < l; i++)
                    this._items[i].insertBefore(this._elementInsertBefore);
            else
                for (var i = 0, l = this._items.length; i < l; i++)
                    this._items[i].appendTo(this._elementContainer);
        }
        else {
            this._items = null;

            if (this._elementContainer.childNodes)
                for (var i = this._elementContainer.childNodes.length - 1; i >= 0; i--) {
                    var element = this._elementContainer.childNodes[i];
                    if (!this._nonItemElements || this._nonItemElements.indexOf(element) == -1)
                        this._elementContainer.removeChild(element);
                }
        }
    },
    updateModelByUI: function () {
        if (this._items) {
            this._model = this._model || [];
            this._model.splice(0, this._model.length);
            for (var i = 0, l = this._items.length; i < l; i++)
                this._model.push(this._items[i].updateAndGetModelByUI());
        }
        else
            this._model = null;
    },

    _onItemActionDel: function (sender) {
        var e = { preventDefault: false };
        toot.fireEvent(this, "beforeChange", e);
        if (e.preventDefault) return;

        this.updateModelByUI();
        var idx = this._items.indexOf(sender);
        this._model.splice(idx, 1);
        this.updateUIByModel();
        toot.fireEvent(this, "change", { type: "remove", idx: idx });
    },
    _onItemChange: function (sender) {
        toot.fireEvent(this, "beforeChange");

        this.updateModelByUI();
        var idx = this._items.indexOf(sender);
        toot.fireEvent(this, "change", { type: "itemChange", idx: idx });
    },
    _onBtnAddAction: function (sender, e) {
        var e = { preventDefault: false };
        toot.fireEvent(this, "beforeChange", e);
        if (e.preventDefault) return;

        this.updateModelByUI();
        var model = sender == this._btnAddText ? new models.components.matchquestion.TextItem() : new models.components.matchquestion.AnswerItem();
        if (!this._model) this._model = [];
        this._model.push(model);
        this.updateUIByModel();
        toot.fireEvent(this, "change", { type: "add" });
    },

    getUIInitializer: function () { return this._uiInitializers && this._uiInitializers.length > 0 ? this._uiInitializers[0] : null },
    setUIInitializer: function (initializer) { this._uiInitializers = [initializer] },
    getUIInitializers: function () { return this._uiInitializers },
    setUIInitializers: function (initializers) { this._uiInitializers = initializers },

    getUIUpdater: function () { return this._uiUpdaters && this._uiUpdaters.length > 0 ? this._uiUpdaters[0] : null },
    setUIUpdater: function (updater) { this._uiUpdaters = [updater] },
    getUIUpdaters: function () { return this._uiUpdaters },

    setUIUpdaters: function (updaters) { this._uiUpdaters = updaters },

    getBtnAddAnswer: function () { return this._btnAddAnswer },

    getItems: function () {
        return this._items;
    },
    getFormDis: function () {
        return this._$formdis;
    }
});
businesscomponents.editors.matchquestion.List.html = '<div class="taskNoTablebox">' +
                                                             '<div class="QuestionNumGroup optionbox3_3 marB10" gi="nonItem">' +
                                                                 '<div class="addItembox clearfix AddTransition">' +
                                                                     '<div class="addItem2 fl">+</div>' +
                                                                     '<dl class="addItemNew transitionStyle" style="width:150px;">' +
                                                                       '<dd><button class="btnAddTxt" gi="btnAddText"></button></dd>' +
                                                                       '<dd  gi="formdis" ><button class="btnAddAnswer" gi="btnAddAnswer"></button></dd>' +
                                                                    '</dl>' +
                                                                '</div>' +
                                                             '</div>' +
                                                     '</div>';



businesscomponents.editors.matchquestion.HeaderCell = function (opt_html) {
    businesscomponents.editors.matchquestion.HeaderCell.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.matchquestion.HeaderCell.html)[0]);

    this._txt = new toot.ui.TextBox($(this._element).find('[gi~="txt"]')[0]);

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.matchquestion.HeaderCell, toot.view.Item);
toot.extendClass(businesscomponents.editors.matchquestion.HeaderCell, {
    updateUIByModel: function () {
        if (this._model) this._txt.setValue(this._model.getText());
        else this._txt.setValue(null);
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.matchquestion.HeaderCell();
        this._model.setText(this._txt.getValue());
    }
});
businesscomponents.editors.matchquestion.HeaderCell.html = '<th><input type="text" class="inputTh" gi="txt"></th>';


businesscomponents.editors.matchquestion.DataCellInitialContent = function (opt_html) {
    businesscomponents.editors.matchquestion.DataCellInitialContent.superClass.constructor.call(this,
                  $(opt_html !== undefined ? opt_html : businesscomponents.editors.matchquestion.DataCellInitialContent.html)[0]);
    this._btnText = new toot.ui.Button($(this._element).find('[gi~="btnText"]')[0]);
    this._btnAnswer = new toot.ui.Button($(this._element).find('[gi~="btnAnswer"]')[0]);
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.matchquestion.DataCellInitialContent, toot.ui.Component);
toot.extendClass(businesscomponents.editors.matchquestion.DataCellInitialContent, {
    getBtnText: function () { return this._btnText },
    getBtnAnswer: function () { return this._btnAnswer }
});
businesscomponents.editors.matchquestion.DataCellInitialContent.html = '<div class="taskTdEditor">' +
                                                                         '<div class="btnGroup4">' +
                                                                           '<button class="btnAddTxt" gi="btnText"></button>' +
                                                                           '<button class="btnAddAnswer" gi="btnAnswer"></button>' +
                                                                         '</div>' +
                                                                       '</div>';


businesscomponents.editors.matchquestion.DataCellTextContent = function (opt_html) {
    businesscomponents.editors.matchquestion.DataCellTextContent.superClass.constructor.call(this,
                  $(opt_html !== undefined ? opt_html : businesscomponents.editors.matchquestion.DataCellTextContent.html)[0]);
    this._btnDel = new toot.ui.Button($(this._element).find('[gi~="btnDel"]')[0]);
    this._txt = new toot.ui.TextBox($(this._element).find('[gi~="txt"]')[0]);
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.matchquestion.DataCellTextContent, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.matchquestion.DataCellTextContent, {
    getBtnDel: function () { return this._btnDel },
    getTxt: function () { return this._txt },

    updateUIByModel: function () {
        if (this._model) this._txt.setValue(this._model.getText());
        else this._txt.setValue(null);
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.matchquestion.TextCell();
        this._model.setText(this._txt.getValue());
    }
});
businesscomponents.editors.matchquestion.DataCellTextContent.html =
                              '<div class="closeBox2"><input type="text" class="inputTd" gi="txt"><span class="closeItem4" gi="btnDel"></span></div>';


businesscomponents.editors.matchquestion.DataCellAnswerContent = function (opt_html) {
    businesscomponents.editors.matchquestion.DataCellAnswerContent.superClass.constructor.call(this,
                  $(opt_html !== undefined ? opt_html : businesscomponents.editors.matchquestion.DataCellAnswerContent.html)[0]);
    this._btnDel = new toot.ui.Button($(this._element).find('[gi~="btnDel"]')[0]);
    this._select = new businesscomponents.Select();
    this._select.setUnselectedText("答案");
    this._select.replaceTo($(this._element).find('[gi~="anchorSelect"]')[0]);
    //select for answer's group
    this._selectGroup = new businesscomponents.Select();
    $(this._selectGroup.getElement()).addClass("marL10");
    this._selectGroup.setUnselectedText("组");
    this._selectGroup.replaceTo($(this._element).find('[gi~="anchorSelectGroup"]')[0]);
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.matchquestion.DataCellAnswerContent, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.matchquestion.DataCellAnswerContent, {
    getBtnDel: function () { return this._btnDel },
    getSelect: function () { return this._select },
    getSelectGroup: function () { return this._selectGroup },

    updateUIByModel: function () {
        if (this._model) {
            this._select.setSelectedIndex(this._model.getAnswer() == null ? -1 : this._model.getAnswer());
            if (this._selectGroup.isVisible())
                this._selectGroup.setSelectedIndex(this._model.getGroup() != null ? this._model.getGroup() : -1);
        }
        else {
            this._select.setSelectedIndex(-1);
            if (this._selectGroup.isVisible())
                this._selectGroup.setSelectedIndex(-1);
        }

    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.matchquestion.AnswerCell();
        this._model.setAnswer(this._select.getSelectedIndex());
        if (this._selectGroup.isVisible())
            this._model.setGroup(this._selectGroup.getSelectedIndex());
        else
            this._model.setGroup(0);
    }
});
businesscomponents.editors.matchquestion.DataCellAnswerContent.html =
                        '<div class="closeBox2"><div class="optionbox3 listStyleIco"><div gi="anchorSelect"></div><div gi="anchorSelectGroup"></div></div><span class="closeItem4" gi="btnDel"></span></div>';


businesscomponents.editors.matchquestion.DataCell = function (opt_html) {
    businesscomponents.editors.matchquestion.DataCell.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.matchquestion.DataCell.html)[0]);
    this._initialContent = new businesscomponents.editors.matchquestion.DataCellInitialContent();
    this._initialContent.appendTo(this._element);
    this._textContent = new businesscomponents.editors.matchquestion.DataCellTextContent();
    this._textContent.appendTo(this._element);
    this._answerContent = new businesscomponents.editors.matchquestion.DataCellAnswerContent();
    this._answerContent.appendTo(this._element);

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.matchquestion.DataCell, toot.view.Item);
toot.extendClass(businesscomponents.editors.matchquestion.DataCell, {
    getInitialContent: function () { return this._initialContent },
    getTextContent: function () { return this._textContent },
    getAnswerContent: function () { return this._answerContent },

    _init_manageEvents: function () {
        businesscomponents.editors.matchquestion.DataCell.superClass._init_manageEvents.call(this);
        toot.connect(this._initialContent.getBtnText(), "action", this, this._onBtnTextAction);
        toot.connect(this._initialContent.getBtnAnswer(), "action", this, this._onBtnAnswerAction);
        toot.connect([this._textContent.getBtnDel(), this._answerContent.getBtnDel()], "action", this, this._onBtnDelAction);
    },

    _onBtnTextAction: function () {
        this._model = new models.components.matchquestion.TextCell();
        this.updateUIByModel();
    },

    _onBtnAnswerAction: function () {
        this._model = new models.components.matchquestion.AnswerCell();
        this._model.setAnswer(-1);
        this.updateUIByModel();
    },

    _onBtnDelAction: function () {
        this._model = null;
        this.updateUIByModel();
    },

    updateUIByModel: function () {
        if (this._model) {
            if (this._model.getType() == models.components.matchquestion.CellType.Text) {
                this._textContent.setModelAndUpdateUI(this._model);
                this._initialContent.setVisible(false);
                this._textContent.setVisible(true);
                this._answerContent.setVisible(false);

            }
            else if (this._model.getType() == models.components.matchquestion.CellType.Answer) {
                this._answerContent.setModelAndUpdateUI(this._model);
                this._initialContent.setVisible(false);
                this._textContent.setVisible(false);
                this._answerContent.setVisible(true);
            }
        }
        else {
            this._initialContent.setVisible(true);
            this._textContent.setVisible(false);
            this._answerContent.setVisible(false);
        }
    },
    updateModelByUI: function () {
        if (this._initialContent.isVisible()) this._model = null;
        else if (this._textContent.isVisible()) this._model = this._textContent.updateAndGetModelByUI();
        else if (this._answerContent.isVisible()) this._model = this._answerContent.updateAndGetModelByUI();
    }
});
businesscomponents.editors.matchquestion.DataCell.html = '<td></td>';


businesscomponents.editors.matchquestion.HeaderRow = function (opt_html) {
    businesscomponents.editors.matchquestion.HeaderRow.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.matchquestion.HeaderRow.html)[0]);
    this._cells = new toot.view.List(this._element, this._element, businesscomponents.editors.matchquestion.HeaderCell, models.components.matchquestion.HeaderCell);
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.matchquestion.HeaderRow, toot.view.Item);
toot.extendClass(businesscomponents.editors.matchquestion.HeaderRow, {
    updateUIByModel: function () {
        if (this._model) this._cells.setModelAndUpdateUI(this._model.getCells());
        else this._cells.setModelAndUpdateUI(null);
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.matchquestion.Row();
        var cells = this._cells.updateAndGetModelByUI();
        this._model.setCells(cells ? cells.concat([]) : null);
    }
});
businesscomponents.editors.matchquestion.HeaderRow.html = '<tr></tr>';


businesscomponents.editors.matchquestion.DataRow = function (opt_html) {
    businesscomponents.editors.matchquestion.DataRow.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.matchquestion.DataRow.html)[0]);
    this._cells = new toot.view.List(this._element, this._element, businesscomponents.editors.matchquestion.DataCell, models.components.matchquestion.Cell);
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.matchquestion.DataRow, toot.view.Item);
toot.extendClass(businesscomponents.editors.matchquestion.DataRow, {
    getCells: function () {
        return this._cells;
    },

    updateUIByModel: function () {
        if (this._model) this._cells.setModelAndUpdateUI(this._model.getCells());
        else this._cells.setModelAndUpdateUI(null);
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.matchquestion.Row();
        var cells = this._cells.updateAndGetModelByUI();
        this._model.setCells(cells ? cells.concat([]) : null);
    }
});
businesscomponents.editors.matchquestion.DataRow.html = '<tr></tr>';


businesscomponents.editors.matchquestion.Table = function (opt_html) {
    businesscomponents.editors.matchquestion.Table.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.matchquestion.Table.html)[0]);
    this._header = new businesscomponents.editors.matchquestion.HeaderRow();
    this._header.appendTo($(this._element).find('[gi~="ctnHeader"]')[0]);
    var elementCtnRows = $(this._element).find('[gi~="ctnRows"]')[0];
    this._rows = new toot.view.List(elementCtnRows, elementCtnRows, businesscomponents.editors.matchquestion.DataRow, models.components.matchquestion.Row);
    this._btnDel = new toot.ui.Button($(this._element).find('[gi~="btnDel"]')[0]);
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.matchquestion.Table, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.matchquestion.Table, {

    // visible selects ( cell already set to 'A' mode )
    _getSelects: function () {
        var selects = []
        var rows = this._rows.getItems();
        if (rows) {
            for (var i = 0, l = rows.length; i < l; i++) {
                var row = rows[i];
                var cells = row.getCells().getItems();
                if (cells) {
                    for (var j = 0, m = cells.length; j < m; j++) {
                        var cell = cells[j];
                        var modelCell = cell.updateAndGetModelByUI();
                        if (modelCell && modelCell.getType() == models.components.matchquestion.CellType.Answer)
                            selects.push(cell.getAnswerContent().getSelect());
                    }
                }
            }
        }
        return selects;
    },

    updateUIByModel: function () {
        if (this._model) {
            this._header.setModelAndUpdateUI(this._model.getHeader());
            this._rows.setModelAndUpdateUI(this._model.getRows());
        }
        else {
            this._header.setModelAndUpdateUI(null);
            this._rows.setModelAndUpdateUI(null);
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.matchquestion.Table();
        this._model.setHeader(this._header.updateAndGetModelByUI());
        var rows = this._rows.updateAndGetModelByUI();
        this._model.setRows(rows ? rows.concat([]) : null);
        //        var selects = this._getSelects();
        //        var answers = [];
        //        for (var i = 0, l = selects.length; i < l; i++)
        //            answers.push(selects[i].getSelectedIndex());
        //        this._model.setAnswers(answers);
    },

    getHeader: function () { return this._header },
    getRows: function () { return this._rows },
    getBtnDel: function () { return this._btnDel }

});
businesscomponents.editors.matchquestion.Table.html = '<div class="taskTableBox"><span class="closeItem" gi="btnDel"></span><table><thead gi="ctnHeader"></thead><tbody gi="ctnRows"></tbody></table></div>';


businesscomponents.editors.matchquestion.TableManager = function (opt_html) {
    businesscomponents.editors.matchquestion.TableManager.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.matchquestion.TableManager.html)[0]);
    var _this = this;
    this._at = new businesscomponents.editors.AddTable2();
    this._at.appendTo(this._element);
    this._table = new businesscomponents.editors.matchquestion.Table();
    this._table.getRows().setUIInitializers(this._table.getRows().getUIInitializers() || []);
    this._table.getRows().getUIInitializers().push(function (row, args) {
        if (args.isNew) {
            row.getCells().setUIUpdaters(row.getCells().getUIUpdaters() || []);
            row.getCells().getUIUpdaters().push(function (cell) {
                _this._udpateSelectGroupOptions(cell.getAnswerContent().getSelectGroup());
            });
        }
    });

    this._table.appendTo(this._element);
    this._msgBar = null;
    this._poolOptions = new toot.lib.Pool(businesscomponents.Option);
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.matchquestion.TableManager, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.matchquestion.TableManager, {

    _init_manageEvents: function () {
        businesscomponents.editors.matchquestion.TableManager.superClass._init_manageEvents.call(this);
        toot.connect(this._at.getBtnSub(), "action", this, this._onBtnSubAction);
        toot.connect(this._table.getBtnDel(), "action", this, this._onTableBtnDelAction);
    },

    _onTableBtnDelAction: function () {
        this._model = "table";
        this.updateUIByModel();
        //添加：删除表格时，将组数也滞空 by xp
        this._at.getGroupsTextBox().setValue('');
        this._at.setViewState("Initial");
    },

    _onBtnSubAction: function () {
        var row = parseInt(this._at.getRowsTextBox().getValue());
        var column = parseInt(this._at.getColumsTextBox().getValue());
        var group = parseInt(this._at.getGroupsTextBox().getValue());

        if (isNaN(row) || isNaN(column) || row < 2 || column < 2 || row > 20 || column > 10) {
            if (this._msgBar) this._msgBar.setMessage("请正确填写行列数", 3000);
            if (isNaN(row) || row < 2 || row > 20) this._at.getRowsTextBox().setValidationHightlighted(true);
            if (isNaN(column) || column < 2 || column > 10) this._at.getColumsTextBox().setValidationHightlighted(true);
            return;
        }

        var table = new models.components.matchquestion.Table();
        table.setCountGroup(isNaN(group) || group < 1 ? 1 : group);
        var header = new models.components.matchquestion.Row();
        table.setHeader(header);
        header.setCells([]);
        for (var i = 0, l = column; i < l; i++)
            header.getCells().push(null);

        table.setRows([]);
        for (var i = 0, l = row - 1; i < l; i++) {
            var row = new models.components.matchquestion.Row();
            table.getRows().push(row);
            row.setCells([]);
            for (var j = 0, m = column; j < m; j++)
                row.getCells().push(null);
        }

        this._model = table;
        this.updateUIByModel();
    },

    _udpateSelectGroupOptions: function (select) {
        var count = this._model.getCountGroup() ? this._model.getCountGroup() : 1;
        if (select.getOptions().length == count) return;

        while (select.getOptions().length > 0) {
            this._poolOptions.push(select.getOptions()[0]);
            select.remove(0);
        }
        for (var j = 0, m = count; j < m; j++) {
            var option = this._poolOptions.pop();
            option.setText("组 " + (j + 1) + "");
            select.add(option);
        }

        select.setVisible(count > 1);
    },

    updateUIByModel: function () {
        if (this._model && this._model != "table") {
            this._table.setModelAndUpdateUI(this._model);
            this._table.setVisible(true);
            this._at.setVisible(false);
        }
        else {
            this._table.setModelAndUpdateUI(null);
            this._table.setVisible(false);
            this._at.setVisible(true);
        }
    },
    updateModelByUI: function () {
        if (this._table.isVisible()) this._model = this._table.updateAndGetModelByUI();
        else this._model = "table";
    },

    getTable: function () { return this._table },
    getAddTable: function () { return this._at },

    getMsgBar: function () { return this._msgBar },
    setMsgBar: function (bar) { this._msgBar = bar }
});
businesscomponents.editors.matchquestion.TableManager.html = '<div></div>';


businesscomponents.editors.matchquestion.Question = function (opt_html) {
    businesscomponents.editors.matchquestion.Question.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.matchquestion.Question.html)[0]);

    var _this = this;

    this._rtQuestion = new businesscomponents.editors.RichText();
    this._rtQuestion.getInitialView().getLbl2().setText(" 题目题干");
    this._rtQuestion.appendTo(this._element);
    this._rtQuestion.setConfigFile('/content3/Scripts/ckeditorconfigs/choicequestion.js');

    this._cl = new businesscomponents.editors.matchquestion.ChoiceList();
    this._cl.appendTo(this._element);

    this._to = new businesscomponents.editors.matchquestion.TableOption();
    this._to.appendTo(this._element);

    this._al = new businesscomponents.editors.matchquestion.List();
    //设置可用不可用样式


    this._al.getBtnAddAnswer().setEnabledStyleConfig({ enabled: "btnAddAnswer", disabled: "btnAddAnswerDis" });

    this._al.setUIUpdaters(this._al.getUIUpdaters() || []);
    this._al.getUIUpdaters().push(function (item) {
        if (item.constructor == businesscomponents.editors.matchquestion.AnswerItem)
            _this._udpateSelectOptions(item.getSelect());
    });
    this._al.appendTo(this._element);

    this._tm = new businesscomponents.editors.matchquestion.TableManager();
    this._tm.getTable().getRows().setUIInitializers(this._tm.getTable().getRows().getUIInitializers() || []);
    this._tm.getTable().getRows().getUIInitializers().push(function (row, args) {
        if (args.isNew) {
            row.getCells().setUIUpdaters(row.getCells().getUIUpdaters() || []);
            row.getCells().getUIUpdaters().push(function (cell) {
                _this._udpateSelectOptions(cell.getAnswerContent().getSelect());
            });
        }
    });
    this._tm.appendTo(this._element);

    this._poolOptions = new toot.lib.Pool(businesscomponents.Option);

    this._setCBComposingOptionVisible(false);

    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.matchquestion.Question, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.matchquestion.Question, {

    getRTQuestion: function () { return this._rtQuestion },
    getChoiceList: function () { return this._cl },
    getTableOption: function () { return this._to },
    getAnswerList: function () { return this._al },

    _init_manageEvents: function () {
        businesscomponents.editors.matchquestion.Question.superClass._init_manageEvents.call(this);
        toot.connect(this._cl, "change", this, this._onChoiceListChange);
        //        toot.connect(this._al, "change", this, this._onAnswerListChange);
        toot.connect(this._to.getCB(), "change", this, this._onCBTableOptionChange);
        //增加选项跟，answerplace校验
        toot.connect([this._al, this._cl], "change", this, this._onValidateEqual);
    },

    _udpateSelectOptions: function (select) {
        if (select.getOptions().length == this._model.getChoices().length) return;

        while (select.getOptions().length > 0) {
            this._poolOptions.push(select.getOptions()[0]);
            select.remove(0);
        }
        for (var j = 0, m = this._model.getChoices().length; j < m; j++) {
            var option = this._poolOptions.pop();
            option.setText((j + 1) + "");
            select.add(option);
        }
    },

    _onChoiceListChange: function (sender, e) {
        if (e.type == "add" || e.type == "remove") {
            //            this._setAnswerListBtnAddState();
            this.updateModelByUI();
            this.updateUIByModel();
        }
    },

    _onValidateEqual: function (sender, e) {
        if (e.type == "add" || e.type == "remove") {

            this._validateEqual();


        }
    },
    //
    _validateEqual: function () {
        var answerLength = 0;
        var answerFirstIdx = null;
        var choiceLength = this._cl.getModel().length;

        if (this._al.getModel()) {
            for (var i = 0; i < this._al.getItems().length; i++) {
                if (this._al.getItems()[i].getModel().getType() == models.components.matchquestion.ItemType.Answer) {
                    answerLength++;
                    if (!answerFirstIdx) {
                        answerFirstIdx = this._al.getItems()[i].getIdx();
                    }
                }
            }
            if (answerLength == choiceLength) {
                //answer按钮A置灰，place删除按钮置灰
                //setEnabledStyleConfig enabled: "btnAddAnswer", disabled: "btnAddAnswerDis" 

                this._al.getBtnAddAnswer().setEnabled(false);
                this._al.getFormDis().addClass("FormDis2");
                for (var j = 0; j < this._cl.getItems().length; j++) {
                    this._cl.getItems()[j].getBtnDel().setVisible(false);
                }

            } else {
                //初始状态
                this._al.getFormDis().removeClass("FormDis2");
                this._al.getBtnAddAnswer().setEnabled(true);
                //最小选项为1
                if (choiceLength > 1) {
                    for (var j = 0; j < this._cl.getItems().length; j++) {
                        this._cl.getItems()[j].getBtnDel().setVisible(true);
                    }
                }

            }


            //answerplace必须大于等于1
            if (answerLength < 2) {
                this._al.getItems()[answerFirstIdx].getBtnDel().setVisible(false);
            } else {
                this._al.getItems()[answerFirstIdx].getBtnDel().setVisible(true);
            }
        } else {
            //最小选项为1
            if (choiceLength > 1) {
                for (var j = 0; j < this._cl.getItems().length; j++) {
                    this._cl.getItems()[j].getBtnDel().setVisible(true);
                }
            }
        }
    },

    //    _onAnswerListChange: function (sender, e) {
    //        if (e.type = "add" || e.type == "remove") {
    //            //            this._setAnswerListBtnAddState();
    //            this.updateModelByUI();
    //            this.updateUIByModel();
    //        }
    //    },

    _onCBTableOptionChange: function (sender, e) {

        this.updateModelByUI();
        this._to.updateModelByUI();
        if (sender.isChecked()) {
            //未选中表格时，回到初始状态: by xp
            //添加：删除表格时，将组数也滞空 by xp
            this._tm.getAddTable().getGroupsTextBox().setValue('');
            this._tm.getAddTable().setViewState("Initial");
            this._model.setForm("table");

        }
        else {
            var list = new models.components.matchquestion.List();
            list.setItems([]);
            list.getItems().push(new models.components.matchquestion.TextItem());
            for (var i = 0, l = 3; i < 3; i++) {
                var item = new models.components.matchquestion.AnswerItem();
                item.setAnswer(-1);
                list.getItems().push(item);
            }
            this._model.setForm(list);

        }
        this._to.updateUIByModel();
        this.updateUIByModel();
        //
        this._validateEqual();
    },
    _setCBComposingOptionVisible: function (Visibled) {
        this._to._setCB1Visible(Visibled);
    },
    _setAnswerListBtnAddState: function () {
        var clCount = this._cl.getModel() ? this._cl.getModel().length : 0;
        var alCount = this._al.getModel() ? this._al.getModel().length : 0;

        if (clCount > alCount)
            this._al.getBtnAdd().setVisible(true);
        else
            this._al.getBtnAdd().setVisible(false);
    },

    updateUIByModel: function () {
        if (this._model) {
            this._cl.setModelAndUpdateUI(this._model.getChoices());
            this._rtQuestion.setModelAndUpdateUI(this._model.getTopic());
            this._to.updateModelByUI();
            if (this._model.getForm()) {
                if (this._model.getForm() == "table" || this._model.getForm().getType() == models.components.matchquestion.AnswerFormType.Table) {
                    this._al.setModelAndUpdateUI(null);
                    this._tm.setModelAndUpdateUI(this._model.getForm());

                    this._al.setVisible(false);
                    this._tm.setVisible(true);

                    //                    this._to.getCB().setChecked(true);

                    this._to.getModel().setIsCreateTable(true);
                }
                else if (this._model.getForm().getType() == models.components.matchquestion.AnswerFormType.List) {
                    this._al.setModelAndUpdateUI(this._model.getForm().getItems());
                    this._tm.setModelAndUpdateUI(null);

                    this._al.setVisible(true);
                    this._tm.setVisible(false);
                    this._to.getCB().setChecked(false);
                    this._to.getModel().setIsCreateTable(false);
                    this._to.getModel().setIsComposing(this._model.getComposing());



                }
                this._to.updateUIByModel();
                this._to.setVisible(true);
            }
        }
        else {
            this._al.setModelAndUpdateUI(null);
            this._tm.setModelAndUpdateUI(null);

            this._al.setVisible(false);
            this._tm.setVisible(false);

            this._to.getCB().setChecked(false);
            this._to.setVisible(false);
            this._to.updateUIByModel();
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.matchquestion.Question();
        this._model.setChoices(this._cl.updateAndGetModelByUI() ? this._cl.updateAndGetModelByUI().concat([]) : null);
        this._model.setTopic(this._rtQuestion.updateAndGetModelByUI());
        if (this._to.getCB().isChecked()) {
            this._model.setForm(this._tm.updateAndGetModelByUI());
            this._model.setComposing(false);
        } else {
            var list = new models.components.matchquestion.List();
            list.setItems(this._al.updateAndGetModelByUI());
            this._model.setForm(list);
            if (this._to.getCB1().isChecked()) {
                this._model.setComposing(true);
            } else {
                this._model.setComposing(false);
            }
            this._to.updateModelByUI();
        }

    },

    getTableManager: function () { return this._tm }
});
businesscomponents.editors.matchquestion.Question.html = '<div></div>'



