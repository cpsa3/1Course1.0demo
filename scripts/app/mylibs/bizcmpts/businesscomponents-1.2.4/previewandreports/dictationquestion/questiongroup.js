/*
*User: 小潘 & 应乐超
*Date: 2015年1月30日 15:20:36
*Desc: 听写题组 预览 查看 
*/

var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.dictationquestion = businesscomponents.previewandreports.dictationquestion || {};

businesscomponents.previewandreports.dictationquestion.QuestionGroup = businesscomponents.previewandreports.dictationquestion.QuestionGroup || {};

businesscomponents.previewandreports.dictationquestion.QuestionGroup.Preview = function(model) {

    this.model = model || {};

    var _$el = $('<div>');
    this.initialize = function() {
        _$el.addClass("questionbox13");

        for (var i = 0; i < this.model.getQuestions().length; i++) {
            var QuestionsGroupEl = $('<div>');
            QuestionsGroupEl.addClass("RichTextEditor marB15");
            var explainEl = $('<div>');
            QuestionsGroupEl.append(explainEl);
            var questions = this.model.getQuestions()[i];
            //var explain = questions._explain;
            explainEl.html(questions._content._explain);
            QuestionsGroupEl.append(explainEl);
            for (var p = 0; p < questions._content.getQuestions().length; p++) {
                if (questions._content.getQuestions()[p]._audioUrl) {
                    var question = new businesscomponents.previewandreports.dictationquestion.QuestionView(questions._content.getQuestions()[p]);
                    QuestionsGroupEl.append(question.$el);
                }

            }


            _$el.append(QuestionsGroupEl);
        }
    };
    this.getElementForJquery = function() {
        return _$el;
    };
    this.initialize();


};
businesscomponents.previewandreports.dictationquestion.QuestionView = function(model) {

    this.model = model || {};
    this.tempalte = '<div class="questionbox13inner">' +
        '<div class="questionbox13IHead clearfix">';
    this.$el = $('<div>');
    this._render = function() {

        //音频
        var audio = new businesscomponents.previewandreports.Audio();
        audio.setRenderModel(0);
        audio.setAudionModel(0);
        audio.setAudioId(this.model._audioUrl);
        audio.renderPlayer();
        $(audio._element).appendTo(this.$el.find('.questionbox13IHead'));

        return this.$el;

    };
    this._initialize = function() {

        this.$el.html(this.tempalte);
        this._render();

    };
    this.setModel = function(model) {
        this.model = model;
    };
    this.updateUIByModel = function() {
        this._initialize();
    };
    this.getElementForJquery = function() {
        return this.$el;
    };
    this._initialize();


};

//扩展RnRItem 增加CorrectModel by xp
businesscomponents.ui = businesscomponents.ui || {};

businesscomponents.ui.CorrectAndRnRItem = function(element) {
    businesscomponents.ui.RnRItem.call(this, element);

    this._model = new businesscomponents.RequestAndResponseAndCorrect();
};

toot.inherit(businesscomponents.ui.CorrectAndRnRItem, businesscomponents.ui.RnRItem);

toot.extendClass(businesscomponents.ui.CorrectAndRnRItem, {
    setModel: function(model) {
        if (model == null) {
            this.setRequestModel(null);
            this.setResponseModel(null);
            this.setCorrectModel(null);
        } else {
            this.setRequestModel(model.getRequest());
            this.setResponseModel(model.getResponse());
            this.setRenderingType(model.getRenderingType());
            this.setCorrectModel(model.getCorrect());
        }
    },
    setCorrectModel: function(correct) {
        this._model.setCorrect(correct == null ? null : correct);
    },
    getCorrectModel: function() {
        return this._model.getCorrect();
    }
});


//扩展businesscomponents.requestAndResponse by xp
businesscomponents.RequestAndResponseAndCorrect = function() {
    this._request = null;
    this._response = null;
    this._renderingType = 1;
    this._correct = null;
};
toot.extendClass(businesscomponents.RequestAndResponseAndCorrect, {
    getRequest: function() {
        return this._request;
    },
    setRequest: function(request) {
        this._request = request;
    },
    getResponse: function() {
        return this._response;
    },
    setResponse: function(response) {
        this._response = response;
    },
    setCorrect: function(correct) {
        this._correct = correct;
    },
    getCorrect: function() {
        return this._correct;
    },
    getRenderingType: function() { return this._renderingType; },
    setRenderingType: function(type) { this._renderingType = type; }
});


//查看
businesscomponents.previewandreports.dictationquestion.QuestionGroup.DisplayFinish = function(opt_html) {
    businesscomponents.previewandreports.dictationquestion.QuestionGroup.DisplayFinish.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.dictationquestion.QuestionGroup.DisplayFinish.html)[0]);

    this._requestModel = null;
    this._responseModel = null;
    this._correctGroup = null;

    this._questionsBox = $(this._element).find('[gi~="questionsBox"]').get(0);
    this._$explainBox = $(this._element).find('[gi~="explainBox"]');

    this._listQuestion = new businesscomponents.ui.List(this._questionsBox, this._questionsBox,
        businesscomponents.previewandreports.dictationquestion.Question.DisplayFinish, null);

    this._listQuestion.setDefaultUIGenerator(
        $.proxy(function() {
            return this._generatorQuestion();
        }, this)
    );
};
toot.inherit(businesscomponents.previewandreports.dictationquestion.QuestionGroup.DisplayFinish, toot.view.ViewBase);
toot.extendClass(businesscomponents.previewandreports.dictationquestion.QuestionGroup.DisplayFinish, {
    updateUIByModel: function() {
        if (this._requestModel && this._responseModel) {
            if (this._requestModel.getExplain()) {
                this._$explainBox.html(this._requestModel.getExplain());
            }

            var questionAndResponses = [];
            for (var i = 0, l = this._requestModel.getQuestions().length; i < l; i++) {
                var rnr = new businesscomponents.RequestAndResponseAndCorrect();
                rnr.setRequest(this._requestModel.getQuestions()[i]);
                rnr.setResponse(this._responseModel.getQuestionResponses()[i]);
                if (this._correctGroup) {
                    rnr.setCorrect(this._correctGroup.getCorrectItems()[i]);
                }
                questionAndResponses.push(rnr);
            }
            this._listQuestion.setModelAndUpdateUI(questionAndResponses);
        }
    },
    setRequestModel: function(requestModel) {
        this._requestModel = requestModel;
    },
    setResponseModel: function(responseModel) {
        this._responseModel = responseModel;
    },
    _generatorQuestion: function() {
        var question = new businesscomponents.previewandreports.dictationquestion.Question.DisplayFinish();
        question.setIsCheck(this._isCheck);
        question.setIsShowReference(this._isShowReference);
        return question;
    },
    setIsCheckAndIsShowReference: function(obj) {
        this._isCheck = obj.isCheck;
        this._isShowReference = obj.isShowReference;
    },
    //绑定Audio
    bindAudios: function() {
        for (var i = 0; i < this._listQuestion.getItems().length; i++) {
            this._listQuestion.getItems()[i].bindAudio();
        }
    },
    setCorrectGroup: function(correctGroup) {
        this._correctGroup = correctGroup;
    },


});
businesscomponents.previewandreports.dictationquestion.QuestionGroup.DisplayFinish.html =
    '<div class="questionbox13">' +
    '<div class="RichTextEditor marB15" gi="explainBox">' +
    '</div>' +
    '<div gi="questionsBox">' +
    '</div>' +
    '</div>';


businesscomponents.previewandreports.dictationquestion.Question = businesscomponents.previewandreports.dictationquestion.Question || {};

businesscomponents.previewandreports.dictationquestion.Question.DisplayFinish = function(opt_html) {
    businesscomponents.previewandreports.dictationquestion.Question.DisplayFinish.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.dictationquestion.Question.DisplayFinish.html)[0]);


    this._player = new businesscomponents.JwPlayerForDictation();

    this._timerBar = new businesscomponents.SpeakingTimeBar(businesscomponents.SpeakingTimeBar.htmlForDictationGroup);
    this._timerBar.setTimes(0);
    this._timerBar.setUsageTimes(0);
    this._timerBar.setTimesText("播放次数");
    this._timerBar.replaceTo($(this.getElement()).find('[gi~="timerBox"]')[0]);

    this._$answerBox = $(this.getElement()).find('[gi~="answerBox"]');
    this._$reference = $(this.getElement()).find('[gi~="referenceBox"]');
    this._$referenceText = $(this.getElement()).find('[gi~="referenceText"]');

    //评分评语
    this._titlezone3 = new businesscomponents.previewandreports.TitleZone();


    //是否请求机批
    this._isCheck = false;
    //是否显示参考答案
    this._isShowReference = false;

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.dictationquestion.Question.DisplayFinish, businesscomponents.ui.CorrectAndRnRItem);
toot.extendClass(businesscomponents.previewandreports.dictationquestion.Question.DisplayFinish, {
    updateUIByModel: function() {
        if (this.getRequestModel() && this.getResponseModel()) {


            if (this.getRequestModel().getReference() && this._isShowReference) {
                this._$reference.html(this.getRequestModel().getReference());
            } else {
                this._$referenceText.hide();
            }
            // 设置学生答案 请求机批
            this._$answerBox.html(this.getUserAnswer(this.getResponseModel().getAnswer()));

            this._timerBar.setTimes(this.getResponseModel().getPlayCount());
            this._timerBar.setUsageTimes(this.getResponseModel().getPlayTime());


            var correctzone;
            if (this.getCorrectModel()) {
                this._titlezone3.setTitles(["评分", "评语"]);
                this._titlezone3.setContentClass("ReportNewSBox3S clearfix");
                correctzone = new businesscomponents.previewandreports.CorrectZone();
                correctzone.setRenderModel(0);
                //未批改查看
                correctzone.setScore(this.getCorrectModel().getScore());
                correctzone.setCorrectComment([this.getCorrectModel().getComment()]);
                correctzone.render();
            } else {
                correctzone = new businesscomponents.previewandreports.UnCorrectZone();
            }
            correctzone.appendTo(this._titlezone3.getContent());
            this._titlezone3.appendTo(this._element);
        }
    },
    setIsCheck: function(check) {
        this._isCheck = check;
    },
    setIsShowReference: function(isShow) {
        this._isShowReference = isShow;
    },
    bindAudio: function() {
        //设置题目音频
        if (this.getRequestModel().getAudioUrl()) {
            $(this.getElement()).find('[gi~="playerBox"]').append(this._player.getElement());
            this._player.setAudioUrl(this.getRequestModel().getAudioUrl());
        }
    },
    getUserAnswer: function(answer) {
        this._userAnswer = answer;
        var re = /^\s+$/g;
        var _this = this;
        if (this._userAnswer.length == 0 || re.test(this._userAnswer)) {
            _this._checkAnswer = "<span style=' color:red;' >未作答</span>";
        } else {
            if (this._isCheck) {
                var data = {};
                data.content = answer;
                $.ajax({
                    url: "/Common/Check",
                    type: 'POST',
                    dataType: 'json',
                    cache: false,
                    data: data,
                    async: false,
                    success: function(json) {
                        //加入是否开启检验判断 2014.11.11 LL
                        if (json.htmlResult) {
                            _this._checkAnswer = json.htmlResult;
                        } else {
                            toot.ui.textToHTML(answer);
                        }

                    }
                });
            } else {
                return toot.ui.textToHTML(answer);
            }

        }
        return this._checkAnswer;
    }

});
businesscomponents.previewandreports.dictationquestion.Question.DisplayFinish.html = '<div>' +
    '<div class="questionbox13inner">' +
    '<div class="questionbox13IHead clearfix" >' +
    '<div class="fl" gi="playerBox"></div>' +
    '<div class="fr" gi="timerBox" >' +
    '<div class="RecordBarBox" >用时<span class="Textbox">00:12:00</span></div>' +
    '<div class="RecordBarBox" >播放次数<span class="Textbox">12</span></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<h5 class="AnswerBoxTitle1">学生回答</h5>' +
    '<div class="AnswerBoxStyle2" gi="answerBox">' +
    '</div>' +
    '<h5 class="AnswerBoxTitle1" gi="referenceText">参考答案</h5>' +
    '<div class="AnswerBoxStyle2" gi="referenceBox">' +
    '</div>' +
    '</div>';