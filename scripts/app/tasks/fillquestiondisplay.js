var usedinthispage = {};


usedinthispage.App = function () {
    usedinthispage.App.superClass.constructor.call(this);
    this._uiQuestions = [];
    this._ctnQuestion = $("#ctnQuestion").get(0);

    //按钮
    this._btnBack = new toot.ui.Button($("#btnBack")[0]);
    this._btnBack.setEnabledStyleConfig({ enabled: "btnSubmit1", disabled: "btnSubmit1 btnSubmit1Dis" });
    this._btnNext = new toot.ui.Button($("#btnNext")[0]);
    this._btnNext.setEnabledStyleConfig({ enabled: "btnSubmit1", disabled: "btnSubmit1 btnSubmit1Dis" });
    this._btnSubmit = new toot.ui.Button($("#btnSubmit")[0]);
    this._btnSubmit.setEnabledStyleConfig({ enabled: "btnSubmit1", disabled: "btnSubmit1 btnSubmit1Dis" });
    //按钮事件
    toot.connect(this._btnSubmit, "action", this, this._onBtnSubmitAction);
    toot.connect(this._btnBack, "action", this, this._onBtnBackAction);
    toot.connect(this._btnNext, "action", this, this._onBtnNextAction);
    //限时自动提交
    this._timerbar = new businesscomponents.ui.Timerbar(businesscomponents.ui.Timerbar.ieltDisplayTimerbarHtml);
    this._timerbar.setVisible(false);
    this._timerbar.replaceTo($("#anchorTimerbar").get(0));
    this._questionContent = null;

};
toot.inherit(usedinthispage.App, task.DisplayApp);
toot.defineEvent(usedinthispage.App, ["_useTimeIncrease_limitTime"]);
toot.extendClass(usedinthispage.App, {
    _onBtnSubmitAction: function () {
        if (isTestDisplay())
            this._closeTestDisplay();
        else {
            this._finish(1, "提交后将无法返回，确认提交？");
        }
    },
    _onBtnBackAction: function () {
        //        if (this._is1stPage()) {
        this._finish(2, null);
        //        }
        //        else {
        //            this._setPageByIndex(this._currPage - 1);
        //        }
    },
    _onBtnNextAction: function () {
        //        if (this._isLastPage()) {
        //        var msg = this._audioPlaying ? "Hey" : null;
        this._finish(1, null);
        //        }
        //        else {
        //            this._setPageByIndex(this._currPage + 1);
        //        }
    },
    setUIByData: function () {

        var content = models.tasks.fillquestion.Content.parse(JSON.parse(this._$dataQuestion.val()));
        this._questionContent = content;
        //渲染按钮状态
        this._setBtnsStateByIndex();
        if (!this._isInFor1st())
            this._answer = models.tasks.fillquestion.AnswerContent.XParse(JSON.parse(this._answerStringified), content);
        if (content.getQuestions()) {
            for (var i = 0, l = content.getQuestions().length; i < l; i++) {
                var uiQuestion = new businesscomponents.fillquestion.ui.display.FillQuestion(businesscomponents.fillquestion.ui.display.FillQuestion.html1);
                uiQuestion.getModel().setRequest(content.getQuestions()[i].getContent());
                //赋值答案
                if (!this._isInFor1st())
                    uiQuestion.getModel().setResponse(this._answer.getAnswers()[i]);
                uiQuestion.updateUIByModel();
                this._ctnQuestion.appendChild(uiQuestion.getElement());
                this._uiQuestions.push(uiQuestion);
            }
        }

        //设置limitTime，暂时放在setUIByData中实现
        //        this._limitTime = this._getLimitTime();
        //        if (this._limitTime != null) {
        //            this._timerbar = new businesscomponents.ui.Timerbar(businesscomponents.ui.Timerbar.ieltDisplayTimerbarHtml);
        //            this._timerbar.replaceTo($("#anchorTimerbar").get(0));
        //        }
        this._manageUpdatingTimerbar();
        this._setIncreasingUseTime_limitTime(true);
        if (!this._sectionTimeMerged && this._questionContent.getLimitTime() != null) {
            this._timerbar.setVisible(true);
        }
    },
    _getContent: function () {
        var content = new models.tasks.fillquestion.AnswerContent();
        var answers = [];
        for (var i = 0, l = this._uiQuestions.length; i < l; i++)
            answers.push(this._uiQuestions[i].updateAndGetModelByUI().getResponse());
        content.setAnswers(answers);
        return content;
    },
    _getAnswerInfos: function () {
        var content = models.tasks.fillquestion.Content.parse(JSON.parse(this._$dataQuestion.val()));
        var questions = [];
        questions = content.getQuestions();

        var answersStr = this._contentForAInfosParsing;
        var answers = [];
        answers = answersStr.getAnswers();
        var aInfosAll = [];
        for (var i = 0, l = answers.length; i < l; i++) {
            var aInfos = services.task.getAInfosByFillQuestionAndResponse(answers[i], questions[i].getContent());
            aInfosAll = aInfosAll.concat(aInfos);

        }
        //alert(JSON.stringify(qInfosAll));
        return aInfosAll;


    },
    //---------------答题限时------------------
    //      代码格式与基类用时计时器一致

    //答题阶段的用时 和答题限时对应 
    _useTime_limitTime: 0,
    _increasingUseTime_limitTime: false,
    //是否为每次启动时的第一次信号
    _increaseUseTimeOnTick_limitTime_1stTickOnStarting: false,
    _increaseUseTimeOnTick_limitTime: function () {
        //使首次促发时用时为0
        //        if (this._useTime_limitTime == 0)
        //            this._useTime_limitTime = 0;
        //        else
        //使首次触发时用时维持原值
        if (!this._increaseUseTimeOnTick_limitTime_1stTickOnStarting)
            this._useTime_limitTime++;
        this._increaseUseTimeOnTick_limitTime_1stTickOnStarting = false;
        toot.fireEvent(this, "_useTimeIncrease_limitTime");
        var limitTime = this._questionContent.getLimitTime();
        if (!this._sectionTimeMerged && limitTime != null && limitTime - this._useTime_limitTime <= 0) {
            this._setIncreasingUseTime_limitTime(false);
            if (isTestDisplay())
                this._closeTestDisplay();
            else {
                this._finish(1);
            }
            //            this._finish(1);
        }
    },
    _setIncreasingUseTime_limitTime: function (increasing) {
        if (this._increasingUseTime_limitTime == increasing)
            return;
        this._increasingUseTime_limitTime = increasing;
        if (this._increasingUseTime_limitTime) {
            this._increaseUseTimeOnTick_limitTime_1stTickOnStarting = true;
            toot.connect(this, "_tick", this, this._increaseUseTimeOnTick_limitTime);
        }
        else {
            toot.disconnect(this, "_tick", this, this._increaseUseTimeOnTick_limitTime);
        }
    },

    //---------------答题限时------------------

    //根据用时和Section合并限时更新计时器
    _updateTimerByUseTime: function () {
        this._timerbar.setTime(this._getCurrentTimeLeftInMerged());
    },
    //根据答题阶段用时和限时更新计时器
    _updateTimerByUseTime_limitTime: function () {
        this._timerbar.setTime(this._questionContent.getLimitTime() - this._useTime_limitTime);
    },
    _manageUpdatingTimerbar: function () {
        //        if (this._hasMergedLimitTime()) {
        //            this._timerbar.setVisible(true);
        //            toot.connect(this, "_useTimeIncrease", this, this._updateTimerByUseTime);
        //        }
        //        else if (this._questionContent.getLimitTime() != null) {
        //            this._timerbar.setVisible(true);
        //            this._setIncreasingUseTime_limitTime(true);
        //            toot.connect(this, "_useTimeIncrease_limitTime", this, this._updateTimerByUseTime_limitTime);
        //        }
        if (this._sectionTimeMerged) {
            if (this._sectionTimeLimited)
                toot.connect(this, "_useTimeIncrease", this, this._updateTimerByUseTime);
        }
        else {
            if (this._questionContent.getLimitTime() != null)
                toot.connect(this, "_useTimeIncrease_limitTime", this, this._updateTimerByUseTime_limitTime);
        }
    },
    //设置按钮状态
    _setBtnsStateByIndex: function () {
        //back按钮的状态（仅位于合并的第一个task时不可见）
        if (!this._isSwitchableBetweenTasks()) {
            this._btnBack.setVisible(false);
        }
        else {
            if (this._1stInMerged)
                this._btnBack.setVisible(false);
            else
                this._btnBack.setVisible(true);
        }
        //next按钮的状态（仅位于合并的最后一个task时不可见）
        if (!this._isSwitchableBetweenTasks()) {
            this._btnNext.setVisible(false);
        }
        else {
            if (this._lastInMerged)
                this._btnNext.setVisible(false);
            else
                this._btnNext.setVisible(true);
        }

        //submit按钮（仅位于合并的最后一个task时可见）
        if (!this._isSwitchableBetweenTasks()) {
            this._btnSubmit.setVisible(true);
        }
        else {
            if (this._lastInMerged)
                this._btnSubmit.setVisible(true);
            else
                this._btnSubmit.setVisible(false);
        }
    },
    _updateTimeUI: function () {
        if (this._limitTime != null)
            this._timerbar.setTime(this._getLeftTime());
    }

});


$(function () {

    var app = new usedinthispage.App();
    app.setUIByData();
    app.setIncreasingUseTime(true);
    if (app._sectionTimeMerged && app._sectionTimeLimited) {
        app._timerbar.setVisible(true);
    }
    //    app.startUpdatingTime();

});