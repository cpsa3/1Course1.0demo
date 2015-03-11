var businesscomponents = businesscomponents || {};

businesscomponents.intelligentdictationfordisplay = businesscomponents.intelligentdictationfordisplay || {};

businesscomponents.intelligentdictationfordisplay.Diction = function (opt_html) {
    businesscomponents.ui.RnRItem.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.intelligentdictationfordisplay.Diction.html)[0]);
    this._$questionList = $($(this._element).find('[gi~="questionList"]')[0]);
    this._uiQuestions = [];
    this._currentQuestion = null;
};
toot.inherit(businesscomponents.intelligentdictationfordisplay.Diction, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.intelligentdictationfordisplay.Diction, {
    //获取文本框和按钮
    getBtnCheck: function () {
        return this._checker.getBtnCheck();
    },
    getBtnSave: function () {
        return this._checker.getBtnSave();
    },
    setIsAllowCheck: function (isAllow) {
        this._checker.setIsAllowCheck(isAllow);
    },
    updateUIByModel: function () {
        if (this.getRequestModel()) {
            //题目
            var questions = this.getModel();
            for (var i = 0; i < questions.getRequest().length; i++) {
                var question = new businesscomponents.intelligentdictationfordisplay.DictionQuestion();
                question.setRequestModel(questions.getRequest()[i]);
                this._$questionList.append($(question.getElement()));
                question.updateUIByModel();
                toot.connect(question, "play", this, this._playAction);
                this._uiQuestions.push(question);
            }
            //校对框
            this._checkAnswer = new businesscomponents.intelligentdictationfordisplay.CheckAnswer();
            $(this._element).append($(this._checkAnswer.getElement()));
            //输入框
            this._checker = new businesscomponents.intelligentdictationfordisplay.Checker();
            $(this._element).append($(this._checker.getElement()));
            toot.connect(this._checker, "save", this, this._onSaveAndCheckAction);
            toot.connect(this._checker, "check", this, this._onSaveAndCheckAction);
            toot.connect(this._checker, "write", this, this._onWriterAction);
            toot.connect(this._checker, "stopwrite", this, this._onStopWriteAction);
        }
        else {
        }

    },
    updateModelByUI: function () {
        var response = new models.tasks.intelligentdictation.AnswerContent();
        var wordCount = 0;
        var errorCount = 0;
        var muchspellCount = 0;
        var misspellCount = 0;
        var accurateCount = 0;
        var userTime = 0;
        var originalWordCount = 0;
        var noAnswers = [];
        var answers = [];
        for (var i = 0; i < this._uiQuestions.length; i++) {
            this._uiQuestions[i].updateModelByUI();
            if (this._uiQuestions[i].getResponseModel().getAnswer() != "") {
                wordCount = wordCount + this._uiQuestions[i].getResponseModel().getWordCount();
                errorCount = errorCount + this._uiQuestions[i].getResponseModel().getErrorCount();
                muchspellCount = muchspellCount + this._uiQuestions[i].getResponseModel().getMuchspellCount();
                misspellCount = misspellCount + this._uiQuestions[i].getResponseModel().getMisspellCount();
                accurateCount = accurateCount + this._uiQuestions[i].getResponseModel().getAccurateCount();
                originalWordCount = originalWordCount + this._uiQuestions[i].getResponseModel().getOriginalWordCount();
                userTime = userTime + this._uiQuestions[i].getResponseModel().getUserTime();
                answers.push(this._uiQuestions[i].getResponseModel());
            }
            else {
                noAnswers.push(this._uiQuestions[i].getResponseModel().getIndex());
                //                wordCount = wordCount+this._setWordsCount(this._uiQuestions[i].getResponseModel().getStandAnswer());
            }

        }
        response.setAnswers(answers);
        response.setWordCount(wordCount);
        response.setErrorCount(errorCount);
        response.setMuchspellCount(muchspellCount);
        response.setMisspellCount(misspellCount);
        response.setAccurateCount(accurateCount);
        response.setNoAnswers(noAnswers);
        response.setOriginalWordCount(originalWordCount);
        response.setUserTime(userTime);
        this.setResponseModel(response);

    },
    _setWordsCount: function (text) {

        //        if (event.data.ta.id = "txtAnswer") {
        //            var text;
        //            text = event.data.ta.val(); //fix ie8 Prototychange事件发生在blur之前
        //            if (text == event.data._this._defaultStr) {
        //                event.data.ta.val("");
        //                text = "";
        //            }
        text = text.replace(/\b\.\b/g, "");
        text = text.replace(/[\u4e00-\u9fa5]/g, " ");
        text = text.replace(/\,|\.|\!|\?|\"|\'|\:|\;/g, " ");
        text = text.replace(/\，|\。|\！|\？|\“|\”|\‘|\’|\：|\；/g, " ");
        text = $.trim(text);
        if (text.length == 0) {
            //            event.data._this._$wordCountBox.text(0);
            return 0;
        } else {
            var count = text.split(/\s+/).length;
            //            event.data._this._$wordCountBox.text(count);
            return count;
        }
        //        }
    },
    _playAction: function (sender, e) {

        if (this._currentQuestion != sender && this._currentQuestion) {
            this._currentQuestion.stopPlay();
            this._currentQuestion.clearBg();
            this._checkAnswer.reset();
            this._checker.reset();
        }
        //        console.log("play");
        //设置check的值
        this._currentQuestion = sender;

        this._checker.setStandAnswer(e.standAnswer);
        this._checker.setAnswer(e.answer);

    },
    _onSaveAndCheckAction: function (sender, e) {

        if (e.type == 2) {
            this._checkAnswer.setCheckAnswer(e.html);
            this._currentQuestion.setAccurateRate(e.accurateRate);
        }
        this._currentQuestion.setRate(e.accurateRate);

        //更新当前question的值
        if (this._currentQuestion) {
            this._currentQuestion.setAnswerText(e.answer, e.html1);
            this._currentQuestion.setWordCount(e.wordCount);
            this._currentQuestion.setOriginalWordCount(e.originalWordCount);
            this._currentQuestion.setErrorCount(e.errorCount);
            this._currentQuestion.setMuchspellCount(e.muchspellCount);
            this._currentQuestion.setMisspellCount(e.misspellCount);
            this._currentQuestion.setAccurateCount(e.accurateCount);
        }
        else {
            alert("非法操作");
        }

    },
    _onWriterAction: function () {
        //        console.log("write");
        this._currentQuestion.startWrite();
    },
    _onStopWriteAction: function () {
        //        console.log("stop");
        this._currentQuestion.stopWrite();
    }
});
businesscomponents.intelligentdictationfordisplay.Diction.html =
                                                                                                                    '<div class="IDictationBox1">' +
                                                                                                                        '<dl class="IDictationBox1Head">' +
                                                                                                                            '<dd class="IDItemBox1">序号</dd>' +
                                                                                                                            '<dd class="IDItemBox2">听写内容</dd>' +
                                                                                                                            '<dd class="IDItemBox3">次数</dd>' +
                                                                                                                            '<dd class="IDItemBox4">正确率</dd>' +
                                                                                                                            '<dd class="IDItemBox5">音频时间</dd>' +
                                                                                                                        '</dl>' +
                                                                                                                        '<div class="IDictationBox1Inner copyScroll" gi="questionList">' +

                                                                                                                        '</div>' +
                                                                                                                    '</div>';

businesscomponents.intelligentdictationfordisplay.DictionQuestion = function (opt_html) {
    businesscomponents.ui.RnRItem.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.intelligentdictationfordisplay.DictionQuestion.html)[0]);
    this._btnplay = new toot.ui.Button($(this._element).find('[gi~="btnplay"]')[0]);
    this._lblTime = new toot.ui.Label($(this._element).find('[gi~="lblTime"]')[0]);
    this._lblTime.setText(this._parseTimeData(0));
    toot.connect(this._btnplay, "action", this, this._onBtnPlayAction);
    this._$ctnPlayer = $(this._element).find('[gi~="ctnPlayer"]');
    this._$ctnPlayer[0].id = "gi-" + (Math.random() + "").substring(2) + (Math.random() + "").substring(2);
    this._$rateProgress = $(this._element).find('[gi~="rateProgress"]');
    this._$playIcon = $(this._element).find('[gi~="playIcon"]');
    this._$playCount = $(this._element).find('[gi~="playCount"]');

    this._lblIndex = $($(this._element).find('[gi~="lblIndex"]')[0]);
    this._questionText = $($(this._element).find('[gi~="questionText"]')[0]);
    this._player = null;
    this._playCount = 0;
    this._playTimer = null;
    this._isPlaying = false;
    this._isFinish = true;
    this._time = 0;
    this._userTime = 0;
    this._rate = 0;
    this._answer = "";
    this._checkAnswer = "";
    this._wordCount = 0;
    this._originalWordCount = 0;
    this._errorCount = 0;
    this._muchspellCount = 0;
    this._misspellCount = 0;
    this._accurateCount = 0;
};
toot.inherit(businesscomponents.intelligentdictationfordisplay.DictionQuestion, businesscomponents.ui.RnRItem);
toot.defineEvent(businesscomponents.intelligentdictationfordisplay.DictionQuestion, "play");
toot.extendClass(businesscomponents.intelligentdictationfordisplay.DictionQuestion, {
    updateUIByModel: function () {
        if (this.getRequestModel()) {
            this._lblIndex.html(this.getRequestModel().getIndex());
            //            this._questionText.html(this.getRequestModel().getEnglishSentence());
            this._setupPlayer(this.getRequestModel().getAudioUrl());
            return;
        }
    },
    updateModelByUI: function () {
        var response = new models.tasks.intelligentdictation.Answer();
        response.setPlayCount(this._playCount);
        response.setStandAnswer(this.getRequestModel().getEnglishSentence());
        response.setAudioUrl(this.getRequestModel().getAudioUrl());
        response.setAnswer(this._answer);
        response.setCheckAnswer(this._checkAnswer);
        response.setAccurateRate(this._rate);
        response.setWordCount(this._wordCount);
        response.setOriginalWordCount(this._originalWordCount);
        response.setErrorCount(this._errorCount);
        response.setMuchspellCount(this._muchspellCount);
        response.setMisspellCount(this._misspellCount);
        response.setAccurateCount(this._accurateCount);
        response.setUserTime(this._userTime);
        response.setIndex(this.getRequestModel().getIndex());

        this.setResponseModel(response);
    },
    setErrorCount: function (errorCount) {
        this._errorCount = errorCount;

    },
    setMuchspellCount: function (muchspellCount) {
        this._muchspellCount = muchspellCount;

    },
    setMisspellCount: function (misspellCount) {
        this._misspellCount = misspellCount;

    },
    setAccurateCount: function (accurateCount) {
        this._accurateCount = accurateCount;

    },

    setWordCount: function (wordCount) {
        this._wordCount = wordCount;

    },
    setOriginalWordCount: function (originalWordCount) {
        this._originalWordCount = originalWordCount;
    },
    _onBtnPlayAction: function () {

        if (this._isPlaying) {
            this._player.pause();
            $(this._btnplay.getElement()).removeClass("btn10Pause").addClass("btn10Play");
            clearInterval(this._playTimer);
            this._isPlaying = !this._isPlaying;
            this._$playIcon.hide();
            return false;
        }
        this._isPlaying = !this._isPlaying;
        if (this._isFinish) {
            this._playCount++;
        }
        this._isFinish = false;
        this._$playCount.html(this._playCount);
        this._$playIcon.show();
        this._player.play();
        this._updataTime();
        $(this._btnplay.getElement()).removeClass("btn10Play").addClass("btn10Pause");
        var data = {
            index: this.getRequestModel().getIndex(),
            standAnswer: this.getRequestModel().getEnglishSentence(),
            answer: this._answer
        };
        toot.fireEvent(this, "play", data);
        //更改颜色
        $(this._element).addClass("IDPlayCurrent");
    },
    //    _stopPlay:
    _updataTime: function () {
        var _this = this;
        this._playTimer = setInterval(function () {
            _this._time++;
            _this._lblTime.setText(_this._parseTimeData(_this._time));
        }, 1000);
    },
    stopPlay: function () {

        this._player.stop();
        this._clearUi();
    },
    clearBg: function () {
        $(this._element).removeClass("IDPlayCurrent");
    },
    setAnswerText: function (answer, checkAnswer) {
        this._answer = answer;
        this._checkAnswer = checkAnswer;
        this._questionText.html(answer);
    },

    setAccurateRate: function (rate) {
        var rate = parseFloat(rate.substring(0, rate.lastIndexOf('%')));
        this._$rateProgress.width(rate);
        //        this.setRate(rate);
    },
    _setupPlayer: function (url) {
        var _this = this;
        this._player = jwplayer(this._$ctnPlayer[0].id).setup({
            flashplayer: "/Scripts/libs/jwplayer/player.swf",
            width: '1',
            height: '1',
            provider: 'sound',
            file: url,
            controlbar: 'top',
            autostart: false
        });
        this._player.onComplete(function () {
            _this._clearUi();
        });
    },
    _clearUi: function () {
        this._isPlaying = false;
        $(this._btnplay.getElement()).removeClass("btn10Pause").addClass("btn10Play");
        this._$playIcon.hide();
        this._lblTime.setText(this._parseTimeData(0));
        clearInterval(this._playTimer);
        this._isFinish = true;
        this._time = 0;
    },
    startWrite: function () {
        var _this = this;
        if (!_this.writeTimer) {

            _this.writeTimer = setInterval(function () {
                _this._userTime++;
                //                alert(_this._userTime);
            }, 1000);
        }
    },
    stopWrite: function () {
        clearInterval(this.writeTimer);

        this.writeTimer = 0;
    },
    getUserTime: function () {
        return this._userTime;
    },
    getPlayCount: function () {
        return this._playCount;
    },
    getRate: function () {
        return this._rate;
    },
    setRate: function (rate) {
        this._rate = rate;
    },
    _parseTimeData: function (timeStr) {

        var second = Math.floor(timeStr % 60);             // 计算秒     
        var minite = Math.floor((timeStr / 60) % 60);      //计算分 
        var hour = Math.floor((timeStr / 60) / 60);        //计算小时
        var Str = "";

        if (hour > 0) {
            Str += hour + ":";
        }
        if (minite < 10) {
            Str += "0" + minite + ":";
        } else {
            Str += minite + ":";
        }

        if (second < 10) {
            Str += "0" + second;
        } else {
            Str += second;
        }
        return Str;
    }
});
businesscomponents.intelligentdictationfordisplay.DictionQuestion.html =
                                                                                                                            '<dl class="IDItemBoxOuter"><!-- 当前正在做的题目增加样式 IDPlayCurrent，背景变蓝 -->' +
                                                                                                                                '<dd class="IDItemBox1" gi="lblIndex"></dd>' +
                                                                                                                                '<dd class="IDItemBox2_1">' +
                                                                                                                                    '<button class="btn10Play" gi="btnplay"></button>' +
                                                                                                                                    '<!-- 暂停把样式换成 btn10Pause ,停止换成 btn10Stop -->' +
                                                                                                                                '</dd>' +
                                                                                                                                '<dd class="IDItemBox2_2" gi="questionText">' +
                                                                                                                                '</dd>' +
                                                                                                                                '<dd class="IDItemBox2_3"><em class="IDPlayIcon" gi="playIcon"  style="display: none;"></em></dd>' +
                                                                                                                                '<dd class="IDItemBox3" gi="playCount">0</dd>' +
                                                                                                                                '<dd class="IDItemBox4">' +
                                                                                                                                    '<span class="AccuracyStyle1"><em style="width:0%;" gi="rateProgress"></em></span>' +
                                                                                                                                    '<!--未答题时使用代码为：<span class="AccuracyStyle0"><em></em></span> -->' +
                                                                                                                                '</dd>' +
                                                                                                                                '<dd class="IDItemBox5"><span gi="lblTime">00:00</span>&nbsp&nbsp&nbsp&nbsp</dd>' +
                                                                                                                                '<div gi="ctnPlayer"></div>' +
                                                                                                                            '</dl>';

businesscomponents.intelligentdictationfordisplay.CheckAnswer = function (opt_html) {
    businesscomponents.ui.BusinessComponentBase.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.intelligentdictationfordisplay.CheckAnswer.html)[0]);
    this._checkAnswer = $($(this._element).find('[gi~="checkAnswer"]')[0]);
};
toot.inherit(businesscomponents.intelligentdictationfordisplay.CheckAnswer, businesscomponents.ui.BusinessComponentBase);
toot.extendClass(businesscomponents.intelligentdictationfordisplay.CheckAnswer, {
    updateUIByModel: function () {
        //        if (!this.getRequestModel()) {
        //            this._cbInAnswer.checked = false;
        //            this._txtContent.setValue(null);
        //            return;
        //        }

        //        this._cbInAnswer.checked = this.getRequestModel().isInAnswer();
        //        this._txtContent.setValue(this.getRequestModel().getContent());
    },
    reset: function () {
        this._checkAnswer.html("");
    },
    updateModelByUI: function () {
        //        this._setRequestModelIfNull(businesscomponents.choicequestion.model.Choice);
        //        this.getRequestModel().setInAnswer(this._cbInAnswer.checked);
        //        this.getRequestModel().setContent(this._txtContent.getValue());
    },
    setCheckAnswer: function (html) {
        this._checkAnswer.html(html);
    }
});
businesscomponents.intelligentdictationfordisplay.CheckAnswer.html =
                                                                                                                    '<dl class="IDictationBox2">' +
                                                                                                                        '<dt class="IDictationBox2Head">校对结果</dt>' +
                                                                                                                        '<dd class="IDictationBox2Inner copyScroll" gi="checkAnswer">' +
                                                                                                                            '<!--  没有内容时为空即可，外框保留占位 -->' +
                                                                                                                        '</dd>' +
                                                                                                                    '</dl>';

businesscomponents.intelligentdictationfordisplay.Checker = function (opt_html) {
    businesscomponents.ui.BusinessComponentBase.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.intelligentdictationfordisplay.Checker.html)[0]);
    this._btnSave = new toot.ui.Button($(this._element).find('[gi~="btnSave"]')[0]);
    this._btnCheck = new toot.ui.Button($(this._element).find('[gi~="btnCheck"]')[0]);
    this._btnSave.setEnabledStyleConfig({ enabled: "btn13Next marR20", disabled: "btn13Next btn13NextDis  marR20" });
    this._btnCheck.setEnabledStyleConfig({ enabled: "btn13Next", disabled: "btn13Next btn13NextDis " });
    this._btnSave.setEnabled(false);
    this._btnCheck.setEnabled(false);
    this._lblErrorCount = new toot.ui.Label($(this._element).find('[gi~="lblErrorCount"]')[0]);
    this._lblMuchspellCount = new toot.ui.Label($(this._element).find('[gi~="lblMuchspellCount"]')[0]);
    this._lblMisspellCount = new toot.ui.Label($(this._element).find('[gi~="lblMisspellCount"]')[0]);
    this._lblAccurateRate = new toot.ui.Label($(this._element).find('[gi~="lblAccurateRate"]')[0]);
    this._lblErrorCount.setText("N/A");
    this._lblMuchspellCount.setText("N/A");
    this._lblMisspellCount.setText("N/A");
    this._lblAccurateRate.setText("N/A");
    this._txtCheck = $($(this._element).find('[gi~="txtCheck"]')[0]);
    this._txtCheck.attr("disabled", "disabled");
    var _this = this;
    this._txtCheck.bind("blur", { _this: _this }, _this._blurAction);
    this._txtCheck.bind("focus", { _this: _this }, _this._focusAction);
    this._txtCheck.bind("keyup", { _this: _this }, _this._keyUpAction);
    this._txtCheck.bind("keypress", { _this: _this }, _this._keyPressAction);

    toot.connect(this._btnSave, "action", this, this._onBtnSaveAction);
    toot.connect(this._btnCheck, "action", this, this._onBtnCheckAction);
    this._standAnswer = "";
    this._checkTimer = null;
    this._isWrite = false;
    this._isAllowCheck = true;
    this._tip = "请输入英文半角状态下的字母与符号......";
};
toot.inherit(businesscomponents.intelligentdictationfordisplay.Checker, businesscomponents.ui.BusinessComponentBase);
toot.defineEvent(businesscomponents.intelligentdictationfordisplay.Checker, "save");
toot.defineEvent(businesscomponents.intelligentdictationfordisplay.Checker, "check");
toot.defineEvent(businesscomponents.intelligentdictationfordisplay.Checker, "write");
toot.defineEvent(businesscomponents.intelligentdictationfordisplay.Checker, "stopwrite");
toot.extendClass(businesscomponents.intelligentdictationfordisplay.Checker, {
    //获取文本框和按钮
    getBtnCheck: function () {
        return this._btnCheck;
    },
    getBtnSave: function () {
        return this._btnSave;
    },
    setIsAllowCheck: function (isAllow) {
        this._isAllowCheck = isAllow;
    },
    updateUIByModel: function () {
        //        if (!this.getRequestModel()) {
        //            this._cbInAnswer.checked = false;
        //            this._txtContent.setValue(null);
        //            return;
        //        }

        //        this._cbInAnswer.checked = this.getRequestModel().isInAnswer();
        //        this._txtContent.setValue(this.getRequestModel().getContent());
    },
    setStandAnswer: function (standAnswer) {
        this._standAnswer = standAnswer;

        this._txtCheck.removeAttr("disabled");

    },
    setAnswer: function (answer) {
        if (this._txtCheck.val() == "" || this._txtCheck.val() == this._tip) {
            this._txtCheck.val(answer);
        }
    },
    reset: function () {
        this._txtCheck.val("");
        this._lblErrorCount.setText("N/A");
        this._lblMuchspellCount.setText("N/A");
        this._lblMisspellCount.setText("N/A");
        this._lblAccurateRate.setText("N/A");
        this._btnSave.setEnabled(false);
        this._btnCheck.setEnabled(false);
    },
    updateModelByUI: function () {
        //        this._setRequestModelIfNull(businesscomponents.choicequestion.model.Choice);
        //        this.getRequestModel().setInAnswer(this._cbInAnswer.checked);
        //        this.getRequestModel().setContent(this._txtContent.getValue());
    },
    _blurAction: function (data) {
        var _this = data.data._this;
        if (_this._txtCheck.val() == "") {
            _this._txtCheck.val(_this._tip);
        }
        toot.fireEvent(_this, "stopwrite");
        clearInterval(_this._checkTimer);
        _this._checkTimer = 0;
        //        console.log("blur");
    },
    _focusAction: function (data) {
        var _this = data.data._this;
        if (_this._txtCheck.val() == _this._tip) {
            _this._txtCheck.val("");
        }
        if (_this._txtCheck.val() != "" && _this._txtCheck.val() != _this._tip && _this._isAllowCheck) {
            _this._btnSave.setEnabled(true);
            _this._btnCheck.setEnabled(true);
        }
        toot.fireEvent(_this, "write");
        _this._checkIsWrite();
        //        console.log("focus");
    },
    _keyPressAction: function (data) {
        var _this = data.data._this;
        toot.fireEvent(_this, "write");
        _this._checkIsWrite();
        //        console.log("press");
    },
    _checkIsWrite: function () {
        var _this = this;
        if (this._checkTimer && this._checkTimer != 0) {
            clearInterval(_this._checkTimer);
            _this._checkTimer = 0;
        }
        this._checkTimer = setInterval(function () {
            toot.fireEvent(_this, "stopwrite");
            clearInterval(_this._checkTimer);
            //            console.log("check1");
            _this._checkTimer = 0;
        }, 5000);
    },

    _keyUpAction: function (data) {
        var _this = data.data._this;
        if (_this._txtCheck.val() != "" && _this._isAllowCheck) {
            _this._btnSave.setEnabled(true);
            _this._btnCheck.setEnabled(true);
        }
        else {
            _this._btnSave.setEnabled(false);
            _this._btnCheck.setEnabled(false);
        }

    },
    _onBtnSaveAction: function () {
        if (this._checkFormat()) {
            this._check(1);
        }
    },
    _onBtnCheckAction: function () {
        if (this._checkFormat()) {
            this._check(2);
        }

    },
    _checkFormat: function () {
        var checkVal = this._txtCheck.val();
        var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        if (checkVal.replace(/\s+/g, "").length == 0) {
            greedyint.dialog2.error("输入内容不能全部为空！");
            return false;
        }
        if (reg.test(checkVal)) {
            greedyint.dialog2.error("输入内容不能包含中文字符！");
            return false;
        }
        for (var i = 0; i < checkVal.length; i++) {
            var strCode = checkVal.charCodeAt(i);
            if ((strCode > 65248) || (strCode == 12288)) {
                greedyint.dialog2.error("输入内容不能包含全角字符！");
                return false;
            }
        }
        return true;
    },
    _check: function (type) {
        var _this = this;
        //type=1;保存，=2check
        var result = {
            type: type,
            answer: _this._txtCheck.val(),
            html: "",
            html1: "",
            accurateRate: 0,
            wordCount: 0,
            originalWordCount: 0,
            errorCount: 0,
            muchspellCount: 0,
            misspellCount: 0,
            accurateCount: 0
        };
        var data = {};
        data.content = this._txtCheck.val();
        data.standard = this._standAnswer;
        data.mode = 0;
        var ajax = {
            url: "/Common/TextDiff",
            data: data,
            type: 'POST',
            dataType: 'json',
            cache: false,
            success: function (json) {
                result.html = json.ComparedText;
                //                result.accurateRate = json.AccurateRate;
                //                if (type == 2) {
                //                    _this._lblErrorCount.setText(json.ErrorCount);
                //                    _this._lblMuchspellCount.setText(json.MuchspellCount);
                //                    _this._lblMisspellCount.setText(json.MisspellCount);
                //                    _this._lblAccurateRate.setText(json.AccurateRate);
                //                }
                //请求报告的html
                data.mode = 1;
                var ajax = {
                    url: "/Common/TextDiff",
                    data: data,
                    type: 'POST',
                    dataType: 'json',
                    cache: false,
                    success: function (json) {
                        result.html1 = json.ComparedText;
                        result.accurateRate = json.AccurateRate;
                        result.wordCount = json.WordCount;
                        result.originalWordCount = json.OriginalWordCount;
                        result.errorCount = json.ErrorCount;
                        result.muchspellCount = json.MuchspellCount;
                        result.misspellCount = json.MisspellCount;
                        result.accurateCount = json.AccurateCount;
                        if (type == 2) {
                            _this._lblErrorCount.setText(json.ErrorCount);
                            _this._lblMuchspellCount.setText(json.MuchspellCount);
                            _this._lblMisspellCount.setText(json.MisspellCount);
                            _this._lblAccurateRate.setText(json.AccurateRate);
                        }
                        toot.fireEvent(_this, "check", result);
                    }
                };
                $.ajax(ajax);
            }
        };
        $.ajax(ajax);
    }
});
businesscomponents.intelligentdictationfordisplay.Checker.html =
                                                                                                                    '<div class="IDictationBox3">' +
                                                                                                                        '<textarea class="textAreaStyle2 copyScroll" gi="txtCheck" spellcheck="false">请输入英文半角状态下的字母与符号......</textarea>' +
                                                                                                                        '<dl class="IDictationBox3Foot clearfix">' +
                                                                                                                            '<dt class="fl">' +
                                                                                                                                '错拼：<span class="TextStyle1" gi="lblErrorCount">N/A</span>' +
                                                                                                                                '多拼：<span class="TextStyle1" gi="lblMuchspellCount">N/A</span>' +
                                                                                                                                '漏拼：<span class="TextStyle1" gi="lblMisspellCount">N/A</span>' +
                                                                                                                                '正确率：<span class="TextStyle1" gi="lblAccurateRate">N/A</span>' +

                                                                                                                            '</dt>' +
                                                                                                                            '<dd class="fr"><button class="btn13Next marR20" gi="btnSave">保存</button><button class="btn13Next"  gi="btnCheck">校对</button></dd>' +
                                                                                                                        '</dl>' +
                                                                                                                    '</div>';