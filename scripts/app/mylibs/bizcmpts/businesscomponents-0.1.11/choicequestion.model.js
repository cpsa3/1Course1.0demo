var businesscomponents = businesscomponents || {};

businesscomponents.choicequestion = businesscomponents.choicequestion || {};

businesscomponents.choicequestion.model = {};

businesscomponents.choicequestion.model.Choice = function () {
    this._inAnswer = false;
    this._content = null;
};
toot.extendClass(businesscomponents.choicequestion.model.Choice, {
    isInAnswer: function () {
        return this._inAnswer;
    },
    setInAnswer: function (inAnswer) {
        this._inAnswer = inAnswer;
    },
    getContent: function () {
        return this._content;
    },
    setContent: function (content) {
        this._content = content;
    }
});
businesscomponents.choicequestion.model.Choice.parse = function (obj) {
    if (obj == null) return null;

    var result = new businesscomponents.choicequestion.model.Choice();
    result.setInAnswer(obj._inAnswer);
    result.setContent(obj._content);
    return result;
};


businesscomponents.choicequestion.model.ChoiceResponse = function () {
    this._selected = false;
};
toot.extendClass(businesscomponents.choicequestion.model.ChoiceResponse, {
    isSelected: function () {
        return this._selected;
    },
    setSelected: function (selected) {
        this._selected = selected;
    }
});
businesscomponents.choicequestion.model.ChoiceResponse.parse = function (obj) {
    if (obj == null) return null;

    var result = new businesscomponents.choicequestion.model.ChoiceResponse();
    result.setSelected(obj._selected);
    return result;
};



businesscomponents.choicequestion.model.Question = function () {
    this._title = null;
    this._choices = null;
};
toot.extendClass(businesscomponents.choicequestion.model.Question, {
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
    }
});
businesscomponents.choicequestion.model.Question.parse = function (obj) {
    if (obj == null) return null;

    var result = new businesscomponents.choicequestion.model.Question();
    result.setTitle(obj._title);
    result.setChoices(businesscomponents.model.parseObjArray(obj._choices, businesscomponents.choicequestion.model.Choice.parse));
    return result;
};


businesscomponents.choicequestion.model.QuestionResponse = function () {
    this._choiceResponses = null;
};
toot.extendClass(businesscomponents.choicequestion.model.QuestionResponse, {
    getChoiceResponses: function () {
        return this._choiceResponses;
    },
    setChoiceResponses: function (choiceResponses) {
        this._choiceResponses = choiceResponses;
    }
});
businesscomponents.choicequestion.model.QuestionResponse.parse = function (obj) {
    if (obj == null) return null;

    var result = new businesscomponents.choicequestion.model.QuestionResponse();
    result.setChoiceResponses(businesscomponents.model.parseObjArray(obj._choiceResponses, businesscomponents.choicequestion.model.ChoiceResponse.parse));
    return result;
};


businesscomponents.choicequestion.model.QuestionGroup = function () {
    this._title = null;
    this._questions = null;
};
toot.extendClass(businesscomponents.choicequestion.model.QuestionGroup, {
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
    }
});
businesscomponents.choicequestion.model.QuestionGroup.parse = function (obj) {
    if (obj == null) return null;

    var result = new businesscomponents.choicequestion.model.QuestionGroup();
    result.setTitle(obj._title);
    result.setQuestions(businesscomponents.model.parseObjArray(obj._questions, businesscomponents.choicequestion.model.Question.parse));
    return result;
};



businesscomponents.choicequestion.model.QuestionResponseGroup = function () {
    this._questionResponses = null;
};
toot.extendClass(businesscomponents.choicequestion.model.QuestionResponseGroup, {
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
businesscomponents.choicequestion.model.QuestionResponseGroup.parse = function (obj) {
    if (obj == null) return null;

    var result = new businesscomponents.choicequestion.model.QuestionResponseGroup();
    result.setQuestionResponses(businesscomponents.model.parseObjArray(obj._questionResponses, businesscomponents.choicequestion.model.QuestionResponse.parse));
    return result;
};




businesscomponents.choicequestion.model.QuestionAndResponse = function () {
};
toot.inherit(businesscomponents.choicequestion.model.QuestionAndResponse, businesscomponents.RequestAndResponse);
toot.extendClass(businesscomponents.choicequestion.model.QuestionAndResponse, {
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

businesscomponents.choicequestion.model.QuestionGroupAndResponse = function () {
};
toot.inherit(businesscomponents.choicequestion.model.QuestionGroupAndResponse, businesscomponents.RequestAndResponse);
toot.extendClass(businesscomponents.choicequestion.model.QuestionGroupAndResponse, {
    getRightWrong: function () {
        var rightWrong = new businesscomponents.model.RightWrong();

        var questions = this.getRequest().getQuestions();
        var questionResponses = this.getResponse().getQuestionResponses();
        for (var i = 0, l = questions.length; i < l; i++) {
            var questionAndResponse = new businesscomponents.choicequestion.model.QuestionAndResponse();
            questionAndResponse.setRequest(questions[i]);
            questionAndResponse.setResponse(questionResponses[i]);
            if (questionAndResponse.isRight()) rightWrong.setRight(rightWrong.getRight() + 1);
            else rightWrong.setWrong(rightWrong.getWrong() + 1);
        }

        return rightWrong;
    }
});








