var businesscomponents = businesscomponents || {};

businesscomponents.choicequestionforsentence = businesscomponents.choicequestionforsentence || {};

businesscomponents.choicequestionforsentence.model = {};

businesscomponents.choicequestionforsentence.model.Question = function () {
    this._choiceQuestion = null;
    this._locations = null;
};
toot.extendClass(businesscomponents.choicequestionforsentence.model.Question, {
    getChoiceQuestion: function () {
        return this._choiceQuestion;
    },
    setChoiceQuestion: function (choiceQuestion) {
        this._choiceQuestion = choiceQuestion;
    },
    getLocations: function () {
        return this._locations;
    },
    setLocations: function (locations) {
        this._locations = locations;
    }
});
businesscomponents.choicequestionforsentence.model.Question.parse = function (obj) {
    if (obj == null) return null;

    var result = new businesscomponents.choicequestionforsentence.model.Question();
    result.setChoiceQuestion(businesscomponents.choicequestion.model.Question.parse(obj._choiceQuestion));
    result.setLocations(obj._locations);
    return result;
};