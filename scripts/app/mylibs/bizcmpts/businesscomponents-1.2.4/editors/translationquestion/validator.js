var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.translationquestion = businesscomponents.editors.translationquestion || {};

businesscomponents.editors.translationquestion.QuestionValidator = function () {
    businesscomponents.editors.translationquestion.QuestionValidator.superClass.constructor.call(this);
}
toot.inherit(businesscomponents.editors.translationquestion.QuestionValidator, businesscomponents.editors.validators.ValidatorBase);
toot.extendClass(businesscomponents.editors.translationquestion.QuestionValidator, {
    validate: function (reValidate) {
        reValidate = reValidate != null ? reValidate : false;
        if (this._model && this._model.getContent()) {
            return true;
        }
        else {
            if (this._msgBar && this._showMsg)
                this._msgBar.setMessage("请输入题干", this._msgDuration);
            return false;
        }
    }
});