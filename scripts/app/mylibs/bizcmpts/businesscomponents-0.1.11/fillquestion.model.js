var businesscomponents = businesscomponents || {};

businesscomponents.fillquestion = businesscomponents.fillquestion || {};

businesscomponents.fillquestion.model = {};

businesscomponents.fillquestion.model.FillQuestion = function () {
    this._title = null;
    this._content = null;
};
toot.extendClass(businesscomponents.fillquestion.model.FillQuestion, {
    getTitle: function () {
        return this._title;
    },
    setTitle: function (title) {
        this._title = title;
    },
    getContent: function () {
        return this._content;
    },
    setContent: function (content) {
        this._content = content;
    }
});
businesscomponents.fillquestion.model.FillQuestion.parse = function (obj) {
    var result = new businesscomponents.fillquestion.model.FillQuestion();
    result.setTitle(obj._title);
    result.setContent(obj._content);
    return result;
};


businesscomponents.fillquestion.model.FillQuestionResponse = function () {
    this._answers = null;
};
toot.extendClass(businesscomponents.fillquestion.model.FillQuestionResponse, {
    getAnswers: function () {
        return this._answers;
    },
    setAnswers: function (answers) {
        this._answers = answers;
    }
});
businesscomponents.fillquestion.model.FillQuestionResponse.parse = function (obj) {
    var result = new businesscomponents.fillquestion.model.FillQuestionResponse();
    result.setAnswers(obj._answers);
    return result;
};
