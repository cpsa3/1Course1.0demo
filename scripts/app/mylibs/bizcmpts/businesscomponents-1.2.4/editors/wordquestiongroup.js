//sat语法的插句题 Create by xiaobao 14/3/6

var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.wordquestiongroup = businesscomponents.editors.wordquestiongroup || {};
//组
businesscomponents.editors.wordquestiongroup.QuestionGroup = function (opt_html) {
    businesscomponents.editors.wordquestiongroup.QuestionGroup.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.wordquestiongroup.QuestionGroup.html)[0]);
    this._questionsui = [];
    this._$questionList = $($(this._element).find('[gi~="questionList"]')[0]);
    this._renderModel = 0; //表示中英都有；1表示英；2表示中
    //播放器
    this._myJwplayer = null;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.wordquestiongroup.QuestionGroup, toot.view.ViewBase);
toot.defineEvent(businesscomponents.editors.wordquestiongroup.QuestionGroup, "renderComplete");
toot.defineEvent(businesscomponents.editors.wordquestiongroup.QuestionGroup, "error");
toot.extendClass(businesscomponents.editors.wordquestiongroup.QuestionGroup, {

    updateUIByModel: function () {
        if (this._model) {
            this._questionsui = [];
            //            $(this._element).find('[gi~="questionList"]').empty();
            if (this._$questionList.children()) {
                for (var i = this._$questionList.children().length - 1; i >= 1; i--) {
                    this._$questionList.children()[i].remove();
                }
            }
            //初始化播放器
            this._myJwplayer = null;
            this._playAudio();
            if (this._model.length != 0) {
                for (var i = 0; i < this._model.length; i++) {
                    var question = new businesscomponents.editors.wordquestiongroup.Question();
                    question.setRenderModel(this.getRenderModel());
                    question.setModelAndUpdateUI(this._model[i]);
                    toot.connect(question, "error", this, this._error);
                    this._$questionList.append($(question.getElement()));
                    this._questionsui.push(question);
                    toot.connect(question, "play", this, this._play);
                    toot.connect(question, "stop", this, this._stop);
                    toot.fireEvent(this, "renderComplete");
                }
            }

        }
        else {
            if (this._$questionList.children()) {
                for (var i = this._$questionList.children().length - 1; i >= 1; i--) {
                    this._$questionList.children()[i].remove();
                }
            }
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
        this._$questionList.show();
        if (this.getRenderModel() == 0) {
            $(this._$questionList.find('[gi~="english"]')[0]).show();
            $(this._$questionList.find('[gi~="chinese"]')[0]).show();
        }
        else if (this.getRenderModel() == 1) {
            $(this._$questionList.find('[gi~="english"]')[0]).hide();
            $(this._$questionList.find('[gi~="chinese"]')[0]).show();
        }
        else if (this.getRenderModel() == 2) {
            $(this._$questionList.find('[gi~="english"]')[0]).show();
            $(this._$questionList.find('[gi~="chinese"]')[0]).hide();
        }
        else {
            this._$questionList.hide();
        }
    },
    _currentQuestionBtn: null,
    _playAudio: function (url, sender) {
        var _this = this;
        this._currentQuestionBtn = sender;
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
            _this._currentQuestionBtn._btnPlay.setEnabled(true);
            $(_this._currentQuestionBtn._btnPlay.getElement()).removeClass("btn10Pause").addClass("btn10Play");
        });

    },
    _play: function (sender, e) {
        if (this._currentQuestionBtn) {
            this._currentQuestionBtn._btnPlay.setEnabled(true);
            $(this._currentQuestionBtn._btnPlay.getElement()).removeClass("btn10Pause").addClass("btn10Play");
        }
        this._playAudio(e.url, sender);

    },
    _stop: function (sender, e) {
        this._myJwplayer.stop();
        //        if (this._currentQuestionBtn) {
        //            this._currentQuestionBtn._btnPlay.setEnabled(true);
        //            $(this._currentQuestionBtn._btnPlay.getElement()).removeClass("btn10Pause").addClass("btn10Play");
        //        }
    }

});
businesscomponents.editors.wordquestiongroup.QuestionGroup.html =
                                                      '<div class="taskLayoutbox" gi="qustionGroupCtn">' +
															'<div class="QuestionWrap clearfix" gi="questionList">' +

                                                                '<div class="QuestionTitleWrap clearfix">' +
                                                                    '<span class="QuestionboxTitle1 fl">题目</span>' +
                                                                    '<span class="QuestionboxTitle2 fl" gi="english">英文</span>' +
                                                                    '<span class="QuestionboxTitle3 fl" gi="chinese">中文</span>' +
                                                                '</div>' +


															'</div>' +
														'</div>';




businesscomponents.editors.wordquestiongroup.Question = function (opt_html) {
    businesscomponents.editors.wordquestiongroup.Question.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.wordquestiongroup.Question.html)[0]);
    this._renderModel = 0; //表示中英都有；1表示中；2表示英,-1表示都不选
    //容器
    this._$audioCtn = $($(this._element).find('[gi~="audioCtn"]')[0]);
    this._$noAudioCtn = $($(this._element).find('[gi~="noAudioCtn"]')[0]);
    this._$noAudioCtn.hide();
    //    this._$englishCtn = $($(this._element).find('[gi~="englishCtn"]')[0]);
    //    this._$chineseCtn = $($(this._element).find('[gi~="chineseCtn"]')[0]);
    //单个元素
    this._btnPlay = new toot.ui.Button($(this._element).find('[gi~="btnPlay"]')[0]);
    this._btnReplace = new toot.ui.Button($(this._element).find('[gi~="btnReplace"]')[0]);
    this._btnDelete = new toot.ui.Button($(this._element).find('[gi~="btnDelete"]')[0]);
    this._btnAdd = new toot.ui.Button($(this._element).find('[gi~="btnAdd"]')[0]);
    this._txtEnglish = new toot.ui.TextBox($(this._element).find('[gi~="txtEnglish"]')[0]);
    this._txtChinese = new toot.ui.TextBox($(this._element).find('[gi~="txtChinese"]')[0]);
    //播放器
    this._myJwplayer = null;
    toot.connect(this._btnPlay, "action", this, this._btnPlayAction);
    toot.connect(this._btnDelete, "action", this, this._btnDeleteAction);
    var _this = this;
    this._ajaxUpload = null;
    this._audioUpload();
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.wordquestiongroup.Question, toot.view.ViewBase);
toot.defineEvent(businesscomponents.editors.wordquestiongroup.Question, ["change"]);
toot.defineEvent(businesscomponents.editors.wordquestiongroup.Question, ["error"]);
toot.defineEvent(businesscomponents.editors.wordquestiongroup.Question, ["play"]);
toot.defineEvent(businesscomponents.editors.wordquestiongroup.Question, ["stop"]);
toot.extendClass(businesscomponents.editors.wordquestiongroup.Question, {
    updateUIByModel: function () {
        if (this._model) {

            if (this.getRenderModel() == 0) {
                this._txtChinese.setValue(this._model.getChineseWord());
                this._txtEnglish.setValue(this._model.getEnglishWord());

            }
            else if (this.getRenderModel() == 1) {
                this._txtEnglish.setVisible(false);
                this._txtChinese.setValue(this._model.getChineseWord());
                this._txtEnglish.setValue(this._model.getEnglishWord());
            }
            else if (this.getRenderModel() == 2) {
                this._txtEnglish.setValue(this._model.getEnglishWord());
                this._txtChinese.setVisible(false);
            }
            else {
                //                this._$englishCtn.hide();
                this._txtChinese.setVisible(false);
                this._txtEnglish.setVisible(false);
                //                this._$chineseCtn.hide();
            }


            if (this._model.getAudioUrl() == "" || this._model.getAudioUrl() == undefined) {
                this._$noAudioCtn.show();
                this._$audioCtn.hide();
            }
            else {
                this._$noAudioCtn.hide();
                this._$audioCtn.show();
            }

        }
        else {
            //            this._srtlm.setText(null);
            //            this._listChoice.setModelAndUpdateUI(null);
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
        //        var _this = this;
        //        if (!this._myJwplayer) {
        //            this._myJwplayer = jwplayer("player").setup({
        //                flashplayer: "/Scripts/libs/jwplayer/player.swf",
        //                width: '1',
        //                height: '1',
        //                provider: 'sound',
        //                file: url,
        //                controlbar: 'bottom'
        //            });
        //        } else {
        //            this._myJwplayer.stop();
        //            this._myJwplayer.load([{ file: url}]);
        //        }
        //        this._myJwplayer.onComplete(function () {
        //            _this._btnPlay.setEnabled(true);
        //            $(_this._btnPlay.getElement()).removeClass("btn10Pause").addClass("btn10Play");
        //        });
        //        this._myJwplayer.play();
        toot.fireEvent(this, "play", { url: url });
    },
    _audioUpload: function () {
        var _this = this;
        var ajax2 = {
            action: '/Common/UploadAudio',
            name: 'file',
            onSubmit: function (file, ext) {
                if (!(ext && /^(mp3)$/.test(ext.toLowerCase()))) {
                    var msg = '请您上传mp3文件';
                    //                    if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                    //                    else alert(msg);
                    toot.fireEvent(_this, "error", { message: msg });
                    //                    alert(msg);
                    return false;
                }
                greedyint.dialog.lock();
            },
            onComplete: function (file, response) {
                var responseJson = JSON.parse(response);
                _this._audioUploadCompleteAction(responseJson.url);
                greedyint.dialog.unLock();
            },
            onError: function (file, errorCode) {
                toot.fireEvent(_this, "error", { message: "未知错误" });
                greedyint.dialog.unLock();
            }
            //以前的方法
            //            zIndex: -5000
        };
        _this._ajaxUpload = new AjaxUpload(_this._btnAdd.getElement(), ajax2);
        _this._ajaxUpload1 = new AjaxUpload(_this._btnReplace.getElement(), ajax2);
        //        //以前的方法
        //        _this._ajaxUpload._createInput();
        //        _this._ajaxUpload1._createInput();
        //        this._ajaxUploadInput = $(this._ajaxUpload._getCurrentInput());
        //        this._ajaxUploadInput1 = $(this._ajaxUpload1._getCurrentInput());
        //        $(this._btnAdd.getElement()).click(function () {
        //            _this._ajaxUploadInput.click();
        //        })
        //        $(this._btnReplace.getElement()).click(function () {
        //            if (_this._myJwplayer) {
        //                _this._myJwplayer.stop();
        //            }
        //            _this._btnPlay.setEnabled(true);
        //            $(_this._btnPlay.getElement()).removeClass("btn10Pause").addClass("btn10Play");
        //            _this._ajaxUploadInput1.click();
        //        })
    },

    _audioUploadCompleteAction: function (url) {
        this._model.setAudioUrl(url);
        this._$noAudioCtn.hide();
        this._$audioCtn.show();
        this._btnPlay.setEnabled(true);
        $(this._btnPlay.getElement()).removeClass("btn10Pause").addClass("btn10Play");
        toot.fireEvent(this, "stop");

    },
    _btnPlayAction: function () {
        this._playAudio(this._model.getAudioUrl());
        $(this._btnPlay.getElement()).removeClass("btn10Play").addClass("btn10Pause");
        this._btnPlay.setEnabled(false);

    },
    _btnDeleteAction: function () {


        this._$noAudioCtn.show();
        this._$audioCtn.hide();
        this._model.setAudioUrl("");
        toot.fireEvent(this, "stop");
    }

});
businesscomponents.editors.wordquestiongroup.Question.html =
                    '<div class="QuestionboxWrap clearfix">' +
                        '<div gi="audioCtn">' +
                            '<button class="btn10Play fl" gi="btnPlay"></button>' +
                            '<button class="btn10Replace fl" gi="btnReplace"></button>' +
                            '<button class="btn10Close fl"  gi="btnDelete"></button>' +
                        '</div>' +
                        '<div gi="noAudioCtn">' +
                            '<button class="btnAddAudio fl marRPatch" gi="btnAdd">添加音频</button>' +
                        '</div>' +
                        '<input type="text" class="textareaStyle1 fl marLR" gi="txtEnglish">' +
                        '<input type="text" class="textareaStyle1 fl" gi="txtChinese">' +
                    '</div>';


//                     '<tr>' +
//                        '<td gi="audioCtn">' +
//                            '<button class="btn10Play" gi="btnPlay"></button>' +
//                            '<!-- 暂停把样式换成btn10Pause,停止换成btn10Stop -->' +
//                            '<button class="btn10Replace" gi="btnReplace"></button>' +
//                            '<button class="btn10Close" gi="btnDelete"></button>' +
//                        '</td>' +
//                        '<td gi="noAudioCtn"><button class="btnAddAudio" gi="btnAdd">添加音频</button></td>' +
//                        '<td gi="englishCtn"><input type="text" class="textareaStyle1" gi="txtEnglish"></td>' +
//                        '<td gi="chineseCtn"><input type="text" class="textareaStyle1" gi="txtChinese"></td>' +
//                    '</tr>'; 