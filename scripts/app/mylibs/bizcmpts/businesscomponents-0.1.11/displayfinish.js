businesscomponents.displayFinish = function () {

    var uiQuestions = [];

    //    try {
    var questions = JSON.parse($("#valQuestions").val());
    var answers = JSON.parse($("#valAnswers").val());

    for (var i = 0, l = questions.length; i < l; i++) {
        if (questions[i].QuestionType == 1)
            var uiQuestion = new businesscomponents.fillquestion.ui.displayfinish.FillQuestion();
        else if (questions[i].QuestionType == 2)
            var uiQuestion = new businesscomponents.choicequestion.ui.displayfinish.QuestionGroup();

        var businessItem = new businesscomponents.model.BusinessItem();
        businessItem.setId(questions[i].Id);
        businessItem.setContent(questions[i].Content);
        businessItem.getBusinessType(2);
        businessItem.setOrderNum(questions[i].OrderNum);
        uiQuestion.getItem().setRequest(businessItem);

        var businessResponseItem = new businesscomponents.model.BusinessResponseItem();
        businessResponseItem.setContent(answers[i].Content);
        uiQuestion.getItem().setResponse(businessResponseItem);
        uiQuestion.updateUIByItem();

        $("#ctnQuestion").append(uiQuestion.getElement());
        uiQuestion.initializeAfterAppendedToDocDOMTree();
        uiQuestions.push(uiQuestion);

    };
    //    }
    //    catch (ex) {
    //        var ex2 = ex;
    //    }
};