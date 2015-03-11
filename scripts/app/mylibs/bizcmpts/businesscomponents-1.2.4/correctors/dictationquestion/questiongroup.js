/*
*User: 小潘
*Date: 2015年2月1日 17:19:48
*Desc: 听写题组  批改页面使用
*/

var businesscomponents = businesscomponents || {};

businesscomponents.correctors = businesscomponents.correctors || {};

businesscomponents.correctors.dictationquestion = businesscomponents.correctors.dictationquestion || {};

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


businesscomponents.correctors.dictationquestion.QuestionGroup = function(opt_html) {
    businesscomponents.correctors.dictationquestion.QuestionGroup.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.correctors.dictationquestion.QuestionGroup.html)[0]);

    this._requestModel = null;
    this._responseModel = null;
    this._correctGroup = null;

    this._questionsBox = $(this._element).find('[gi~="questionsBox"]').get(0);
    this._explainBox = $(this._element).find('[gi~="explainBox"]').get(0);


    this._qZone = new businesscomponents.correctors.Zone();
    this._qZone.getLblTitle().setText("题目\n要求");
    this._qtxt = this._qZone.getElementContainer();



    this._listQuestion = new businesscomponents.ui.List(this._questionsBox, this._questionsBox,
        businesscomponents.correctors.dictationquestion.Question, null);
    this._listQuestion.setDefaultUIGenerator(
        $.proxy(function() {
            return this._generatorQuestion();
        }, this)
    );
};
toot.inherit(businesscomponents.correctors.dictationquestion.QuestionGroup, toot.view.ViewBase);
toot.extendClass(businesscomponents.correctors.dictationquestion.QuestionGroup, {
    updateUIByModel: function() {
        if (this._requestModel && this._responseModel) {
            if (this._requestModel.getExplain()) {
                $(this._qtxt).html(this._requestModel.getExplain());
                this._qZone.replaceTo(this._explainBox);
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
        var question = new businesscomponents.correctors.dictationquestion.Question();
        question.setIsCheck(this._isCheck);
        question.setIsShowReference(this._isShowReference);

        return question;
    },
    setIsCheckAndIsShowReference: function(obj) {
        this._isCheck = obj.isCheck;
        this._isShowReference = obj.isShowReference;
    },
    setCorrectGroup: function(correctGroup) {
        this._correctGroup = correctGroup;
    },
    getCorrectGroup: function() {
        var correctGroup = new models.components.dictationquestion.CorrectGroup();
        var corrects = [];
        for (var i = 0; i < this._listQuestion.getItems().length; i++) {
            this._listQuestion.getItems()[i].updateModelByUI();
            corrects.push(this._listQuestion.getItems()[i].getCorrectModel());
        }
        correctGroup.setCorrectItems(corrects);
        return correctGroup;
    }


});
businesscomponents.correctors.dictationquestion.QuestionGroup.html =
    '<div class="taskMarkPaperBox">' +
    '<div gi="explainBox"></div>' +
    '<div gi="questionsBox"></div>' +
    '</div>';


businesscomponents.correctors.dictationquestion.Question = function(opt_html) {
    businesscomponents.correctors.dictationquestion.Question.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.correctors.dictationquestion.Question.html)[0]);


    //听写音频
    this._cZone = new businesscomponents.correctors.Zone();

    this._cZone.getLblTitle().setText("听写\n音频");
    this._cZone.setLayoutboxClass("marT20 E_imgMax clearfix");
    this._cZone.setContainerClass("fl L2 marT10");
    this._cAudio = new businesscomponents.correctors.Audio();
    this._cAudio.appendTo(this._cZone.getElementContainer());

    //学生回答
    this._sZone = new businesscomponents.correctors.Zone();
    this._sZone.getLblTitle().setText("学生\n回答");
    this._sZone.setLayoutboxClass("marT20 E_imgMax clearfix");
    this._sZone.setContainerClass("fl L2 marT10");
    this._stxt = this._sZone.getElementContainer();
    this._sTimes = new businesscomponents.CorrectSpeakingTimeBar();

    //参考答案
    /// ---题目
    /// ---题目
    this._suggestzoon = new businesscomponents.correctors.Zone();

    this._suggestzoon.setLayoutboxClass("marT20 E_imgMax clearfix");
    this._suggestzoon.setContainerClass("fl L2 marT10");
    this._suggestzoon.getLblTitle().setText("参考\n答案");

    this._sugtxt = this._suggestzoon.getElementContainer();


    this._pZones = new businesscomponents.correctors.Zone();
    this._pZones.setLayoutboxClass("marT20 E_imgMax clearfix");
    this._pZones.getLblTitle().setText("批阅");
    this._pZones.setContainerClass("fl L2_2 marT10");

    //评分
    this._combox = new businesscomponents.correctors.ComBox();

    //评语
    this._commentBox = new businesscomponents.correctors.CommentBox(undefined, $191);

    this._combox.appendTo(this._pZones.getElementContainer());

    this._commentBox.appendTo(this._pZones.getElementContainer());


//是否请求机批
    this._isCheck = false;
    //是否显示参考答案
    this._isShowReference = false;

    //默认为0-100的分数
    this._range = this.getScoreRange(0.5, 0, 5);
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.correctors.dictationquestion.Question, businesscomponents.ui.CorrectAndRnRItem);
toot.extendClass(businesscomponents.correctors.dictationquestion.Question, {
    updateUIByModel: function() {
        if (this.getRequestModel() && this.getResponseModel()) {
            //设置题目音频
            if (this.getRequestModel().getAudioUrl()) {
                this._cAudio.setModelAndUpdateUI(this.getRequestModel().getAudioUrl());
                this._cZone.appendTo(this._element);
            }
            
            // 设置学生答案 请求机批

            $(this._stxt).html(this.getUserAnswer(this.getResponseModel().getAnswer()));

            this._sTimes.appendTo(this._sZone.getElementContainer());
            this._sTimes.setTimesText("播放次数");
            this._sTimes.setTimes(this.getResponseModel().getPlayCount());
            this._sTimes.setUsageTimes(this.getResponseModel().getPlayTime());
            this._sZone.appendTo(this._element);


            if (this.getRequestModel().getReference()) {
                $(this._sugtxt).html(this.getRequestModel().getReference());
                this._suggestzoon.appendTo(this._element);
            }

            //设置下拉数据 
            this._combox.setItemData(this._range);


            this._pZones.appendTo(this._element);

            if (this.getCorrectModel()) {
                //评分
                this._combox.setModelAndUpdateUI(this.getCorrectModel().getScore());
                //评语
                this._commentBox.setModelAndUpdateUI(this.getCorrectModel().getComment());
            }


        }
    },
    updateModelByUI: function() {
        var correct = new models.components.dictationquestion.CorrectItem();
        correct.setScore(this._combox.getModel());
        correct.setComment(this._commentBox.updateAndGetModelByUI());
        this.setCorrectModel(correct);
    },
    setIsCheck: function(check) {
        this._isCheck = check;
    },
    setIsShowReference: function(isShow) {
        this._isShowReference = isShow;
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
    },
    setCorrect: function(obj) {
        this._score = obj.score;
        this._comment = obj.comment;
    },
    getCorrect: function() {
        return { score: this._score, comment: this._comment };
    },
    setRange: function(range) {
        this._range = range;
    },
    getScoreRange: function(scoreStep, scoreMin, scoreMax) {
        var range = [];


        for (var i = scoreMin; i <= scoreMax; i += scoreStep) {
            var num = Math.round(i * 10) / 10;

            range.push(num);
        }

        if (range[range.length - 1] < scoreMax)
            range.push(scoreMax);

        return range;

    }


});
businesscomponents.correctors.dictationquestion.Question.html = '<div></div>';