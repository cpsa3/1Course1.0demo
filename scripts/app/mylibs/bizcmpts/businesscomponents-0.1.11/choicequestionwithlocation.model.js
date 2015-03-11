var businesscomponents = businesscomponents || {};

businesscomponents.choicequestionwithlocation = businesscomponents.choicequestionwithlocation || {};

businesscomponents.choicequestionwithlocation.model = {};

businesscomponents.choicequestionwithlocation.model.Location = function () {
    this._start = 0;
    this._end = 0;
};
toot.extendClass(businesscomponents.choicequestionwithlocation.model.Location, {
    getStart: function () {
        return this._start;
    },
    setStart: function (start) {
        this._start = start;
    },
    getEnd: function () {
        return this._end;
    },
    setEnd: function (end) {
        this._end = end;
    }
});
businesscomponents.choicequestionwithlocation.model.Location.parse = function (obj) {
    if (obj == null) return null;

    var result = new businesscomponents.choicequestionwithlocation.model.Location();
    result.setStart(obj._start);
    result.setEnd(obj._end);
    return result;
}

businesscomponents.choicequestionwithlocation.model.Question = function () {
    this._choiceQuestion = null;
    //    this._location = null;
    this._locations = null;
};
toot.extendClass(businesscomponents.choicequestionwithlocation.model.Question, {
    getChoiceQuestion: function () {
        return this._choiceQuestion;
    },
    setChoiceQuestion: function (choiceQuestion) {
        this._choiceQuestion = choiceQuestion;
    },
    getLocation: function () {
        return this._location;
    },
    setLocation: function (location) {
        this._location = location;
    },
    getLocations: function () {
        return this._locations;
    },
    setLocations: function (locations) {
        this._locations = locations;
    }
});
businesscomponents.choicequestionwithlocation.model.Question.parse = function (obj) {
    if (obj == null) return null;

    var result = new businesscomponents.choicequestionwithlocation.model.Question();
    result.setChoiceQuestion(businesscomponents.choicequestion.model.Question.parse(obj._choiceQuestion));
    //    result.setLocation(businesscomponents.choicequestionwithlocation.model.Location.parse(obj._location));
    if (obj._location) {
        result.setLocations([businesscomponents.choicequestionwithlocation.model.Location.parse(obj._location)]);
    }
    if (obj._locations) {
        result.setLocations(models.parseObjArray(obj._locations, businesscomponents.choicequestionwithlocation.model.Location.parse));

    }
    return result;
};