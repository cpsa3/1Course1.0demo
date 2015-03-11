var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.initEditor = function (editor, contentParser, contentCreator) {
    var name = $("#data-name").val();
    var num = $("#data-num").val();
    var level = parseInt($("#data-level").val());
    var version = parseInt($("#data-version").val());
    var totalTime = parseInt($("#data-totalTime").val()); 
    var content = null;
    var oldContent = null;
    try {
        try {
            content = contentParser(JSON.parse($("#data-question").val()));
            oldContent = contentParser(JSON.parse($("#data-question").val()));
        }
        catch (ex) { content = contentCreator(); }
    }
    catch (ex) { }
    var taskTypeName = $("#data-taskTypeName").val();

    var taskQuestion = new models.core.TaskQuestion();
    taskQuestion.setSerialId(num);
    taskQuestion.setName(name);
    taskQuestion.setLevel(level);
    taskQuestion.setContent(content);
    editor.setModelAndUpdateUI(taskQuestion);
    editor.setOldContentStr($("#data-question").val());
    editor.setOldContent(oldContent);
    editor.setOldLevel(level);
    editor.setOldSerial(num);
    editor.setOldName(name);
    editor.setVersion(version);
    editor.setOldTotalTime(totalTime);
    editor.setContentParser(contentParser);
    editor.getTopbar().getLblName().setText(taskTypeName);
};