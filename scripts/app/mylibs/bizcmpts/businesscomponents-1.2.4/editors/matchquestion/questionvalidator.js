var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

//matchquestion其实是排序/概括题 由于历史原因名称没有改过来
businesscomponents.editors.matchquestion = businesscomponents.editors.matchquestion || {};


businesscomponents.editors.matchquestion.ChoiceListValidator = function () {
    businesscomponents.editors.matchquestion.ChoiceListValidator.superClass.constructor.call(this);
}
toot.inherit(businesscomponents.editors.matchquestion.ChoiceListValidator, businesscomponents.editors.validators.ValidatorBase);
toot.extendClass(businesscomponents.editors.matchquestion.ChoiceListValidator, {
    validate: function (reValidate) {
        reValidate = reValidate != null ? reValidate : false;
        var resultChoiceContent = true;
        var choices = this._ui.getItems();
        if (choices)
            for (var i = 0, l = choices.length; i < l; i++) {
                if (!$.trim(choices[i].getTxtContent().getValue())) {
                    if (!reValidate)
                        this._ui.getItems()[i].getTxtContent().setValidationHightlighted(true);
                    resultChoiceContent = false;
                } else {
                    this._ui.getItems()[i].getTxtContent().setValidationHightlighted(false);
                }
            }

        if (this._msgBar && this._showMsg && !reValidate) {
            if (!resultChoiceContent) this._msgBar.setMessage("请填写答案内容", this._msgDuration);
        }

        return resultChoiceContent;
    }
});



businesscomponents.editors.matchquestion.QuestionValidator = function () {
    businesscomponents.editors.matchquestion.QuestionValidator.superClass.constructor.call(this);
    //    this._choiceListValidator = new businesscomponents.editors.matchquestion.ChoiceListValidator();
}
toot.inherit(businesscomponents.editors.matchquestion.QuestionValidator, businesscomponents.editors.validators.ValidatorBase);
toot.extendClass(businesscomponents.editors.matchquestion.QuestionValidator, {

    //    setUI: function (ui) {
    //        businesscomponents.editors.matchquestion.QuestionValidator.superClass.setUI.call(this, ui);
    //        this._choiceListValidator.setUI(ui);
    //    },
    //    setModel: function (model) {
    //        businesscomponents.editors.matchquestion.QuestionValidator.superClass.setUI.call(this, model);
    //        this._choiceListValidator.setModel(ui);
    //    },

    //    setRelatedModel: function (model) {
    //        businesscomponents.editors.matchquestion.QuestionValidator.superClass.setUI.call(this, model);
    //        this._choiceListValidator.setRelatedModel(model);
    //    },
    //    setValidatedFalseModel: function (model) {
    //        businesscomponents.editors.matchquestion.QuestionValidator.superClass.setUI.call(this, model);
    //        this._choiceListValidator.setValidatedFalseModel(model);
    //    },

    //    setMsgBar: function (msgBar) {
    //        businesscomponents.editors.matchquestion.QuestionValidator.superClass.setUI.call(this, msgBar);
    //        this._choiceListValidator.setMsgBar(msgBar);
    //    },
    //    setShowMsg: function (showMsg) {
    //        businesscomponents.editors.matchquestion.QuestionValidator.superClass.setUI.call(this, showMsg);
    //        this._choiceListValidator.setShowMsg(showMsg);
    //    },
    //    setMsgDuration: function (duration) {
    //        businesscomponents.editors.matchquestion.QuestionValidator.superClass.setUI.call(this, duration);
    //        this._choiceListValidator.setMsgDuration(duration);
    //    },

    validate: function () {

        var choiceCount = this._model.getChoices() ? this._model.getChoices().length : 0;

        if (this._model.getForm() == "table") {
            if (this._msgBar && this._showMsg)
                this._msgBar.setMessage("请设定表格", this._msgDuration);
            return false;
        }
        else if (this._model.getForm().getType() == models.components.matchquestion.AnswerFormType.List) {
            var answers = [];
            var resultSameAnswer = true;
            var resultAnswer = true;
            var countAnswer = 0;
            var items = this._model.getForm().getItems();
            if (items)
                for (var i = 0, l = items.length; i < l; i++)
                    if (items[i].getType() == models.components.matchquestion.ItemType.Answer) {
                        countAnswer++;
                        if (items[i].getAnswer() == -1)
                            resultAnswer = false;
                        else {
                            if (answers[items[i].getAnswer()]) resultSameAnswer = false;
                            else answers[items[i].getAnswer()] = true;
                        }
                    }
            if (countAnswer == 0) {
                if (this._msgBar && this._showMsg)
                    this._msgBar.setMessage("请至少设置一个答案", this._msgDuration);
                return false;
            }
            if (countAnswer > choiceCount) {
                if (this._msgBar && this._showMsg)
                    this._msgBar.setMessage("答案数量须小于等于选项数量", this._msgDuration);
                return false;
            }
            if (!resultAnswer) {
                if (this._msgBar && this._showMsg)
                    this._msgBar.setMessage("请选择答案", this._msgDuration);
                return false;
            }
            if (!resultSameAnswer) {
                if (this._msgBar && this._showMsg)
                    this._msgBar.setMessage("答案不能相同", this._msgDuration);
                return false;
            }
        }
        else if (this._model.getForm().getType() == models.components.matchquestion.AnswerFormType.Table) {
            var answers = [];
            var resultSameAnswer = true;
            var resultAnswer = true;
            var resultGroup = true;
            var countAnswer = 0;
            var rows = this._model.getForm().getRows();
            if (rows)
                for (var i = 0, l = rows.length; i < l; i++) {
                    var cells = rows[i].getCells()
                    if (cells)
                        for (var j = 0, m = cells.length; j < m; j++)
                            if (cells[j] && cells[j].getType() == models.components.matchquestion.CellType.Answer) {
                                countAnswer++;
                                if (cells[j].getAnswer() == -1) {
                                    resultAnswer = false;
                                }
                                else {
                                    if (answers[cells[j].getAnswer()]) resultSameAnswer = false;
                                    else answers[cells[j].getAnswer()] = true;
                                }
                                if (cells[j].getGroup() == -1)
                                    resultGroup = false;
                            }
                }

            if (countAnswer == 0) {
                if (this._msgBar && this._showMsg)
                    this._msgBar.setMessage("请至少设置一个答案", this._msgDuration);
                return false;
            }
            if (countAnswer > choiceCount) {
                if (this._msgBar && this._showMsg)
                    this._msgBar.setMessage("答案数量须小于等于选项数量", this._msgDuration);
                return false;
            }
            if (!resultAnswer) {
                if (this._msgBar && this._showMsg)
                    this._msgBar.setMessage("请选择答案", this._msgDuration);
                return false;
            }
            if (!resultSameAnswer) {
                if (this._msgBar && this._showMsg)
                    this._msgBar.setMessage("答案不能相同", this._msgDuration);
                return false;
            }
            if (!resultGroup) {
                if (this._msgBar && this._showMsg)
                    this._msgBar.setMessage("请选择组", this._msgDuration);
                return false;
            }

        }

        return true;
    }
});
