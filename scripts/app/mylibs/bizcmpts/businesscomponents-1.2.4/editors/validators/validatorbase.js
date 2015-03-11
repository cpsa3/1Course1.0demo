var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.validators = businesscomponents.editors.validators || {};

businesscomponents.editors.validators.ValidatorBase = function () {
    this._ui = null;
    this._model = null;

    //model cannot be accessed by ui
    this._relatedModel = null;
    //generally used for blur re-validation after first validated false
    this._validatedFalseModel = null;

    this._msgBar = null;
    this._showMsg = false;
    //duration see msgBar comment
    this._msgDuration = true;
};
toot.extendClass(businesscomponents.editors.validators.ValidatorBase, {
    getUI: function () { return this._ui; },
    setUI: function (ui) { this._ui = ui; },
    getModel: function () { return this._model; },
    setModel: function (model) { this._model = model; },

    getRelatedModel: function () { return this._relatedModel },
    setRelatedModel: function (model) { this._relatedModel = model },
    getValidatedFalseModel: function () { return this._validatedFalseModel },
    setValidatedFalseModel: function (model) { this._validatedFalseModel = model },

    getMsgBar: function () { return this._msgBar; },
    setMsgBar: function (msgBar) { this._msgBar = msgBar; },
    isShowMsg: function () { return this._showMsg; },
    setShowMsg: function (showMsg) { this._showMsg = showMsg; },
    getMsgDuration: function () { return this._msgDuration; },
    setMsgDuration: function (duration) { this._msgDuration = duration; },

    validate: function () {
    }
});


