var businesscomponents = businesscomponents || {};

businesscomponents.judgequestion = businesscomponents.judgequestion || {};

businesscomponents.judgequestion.model = {};

businesscomponents.judgequestion.model.Choice = function () {
    this._inAnswer = false;
    this._content = null;
    this._tempIndex = 0;
};
toot.extendClass(businesscomponents.judgequestion.model.Choice, {
    isInAnswer: function () {
        return this._inAnswer;
    },
    setInAnswer: function (inAnswer) {
        this._inAnswer = inAnswer;
    },
    getContent: function () {
        return this._content; 011111
    },
    setContent: function (content) {
        this._content = content;
    },
    getTempIndex: function (_tempIndex) {
        return this._tempIndex;
    },
    setTempIndex: function (_tempIndex) {
        this._tempIndex = _tempIndex;
    }
});
businesscomponents.judgequestion.model.Choice.parse = function (obj) {
    if (obj == null) return null;

    var result = new businesscomponents.judgequestion.model.Choice();
    result.setTempIndex(obj._tempIndex);
    result.setInAnswer(obj._inAnswer);
    result.setContent(obj._content);
    return result;
};


businesscomponents.judgequestion.model.ChoiceResponse = function () {
    this._selected = false;
};
toot.extendClass(businesscomponents.judgequestion.model.ChoiceResponse, {
    isSelected: function () {
        return this._selected;
    },
    setSelected: function (selected) {
        this._selected = selected;
    }
});
businesscomponents.judgequestion.model.ChoiceResponse.parse = function (obj) {
    if (obj == null) return null;

    var result = new businesscomponents.judgequestion.model.ChoiceResponse();
    result.setSelected(obj._selected);
    return result;
};



businesscomponents.judgequestion.model.Question = function () {
    this._title = null;
    this._choices = null;
    this._tempIndex = 0;
};
toot.extendClass(businesscomponents.judgequestion.model.Question, {
    getTitle: function () {
        return this._title;
    },
    setTitle: function (title) {
        this._title = title;
    },
    getChoices: function () {
        return this._choices;
    },
    setChoices: function (choices) {
        this._choices = choices;
    },
    getAnswer: function () {
        if (!this._choices) return null;
        var answer = [];
        for (var i = 0, l = this._choices.length; i < l; i++) {
            if (this._choices[i].isInAnswer())
                answer.push(i);
        }
        return answer;
    },
    getTempIndex: function (_tempIndex) {
        return this._tempIndex;
    },
    setTempIndex: function (_tempIndex) {
        this._tempIndex = _tempIndex;
    }
});
businesscomponents.judgequestion.model.Question.parse = function (obj) {
    if (obj == null) return null;

    var result = new businesscomponents.judgequestion.model.Question();
    result.setTitle(obj._title);
    result.setTempIndex(obj._tempIndex);
    result.setChoices(businesscomponents.model.parseObjArray(obj._choices, businesscomponents.judgequestion.model.Choice.parse));
    return result;
};


businesscomponents.judgequestion.model.QuestionResponse = function () {
    this._choiceResponses = null;
};
toot.extendClass(businesscomponents.judgequestion.model.QuestionResponse, {
    getChoiceResponses: function () {
        return this._choiceResponses;
    },
    setChoiceResponses: function (choiceResponses) {
        this._choiceResponses = choiceResponses;
    }
});
businesscomponents.judgequestion.model.QuestionResponse.parse = function (obj) {
    if (obj == null) return null;

    var result = new businesscomponents.judgequestion.model.QuestionResponse();

    result.setChoiceResponses(businesscomponents.model.parseObjArray(obj._choiceResponses, businesscomponents.judgequestion.model.ChoiceResponse.parse));
    return result;
};


businesscomponents.judgequestion.model.QuestionGroup = function () {
    this._title = null;
    this._questions = null;
    this._tempIndex = 0;
};
toot.extendClass(businesscomponents.judgequestion.model.QuestionGroup, {
    getTitle: function () {
        return this._title;
    },
    setTitle: function (title) {
        this._title = title;
    },
    getQuestions: function () {
        return this._questions;
    },
    setQuestions: function (questions) {
        this._questions = questions;
    },
    getTempIndex: function (_tempIndex) {
        return this._tempIndex;
    },
    setTempIndex: function (_tempIndex) {
        this._tempIndex = _tempIndex;
    }
});
businesscomponents.judgequestion.model.QuestionGroup.parse = function (obj) {
    if (obj == null) return null;

    var result = new businesscomponents.judgequestion.model.QuestionGroup();
    result.setTitle(obj._title);
    obj._tempIndex == obj._tempIndex
    result.setTempIndex(obj._tempIndex);
    result.setQuestions(businesscomponents.model.parseObjArray(obj._questions, businesscomponents.judgequestion.model.Question.parse));
    return result;
};



businesscomponents.judgequestion.model.QuestionResponseGroup = function () {
    this._questionResponses = null;
};
toot.extendClass(businesscomponents.judgequestion.model.QuestionResponseGroup, {
    getTitle: function () {
        return this._title;
    },
    setTitle: function (title) {
        this._title = title;
    },
    getQuestionResponses: function () {
        return this._questionResponses;
    },
    setQuestionResponses: function (questionResponses) {
        this._questionResponses = questionResponses;
    }
});
businesscomponents.judgequestion.model.QuestionResponseGroup.parse = function (obj) {
    if (obj == null) return null;

    var result = new businesscomponents.judgequestion.model.QuestionResponseGroup();
    result.setQuestionResponses(businesscomponents.model.parseObjArray(obj._questionResponses, businesscomponents.judgequestion.model.QuestionResponse.parse));
    return result;
};




businesscomponents.judgequestion.model.QuestionAndResponse = function () {
};
toot.inherit(businesscomponents.judgequestion.model.QuestionAndResponse, businesscomponents.RequestAndResponse);
toot.extendClass(businesscomponents.judgequestion.model.QuestionAndResponse, {
    isRight: function () {
        var choices = this.getRequest().getChoices();
        var choicesResponses = this.getResponse().getChoiceResponses();

        var isRight = true;
        for (var i = 0, l = choices.length; i < l; i++) {
            if (choices[i].isInAnswer() != choicesResponses[i].isSelected()) {
                isRight = false;
                break;
            }
        }
        return isRight;
    }
});

businesscomponents.judgequestion.model.QuestionGroupAndResponse = function () {
};
toot.inherit(businesscomponents.judgequestion.model.QuestionGroupAndResponse, businesscomponents.RequestAndResponse);
toot.extendClass(businesscomponents.judgequestion.model.QuestionGroupAndResponse, {
    getRightWrong: function () {
        var rightWrong = new businesscomponents.model.RightWrong();

        var questions = this.getRequest().getQuestions();
        var questionResponses = this.getResponse().getQuestionResponses();
        for (var i = 0, l = questions.length; i < l; i++) {
            var questionAndResponse = new businesscomponents.judgequestion.model.QuestionAndResponse();
            questionAndResponse.setRequest(questions[i]);
            questionAndResponse.setResponse(questionResponses[i]);
            if (questionAndResponse.isRight()) rightWrong.setRight(rightWrong.getRight() + 1);
            else rightWrong.setWrong(rightWrong.getWrong() + 1);
        }

        return rightWrong;
    }
});








