/*
*User: 小潘
*Date: 2015年1月24日 17:48:08
*Desc: 听写题组 做题
*/

var businesscomponents = businesscomponents || {};

businesscomponents.dictationquestion = businesscomponents.dictationquestion || {};

businesscomponents.dictationquestion.ui = {};

businesscomponents.dictationquestion.ui.display = {};

businesscomponents.dictationquestion.ui.display.Question = function(opt_html) {
    businesscomponents.ui.RnRItem.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.dictationquestion.ui.display.Question.html)[0]);

    this._player = new businesscomponents.JwPlayerForDictation();

    this._timerBar = new businesscomponents.SpeakingTimeBar(businesscomponents.SpeakingTimeBar.htmlForDictationGroup);
    this._timerBar.setTimes(0);
    this._timerBar.setUsageTimes(0);
    this._timerBar.setTimesText("播放次数");
    this._timerBar.replaceTo($(this.getElement()).find('[gi~="timerBox"]')[0]);

    this._answerBox = new toot.ui.TextBox($(this.getElement()).find('[gi~="answerBox"]')[0]);

    this.inputTimer = new businesscomponents.InputTimer({ 'input': $(this._answerBox._element) });

    this._initEvent();
};
toot.inherit(businesscomponents.dictationquestion.ui.display.Question, businesscomponents.ui.RnRItem);
//define event 
toot.defineEvent(businesscomponents.dictationquestion.ui.display.Question, ["change", "beforechange"]);
toot.extendClass(businesscomponents.dictationquestion.ui.display.Question, {
    //初始化处理时间
    _initEvent: function() {
        toot.connect(this._player, "playCountChange", this, this._onPlayCountChange);
        $(this.inputTimer).on("changeValue",
            $.proxy(function(e, value) {
                this._timerBar.setUsageTimes(value);
            }, this)
        );

    },
    //播放次数
    _onPlayCountChange: function() {
        this._timerBar.setTimes(this._timerBar.getTimes() + 1);
    },
    updateUIByModel: function() {
        if (!this.getRequestModel())
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;
    },
    bindAudio: function() {
        if (!this.getRequestModel())
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;
        $(this.getElement()).find('[gi~="player"]').append(this._player.getElement());

        this._player.setAudioUrl(this.getRequestModel().getAudioUrl());
    },
    updateModelByUI: function() {
        this._setResponseModelIfNull(models.components.dictationquestion.QuestionResponse);
        this.getResponseModel().setPlayTime(this._timerBar.getUsageTimes());
        this.getResponseModel().setPlayCount(this._timerBar.getTimes());
        this.getResponseModel().setAnswer(this._answerBox.getValue());
    },

    getTimeBar: function() {
        return this._timerBar;
    },
    getPlayer: function() {
        return this._player;
    }
});

businesscomponents.dictationquestion.ui.display.Question.html = '<div class="questionbox13inner">' +
    '<div class="questionbox13IHead clearfix">' +
    '<div class="fl" gi="player"></div>' +
    '<div class="fr" gi="timerBox" >' +
    '<div class="RecordBarBox" >用时<span class="Textbox">00:12:00</span></div>' +
    '<div class="RecordBarBox" >播放次数<span class="Textbox">12</span></div>' +
    '</div>' +
    '</div>' +
    '<textarea class="textAreaStyle copyScroll" gi="answerBox"></textarea>' +
    '</div>';


//注入display.question

businesscomponents.dictationquestion.ui.display.QuestionGroup = function(opt_html) {

    businesscomponents.ui.BusinessComponentBase.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.dictationquestion.ui.display.QuestionGroup.html)[0]);

    //说明文本 富文本
    this._explain = new businesscomponents.RichTextDisplay(businesscomponents.RichTextDisplay.html2);
    this._explain.replaceTo($(this._element).find('[gi~="explainBox"]')[0]);

    //题目集合
    this._listQuestion = new businesscomponents.ui.List($(this._element).find('[gi~="questionBox"]')[0], $(this._element).find('[gi~="questionBox"]')[0],
        businesscomponents.dictationquestion.ui.display.Question, models.components.dictationquestion.Question);
    this._listQuestion.setDefaultUIGenerator(
        $.proxy(function() {
            return this._generatorQuestion();
        }, this)
    );


    this._parser.setRequest(models.components.dictationquestion.QuestionGroup.parse);
    this._parser.setResponse(models.components.dictationquestion.QuestionResponse.parse);

};
toot.inherit(businesscomponents.dictationquestion.ui.display.QuestionGroup, businesscomponents.ui.BusinessComponentBase);
toot.defineEvent(businesscomponents.dictationquestion.ui.display.QuestionGroup, ["playAudio"]);
toot.extendClass(businesscomponents.dictationquestion.ui.display.QuestionGroup, {
    updateUIByModel: function() {
        if (!this.getRequestModel())
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;


        this._explain.setHtml(this.getRequestModel().getExplain() || '');

        var questionAndResponses = [];
        for (var i = 0, l = this.getRequestModel().getQuestions().length; i < l; i++) {
            var rnr = new businesscomponents.RequestAndResponse();
            rnr.setRequest(this.getRequestModel().getQuestions()[i]);
            if (this.getResponseModel())
                rnr.setResponse(this.getResponseModel().getQuestionResponses()[i]);
            questionAndResponses.push(rnr);
        }
        this._listQuestion.setModelAndUpdateUI(questionAndResponses);

    },
    updateModelByUI: function() {
        this._setResponseModelIfNull(models.components.dictationquestion.QuestionResponseGroup);
        var responses = [];
        for (var i = 0, l = this._listQuestion.updateAndGetModelByUI().length; i < l; i++)
            responses.push(this._listQuestion.updateAndGetModelByUI()[i].getResponse());
        this.getResponseModel().setQuestionResponses(responses);
    },

    _generatorQuestion: function() {
        var uiQuestion = new businesscomponents.dictationquestion.ui.display.Question();
        toot.connect(uiQuestion.getPlayer(), "playAudio", this, this._playAudio);
        return uiQuestion;
    },
    _playAudio: function(player) {
        toot.fireEvent(this, "playAudio", { player: player });
    },
    pauseAudios: function() {
        if (this._listQuestion.getItems()) {
            for (var i = 0; i < this._listQuestion.getItems().length; i++) {
                if (this._listQuestion.getItems()[i].getPlayer().getIsPlay()) {
                    this._listQuestion.getItems()[i].getPlayer().pauseController();
                }
            }
        }
    },
    //绑定Audio
    bindAudio: function() {
        for (var i = 0; i < this._listQuestion.getItems().length; i++) {
            this._listQuestion.getItems()[i].bindAudio();
        }
    }
});

businesscomponents.dictationquestion.ui.display.QuestionGroup.html = '<div class="questionbox13">' +
    '<div class="RichTextEditor marB15" gi="explainBox">' +
    '</div>' +
    '<div  gi="questionBox">' +
    '</div>' +
    '</div>';