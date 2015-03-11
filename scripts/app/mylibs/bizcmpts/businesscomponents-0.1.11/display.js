businesscomponents.display = function () {

    var uiQuestions = [];

    //    try {
    var questions = JSON.parse($("#valQuestions").val());
    var answers;
    try {
        answers = JSON.parse($("#valAnswers").val());
    }
    catch (ex) {
        answers = [];
        for (var i = 0, l = questions.length; i < l; i++)
            answers.push(null);
    }

    for (var i = 0, l = questions.length; i < l; i++) {
        if (questions[i].QuestionType == 1)
            var uiQuestion = new businesscomponents.fillquestion.ui.display.FillQuestion();
        else if (questions[i].QuestionType == 2)
            var uiQuestion = new businesscomponents.choicequestion.ui.display.QuestionGroup();

        var businessItem = new businesscomponents.model.BusinessItem();
        businessItem.setId(questions[i].ID);
        businessItem.setContent(questions[i].Content);
        businessItem.setOrderNum(questions[i].OrderNum);
        uiQuestion.getItem().setRequest(businessItem);

        if (answers[i]) {
            var businessResponseItem = new businesscomponents.model.BusinessResponseItem();
            businessResponseItem.setContent(answers[i].Content);
            uiQuestion.getItem().setResponse(businessResponseItem);
        }

        uiQuestion.updateUIByItem();

        $("#ctnQuestion").append(uiQuestion.getElement());
        uiQuestion.initializeAfterAppendedToDocDOMTree();
        uiQuestions.push(uiQuestion);
    };
    //    }
    //    catch (ex) {
    //        var ex2 = ex;
    //    }

    return {
        getAnswers: function () {
            var answers = [];
            for (var i = 0, l = uiQuestions.length; i < l; i++) {
                uiQuestions[i].updateResponseItemByUI();
                answers.push({
                    Id: uiQuestions[i].getItem().getResponse().getId(),
                    Content: uiQuestions[i].getItem().getResponse().getContent()
                });
            }
            return answers;
        },
        getRightWrong: function () {
            var rightWrong = new businesscomponents.model.RightWrong();
            for (var i = 0, l = uiQuestions.length; i < l; i++) {
                var uiRightWrong = uiQuestions[i].getRightWrong();
                if (uiRightWrong) {
                    rightWrong.setRight(rightWrong.getRight() + uiRightWrong.getRight());
                    rightWrong.setWrong(rightWrong.getWrong() + uiRightWrong.getWrong());
                }
            }
            return {
                right: rightWrong.getRight(),
                wrong: rightWrong.getWrong()
            }
        }
    }
};