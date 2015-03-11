//sat语法的插句题 Create by xiaobao 14/3/6

var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.wordquestiongroup = businesscomponents.editors.wordquestiongroup || {};
//组
businesscomponents.editors.wordquestiongroup.QuestionGroupForDisplay = function (opt_html) {
    businesscomponents.editors.wordquestiongroup.QuestionGroupForDisplay.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.wordquestiongroup.QuestionGroupForDisplay.html)[0]);
    this._questionsui = [];
    this._$questionList = $($(this._element).find('[gi~="questionList"]')[0]);
    this._renderModel = 0; //表示中英都有；1表示英；2表示中
    this._displayModel = 0; //0表示预览；1表示做题
    //播放器
    this._myJwplayer = null;
  //  if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.wordquestiongroup.QuestionGroupForDisplay, toot.view.ViewBase);
toot.defineEvent(businesscomponents.editors.wordquestiongroup.QuestionGroupForDisplay, "renderComplete");
toot.defineEvent(businesscomponents.editors.wordquestiongroup.QuestionGroupForDisplay, "error");
toot.extendClass(businesscomponents.editors.wordquestiongroup.QuestionGroupForDisplay, {

    updateUIByModel: function () {
        if (this._model) {
            //播放器
            this._myJwplayer = null;
            this._playAudio();
            this._questionsui = [];
            //  $(this._element).find('[gi~="questionList"]').empty();
            if (this._$questionList.children()) {
                for (var i = this._$questionList.children().length - 1; i >= 1; i--) {
                    this._$questionList.children()[i].remove();
                }
            }
            if (this._model.length != 0) {
                for (var i = 0; i < this._model.length; i++) {
                    var question = new businesscomponents.editors.wordquestiongroup.Question();

                    question.setRenderModel(this.getRenderModel());
                    question.setDisplayModel(this.getDisplayModel());
                    question.setModelAndUpdateUI(this._model[i]);
                    toot.connect(question, "error", this, this._error);
                    toot.connect(question, "play", this, this._play);
                    this._$questionList.append($(question.getElement()));
                    this._questionsui.push(question);
                    toot.fireEvent(this, "renderComplete");
                }
            }

        }
        else {

        }
    },
    _error: function (sender, e) {
        toot.fireEvent(this, "error", e);
    },
    updateModelByUI: function () {
        this._model = [];
        for (var i = 0; i < this._questionsui.length; i++) {
            var tempModel = this._questionsui[i].updateAndGetModelByUI();
            this._model.push(tempModel);
        }
    },
    setRenderModel: function (renderModel) {
        this._renderModel = renderModel;
        this.render();
    },
    getRenderModel: function () {
        return this._renderModel;
    },
    render: function () {
        if (this.getRenderModel() == 0) {
            $(this._$questionList.find('[gi~="english"]')[0]).show();
            $(this._$questionList.find('[gi~="chinese"]')[0]).show();
        }
        else if (this.getRenderModel() == 1) {
            $(this._$questionList.find('[gi~="english"]')[0]).hide();
            $(this._$questionList.find('[gi~="chinese"]')[0]).show();
        }
        else {
            $(this._$questionList.find('[gi~="english"]')[0]).show();
            $(this._$questionList.find('[gi~="chinese"]')[0]).hide();
        }
    },
    setDisplayModel: function (displayModel) {
        this._displayModel = displayModel;
    },
    getDisplayModel: function () {
        return this._displayModel;
    },
    _currentQuestion: null,
    _playAudio: function (url, sender) {
        var _this = this;
        this._currentQuestion = sender;
        if (!this._myJwplayer) {
            this._myJwplayer = jwplayer("player").setup({
                flashplayer: "/Scripts/libs/jwplayer/player.swf",
                width: '1',
                height: '1',
                provider: 'sound',
                controlbar: 'bottom'
            });
        } else {
            this._myJwplayer.stop();
            this._myJwplayer.load([{ file: url}]);
            this._myJwplayer.play();
        }
        this._myJwplayer.onComplete(function () {
            _this._currentQuestion._btnPlay.setEnabled(true);
            $(_this._currentQuestion._btnPlay.getElement()).removeClass("btn10Pause2").addClass("btn10Play");
            _this._currentQuestion._lbInfo.setVisible(false)
        });

    },
    _play: function (sender, e) {
        if (this._currentQuestion) {
            this._currentQuestion._btnPlay.setEnabled(true);
            $(this._currentQuestion._btnPlay.getElement()).removeClass("btn10Pause2").addClass("btn10Play");

            if (sender.getModel() == this._currentQuestion.getModel()) {

            }
            else {
                this._currentQuestion._lbInfo.setVisible(false);
            }
        }
        this._playAudio(e.url, sender);

    }
});
businesscomponents.editors.wordquestiongroup.QuestionGroupForDisplay.html =
                                                      '<div class="ReportNewQAbox" gi="qustionGroupCtn">' +
															'<div class="QuestionWrap2">' +
																'<table>' +
																	'<tbody gi="questionList">' +
																		'<tr>' +
																			'<th width="140" >题目</th>' +
																			'<th width="380" gi="english">英文</th>' +
																			'<th gi="chinese">中文</th>' +
																		'</tr>' +
																	'</tbody>' +
                                                                '</table>' +
															'</div>' +
														'</div>';




businesscomponents.editors.wordquestiongroup.Question = function (opt_html) {
    businesscomponents.editors.wordquestiongroup.Question.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.wordquestiongroup.Question.html)[0]);
    this._renderModel = 0; //表示中英都有；1表示英；2表示中
    this._displayModel = 0; //0表示预览；1表示做题
    //容器
    this._$audioCtn = $($(this._element).find('[gi~="audioCtn"]')[0]);
    this._$noAudioCtn = $($(this._element).find('[gi~="noAudioCtn"]')[0]);
    this._$noAudioCtn.hide();
    this._$englishCtn = $($(this._element).find('[gi~="englishCtn"]')[0]);
    this._$chineseCtn = $($(this._element).find('[gi~="chineseCtn"]')[0]);
    //单个元素
    this._btnPlay = new toot.ui.Button($(this._element).find('[gi~="btnPlay"]')[0]);
    this._txtEnglish = new toot.ui.TextBox($(this._element).find('[gi~="txtEnglish"]')[0]);
    this._txtChinese = new toot.ui.TextBox($(this._element).find('[gi~="txtChinese"]')[0]);
    this._lbInfo = new toot.ui.Label($(this._element).find('[gi~="lbInfo"]')[0]);
    this._lbInfo.setText("播放中...");
    this._lbInfo.setVisible(false);
    //播放器
    this._myJwplayer = null;

    toot.connect(this._btnPlay, "action", this, this._btnPlayAction);
    var _this = this;
 //   if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.wordquestiongroup.Question, toot.view.ViewBase);
toot.defineEvent(businesscomponents.editors.wordquestiongroup.Question, ["change"]);
toot.defineEvent(businesscomponents.editors.wordquestiongroup.Question, ["error"]);
toot.defineEvent(businesscomponents.editors.wordquestiongroup.Question, ["play"]);
toot.extendClass(businesscomponents.editors.wordquestiongroup.Question, {
    updateUIByModel: function () {
        if (this._model) {

            if (this.getRenderModel() == 1) {
                this._$englishCtn.hide();

            }
            else if (this.getRenderModel() == 2) {
                this._$chineseCtn.hide();
            }
            //默认都显示
            else {
            }

            //做题和预览模式切换
            if (this.getDisplayModel() == 0) {
                this._txtEnglish.setState(1);
                this._txtChinese.setState(1);
            }
            else if (this.getDisplayModel() == 1) {

            }
            //是否有音频
            if (this._model.getAudioUrl() != "") {
                //                this._$audioCtn.hide();
            }
            else {
                throw ("No AudioUrl！");
            }

        }
        else {
            //model 为空时做一些处理
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.wordquestiongroup.Question();
        this._model.setChineseWord(this._txtChinese.getValue());
        this._model.setEnglishWord(this._txtEnglish.getValue());

    },
    setRenderModel: function (renderModel) {
        this._renderModel = renderModel;
    },
    getRenderModel: function () {
        return this._renderModel;
    },
    _playAudio: function (url) {
        this._lbInfo.setVisible(true);
        toot.fireEvent(this, "play", { url: url });
    },
    _btnPlayAction: function () {
        this._playAudio(this._model.getAudioUrl());
        $(this._btnPlay.getElement()).removeClass("btn10Play").addClass("btn10Pause2");
        this._btnPlay.setEnabled(false);

    },
    setDisplayModel: function (displayModel) {
        this._displayModel = displayModel;
    },
    getDisplayModel: function () {
        return this._displayModel;
    }

});
businesscomponents.editors.wordquestiongroup.Question.html =
                     '<tr>' +
                        '<td gi="audioCtn">' +
                            ' <button class="btn10Play" gi="btnPlay"></button>' +
                            '<span class="btnPlayText" gi="lbInfo">播放中...</span>' +
                        '</td>' +
                        '<td gi="englishCtn"><input type="text" class="textareaStyle1" gi="txtEnglish"></td>' +
                        '<td gi="chineseCtn"><input type="text" class="textareaStyle1" gi="txtChinese"></td>' +
                    '</tr>'; 