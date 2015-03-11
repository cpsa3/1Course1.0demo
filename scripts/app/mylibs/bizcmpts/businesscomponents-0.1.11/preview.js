businesscomponents.preview = function () {

    var uiQuestions = [];

    //    try {
    var questions = JSON.parse($("#preview-valQuestions").val());
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
        uiQuestion.updateUIByItem();

        $("#preview-ctnQuestion").append(uiQuestion.getElement());
        uiQuestion.initializeAfterAppendedToDocDOMTree();
        uiQuestions.push(uiQuestion);
    };
    //    }
    //    catch (ex) {
    //        var ex2 = ex;
    //    }
};