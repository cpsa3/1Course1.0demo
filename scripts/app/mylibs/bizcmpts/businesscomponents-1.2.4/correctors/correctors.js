//
/*
* 功能:数据装配
* 作者:小潘
* 日期:20130731
* add autoCheck model parse 8.7 22:16
*/
var businesscomponents = businesscomponents || {};

businesscomponents.correctors = businesscomponents.correctors || {};

businesscomponents.correctors.InitCorrectors = function (correct, questionParser, answerParser, autocheckParser, correctParser, correctCreator) {
    var name = $("#data-name").val();
    var typename = $("#data-taskTypeName").val();
    var useTime = $("#data-useTime").val();
    var testName = $("#data-testName").val();
    var studentName = $("#data-studentName").val();
    var checkAnswer = $("#data-checkAnswer").val();
    var testId = $("#data-testId").val()

    try {
        var nodeConfig = JSON.parse($("#data-nodeConfig").val());
    }
    catch (ex) {
        var nodeConfig = null;
    }

    var autoCheck = null;

    try {
        autoCheck = autocheckParser(JSON.parse($("#data-autoCheck").val()));
    }
    catch (e) {
    }

    /*
    //taskquestion->content->question
    //taskanswer->content->answer
    //taskcorrect->content->correct
    */

    var taskItem = new models.core.TaskItem();
    var question = questionParser(JSON.parse($("#data-question").val()));
    try {
        var answer = answerParser(JSON.parse($("#data-answer").val()), question);
    }
    catch (ex) {
        var answer = null;
    }
    var correctcontent = null;
    try {
        try {
            correctcontent = correctParser(JSON.parse($("#data-userCheck").val()), question);
        } catch (ex) {
            correctcontent = correctCreator();
        }
    }
    catch (ex) {
    }

    var taskQuestion = new models.core.TaskQuestion();
    taskQuestion.setName(name);
    taskQuestion.setContent(question);

    var taskCorrect = new models.core.TaskCorrect();
    //新增类型名称 试卷名称和学生姓名 8.2 19:16
    taskCorrect.setTypeName(typename);
    taskCorrect.setTestName(testName);
    taskCorrect.setStudentName(studentName);
    taskCorrect.setContent(correctcontent);
    taskCorrect.setCheckAnswer(checkAnswer);
    taskCorrect.setTestId(testId);
    taskCorrect.setNodeConfig(nodeConfig);

    var taskAnswer = new models.core.TaskAnswer();
    taskAnswer.setUseTime(useTime);
    taskAnswer.setContent(answer);

    taskItem.setAnswer(taskAnswer);
    taskItem.setQuestion(taskQuestion);
    taskItem.setCorrect(taskCorrect);
    //add autoCheck
    taskItem.setAutoCorrect(autoCheck);

    if ($("#data-teacherMark").val()) {
        var mark = JSON.parse($("#data-teacherMark").val());
        if (mark && mark.Content) {
            mark.Content = JSON.parse(mark.Content);
            if (mark.Content)
                taskItem.setTeacherMark(mark);
        }
    }

    if ($("#data-studentMark").val()) {
        var mark = JSON.parse($("#data-studentMark").val());
        if (mark && mark.Content) {
            mark.Content = JSON.parse(mark.Content);
            if (mark.Content)
                taskItem.setStudentMark(mark);
        }
    }

    correct.setModelAndUpdateUI(taskItem);

};