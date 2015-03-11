
var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.AudioWithWebUploaderForIntelligentDictation = function (opt_html) {
    businesscomponents.editors.AudioWithWebUploaderForIntelligentDictation.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.AudioWithWebUploaderForIntelligentDictation.html)[0]);
    this._iv = new businesscomponents.editors.InitialView();
    this._iv.setHeight(50);
    this._iv.setLb12(" 听力音频（请上传小于300MB的音频！）");
    this._iv.replaceTo($(this._element).find('[gi~="anchorInitialView"]')[0]);

    this._$editView = $(this._element).find('[gi~="editView"]');
    this._$ctnPlayer = $(this._element).find('[gi~="ctnPlayer"]');
    this._$ctnPlayer[0].id = "gi-" + (Math.random() + "").substring(2) + (Math.random() + "").substring(2);

    this._$btnGroup1 = $(this._element).find('[gi~="btnGroup1"]');
    this._player = null;
    this._btnReplace = new toot.ui.Button($(this._element).find('[gi~="btnReplace"]')[0]);
    this._btnDel = new toot.ui.Button($(this._element).find('[gi~="btnDel"]')[0]);
    this._btnDel.setVisible(false);
    this._autoplay = false;
    this._url = null;

    this._uploadAddReplace = null;
    this._uploadAdd = null;

    this._justUploaded = false;
    this._msgBar = null;
    this._audioText = "";
    this._audioSplitServiceUrl = "";


    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.AudioWithWebUploaderForIntelligentDictation, businesscomponents.editors.SwitchableView);
toot.defineEvent(businesscomponents.editors.AudioWithWebUploaderForIntelligentDictation, "pick");
toot.defineEvent(businesscomponents.editors.AudioWithWebUploaderForIntelligentDictation, "error");
toot.extendClass(businesscomponents.editors.AudioWithWebUploaderForIntelligentDictation, {
    _init_manageEvents: function () {
        businesscomponents.editors.AudioWithWebUploaderForIntelligentDictation.superClass._init_manageEvents.call(this);
        toot.connect(this._btnDel, "action", this, this._onBtnDelAction);
    },

    _init: function () {
        this._init_manageEvent
        this._init_render();
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
            server: _this._audioSplitServiceUrl,
            fileNumLimit: 1,
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: {
                "id": $(this._element).find('[gi~="btnReplace"]')[0],
                "pickClass": {
                    "pick": "webuploader-pick-intelligentdictation-replace",
                    "hover": "webuploader-pick-intelligentdictation-replace-hover",
                    "disable": "webuploader-pick-disable"
                }
            },
            timeout: 2 * 60 * 60 * 1000
        });
        _this._uploadAddReplace.on('fileQueued', function (file) {
            //提示是否替换
            greedyint.dialog.confirm("替换音频将会清空已有题目并重新生成题目。确定替换？", function () {
                toot.fireEvent(_this, "pick");
                if (!_this._validateFile(file)) {
                    return fasle;
                }


                greedyint.dialog.lock();
                _this._uploadAddReplace.option('formData', {
                    "text": _this._audioText
                });
                _this._uploadAddReplace.upload();
            }, function () {
                _this._uploadAddReplace.reset();
            });

        });
        _this._uploadAddReplace.on('uploadSuccess', function (file, responseJson) {
            _this._uploadSuccess(responseJson);
        });
        _this._uploadAdd = WebUploader.create({

            // 不压缩image
            resize: false,

            // swf文件路径
            swf: '/Scripts/libs/webuploader-0.1.5/Uploader.swf',

            // 文件接收服务端。
            server: _this._audioSplitServiceUrl,
            fileNumLimit: 1,
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: {
                "id": this._iv.getElement(),
                "pickClass": {
                    "pick": "webuploader-pick-dictation",
                    "hover": "",
                    "disable": ""
                }
            },
            timeout: 2 * 60 * 60 * 1000
        });
        _this._uploadAdd.on('fileQueued', function (file) {
            toot.fireEvent(_this, "pick");
            if (!_this._validateFile(file)) {
                return false;
            }


            greedyint.dialog.lock();
            //            console.log((new Date()).toLocaleString());
            _this._uploadAdd.option('formData', {
                "text": _this._audioText
            });
            _this._uploadAdd.upload();
        });
        _this._uploadAdd.on('uploadSuccess', function (file, responseJson) {
            //            _this._model = responseJson.id;
            _this._uploadSuccess(responseJson);
        });
    },
    _validateFile: function (file) {
        var _this = this;
        var msg = "";
        if (file.type != "audio/mp3") {
            msg = "请上传MP3文件！";
            //                _this._msgBar.setMessage(msg, 3000);
            toot.fireEvent(_this, "error", msg);
            return false;
        }
        if (file.size >= 300 * 1024 * 1024) {
            msg = "音频大小不得超过300MB！";
            //                _this._msgBar.setMessage(msg, 3000);
            toot.fireEvent(_this, "error", msg);
            return false;
        }
        if (_this._audioText == "") {
            msg = "材料文本不符合格式要求。请调整后重试！";
            toot.fireEvent(_this, "error", msg);
            return false;
        }
        var reg = new RegExp("[\x00-\x7e]+", "g");
        if (reg.test(_this._audioText)) {

        } else {
            msg = "材料文本不符合格式要求。请调整后重试！";
            toot.fireEvent(_this, "error", msg);
            return false;
        }
        return true;
    },
    _uploadSuccess: function (responseJson) {
        //        console.log((new Date()).toLocaleString());
        //        this._url = responseJson.files[0].url;
        greedyint.dialog.unLock();
        this._uploadAdd.reset();
        this._uploadAddReplace.reset();
        if (!responseJson.status) {
            toot.fireEvent(this, "error", businesscomponents.editors.AudioWithWebUploaderForIntelligentDictation.error[responseJson.message]);
            return false;
        }
        this._model = responseJson.files[0].url;
        //            _this._justUploaded = true;
        this.updateUIByModel();

        //上传切分完成
        toot.fireEvent(this, "change", responseJson);
    },

    _onBtnDelAction: function () {
        if (this._player) this._player.stop();
        this._model = null;
        this._url = null;
        this._viewState = businesscomponents.editors.ViewState.Initial;
        this._renderViewState();
        toot.fireEvent(this, "change");
    },
    _setupPlayer: function () {
        var autoStart = null;
        if (this._justUploaded)
            autoStart = this._autoplayAfterUploaded;
        else
            autoStart = this._autoplayAfterSet;
        this._player = jwplayer(this._$ctnPlayer[0].id).setup({
            flashplayer: "/Scripts/libs/jwplayer/player.swf",
            width: '578',
            height: '30',
            provider: 'sound',
            file: this._model,
            skin: "/Scripts/libs/jwplayer/oneTestPlayer/oneTestPlayer.xml",
            controlbar: 'top',
            autostart: autoStart
        });
        this._justUploaded = false;
    },

    setModelAndUpdateUI: function (model) {
        if (this._model == model) return;
        businesscomponents.editors.AudioWithWebUploaderForIntelligentDictation.superClass.setModelAndUpdateUI.call(this, model);
    },
    setModel: function (model) {
        if (this._model != model) this._url = null;
        businesscomponents.editors.AudioWithWebUploaderForIntelligentDictation.superClass.setModel.call(this, model);
    },
    updateUIByModel: function () {
        var _this = this;
        if (this._model) {
            this._viewState = businesscomponents.editors.ViewState.Edit;
            this._renderViewState();

            //            if (this._url) {
            this._setupPlayer();
            //            }
        } else {
            this._viewState = businesscomponents.editors.ViewState.Initial;
            this._renderViewState();
        }
    },
    _renderViewState: function () {
        if (this._viewState == businesscomponents.editors.ViewState.Initial) {
            this._iv.setVisible(true);
            this._$editView.hide();
        } else if (this._viewState == businesscomponents.editors.ViewState.Edit) {
            this._iv.setVisible(false);
            this._$editView.show();
        }
    },

    getInitialView: function () {
        return this._iv;
    },

    _autoplayAfterSet: false,
    _autoplayAfterUploaded: false,

    setAutoPlayAfterSet: function (autoplayAfterSet) {
        this._autoplayAfterSet = autoplayAfterSet;
    },

    setAutoplayAfterUploaded: function (autoplayAfterUploaded) {
        this._autoplayAfterUploaded = autoplayAfterUploaded;
    },

    getMsgBar: function () { return this._msgBar; },
    setMsgBar: function (bar) { this._msgBar = bar; },
    getBtnDel: function () {
        return this._btnDel;
    },
    getBtnReplace: function () {
        return this._btnReplace;
    },
    getAudioUrl: function () {
        return this._url;
    },
    //设置上传文本
    setAudioText: function (audioText) {
        this._audioText = audioText;
    },
    setAudioSplitServiceUrl: function (audioSplitServiceUrl) {
        this._audioSplitServiceUrl = audioSplitServiceUrl;
    }
});
businesscomponents.editors.AudioWithWebUploaderForIntelligentDictation.html = '<div>' +
    '<div gi="anchorInitialView"></div>' +
    '<div class="btnGroupOuter1" gi="editView">' +
    '<div class="AudioBox" gi="ctnPlayer"></div>' +
    '<div class="btnGroup1 clearfix" gi="btnGroup1" >' +
    '<button class="btnDelete" title="删除" gi="btnDel"></button>' +
    '<button class="btnReplace" title="替换" gi="btnReplace"></button>' +
    '</div>' +
    '</div>' +
    '</div>';
businesscomponents.editors.AudioWithWebUploaderForIntelligentDictation.error = {
    "1000": "未知错误！请重试！",//接不到音频
    "1001": "请上传Mp3文件！",
    "2000": "未知错误！请重试！",//不匹配分割错误
    "2001": "未知错误！请重试！",//读分割音频错误
    "2002": "未知错误！请重试！",//分割音频错误
    "3000": "未知错误！请重试！"//上传错误
};