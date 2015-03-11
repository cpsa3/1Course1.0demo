//听写专用
var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.IntelligentDictationQuestionGroup = function (opt_html) {
    businesscomponents.previewandreports.IntelligentDictationQuestionGroup.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.IntelligentDictationQuestionGroup.html)[0]);

    this._$questionList = $($(this._element).find('[gi~="questionList"]')[0]);
    this._$noAnswer = $($(this._element).find('[gi~="noAnswer"]')[0]);
    this._$noAnswerctn = $($(this._element).find('[gi~="noAnswerctn"]')[0]);
    this._$noAnswerctn.hide();
    this._lblWordCount = new toot.ui.Label($(this._element).find('[gi~="wordCount"]')[0]);
    this._lblErrorCount = new toot.ui.Label($(this._element).find('[gi~="errorCount"]')[0]);
    this._lblMuchspellCount = new toot.ui.Label($(this._element).find('[gi~="muchspellCount"]')[0]);
    this._lblMisspellCount = new toot.ui.Label($(this._element).find('[gi~="misspellCount"]')[0]);
    this._lblAccurateCount = new toot.ui.Label($(this._element).find('[gi~="accurateCount"]')[0]);

    this._lblStartTime = new toot.ui.Label($(this._element).find('[gi~="startTime"]')[0]);
    this._lblEfficientUserTime = new toot.ui.Label($(this._element).find('[gi~="efficientUserTime"]')[0]);
    this._lblUserTime = new toot.ui.Label($(this._element).find('[gi~="userTime"]')[0]);
    this._lblEfficiency = new toot.ui.Label($(this._element).find('[gi~="efficiency"]')[0]);
    this._lblRate = new toot.ui.Label($(this._element).find('[gi~="rate"]')[0]);

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.IntelligentDictationQuestionGroup, toot.view.ViewBase);
toot.extendClass(businesscomponents.previewandreports.IntelligentDictationQuestionGroup, {
    updateUIByModel: function () {
        if (this._model) {
            this._lblWordCount.setText(this._model.getOriginalWordCount());
            this._lblErrorCount.setText(this._model.getErrorCount());
            this._lblMuchspellCount.setText(this._model.getMuchspellCount());
            this._lblMisspellCount.setText(this._model.getMisspellCount());
            this._lblAccurateCount.setText(this._model.getAccurateCount());
            this._lblStartTime.setText(this._model.getStartTime());
            this._lblEfficientUserTime.setText(this._changeTime(this._model.getUserTime()));
            this._lblUserTime.setText(this._changeTime(this._model.getTotalTime()));
            this._lblEfficiency.setText(this._changeTwoDecimal_f(this._model.getEfficiency()) + "%");
            this._lblRate.setText(this._changeTwoDecimal_f(this._model.getAccurateRate()) + "%");
            if (this._model.getNoAnswers().length > 0) {
                this._$noAnswerctn.show();
                for (var i = 0; i < this._model.getNoAnswers().length; i++) {
                    var str = "";
                    if (i == this._model.getNoAnswers().length - 1) {
                        str = "<span>" + this._model.getNoAnswers()[i] + "</span>";
                    }
                    else {
                        str = "<span>" + this._model.getNoAnswers()[i] + ",</span>"
                    };
                    this._$noAnswer.append($(str));
                }
            }
            //渲染题目
            for (var i = 0; i < this._model.getAnswers().length; i++) {
                var question = new businesscomponents.previewandreports.IntelligentDictationQuestion();
                this._$questionList.append($(question.getElement()));
                question.setModelAndUpdateUI(this._model.getAnswers()[i]);

            }

        }
        else {
        }

    },
    _changeTwoDecimal_f: function (x) {
        if (x == null || x == undefined) {
            return 0;
        }
        var s_x = "";
        if (x == 0) {
            s_x = "0";
            return s_x;
        } else if (x == 1) {
            s_x = "100";
            return s_x;
        } else {
            var tempArray = x.toString().split('.');
            if (tempArray[1].length >= 4) {
                s_x = tempArray[1].substring(0, 4);
            } else {
                s_x = tempArray[1].substring(0);
            }
        }
        var index = 0;
        if (s_x.length > 2) {
            s_x = s_x.substring(0, 2) + "." + s_x.substring(2);
        }
        for (var i = 0; i < s_x.length; i++) {
            if (s_x[i] != 0) {
                index = i;
                break;
            }
        }
        if (index == 0 && s_x.length == 1) {
            s_x = s_x + '0';
        } else {
            s_x = s_x.substring(index);
        }
        if (s_x.indexOf('.') == 0) {
            s_x = "0" + s_x;
        }
        if (s_x == 0) {
            s_x = "0";
        }
        return s_x;
    },
    _changeTime: function (time) {
        var second = Math.floor(time % 60);             // 计算秒     
        var minite = Math.floor((time / 60) % 60);      //计算分 
        var hour = Math.floor((time / 60) / 60);        //计算小时
        var Str = "";

        if (hour > 0) {
            Str += hour + ":";
        }
        if (minite < 10) {
            if (minite == 0) {
                Str += minite + ":";
            }
            else {
                Str += "0" + minite + ":";
            }

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
businesscomponents.previewandreports.IntelligentDictationQuestionGroup.html =
                                                                                                                                            '<div>' +
                                                                                                                                                '<div class="IDictationBox4Explain">' +
                                                                                                                                                    '<div class="IDictationBox4E_1"><!-- 不要有空格 -->' +
                                                                                                                                                        '单词：<span class="TextStyle1" gi="wordCount">168</span>正确：<span class="TextStyle1" gi="accurateCount">54</span><span class="TextStyleWrong2">错拼</span>&nbsp;<span class="TextStyleCorrect">纠正</span>：<span class="TextStyle1"  gi="errorCount">12</span><span class="TextStyleMiss2">漏拼</span>：<span class="TextStyle1" gi="misspellCount">8</span><span class="TextStyleExtra2">多拼</span>：<span class="TextStyle1" gi="muchspellCount">11</span>' +
                                                                                                                                                    '</div>' +
                                                                                                                                                    '<div class="IDictationBox4E_2"><!-- 不要有空格 -->' +
                                                                                                                                                        '开始时间：<span class="TextStyle1" gi="startTime">2014-12-22 12:12:12</span>答题有效时长：<span class="TextStyle1" gi="efficientUserTime">1:12</span>答题总时长：<span class="TextStyle1"  gi="userTime">2:28</span>听写效率：<span class="TextStyle2" gi="efficiency">34.0%</span>正确率：<span class="TextStyle2" gi="rate">45.0%</span>' +
                                                                                                                                                    '</div>' +
                                                                                                                                                '</div>' +
                                                                                                                                                '<div gi="questionList"></div>' +
                                                                                                                                                '<div class="IDictationBox4Miss" gi="noAnswerctn">第 <span gi="noAnswer"></span> 句 未听写！</div>' +
                                                                                                                                            '</div>';



businesscomponents.previewandreports.IntelligentDictationQuestion = function (opt_html) {
    businesscomponents.previewandreports.IntelligentDictationQuestion.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.IntelligentDictationQuestion.html)[0]);
    this._lblRate = new toot.ui.Label($(this._element).find('[gi~="rate"]')[0]);
    this._lblWordCount = new toot.ui.Label($(this._element).find('[gi~="wordCount"]')[0]);
    this._lblPlayCount = new toot.ui.Label($(this._element).find('[gi~="playCount"]')[0]);
    this._lblIndex = new toot.ui.Label($(this._element).find('[gi~="index"]')[0]);
    this._$standAnswer = $($(this._element).find('[gi~="standAnswer"]')[0]);
    this._$answer = $($(this._element).find('[gi~="answer"]')[0]);
    this._$checkAnswer = $($(this._element).find('[gi~="checkAnswer"]')[0]);
    this._btnplay = new toot.ui.Button($(this._element).find('[gi~="btnplay"]')[0]);
    toot.connect(this._btnplay, "action", this, this._onBtnPlayAction);
    this._isPlaying = false;
    this._player = null;
    this._$ctnPlayer = $(this._element).find('[gi~="ctnPlayer"]');
    this._$ctnPlayer[0].id = "gi-" + (Math.random() + "").substring(2) + (Math.random() + "").substring(2);
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.IntelligentDictationQuestion, toot.view.ViewBase);
toot.extendClass(businesscomponents.previewandreports.IntelligentDictationQuestion, {
    updateUIByModel: function () {
        if (this._model) {
            this._lblRate.setText(this._model.getAccurateRate());
            this._lblWordCount.setText(this._model.getWordCount());
            this._lblIndex.setText(this._model.getIndex());
            this._lblPlayCount.setText(this._model.getPlayCount());
            this._$standAnswer.html(this._model.getStandAnswer());
            this._$answer.html(this._model.getAnswer());
            this._$checkAnswer.html(this._model.getCheckAnswer());
            this._setupPlayer(this._model.getAudioUrl());
        }
        else {
        }


    },
    _onBtnPlayAction: function () {

        if (this._isPlaying) {
            this._player.pause();
            $(this._btnplay.getElement()).removeClass("btn10Pause").addClass("btn10Play");

            return false;
        }
        this._isPlaying = !this._isPlaying;
        this._player.play();
        $(this._btnplay.getElement()).removeClass("btn10Play").addClass("btn10Pause");
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
            $(_this._btnplay.getElement()).removeClass("btn10Pause").addClass("btn10Play");
            _this._isPlaying = false;
        });
    }

});
businesscomponents.previewandreports.IntelligentDictationQuestion.html = '<div class="IDictationBox4Detail clearfix">' +
                                                                                                                                                '<span class="IDictationBox4D_1" gi="index">1</span>' +
                                                                                                                                                '<div class="IDictationBox4D_2">' +
                                                                                                                                                    '<button class="btn10Play" gi="btnplay"></button>' +
                                                                                                                                                    '<!-- 暂停把样式换成 btn10Pause ,停止换成 btn10Stop -->' +
                                                                                                                                                    '<div gi="ctnPlayer"></div>' +
                                                                                                                                                '</div>' +
                                                                                                                                                '<div class="IDictationBox4D_3">' +
                                                                                                                                                    '<dl class="clearfix">' +
                                                                                                                                                        '<dt>参考原文：</dt>' +
                                                                                                                                                        '<dd gi="standAnswer">' +
                                                                                                                                                        '</dd>' +
                                                                                                                                                    '</dl>' +
                                                                                                                                                    '<dl class="clearfix">' +
                                                                                                                                                        '<dt>听写内容：</dt>' +
                                                                                                                                                        '<dd gi="answer">' +

                                                                                                                                                        '</dd>' +
                                                                                                                                                    '</dl>' +
                                                                                                                                                    '<dl class="clearfix">' +
                                                                                                                                                        '<dt>校对结果：</dt>' +
                                                                                                                                                        '<dd gi="checkAnswer">' +
                                                                                                                                                        '</dd>' +
                                                                                                                                                    '</dl>' +
                                                                                                                                                    '<dl class="clearfix">' +
                                                                                                                                                        '<dt>数据统计：</dt>' +
                                                                                                                                                        '<dd class="TextStyle3">' +
                                                                                                                                                            '正确率（<span gi="rate">1%</span>）| 单词（<span gi="wordCount">5</span>） 次数（<span gi="playCount">12</span>）' +
                                                                                                                                                        '</dd>' +
                                                                                                                                                    '</dl>' +
                                                                                                                                                '</div>' +

                                                                                                                                            '</div>';