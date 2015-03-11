var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.choicequestion = businesscomponents.editors.choicequestion || {};

businesscomponents.editors.choicequestion.ChoiceListValidator = function () {
    businesscomponents.editors.choicequestion.ChoiceListValidator.superClass.constructor.call(this);
}
toot.inherit(businesscomponents.editors.choicequestion.ChoiceListValidator, businesscomponents.editors.validators.ValidatorBase);
toot.extendClass(businesscomponents.editors.choicequestion.ChoiceListValidator, {
    validate: function (reValidate) {
        reValidate = reValidate != null ? reValidate : false;

        var resultAtLeastOneInAnswerIfHasChoice = false;
        var resultChoiceContent = true;
        var choices = this._ui.getItems();
        if (choices && choices.length > 0)
            for (var i = 0, l = choices.length; i < l; i++) {
                if (!$.trim(choices[i].getTxtContent().getValue())) {
                    if (!reValidate)
                        this._ui.getItems()[i].getTxtContent().setValidationHightlighted(true);
                    resultChoiceContent = false;
                } else {
                    this._ui.getItems()[i].getTxtContent().setValidationHightlighted(false);
                }
                if ((choices[i].isRadioMode() && choices[i].getRadioInAnswer().isChecked()) ||
                   (!choices[i].isRadioMode() && choices[i].getCBInAnswer().isChecked()))
                    resultAtLeastOneInAnswerIfHasChoice = true;
            }
        else
            resultAtLeastOneInAnswerIfHasChoice = true;

        if (resultAtLeastOneInAnswerIfHasChoice)
            this._ui.setAtLeastOneChoiceSelectedValidationHighlighted(false);
        else if (!reValidate)
            this._ui.setAtLeastOneChoiceSelectedValidationHighlighted(true);

        if (this._msgBar && this._showMsg && !reValidate) {
            if (!resultChoiceContent) this._msgBar.setMessage("请填写答案内容", this._msgDuration);
            else if (!resultAtLeastOneInAnswerIfHasChoice) this._msgBar.setMessage("至少选中一个答案", this._msgDuration);
        }

        return resultAtLeastOneInAnswerIfHasChoice && resultChoiceContent;
    }
});

