var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.validators = businesscomponents.editors.validators || {};

businesscomponents.editors.validators.QuestionGroupCurrentValidatorBase = function () {
    this._ui = null;
    this._msgBar = null;
    this._showMsg = false;
    this._defaultMessageDuration = null;
};
toot.extendClass(businesscomponents.editors.validators.QuestionGroupCurrentValidatorBase, {
    getUI: function () { return this._ui; },
    setUI: function (ui) { this._ui = ui; },
    getMsgBar: function () { return this._msgBar; },
    setMsgBar: function (msgBar) { this._msgBar = msgBar; },
    isShowMsg: function () { return this._showMsg; },
    setShowMsg: function (showMsg) { this._showMsg = showMsg; },
    getDefaultMessageDuration: function () { return this._defaultMessageDuration; },
    setDefaultMessageDuration: function (duration) { this._defaultMessageDuration = duration; },
    validate: function () {
    }
});

businesscomponents.editors.validators.QuestionGroupCurrentValidator = function () {
    businesscomponents.editors.validators.QuestionGroupCurrentValidator.superClass.constructor.call(this);
    //title error msg
    this._titleMsg = "请输入题目要求";
    // show title msg？
    this._showTitleMsg = false;
};
toot.inherit(businesscomponents.editors.validators.QuestionGroupCurrentValidator, businesscomponents.editors.validators.QuestionGroupCurrentValidatorBase);
toot.extendClass(businesscomponents.editors.validators.QuestionGroupCurrentValidator, {
    validate: function () {
        if (this._ui.getCurrent() == -1) return true;

        //增加选择题组 title校验 by xp 2014年3月24日 17:16:56
        if (!this._ui.getModel().getTitle() && this._showMsg && this.isShowTitleMsg()) {
            this._msgBar.setMessage(this.getTitleMsg(), this._defaultMessageDuration);
            return false;
        }

        var question = this._ui.getModel().getQuestions()[this._ui.getCurrent()];
        var atLeastOne = false;
        var resultChoiceContent = true;


        if (question.getChoices())
            for (var i = 0, l = question.getChoices().length; i < l; i++) {
                if (!$.trim(question.getChoices()[i].getContent())) {
                    this._ui.getListChoice().getItems()[i].getTxtContent().setValidationHightlighted(true);
                    resultChoiceContent = false;
                } else {
                    this._ui._listChoice.getItems()[i].getTxtContent().setValidationHightlighted(false);
                }
                if (question.getChoices()[i].isInAnswer())
                    atLeastOne = true;
            }

        if (question.getChoices() && question.getChoices().length > 0 && !atLeastOne)
            this._ui.setAtLeastOneChoiceSelectedValidationHighlighted(true);
        else
            this._ui.setAtLeastOneChoiceSelectedValidationHighlighted(false);

        if (!resultChoiceContent && this._showMsg) {
            this._msgBar.setMessage("请填写答案内容", this._defaultMessageDuration);
            return false;
        } else if (question.getChoices() && question.getChoices().length > 0 && !atLeastOne && this._showMsg) {
            this._msgBar.setMessage("至少选中一个答案", this._defaultMessageDuration);
            return false;
        }
        return true;
    },
    getTitleMsg: function () { return this._titleMsg; },
    setTitleMsg: function (titleMsg) { this._titleMsg = titleMsg; },
    isShowTitleMsg: function () { return this._showTitleMsg; },
    setShowTitleMsg: function (showTitleMsg) { this._showTitleMsg = showTitleMsg; }

});

businesscomponents.editors.validators.QuestionGroupCurrentBlurValidatorBase = function () {
    this._validatedFalseModel = null;
};
toot.inherit(businesscomponents.editors.validators.QuestionGroupCurrentBlurValidatorBase, businesscomponents.editors.validators.QuestionGroupCurrentValidatorBase);
toot.extendClass(businesscomponents.editors.validators.QuestionGroupCurrentBlurValidatorBase, {
    getValidatedFalseModel: function () { return this._validatedFalseModel; },
    setValidatedFalseModel: function (model) { this._validatedFalseModel = model; }
});

businesscomponents.editors.validators.QuestionGroupCurrentBlurValidator = function () {
};
toot.inherit(businesscomponents.editors.validators.QuestionGroupCurrentBlurValidator, businesscomponents.editors.validators.QuestionGroupCurrentBlurValidatorBase);
toot.extendClass(businesscomponents.editors.validators.QuestionGroupCurrentBlurValidator, {
    validate: function () {
        var questionBefore = this._validatedFalseModel;
        var questionAfter = this._ui.getModel().getQuestions()[this._ui.getCurrent()];
        var atLeastOneBefore = false;
        var atLeastOneAfter = false;
        if (questionBefore.getChoices())
            for (var i = 0, l = questionBefore.getChoices().length; i < l; i++) {
                if (!$.trim(questionBefore.getChoices()[i].getContent()) && $.trim(questionAfter.getChoices()[i].getContent()))
                    this._ui.getListChoice().getItems()[i].getTxtContent().setValidationHightlighted(false);
                if (questionBefore.getChoices()[i].isInAnswer())
                    atLeastOneBefore = true;
                if (questionAfter.getChoices()[i].isInAnswer())
                    atLeastOneAfter = true;
            }

        if (!atLeastOneBefore && atLeastOneAfter) this._ui.setAtLeastOneChoiceSelectedValidationHighlighted(false);
    }
});

//sat语法验证
businesscomponents.editors.validators.QuestionGroupCurrentValidatorSat = function () {
    businesscomponents.editors.validators.QuestionGroupCurrentValidatorSat.superClass.constructor.call(this);
};
toot.inherit(businesscomponents.editors.validators.QuestionGroupCurrentValidatorSat, businesscomponents.editors.validators.QuestionGroupCurrentValidatorBase);
toot.extendClass(businesscomponents.editors.validators.QuestionGroupCurrentValidatorSat, {
    validate: function () {
        if (this._ui.getCurrent() == -1) return true;
        var question = this._ui.getModel().getQuestions()[this._ui.getCurrent()];
        var atLeastOne = false;
        var resultChoiceContent = true;
        if (!question.getTitle()) {
            this._msgBar.setMessage("请配置并保存题目文本", this._defaultMessageDuration);
            return false;
        }
        if (!question.getChoices() || question.getChoices().length == 0) {
            this._msgBar.setMessage("请配置题目选项", this._defaultMessageDuration);
            return false;
        }
        if (question.getChoices())
            for (var i = 0, l = question.getChoices().length; i < l; i++) {
                //                if (!$.trim(question.getChoices()[i].getContent())) {
                //                    this._ui.getQuestion().getListChoice().getItems()[i].getTxtContent().setValidationHightlighted(true);
                //                    resultChoiceContent = false;
                //                } else {
                //                    this._ui.getQuestion()._listChoice.getItems()[i].getTxtContent().setValidationHightlighted(false);
                //                }
                if (question.getChoices()[i].isInAnswer())
                    atLeastOne = true;
            }

        if (question.getChoices() && question.getChoices().length > 0 && !atLeastOne)
            this._ui.setAtLeastOneChoiceSelectedValidationHighlighted(true);
        else
            this._ui.setAtLeastOneChoiceSelectedValidationHighlighted(false);

        if (question.getChoices() && question.getChoices().length > 0 && !atLeastOne && this._showMsg) {
            this._msgBar.setMessage("请配置题目答案", this._defaultMessageDuration);
            return false;
        }
        return true;
    }
});
//sat数学验证
businesscomponents.editors.validators.QuestionGroupCurrentValidatForMatchs = function () {
    businesscomponents.editors.validators.QuestionGroupCurrentValidatForMatchs.superClass.constructor.call(this);
};
toot.inherit(businesscomponents.editors.validators.QuestionGroupCurrentValidatForMatchs, businesscomponents.editors.validators.QuestionGroupCurrentValidatorBase);
toot.extendClass(businesscomponents.editors.validators.QuestionGroupCurrentValidatForMatchs, {
    validate: function (reValidate) {
        reValidate = reValidate != null ? reValidate : false;
        if (this._ui.getCurrent() == -1) return true;
        var question = this._ui.getModel().getQuestions()[this._ui.getCurrent()];
        var atLeastOne = false;
        var hasEmptyAnswer = false;
        //校验答案格式
        var hasWrongAnswer = false;
        var isWrongAnswer = false;
        if (reValidate) {
            if (!question.getTitle()) {
                this._msgBar.setMessage("请输入题干", this._defaultMessageDuration);
                return false;
            }
        }

        if (question.getItems())
            for (var i = 0, l = question.getItems().length; i < l; i++) {
                var itemAnswers = question.getItems()[i].getAnswer();
                if (itemAnswers) {
                    for (var j = 0; j < itemAnswers.length; j++) {
                        if (itemAnswers[j]) {
                            atLeastOne = true;
                            break;
                        }
                        else {
                            atLeastOne = false;
                        }
                    }
                    if (itemAnswers[0] && !itemAnswers[1] && itemAnswers[2]) {
                        isWrongAnswer = true;
                    }
                    else if (itemAnswers[1] && !itemAnswers[2] && itemAnswers[3]) {
                        isWrongAnswer = true;
                    }
                    else if (itemAnswers[0] && !itemAnswers[1] && !itemAnswers[2] && itemAnswers[3]) {
                        isWrongAnswer = true;
                    } 
                    else {
                        isWrongAnswer = false;
                    }
                    if (!atLeastOne) {
                        if (reValidate) {
                            this._ui.getListItem().getItems()[i].setValidationHightlighted(true);
                            hasEmptyAnswer = true;
                        //    break;
                        }

                        else {            
                            this._ui.getListItem().getItems()[i].setValidationHightlighted(false);

                        }

                    }
                    else if (isWrongAnswer) {
                            hasWrongAnswer = true;
                            this._ui.getListItem().getItems()[i].setValidationHightlighted(true);
                     //       break;
                        }
                    else {
                        this._ui.getListItem().getItems()[i].setValidationHightlighted(false);
                    }


                }
            }
        if (hasEmptyAnswer) {
            if (reValidate) {
                this._msgBar.setMessage("请填写答案内容", this._defaultMessageDuration);
            }
            return false;
        }
        if (hasWrongAnswer) {
            this._msgBar.setMessage("请填写正确的答案", this._defaultMessageDuration);
            return false;
        }
        return true;
    }
});
