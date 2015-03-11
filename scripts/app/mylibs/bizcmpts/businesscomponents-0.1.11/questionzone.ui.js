var businesscomponents = businesscomponents || {};

businesscomponents.questionzone = businesscomponents.questionzone || {};

businesscomponents.questionzone.ui = businesscomponents.questionzone.ui || {};

businesscomponents.questionzone.ui.display = businesscomponents.questionzone.ui.display || {};

businesscomponents.questionzone.ui.display.Question = function () {
    businesscomponents.ui.BusinessComponentBase.call(this, $('<div><div></div><div>').get(0));
    this._title = $("div")[0];
};

toot.inherit(businesscomponents.questionzone.ui.display.Question, businesscomponents.ui.BusinessComponentBase);
toot.extendClass(businesscomponents.questionzone.ui.display.Question, {
    updateUIByModel: function () {
//        if (!this.getRequestModel())
//            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

//        this._title.html(this.getRequestModel().getTitle());
    }
})