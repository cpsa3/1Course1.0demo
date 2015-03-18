var task = task || {};

task.DisplayWithCorrectApp = function () {

    task.DisplayWithCorrectApp.superClass.constructor.call(this);
    this._userCheck = null;
    this._checkUrl = "/Common/GammaCheck";
    this._data = {};
    this._correctQuestion = null;
    this._correctAnswer = null;

};
toot.inherit(task.DisplayWithCorrectApp, task.DisplayApp);
toot.extendClass(task.DisplayWithCorrectApp, {
    _getUserCheck: function () {
        return this._userCheck;
    },
    _setUserCheck: function (userCheck) {
        this._userCheck = userCheck;
    },
    setCheckUrl: function (checkUrl) {
        this._checkUrl = checkUrl;
    },
    setCheckData: function (data) {
        this._data = data;
    },


    _finish: function (mode, confirm) {
        var _this = this;

        if (this._state != 10)
            return false;

        if (confirm != null) {
            greedyint.dialog.confirm(confirm, function () {
                //停止计时器
                _this._stopTime();
                _this._finish(mode);
            }, function () {
                //Do nothing
            });
            return;
        }
        else {
            //停止计时器
            _this._stopTime();
        }

        var content = this._getContent();
        this._contentForAInfosParsing = content;
        var aInfos = null;

        //重复提交相关
        var durationsCorrect = [20000, 30000];
        var durations = [10000, 20000];
        var durationInShort = 1000;
        var attemptAt = -1;
        var repeatAt = -1;
        var succesInShort = true;
        var submitFns = [function () {
            greedyint.common.ajax({
                url: _this._checkUrl,
                data: _this._data,
                type: 'POST',
                cache: false,
                timeout: durationsCorrect[attemptAt]
            }).
            networkError(function (resultStatus) {
                _this._setState(30, { status: resultStatus });
            }).
            timeout(function (resultStatus) {
                _this._setState(30, { status: resultStatus });
                if (attemptAt == 0) {
                    attemptAt = 1;
                    submit();
                }
                else if (attemptAt == 1) {
                    attemptAt = -1;
                }
            }).
            bizSuccess(function (data) {
                _this._setUserCheck(data);
                aInfos = _this._getAnswerInfos();
                submitFns[1]();
            }).
            bizError(function (error, msg) {
                greedyint.dialog.error('提醒', msg);
            }).
            before(function () {
                _this._setState(20, { timeout: durationsCorrect[attemptAt] + durations[attemptAt] });
            }).
            complete(function (resultStatus) {
            });
        }, function () {
            greedyint.common.ajax({
                url: "/TaskService/SaveTaskAnswer?id=" + _this._urlInfo.id + "&tqId=" + _this._urlInfo.tqId + "&finishUrl=" + _this._urlInfo.finishUrl
               + "&ticks=" + _this._urlInfo.ticks + "&token=" + _this._urlInfo.token,
                data: {
                    content: JSON.stringify(_this._getContent()),
                    useTime: _this._useTime,
                    userCheck: _this._getUserCheck(),
                    answerInfos: JSON.stringify(aInfos == null ? null : model.core.AnswerInfo.convert(aInfos))
                },
                type: 'POST',
                cache: false,
                timeout: durations[attemptAt]
            }).
            networkError(function (resultStatus) {
                _this._setState(30, { status: resultStatus });
            }).
            timeout(function (resultStatus) {
                _this._setState(30, { status: resultStatus });
                if (attemptAt == 0) {
                    attemptAt = 1;
                    submit();
                }
                else if (attemptAt == 1) {
                    attemptAt = -1;
                }
            }).
            bizSuccess(function (data) {
                _this._setState(90, { data: data });
            }).
            bizError(function (error, msg) {
                greedyint.dialog.error('提醒', msg);
            }).
            before(function () {
                if (_this._state != 20)
                    _this._setState(20, { timeout: durations[attemptAt] });
            }).
            complete(function (resultStatus) {
            });
        } ];
        var submit = function () {
            if (_this._userCheck)
                submitFns[1]();
            else
                submitFns[0]();
        }
        var onFinishSuccess = function (win) {
          
            if (win.opener) {
                if (typeof win.opener.refreshByTask == "function")
                    win.opener.refreshByTask();
            }

        }
        var locate = function (e) {
            _this._locateTo(decodeURIComponent(_this._urlInfo.finishUrl) +
                                       "&answerId=" + e.data +
                                        "&mode=" + mode +
                                        (_this._hasMergedLimitTime() ? "&timeLeftInMerged=" + _this._getCurrentTimeLeftInMerged() : ""));
            //刷新父窗体列表
            onFinishSuccess(_this.thatWindow);
        }
        toot.connect(this, "statusChange", this, function (sender, e) {
            if (e.stateBefore == 10 && e.stateAfter == 20) {
                setTimeout(function () {
                    if (_this._state == 20) {
                        succesInShort = false;
                        _this._uiProgress.startProgressing(0, 20, e.timeout);
                        _this._uiProgress.setVisible(true);
                        _this._uiRetry.setVisible(false);
                    }
                }, 1000);
            }
            if (e.stateBefore == 30 && e.stateAfter == 20) {
                if (attemptAt == 0)
                    this._uiProgress.startProgressing(0, 20, e.timeout);
                else if (attemptAt == 1)
                    this._uiProgress.startProgressing(this._uiProgress.getProgress(), 80, e.timeout);
                this._uiProgress.setVisible(true);
                this._uiRetry.setVisible(false);
            }
            if (e.stateBefore == 20 && e.stateAfter == 30) {
                if (e.status == "networkError" || e.status == "timeout" && attemptAt == 1) {
                    this._uiProgress.stopProgressing();
                    this._uiProgress.setVisible(false);
                    this._uiRetry.setVisible(true);
                    toot.connectOnce(this._uiRetry.btnRetry, "action", this, function () {
                        repeatAt++;
                        attemptAt = 0;
                        submit();
                    });
                }
            }
            if (e.stateBefore == 20 && e.stateAfter == 90) {
                if (repeatAt == 0 && attemptAt == 0 && succesInShort) {
                    locate(e);
                }
                else {
                    this._uiProgress.startProgressing(this._uiProgress.getProgress(), 100, 1000, function () {
                        _this._uiProgress.setVisible(false);
                        _this._uiSuccess.setVisible(true);
                        setTimeout(function () {
                            locate(e);
                        }, 1000);
                    });
                }
            }
        });


        repeatAt = 0;
        attemptAt = 0;
        submit();
        //重复提交相关

        return true;
    },

    getCorrectQuestion: function () {
        return this._correctQuestion;
    },
    setCorrectQuestion: function (correctQuestion) {
        this._correctQuestion = correctQuestion;
    },
    getCorrectAnswer: function () {
        return this._correctAnswer;
    },
    setCorrectAnswer: function (correctAnswer) {
        this._correctAnswer = correctAnswer;
    },
    _getAnswerInfos: function () {
        var aInfosAll = [];
        var aInfo = new model.core.AnswerInfo();
        //        task.model.ieltswritingpractice.CorrectContent.parse(JSON.parse($("#data-userCheck").val()));
        if (!this._sectionTimeMerged) {
            aInfo.setUserTotalCount(task.model.ieltswritingpractice.CorrectContent.parse(JSON.parse(this._getUserCheck())).getComment().getScore());
        }
        aInfosAll.push(aInfo);
        return aInfosAll;
    }
});