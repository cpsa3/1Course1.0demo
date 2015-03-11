var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.intelligentdictationquestiongroup = businesscomponents.editors.intelligentdictationquestiongroup || {};
//组
businesscomponents.editors.intelligentdictationquestiongroup.QuestionGroup = function (opt_html) {
    businesscomponents.editors.intelligentdictationquestiongroup.QuestionGroup.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.intelligentdictationquestiongroup.QuestionGroup.html)[0]);
    this._questionsui = [];
    this._$questionList = $($(this._element).find('[gi~="questionList"]')[0]);
    this._btnAddItem = new toot.ui.Button($(this._element).find('[gi~="btnAddItem"]')[0]);
    toot.connect(this._btnAddItem, "action", this, this._btnAddItemAction);
    //播放器
    this._myJwplayer = null;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.intelligentdictationquestiongroup.QuestionGroup, toot.view.ViewBase);
toot.defineEvent(businesscomponents.editors.intelligentdictationquestiongroup.QuestionGroup, "renderComplete");
toot.defineEvent(businesscomponents.editors.intelligentdictationquestiongroup.QuestionGroup, "error");
toot.extendClass(businesscomponents.editors.intelligentdictationquestiongroup.QuestionGroup, {

    updateUIByModel: function () {
        if (this._model) {
            this._questionsui = [];
            if (this._$questionList.children()) {
                for (var i = this._$questionList.children().length - 1; i >= 0; i--) {
                    this._$questionList.children()[i].remove();
                }
            }
            //初始化播放器
            this._myJwplayer = null;
            this._playAudio();
            if (this._model.length != 0) {
                for (var i = 0; i < this._model.length; i++) {
                    var question = new businesscomponents.editors.intelligentdictationquestiongroup.Question();
                    question.setModelAndUpdateUI(this._model[i]);
                    toot.connect(question, "error", this, this._error);
                    this._$questionList.append($(question.getElement()));
                    //初始化上传
                    question.initUpload();
                    this._questionsui.push(question);
                    toot.connect(question, "play", this, this._play);
                    toot.connect(question, "stop", this, this._stop);
                    toot.connect(question, "deleteItem", this, this._deleteItem);

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
    },
    _deleteItem: function (sender, e) {
        this._myJwplayer.stop();
        if (this._currentQuestionBtn) {
            this._currentQuestionBtn._btnPlay.setEnabled(true);
            $(this._currentQuestionBtn._btnPlay.getElement()).removeClass("btn10Pause").addClass("btn10Play");
        }
        var temp = [];
        for (var i = 0; i < this._questionsui.length; i++) {
            if (sender.getModel().getIndex() == 1) {
                $(this._questionsui[i].getElement()).remove();
                for (var j = i + 1; j < this._questionsui.length; j++) {
                    this._questionsui[j].getModel().setIndex(this._questionsui[j].getModel().getIndex() - 1);
                    this._questionsui[j].getLblIndex().setText(this._questionsui[j].getModel().getIndex());
                    temp.push(this._questionsui[j]);
                }
                break;
            }
            else if (sender.getModel().getIndex() == this._questionsui[this._questionsui.length - 1].getModel().getIndex()) {
                $(this._questionsui[this._questionsui.length - 1].getElement()).remove();
                this._questionsui.splice(this._questionsui.length - 1, 1);
                temp = this._questionsui;
                break;
            }
            else {
                if (this._questionsui[i].getModel().getIndex() == sender.getModel().getIndex()) {
                    //                this._$questionList.remove(this._questionsui[i]);
                    $(this._questionsui[i].getElement()).remove();
                    for (var j = i + 1; j < this._questionsui.length; j++) {
                        this._questionsui[j].getModel().setIndex(this._questionsui[j].getModel().getIndex() - 1);
                        this._questionsui[j].getLblIndex().setText(this._questionsui[j].getModel().getIndex());
                        temp.push(this._questionsui[j]);
                    }
                    break;
                }
                else {
                    temp.push(this._questionsui[i]);
                }

            }

        }

        this._questionsui = temp;

    },
    //添加事件
    _btnAddItemAction: function () {
        var question = new businesscomponents.editors.intelligentdictationquestiongroup.Question();
        var temp = new models.tasks.intelligentdictation.Question();
        temp.setEnglishSentence("");
        temp.setAudioUrl("");
        if (this._questionsui.length == 0) {
            temp.setIndex(1);
        }
        else {
            temp.setIndex(this._questionsui[this._questionsui.length - 1].getModel().getIndex() + 1);
        }
        question.setModelAndUpdateUI(temp);
        toot.connect(question, "error", this, this._error);
        toot.connect(question, "play", this, this._play);
        toot.connect(question, "stop", this, this._stop);
        toot.connect(question, "deleteItem", this, this._deleteItem);
        this._$questionList.append($(question.getElement()));
        //初始化上传
        question.initUpload();
        this._questionsui.push(question);
    }

});
businesscomponents.editors.intelligentdictationquestiongroup.QuestionGroup.html =
                                                      '<div class="taskLayoutbox3" gi="qustionGroupCtn">' +
//															'<div class="QuestionWrap clearfix" >' +
                                                                '<div class="clearfix">' +
                                                                    '<span class="EIDictationBox1">序号</span>' +
                                                                    '<span class="EIDictationBox2">题目音频</span>' +
                                                                    '<span class="EIDictationBox3">题目文本</span>' +
                                                                '</div>' +
                                                                '<div gi="questionList"></div>' +
                                                                '<div class="EIDictationBox4">' +
                                                                    '<button class="btnAddAudio" gi="btnAddItem">添加题目</button>' +
                                                                '</div>' +
//															'</div>' +
														'</div>';




businesscomponents.editors.intelligentdictationquestiongroup.Question = function (opt_html) {
    businesscomponents.editors.intelligentdictationquestiongroup.Question.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.intelligentdictationquestiongroup.Question.html)[0]);
    //容器
    this._$audioCtn = $($(this._element).find('[gi~="audioCtn"]')[0]);
    this._$noAudioCtn = $($(this._element).find('[gi~="noAudioCtn"]')[0]);
    this._$noAudioCtn.hide();
    //    this._$englishCtn = $($(this._element).find('[gi~="englishCtn"]')[0]);
    //    this._$chineseCtn = $($(this._element).find('[gi~="chineseCtn"]')[0]);
    //单个元素
    this._btnPlay = new toot.ui.Button($(this._element).find('[gi~="btnPlay"]')[0]);
    this._btnReplace = new toot.ui.Button($(this._element).find('[gi~="btnReplace"]')[0]);
    //    this._btnDelete = new toot.ui.Button($(this._element).find('[gi~="btnDelete"]')[0]);
    this._btnDeleteItem = new toot.ui.Button($(this._element).find('[gi~="btnDeleteItem"]')[0]);
    this._btnAdd = new toot.ui.Button($(this._element).find('[gi~="btnAdd"]')[0]);
    $(this._btnAdd.getElement())[0].id = "gi-" + (Math.random() + "").substring(2) + (Math.random() + "").substring(2);
    $(this._btnReplace.getElement())[0].id = "gi-" + (Math.random() + "").substring(2) + (Math.random() + "").substring(2);
    this._txtEnglish = new toot.ui.TextBox($(this._element).find('[gi~="txtEnglish"]')[0]);
    this._lblIndex = new toot.ui.Label($(this._element).find('[gi~="lblIndex"]')[0]);
    //播放器
    this._myJwplayer = null;
    toot.connect(this._btnPlay, "action", this, this._btnPlayAction);
    toot.connect(this._btnDeleteItem, "action", this, this._btnDeleteItemAction);
    //    toot.connect(this._btnDelete, "action", this, this._btnDeleteAction);
    var _this = this;
    this._uploadAdd = null;
    this._uploadAddReplace = null;
    //         this._initUpload();
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.intelligentdictationquestiongroup.Question, toot.view.ViewBase);
toot.defineEvent(businesscomponents.editors.intelligentdictationquestiongroup.Question, ["change"]);
toot.defineEvent(businesscomponents.editors.intelligentdictationquestiongroup.Question, ["error"]);
toot.defineEvent(businesscomponents.editors.intelligentdictationquestiongroup.Question, ["play"]);
toot.defineEvent(businesscomponents.editors.intelligentdictationquestiongroup.Question, ["stop"]);
toot.defineEvent(businesscomponents.editors.intelligentdictationquestiongroup.Question, ["deleteItem"]);

toot.extendClass(businesscomponents.editors.intelligentdictationquestiongroup.Question, {
    updateUIByModel: function () {
        if (this._model) {
            this._txtEnglish.setValue(this._model.getEnglishSentence());
            this._lblIndex.setText(this._model.getIndex());
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
        if (!this._model) this._model = new models.components.intelligentdictationquestiongroup.Question();
        this._model.setEnglishSentence(this._txtEnglish.getValue());

    },
    _playAudio: function (url) {
        toot.fireEvent(this, "play", { url: url });
    },
    initUpload: function () {
        var _this = this;
        //替换按钮
        _this._uploadAddReplace = WebUploader.create({

            // 不压缩image
            resize: false,

            // swf文件路径
            swf: '/Scripts/libs/webuploader-0.1.5/Uploader.swf',

            // 文件接收服务端。
            server: '/Common/UploadAudio',
            //            fileNumLimit: 1,
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: {
                "id": "#" + $(_this._btnReplace.getElement())[0].id,
                "pickClass": {
                    "pick": "webuploader-pick-intelligentdictation-replace",
                    "hover": "webuploader-pick-intelligentdictation-replace-hover",
                    "disable": "webuploader-pick-disable"
                }
            }
        });
        _this._uploadAddReplace.on('fileQueued', function (file) {
            if (file.size >= 300 * 1024 * 1024) {
                var msg = "请上传小于300MB的音频！";
                toot.fireEvent(_this, "error", { message: msg });
                return false;
            }
            greedyint.dialog.lock();
            _this._uploadAddReplace.upload();
        });
        _this._uploadAddReplace.on('uploadSuccess', function (file, response) {
            //            var responseJson = JSON.parse(response);
            _this._audioUploadCompleteAction(response.url);
            _this._uploadAddReplace.reset();
            greedyint.dialog.unLock();
        });
        _this._uploadAdd = WebUploader.create({

            // 不压缩image
            resize: false,

            // swf文件路径
            swf: '/Scripts/libs/webuploader-0.1.5/Uploader.swf',

            // 文件接收服务端。
            server: '/Common/UploadAudio',
            //            fileNumLimit: 1,
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: {
                "id": "#" + $(_this._btnAdd.getElement())[0].id,
                "pickClass": {
                    "pick": "webuploader-pick-intelligentdictation-add",
                    "hover": "webuploader-pick-intelligentdictation-replace-hover",
                    "disable": "webuploader-pick-disable"
                }
            }
        });
        _this._uploadAdd.on('fileQueued', function (file) {
            if (file.size >= 300 * 1024 * 1024) {
                var msg = "请上传小于300MB的音频！";
                toot.fireEvent(_this, "error", { message: msg });
                return false;
            }
            greedyint.dialog.lock();
            _this._uploadAdd.upload();
        });
        _this._uploadAdd.on('uploadSuccess', function (file, response) {
            //            var responseJson = JSON.parse(response);
            _this._audioUploadCompleteAction(response.url);
            _this._uploadAdd.reset();
            greedyint.dialog.unLock();
        });
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
    _btnDeleteItemAction: function () {
        toot.fireEvent(this, "deleteItem");
    },
    _btnDeleteAction: function () {


        this._$noAudioCtn.show();
        this._$audioCtn.hide();
        this._model.setAudioUrl("");
        toot.fireEvent(this, "stop");
    },
    getLblIndex: function () {
        return this._lblIndex;
    }

});
businesscomponents.editors.intelligentdictationquestiongroup.Question.html =
                    '<div class="clearfix">' +
                        '<span class="EIDictationBox1" gi="lblIndex"></span>' +
                        '<div gi="audioCtn" class="EIDictationBox2">' +
                            '<button class="btn10Play fl" gi="btnPlay"></button>' +
                            '<button class="btn10Replace fl"  gi="btnReplace"></button>' +
//                            '<button class="btn10Close fl"  gi="btnDelete"></button>' +
                        '</div>' +
                        '<div gi="noAudioCtn" class="EIDictationBox2">' +
                            '<button class="btnAddAudio fl marRPatch" gi="btnAdd">添加音频</button>' +
                        '</div>' +
                        '<div class="EIDictationBox3">' +
                            '<input type="text" class="textareaStyle1 fl" gi="txtEnglish">' +
                            '<button class="btn10Close fl" gi="btnDeleteItem"></button>' +
                       '</div>' +
                    '</div>';