businesscomponents.edit = function () {


    var uiQuestions = [];

    var btnAddChoiceQuestion = new toot.ui.Button($("#btnAddChoiceQuestion").get(0));
    var btnAddFillQuestion = new toot.ui.Button($("#btnAddFillQuestion").get(0));

    var btnPreview = new toot.ui.Button($("#btnPreview").get(0));
    var btnSave = new toot.ui.Button($("#btnSave").get(0));
    var btnCancel = new toot.ui.Button($("#btnCancel").get(0));

    toot.connect([btnAddChoiceQuestion, btnAddFillQuestion], "action", null, function (sender) {
        if (sender == btnAddChoiceQuestion)
            var uiQuestion = businesscomponents.choicequestion.ui.edit.createDefaultUIQuestionGroup();
        else if (sender == btnAddFillQuestion)
            var uiQuestion = businesscomponents.fillquestion.ui.edit.createDefaultUIFillQuestion();

        $("#ctnQuestion").append(uiQuestion.getElement());
        uiQuestion.initializeAfterAppendedToDocDOMTree();
        uiQuestions.push(uiQuestion);

        toot.connect(uiQuestion, "actionDel", null, function (sender) {
            var idx = uiQuestions.indexOf(sender);
            uiQuestions.splice(idx, 1);
            $("#ctnQuestion").get(0).removeChild(sender.getElement());

            if (uiQuestions.length == 0) {
                btnPreview.setVisible(false);
                btnSave.setVisible(false);
                btnCancel.setVisible(false);
            }
        });

        btnPreview.setVisible(true);
        btnSave.setVisible(true);
        btnCancel.setVisible(true);
    });

    try {
        var questions = JSON.parse($("#valQuestions").val());
        for (var i = 0, l = questions.length; i < l; i++) {
            if (questions[i].QuestionType == 1)
                var uiQuestion = new businesscomponents.fillquestion.ui.edit.FillQuestion();
            else if (questions[i].QuestionType == 2)
                var uiQuestion = new businesscomponents.choicequestion.ui.edit.QuestionGroup();

            var businessItem = new businesscomponents.model.BusinessItem();
            businessItem.setId(questions[i].ID);
            businessItem.setContent(questions[i].Content);
            businessItem.setOrderNum(questions[i].OrderNum);
            uiQuestion.getItem().setRequest(businessItem);
            uiQuestion.updateUIByItem();

            $("#ctnQuestion").append(uiQuestion.getElement());
            uiQuestion.initializeAfterAppendedToDocDOMTree();
            uiQuestions.push(uiQuestion);

            toot.connect(uiQuestion, "actionDel", null, function (sender) {
                var idx = uiQuestions.indexOf(sender);
                uiQuestions.splice(idx, 1);
                $("#ctnQuestion").get(0).removeChild(sender.getElement());

                if (uiQuestions.length == 0) {
                    btnPreview.setVisible(false);
                    btnSave.setVisible(false);
                    btnCancel.setVisible(false);
                }
            });

        };
    }
    catch (ex) {
        var ex2 = ex;
    }

    if (uiQuestions.length == 0) {
        var uiQuestion = businesscomponents.fillquestion.ui.edit.createDefaultUIFillQuestion();
        $("#ctnQuestion").append(uiQuestion.getElement());
        uiQuestion.initializeAfterAppendedToDocDOMTree();
        uiQuestions.push(uiQuestion);
        toot.connect(uiQuestion, "actionDel", null, function (sender) {
            var idx = uiQuestions.indexOf(sender);
            uiQuestions.splice(idx, 1);
            $("#ctnQuestion").get(0).removeChild(sender.getElement());

            if (uiQuestions.length == 0) {
                btnPreview.setVisible(false);
                btnSave.setVisible(false);
                btnCancel.setVisible(false);
            }
        });
    }


    return {
        //with validation
        getEditQuestions: function () {
            var questions = [];
            for (var i = 0, l = uiQuestions.length; i < l; i++) {
                uiQuestions[i].updateRequestItemByUI();
                if (!uiQuestions[i].isValidatedOK()) {
                    throw { validation: uiQuestions[i].getValidationMsg() }
                }

                questions.push({
                    Id: uiQuestions[i].getItem().getRequest().getId(),
                    QuestionType: uiQuestions[i].getItem().getRequest().getBusinessType(),
                    Content: uiQuestions[i].getItem().getRequest().getContent(),
                    OrderNum: uiQuestions[i].getItem().getRequest().getOrderNum()
                });
            }
            return questions;
        },
        //without validation
        getPreviewQuestions: function () {
            var questions = [];
            for (var i = 0, l = uiQuestions.length; i < l; i++) {
                uiQuestions[i].updateRequestItemByUI();

                questions.push({
                    Id: uiQuestions[i].getItem().getRequest().getId(),
                    QuestionType: uiQuestions[i].getItem().getRequest().getBusinessType(),
                    Content: uiQuestions[i].getItem().getRequest().getContent(),
                    OrderNum: uiQuestions[i].getItem().getRequest().getOrderNum()
                });
            }
            return questions;
        }
    }
};