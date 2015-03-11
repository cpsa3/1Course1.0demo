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

businesscomponents.editors.validators.JudgeQuestionGroupCurrentValidator = function () {
    businesscomponents.editors.validators.JudgeQuestionGroupCurrentValidator.superClass.constructor.call(this);
};
toot.inherit(businesscomponents.editors.validators.JudgeQuestionGroupCurrentValidator, businesscomponents.editors.validators.QuestionGroupCurrentValidatorBase);
toot.extendClass(businesscomponents.editors.validators.JudgeQuestionGroupCurrentValidator, {
    validate: function () {
        if (this._ui.getCurrent() == -1) return true;

        var question = this._ui.getModel().getQuestions()[this._ui.getCurrent()];
        var atLeastOne = false;
        if (question.getChoices())
            for (var i = 0, l = question.getChoices().length; i < l; i++) {
                if (question.getChoices()[i].isInAnswer())
                    atLeastOne = true;
            }

        if (question.getChoices() && question.getChoices().length > 0 && !atLeastOne)
            this._ui.setAtLeastOneChoiceSelectedValidationHighlighted(true);
        else
            this._ui.setAtLeastOneChoiceSelectedValidationHighlighted(false);

        if (!$.trim(question.getTitle())) {
            this._msgBar.setMessage("请填写判断题组题干", this._defaultMessageDuration);
            return false;
        }
        else if (question.getChoices() && question.getChoices().length > 0 && !atLeastOne && this._showMsg) {
            this._msgBar.setMessage("至少选中一个答案", this._defaultMessageDuration);
            return false;
        }
        return true;
    },
    validate2: function () {
        if (this._ui.getCurrent() == -1) return true;

        var question = this._ui.getModel().getQuestions()[this._ui.getCurrent()];
        var atLeastOne = false;
        if (question.getChoices())
            for (var i = 0, l = question.getChoices().length; i < l; i++) {
                if (question.getChoices()[i].isInAnswer())
                    atLeastOne = true;
            }

        if (question.getChoices() && question.getChoices().length > 0 && !atLeastOne)
            this._ui.setAtLeastOneChoiceSelectedValidationHighlighted(true);
        else
            this._ui.setAtLeastOneChoiceSelectedValidationHighlighted(false);

        if (!$.trim(this._ui.getModel().getTitle())) {
            this._msgBar.setMessage("请填写判断题组题目要求", this._defaultMessageDuration);
            return false;
        }
        else if (!$.trim(question.getTitle())) {
            this._msgBar.setMessage("请填写判断题组题干", this._defaultMessageDuration);
            return false;
        }
        else if (question.getChoices() && question.getChoices().length > 0 && !atLeastOne && this._showMsg) {
            this._msgBar.setMessage("至少选中一个答案", this._defaultMessageDuration);
            return false;
        }
        return true;
    }
});

businesscomponents.editors.validators.JudgeQuestionGroupCurrentBlurValidatorBase = function () {
    this._validatedFalseModel = null;
};
toot.inherit(businesscomponents.editors.validators.JudgeQuestionGroupCurrentBlurValidatorBase, businesscomponents.editors.validators.QuestionGroupCurrentValidatorBase);
toot.extendClass(businesscomponents.editors.validators.JudgeQuestionGroupCurrentBlurValidatorBase, {
    getValidatedFalseModel: function () { return this._validatedFalseModel; },
    setValidatedFalseModel: function (model) { this._validatedFalseModel = model; }
});

businesscomponents.editors.validators.JudgeQuestionGroupCurrentBlurValidator = function () {
};
toot.inherit(businesscomponents.editors.validators.JudgeQuestionGroupCurrentBlurValidator, businesscomponents.editors.validators.QuestionGroupCurrentBlurValidatorBase);
toot.extendClass(businesscomponents.editors.validators.JudgeQuestionGroupCurrentBlurValidator, {
    validate: function () {
        var questionBefore = this._validatedFalseModel;
        var questionAfter = this._ui.getModel().getQuestions()[this._ui.getCurrent()];
        var atLeastOneBefore = false;
        var atLeastOneAfter = false;
        if (questionBefore.getChoices())
            for (var i = 0, l = questionBefore.getChoices().length; i < l; i++) {

                if (questionBefore.getChoices()[i].isInAnswer())
                    atLeastOneBefore = true;
                if (questionAfter.getChoices()[i].isInAnswer())
                    atLeastOneAfter = true;
            }

        if (!atLeastOneBefore && atLeastOneAfter) this._ui.setAtLeastOneChoiceSelectedValidationHighlighted(false);
    }
});