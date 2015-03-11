//
/*
* 功能:批改页基类
* 作者:小潘
* 日期:20130731
*/

var businesscomponents = businesscomponents || {};

businesscomponents.correctors = businesscomponents.correctors || {};

businesscomponents.correctors.CorrectorBase = function () {
    businesscomponents.correctors.CorrectorBase.superClass.constructor.call(this, document.body);

    this._element.className = "taskbodybg";
    this._topbar = new businesscomponents.correctors.Topbar();
    this._topbar.appendTo(this._element);
    this._elementCtnZones = $('<div class="taskMidbox"></div>').appendTo(this._element)[0];
    $('<div class="taskfooter webfooterFix"></div>').appendTo(this._element);
    this._$markSpeakHr = $(' <div class="markSpeakHr"></div>');
    //空内容显示dom
    var empty = new businesscomponents.SingleContainer(businesscomponents.SingleContainer.html_empty);
    this._empty = empty.getElementContainer();

    //taskMarkPaperBox
    var taskMarkPaperBox = new businesscomponents.SingleContainer(businesscomponents.SingleContainer.html_taskMarkPaperBox);
    this._taskMarkPaperBox = taskMarkPaperBox.getElementContainer();

    this._msgBar = new businesscomponents.MessageBar();
    this._msgBar.setVisible(false);
    this._msgBar.appendTo(this._element);

    this._combox = new businesscomponents.correctors.ComBox();
    this._urlInfo = this._getUrlInfo();

    this._mark = null;

    this._nowAt = new Date($("#data-nowAt").val());
    this._nowBy = $("#data-nowBy").val();

    if (this.constructor == arguments.callee) this._init();

    //窗口高度超过页面高度时，中间部分的高度自动增高 duji
    if ($(window).height() > $("body").height()) {
        $(".taskMidbox").css("min-height", $(window).height() - 90);
    }


};
toot.inherit(businesscomponents.correctors.CorrectorBase, toot.view.ViewBase);
toot.extendClass(businesscomponents.correctors.CorrectorBase, {

    getNowAt: function () { return this._nowAt },
    setNowAt: function (nowAt) { return this._nowAt = nowAt },
    getNowBy: function () { return this._nowBy },
    setNowBy: function (nowBy) { this._nowBy = nowBy },

    _defaultMessageDuration: 3000,
    _init_manageEvents: function () {

        businesscomponents.correctors.CorrectorBase.superClass._init_manageEvents.call(this);
        //页面加载和变化的时候执行
        //            window.onload = this._setFootbarPosition();
        //            window.onresize = this._setFootbarPosition();
        //            window.onscroll = this._setFootbarPosition();
        toot.connect(this._topbar.getBtnSave(), "action", this, this._onBtnSaveAction);
        toot.connect(this._topbar.getBtnCancel(), "action", this, this._onBtnCancelAction);

    },

    _onBtnCancelAction: function () {
        greedyint.dialog.confirm(StatusMessage[2628], function () {
            window.close();
        });
    },
    _setFootbarPosition: function (i) {
        //窗口高度超过页面高度时，中间部分的高度自动增高

        if ($(window).height() > $("body").height()) {
            $(".taskMidbox").height($(window).height() - 90);
        }
    },

    _validate: function () {
        if (!this._combox.getModel()) {
            this._msgBar.setMessage(StatusMessage[2301], this._defaultMessageDuration);
            return false;
        }
        return true;
    },

    _onBtnSaveAction: function () {
        var _this = this;
        this.updateModelByUI();
        this._isTestValid(function () {
            if (!_this._validate()) return false;

            var aInfos = _this._getAnswerInfos();
            $.ajax({
                url: "/TaskService/SaveCorrect?id=" + _this._urlInfo.id + "&usernodeid=" + _this._urlInfo.usernodeid + "&ticks=" + _this._urlInfo.ticks
                    + "&token=" + _this._urlInfo.token,
                data: {
                    content: JSON.stringify(_this._model.getCorrect().getContent()),
                    answerInfo: JSON.stringify(aInfos == null ? null : model.core.AnswerInfo.convert(aInfos)),
                    userTaskMark: _this._model.getTeacherMark() ? JSON.stringify(_this._model.getTeacherMark().Content) : null
                },
                type: 'POST',
                dataType: 'json',
                cache: false,
                success: function (json) {

                    if (json.status == 1) {
                        if (typeof window.taskListRefresh == "function")
                            try {
                                window.taskListRefresh();
                            }
                            catch (e) {
                            }
                        greedyint.dialog.confirm(StatusMessage[2626],
                            function () {
                                window.opener = null;
                                window.open('', '_self');
                                window.close();
                            });
                        //                            greedyint.dialog.success(StatusMessage[10003], StatusMessage[json.code], 2, function () {
                        //                                //window.location.reload();
                        //
                        //                                window.opener = null;
                        //                                window.open('', '_self');
                        //                                window.close();
                        //                            });
                        //                        window.location = decodeURIComponent(_this._urlInfo.finishUrl) + "&answerId=" + json.id;
                        if (window.correctFinished) correctFinished(_this._urlInfo.usernodeid);

                    } else {
                        greedyint.dialog.error(StatusMessage[2611], StatusMessage[json.code]);
                    }

                }
            });
        }
        );
    },

    updateUIByModel: function () {
        if (this._model) {
            // this._topbar.getTxtName().setText("阅卷 - " + this._model.getCorrect().getTypeName() + "批改");
            this._topbar.getTxtName().setText("批改");
            this._topbar.getUseTime().setText(this.formatSeconds(this._model.getAnswer().getUseTime()));
            this._isTestValid();
        } else {
            this._topbar.getTxtName().setText(null);
            this._topbar.getUseTime().setText(null);
        }
    },
    //url argument
    _getUrlInfo: function () {
        var infoFromSearch = this._parseUrlParas(location.search);
        var infoFromHash = this._parseUrlParas(location.hash);
        var result = {};
        for (var p in infoFromSearch)
            result[p] = infoFromHash[p] !== undefined ? infoFromHash[p] : infoFromSearch[p];
        return result;
    },
    _parseUrlParas: function (str) {
        var result = {};
        var searchItems = str.substring(1).split('&');
        for (var i = 0, l = searchItems.length; i < l; i++) {
            var kv = searchItems[i].split('=');
            if (kv[0].toLowerCase() == "id") result.id = kv[1];
            else if (kv[0].toLowerCase() == "ticks") result.ticks = kv[1];
            else if (kv[0].toLowerCase() == "usernodeid") result.usernodeid = kv[1];
            else if (kv[0].toLowerCase() == "token") result.token = kv[1];
        }
        return result;
    },

    _getAnswerInfos: function () {
        var aInfosAll = [];
        var aInfo = new model.core.AnswerInfo();
        //对得分字符串去空
        aInfo.setUserTotalCount($.trim(this._combox.getModel()));
        aInfosAll.push(aInfo);
        return aInfosAll;
    },

    formatSeconds: function (value) {
        var theTime = parseInt(value); // 秒
        var theTime1 = 0; // 分
        var theTime2 = 0; // 小时
        // alert(theTime);
        if (theTime > 60) {
            theTime1 = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            // alert(theTime1+"-"+theTime);
            if (theTime1 > 60) {
                theTime2 = parseInt(theTime1 / 60);
                theTime1 = parseInt(theTime1 % 60);
            }
        }
        var result = "" + parseInt(theTime) + "秒";
        if (theTime1 > 0) {
            result = "" + parseInt(theTime1) + "分" + result;
        }
        if (theTime2 > 0) {
            result = "" + parseInt(theTime2) + "小时" + result;
        }
        return "用时：" + result;
    },
    //
    getScoreRange: function (type) {
        var nodeConfig = this.getModel().getCorrect().getNodeConfig();
        var range = [];
        if (nodeConfig && nodeConfig.length > 0) {
            var correctConfig = nodeConfig[0].correctConfig;
            var scoreStep = correctConfig.scoreStep;
            var scoreMin = correctConfig.scoreMin;
            var scoreMax = correctConfig.scoreMax;
            for (var i = scoreMin; i <= scoreMax; i += scoreStep) {
                var num = Math.round(i * 10) / 10;

                range.push(num);
            }

            if (range[range.length - 1] < scoreMax)
                range.push(scoreMax);

            return range;
        }

        switch (type) {
            case 0:
                //托福默认打分
                return [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
            case 1:
                //雅思默认打分             
                return [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];
            case 2:
                //翻译题
                return [0, 1, 2, 3, 4, 5];
            case 3:
                //托福口语
                return [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
            case 4:
                //通用题型 翻译题
                return ["Good"];
            case 5:
                //听写
                return [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
        }

        return [1, 2, 3];
    },
    getTopbar: function () { return this._topbar; },
    _isTestValid: function (ok, no) {
        var url = '/TestManager/IsTestValid';
        var data = {};

        data.id = this._model.getCorrect().getTestId();
        var ajax = {
            url: url,
            data: data,
            type: 'POST',
            dataType: 'json',
            cache: false,
            success: function (rs) {
                if (rs.result) {
                    if (ok) {
                        ok();
                    }
                }
                else {
                    if (no) {
                        no();
                    }
                    else {
                        greedyint.dialog.info(StatusMessage[4050], function () { });
                    }
                }
            }
        }
        $.ajax(ajax);
    }

});