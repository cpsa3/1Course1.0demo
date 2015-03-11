var businesscomponents = businesscomponents || {};

businesscomponents.previews = businesscomponents.previews || {};

businesscomponents.previews.initPreview = function (contentParser, createView) {
    var btnClose;
    var lblTitle;
    var taskContainer;
    $(function () {

        //body添加样式
        $(document.body).addClass("taskbodybg");
        taskContainer = $('<div class="ReportLayoutBox2 ReportNewLayoutS6" id="taskContainer"></div>').appendTo(document.body)[0];
        setFootbarPosition();
        $(window).resize(setFootbarPosition);
        $(window).load(setFootbarPosition);
        var taskItem = new models.previewandreports.TaskItem();
        taskItem.setRenderingType(models.previewandreports.RenderingType.Preview);
        taskItem.setQuestion(new models.core.TaskQuestion());
        taskItem.getQuestion().setContent(contentParser(JSON.parse($("#data-question").val())));
        var taskView = createView();
        taskView.appendTo(taskContainer);
        taskView.setModelAndUpdateUI(taskItem);
        


    });

};

//做题完成查看
businesscomponents.previews.displayFinish = function (contentParser, createView, answerParser, correctParser, autoCorrectParser) {
    var taskContainer;
    $(function () {

        //body添加样式
        $(document.body).addClass("taskbodybg");
        //topbar
        $topbar = $('<div class="webTopToolbarOuter">' +
                       '<dl class="webTopToolbar clearfix">' +
                         '<dd class="fr"><button class="btnSubmit1" gi="btnClose">关闭</button></dd>' +
                         '<dd class="fr"><button class="btnSubmit1 marR10" gi="btnNext">下一任务</button></dd>' +
                         '<dd class="fr marR10 clearfix">' +
                           '<div class="fl">用时：</div>' +
                           '<div class="timerTxt fl" gi="lblUseTime"></div>' +
                         '</dd>' +
                         '</dl>' +
                     '</div>').appendTo(document.body);
        var btnClose = new toot.ui.Button($topbar.find('[gi~="btnClose"]')[0]);
        var btnNext = new toot.ui.Button($topbar.find('[gi~="btnNext"]')[0]);
        var lblUseTime = new toot.ui.Label($topbar.find('[gi~="lblUseTime"]')[0]);
        toot.connect(btnClose, "action", null, function () {
            window.close();
        });
        var nextUrl = $.trim($("#data-nextUrl").val());
        if (nextUrl) {
            toot.connect(btnNext, "action", null, function () {
                window.location = nextUrl;
            });
        }
        else {
            btnNext.setVisible(false);
        }

        taskContainer = $('<div class="ReportLayoutBox2 ReportNewLayoutS6" id="taskContainer"></div>').appendTo(document.body)[0];

        $(window).resize(setFootbarPosition);
        $(window).load(setFootbarPosition);
        var taskItem = new models.previewandreports.TaskItem();
        taskItem.setRenderingType(models.previewandreports.RenderingType.DisplayFinish);
        taskItem.setQuestion(new models.core.TaskQuestion());
        taskItem.getQuestion().setContent(contentParser(JSON.parse($("#data-question").val())));
        if (answerParser) {
            taskItem.setAnswer(new models.core.TaskAnswer());
            taskItem.getAnswer().setContent(answerParser(JSON.parse($("#data-answer").val()), contentParser(JSON.parse($("#data-question").val()))));
            taskItem.getAnswer().setUseTime(JSON.parse($("#data-useTime").val()));
            taskItem.setCheckAnswer($("#data-checkAnswer").val());
        }
        if (correctParser) {
            taskItem.setCorrect(correctParser(JSON.parse($("#data-correct").val() != "" ? $("#data-correct").val() : null),
                   contentParser(JSON.parse($("#data-question").val()))));
        }
        if (autoCorrectParser) {
            taskItem.setAutoCorrect(autoCorrectParser(JSON.parse($("#data-autoCorrect").val() != "" ? $("#data-autoCorrect").val() : null)));
        }

        if ($("#data-studentMark").val()) {
            var mark = JSON.parse($("#data-studentMark").val());
            if (mark && mark.Content) {
                mark.Content = JSON.parse(mark.Content);
                if (mark.Content)
                    taskItem.setStudentMark(mark);
            }
        }

        if ($("#data-teacherMark").val()) {
            var mark = JSON.parse($("#data-teacherMark").val());
            if (mark && mark.Content) {
                mark.Content = JSON.parse(mark.Content);
                if (mark.Content)
                    taskItem.setTeacherMark(mark);
            }
        }
        //设置是否显示批改
        if ($("#data-isShowAutoCorrect").val()) {
            //            var flg = $("#data-isShowAutoCorrect").val();
            taskItem.setIsShowCorrect($("#data-isShowAutoCorrect").val());

        }




        //useTime 
        (function () {
            if (answerParser) {
                var userTime = taskItem.getAnswer().getUseTime();
                var hr = Math.floor(userTime / 3600);
                var min = Math.floor(userTime / 60) % 60;
                var sec = userTime % 60;
                var useTimeDisplayedAs = "";
                if (hr > 0 && hr < 10)
                    useTimeDisplayedAs += "0" + hr + ":";
                else if (hr >= 10)
                    useTimeDisplayedAs += hr + ":";
                if (min < 10)
                    useTimeDisplayedAs += "0" + min + ":";
                else if (min >= 10)
                    useTimeDisplayedAs += min + ":";
                if (sec < 10)
                    useTimeDisplayedAs += "0" + sec;
                else if (sec >= 10)
                    useTimeDisplayedAs += sec;
                lblUseTime.setText(useTimeDisplayedAs);
            } else {
                //                lblUseTime.setVisible(false);
                $(lblUseTime.getElement()).parent().hide();
            }

        })();

        var taskView = createView();
        taskView.appendTo(taskContainer);
        taskView.setModelAndUpdateUI(taskItem);



        setFootbarPosition();
        //禁用右键和ctrl+c和ctrl+v
        disableCopy();
    });
};

//学生查看
businesscomponents.previews.studentAnalysis = function (contentParser, createView, answerParser, correctParser, autoCorrectParser, whereFrom) {
    var taskContainer;
    $(function () {
        //最后一个参数区分是哪个界面进来的，1表示学生分析，2表示学生查看，3表示老师分析
        //body添加样式
        $(document.body).addClass("taskbodybg");
        //topbar
        $topbar = $('<div class="webTopToolbarOuter">' +
                       '<dl class="webTopToolbar clearfix">' +
                         '<dd class="fr"><button class="btnSubmit1" gi="btnClose">关闭</button></dd>' +
                         '<dd class="fr"><button class="btnSubmit1 marR10" gi="btnNext">提交</button></dd>' +
                         '<dd class="fr marR10 clearfix">' +
                           '<div class="fl">用时：</div>' +
                           '<div class="timerTxt fl" gi="lblUseTime"></div>' +
                         '</dd>' +
                         '</dl>' +
                     '</div>').appendTo(document.body);
        var btnClose = new toot.ui.Button($topbar.find('[gi~="btnClose"]')[0]);
        var btnNext = new toot.ui.Button($topbar.find('[gi~="btnNext"]')[0]);
        if (whereFrom == 2) {
            $(btnNext.getElement()).html("下一任务");
        }

        var lblUseTime = new toot.ui.Label($topbar.find('[gi~="lblUseTime"]')[0]);
        toot.connect(btnClose, "action", null, function () {
            window.close();
        });
        var nextUrl = $.trim($("#data-nextUrl").val());
        //        if (nextUrl) {
        if (whereFrom == 2) {
            if (!nextUrl) {
                btnNext.setVisible(false);
            }
        }
        toot.connect(btnNext, "action", null, function () {
            if (whereFrom == 2) {
                if (nextUrl) {
                    window.location = nextUrl;
                }
                return;
            }

            var studentAnalysis = "";
            var teacherAnalysis = "";
            if (taskView.Validate() != -1) {
                greedyint.dialog2.error("第" + taskView.Validate() + "题请填写分析！");
                return false;
            }
            var loadData = {};
            if (whereFrom == 1) {

                loadData.analysis = JSON.stringify(taskView.updateAndGetModelByUI().getStudentAnalysis());
            }
            if (whereFrom == 3) {
                loadData.analysis = JSON.stringify(taskView.updateAndGetModelByUI().getTeacherAnalysis());
            }

            loadData.notation = null;
            if (whereFrom == 1) {
                var mark = taskView.updateAndGetModelByUI().getStudentMark();
                if (mark) loadData.notation = JSON.stringify(mark.Content);
            }
            if (whereFrom == 3) {
                var mark = taskView.updateAndGetModelByUI().getTeacherMark();
                if (mark) loadData.notation = JSON.stringify(mark.Content);
            }

            //            return;

            loadData.userTaskNodeId = $("#data-id").val();
            //            return;
            var url = "";
            if (whereFrom == 1) {
                url = "/TaskService/SaveStudentAnalysis";

            }
            else if (whereFrom == 3) {
                url = "/TaskService/SaveTeacherAnalysis";
            }
            var ajax = {
                url: url,
                data: loadData,
                type: 'POST',
                dataType: 'json',
                cache: false,
                success: function (json) {
                    if (json.status == 1) {
                        if (window.opener) {
                            if (typeof window.opener.refreshByTask == "function")
                                window.opener.refreshByTask();
                        }
                        if (whereFrom == 3) {
                            greedyint.dialog2.confirm("保存成功！是否关闭页面？",
                                     function () {
                                         window.close();
                                     });
                        }
                        else {
                            window.location = "/Task/DisplayFinish?id=" + $("#data-id").val();
                        }
                    } else {
                        greedyint.dialog2.error(json.message);
                    }
                }
            };
            $.ajax(ajax);

        });
        //        }
        //        else {
        //            btnNext.setVisible(false);
        //        }

        taskContainer = $('<div class="ReportLayoutBox2 ReportNewLayoutS6" id="taskContainer"></div>').appendTo(document.body)[0];

        $(window).resize(setFootbarPosition);
        $(window).load(setFootbarPosition);
        var taskItem = new models.previewandreports.TaskItem();
        if (whereFrom == 1) {
            taskItem.setRenderingType(models.previewandreports.RenderingType.StudentAnalysis);
        }
        else if (whereFrom == 2) {
            taskItem.setRenderingType(models.previewandreports.RenderingType.StudentView);
        }
        else if (whereFrom == 3) {
            taskItem.setRenderingType(models.previewandreports.RenderingType.TeacherAnalysisView);
        }
        taskItem.setQuestion(new models.core.TaskQuestion());
        taskItem.getQuestion().setContent(contentParser(JSON.parse($("#data-question").val())));
        if (answerParser) {
            taskItem.setAnswer(new models.core.TaskAnswer());
            taskItem.getAnswer().setContent(answerParser(JSON.parse($("#data-answer").val()), contentParser(JSON.parse($("#data-question").val()))));
            taskItem.getAnswer().setUseTime(JSON.parse($("#data-useTime").val()));
            taskItem.setCheckAnswer($("#data-checkAnswer").val());
        }
        if (correctParser) {
            taskItem.setCorrect(correctParser(JSON.parse($("#data-correct").val() != "" ? $("#data-correct").val() : null),
                   contentParser(JSON.parse($("#data-question").val()))));
        }
        if (autoCorrectParser) {
            taskItem.setAutoCorrect(autoCorrectParser(JSON.parse($("#data-autoCorrect").val() != "" ? $("#data-autoCorrect").val() : null)));
        }
        if ($("#data-studentAnalysis").val() != "null") {
            taskItem.setStudentAnalysis(JSON.parse($("#data-studentAnalysis").val()).Content);
        }
        if ($("#data-teacherAnalysis").val() != "null") {
            taskItem.setTeacherAnalysis(JSON.parse($("#data-teacherAnalysis").val()).Content);
        }

        if ($("#data-studentMark").val()) {
            var mark = JSON.parse($("#data-studentMark").val());
            if (mark && mark.Content) {
                mark.Content = JSON.parse(mark.Content);
                if (mark.Content)
                    taskItem.setStudentMark(mark);
            }
        }

        if ($("#data-teacherMark").val()) {
            var mark = JSON.parse($("#data-teacherMark").val());
            if (mark && mark.Content) {
                mark.Content = JSON.parse(mark.Content);
                if (mark.Content)
                    taskItem.setTeacherMark(mark);
            }
        }


        //useTime 
        (function () {
            if (answerParser) {
                var userTime = taskItem.getAnswer().getUseTime();
                var hr = Math.floor(userTime / 3600);
                var min = Math.floor(userTime / 60) % 60;
                var sec = userTime % 60;
                var useTimeDisplayedAs = "";
                if (hr > 0 && hr < 10)
                    useTimeDisplayedAs += "0" + hr + ":";
                else if (hr >= 10)
                    useTimeDisplayedAs += hr + ":";
                if (min < 10)
                    useTimeDisplayedAs += "0" + min + ":";
                else if (min >= 10)
                    useTimeDisplayedAs += min + ":";
                if (sec < 10)
                    useTimeDisplayedAs += "0" + sec;
                else if (sec >= 10)
                    useTimeDisplayedAs += sec;
                lblUseTime.setText(useTimeDisplayedAs);
            } else {
                //                lblUseTime.setVisible(false);
                $(lblUseTime.getElement()).parent().hide();
            }

        })();

        var taskView = createView();
        taskView.appendTo(taskContainer);
        taskView.setModelAndUpdateUI(taskItem);



        setFootbarPosition();
        //禁用右键和ctrl+c和ctrl+v
        disableCopy();
    });
};



function setFootbarPosition() {
    //窗口高度超过页面高度时，中间部分的高度自动增高
    if ($(window).height() > $("body").height()) {
        $("#taskContainer").css("min-height", $(window).height() - 140);
    }
}
//禁用右键和ctrl+c和ctrl+v
function disableCopy() {
    //    禁用右键菜单和复制黏贴
    $(document).bind("dragstart dragenter dragover drop contextmenu", function (e) {
        e.preventDefault();
    });
    $(document).bind("keydown", function (e) {
        if (e.ctrlKey)
            e.preventDefault();
    });
    $(document).bind("copy", function (e) {
        return false;
    });
    $(document).bind("paste", function (e) {
        return false;
    });
    $(document).bind("cut", function (e) {
        return false;
    });
}