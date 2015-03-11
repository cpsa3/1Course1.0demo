/*
*User: 小潘
*Date: 2015年1月27日 15:43:25
*Desc: 听写题组所用的音频上传及播放组件 上传时需校验文件大小 
*/
var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.AudioWithWebUploader = function(opt_html) {
    businesscomponents.editors.AudioWithWebUploader.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.AudioWithWebUploader.html)[0]);

    this._lblFilename = new toot.ui.Label($(this._element).find('[gi~="filename"]')[0]);

    this._iv = new businesscomponents.editors.InitialView();
    this._iv.setHeight(50);
    this._iv.setLb12(" 听力音频（请上传总和小于300MB的音频！）");
    this._iv.replaceTo($(this._element).find('[gi~="anchorInitialView"]')[0]);

    this._$editView = $(this._element).find('[gi~="editView"]');
    this._$ctnPlayer = $(this._element).find('[gi~="ctnPlayer"]');
    this._$ctnPlayer[0].id = "gi-" + (Math.random() + "").substring(2) + (Math.random() + "").substring(2);

    this._$btnGroup1 = $(this._element).find('[gi~="btnGroup1"]');
    this._player = null;
    this._btnReplace = new toot.ui.Button($(this._element).find('[gi~="btnReplace"]')[0]);
    this._btnDel = new toot.ui.Button($(this._element).find('[gi~="btnDel"]')[0]);
    this._autoplay = false;
    this._url = null;
    this._ajaxUpload = null;
    this._addUpload = null;

    this._uploadAddReplace = null;
    this._uploadAdd = null;

    this._justUploaded = false;
    this._fileName = ''; //文件名
    this._msgBar = null;

    //文件大小
    this._size = 0;

    //整个Task所有音频的大小综合
    this._taskAudioSize = 0;

    //整个task的结构 只读
    this._taskModel = null;

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.AudioWithWebUploader, businesscomponents.editors.SwitchableView);
toot.defineEvent(businesscomponents.editors.AudioWithWebUploader, "sessionOut");
toot.extendClass(businesscomponents.editors.AudioWithWebUploader, {
    _fileZIndex: 5000,
    getFileZIndex: function() { return this._fileZIndex; },
    setFileZIndex: function(zIndex) {
        this._fileZIndex = zIndex;
        this._renderFileZIndex();
    },
    _renderFileZIndex: function() {
        if (this._ajaxUpload && this._ajaxUpload._input)
            this._ajaxUpload._input.style.zIndex = this._fileZIndex;
    },

    _init_manageEvents: function() {
        businesscomponents.editors.AudioWithWebUploader.superClass._init_manageEvents.call(this);
        toot.connect(this._btnDel, "action", this, this._onBtnDelAction);
    },

    _init: function() {
        this._init_manageEvents();

        var _this = this;
        //替换按钮
        _this._uploadAddReplace = WebUploader.create({

            // 不压缩image
            resize: false,

            // swf文件路径
            swf: '/Scripts/libs/webuploader-0.1.5/Uploader.swf',

            // 文件接收服务端。
            server: '/Common/UploadAudio',
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
            }
        });
        _this._uploadAddReplace.on('fileQueued', function(file) {
            if ((_this._taskModel.getContent().getAudioSize() + file.size - _this._size) >= 300 * 1024 * 1024) {
                var msg = "音频上传合计不能超过300MB";
                _this._msgBar.setMessage(msg, 3000);
                return false;
            }
            greedyint.dialog.lock();
            _this._uploadAddReplace.upload();
        });
        _this._uploadAddReplace.on('uploadSuccess', function(file, responseJson) {
            _this._model = responseJson.id;
            _this._url = responseJson.url;
            _this._justUploaded = true;
            _this._fileName = responseJson.fileName;
            _this._lblFilename.setText(responseJson.fileName);
            _this._size = file.size;
            _this.updateUIByModel();
            greedyint.dialog.unLock();
            toot.fireEvent(_this, "change");
            _this._uploadAddReplace.reset();
            //            _this._addUploadInput = _this._addUpload._input;
        });
        _this._uploadAdd = WebUploader.create({

            // 不压缩image
            resize: false,

            // swf文件路径
            swf: '/Scripts/libs/webuploader-0.1.5/Uploader.swf',

            // 文件接收服务端。
            server: '/Common/UploadAudio',
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
            }
        });
        _this._uploadAdd.on('fileQueued', function(file) {
            if ((_this._taskModel.getContent().getAudioSize() + file.size) >= 300 * 1024 * 1024) {
                var msg = "音频上传合计不能超过300MB";
                _this._msgBar.setMessage(msg, 3000);
                return false;
            }
            greedyint.dialog.lock();
            _this._uploadAdd.upload();
        });
        _this._uploadAdd.on('uploadSuccess', function(file, responseJson) {
            _this._model = responseJson.id;
            _this._url = responseJson.url;
            _this._justUploaded = true;
            _this._fileName = responseJson.fileName;
            _this._lblFilename.setText(responseJson.fileName);
            _this._size = file.size;
            _this.updateUIByModel();
            greedyint.dialog.unLock();
            toot.fireEvent(_this, "change");
            _this._uploadAdd.reset();
        });


        this._init_render();
    },

    _onBtnDelAction: function() {
        if (this._player) this._player.stop();
        this._model = null;
        this._url = null;
        this._size = 0;
        this._viewState = businesscomponents.editors.ViewState.Initial;
        this._renderViewState();
        toot.fireEvent(this, "change");
    },
    _setupPlayer: function() {
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
            file: this._url,
            skin: "/Scripts/libs/jwplayer/oneTestPlayer/oneTestPlayer.xml",
            controlbar: 'top',
            autostart: autoStart
        });
        this._justUploaded = false;
    },

    setModelAndUpdateUI: function(model) {
        if (this._model == model) return;
        businesscomponents.editors.AudioWithWebUploader.superClass.setModelAndUpdateUI.call(this, model);
    },
    setModel: function(model) {
        if (this._model != model) this._url = null;
        businesscomponents.editors.AudioWithWebUploader.superClass.setModel.call(this, model);
    },
    getFileName: function() {
        return this._fileName;
    },
    setFileName: function(fileName) {
        this._fileName = fileName;
        this._lblFilename.setText(this._fileName);
    },
    updateUIByModel: function() {
        var _this = this;
        if (this._model) {
            this._viewState = businesscomponents.editors.ViewState.Edit;
            this._renderViewState();

            if (this._url) {
                this._setupPlayer();
            } else
                $.ajax({
                    url: "/Common/GetShortUrl?id=" + _this._model,
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    success: function(json) {
                        _this._url = json.url;
                        _this._setupPlayer();
                    }
                });
        } else {
            this._viewState = businesscomponents.editors.ViewState.Initial;
            this._renderViewState();
        }
    },
    _renderViewState: function() {
        if (this._viewState == businesscomponents.editors.ViewState.Initial) {
            this._iv.setVisible(true);
            this._$editView.hide();
        } else if (this._viewState == businesscomponents.editors.ViewState.Edit) {
            this._iv.setVisible(false);
            this._$editView.show();
        }
    },

    getInitialView: function() {
        return this._iv;
    },

    _autoplayAfterSet: false,
    _autoplayAfterUploaded: false,

    setAutoPlayAfterSet: function(autoplayAfterSet) {
        this._autoplayAfterSet = autoplayAfterSet;
    },

    setAutoplayAfterUploaded: function(autoplayAfterUploaded) {
        this._autoplayAfterUploaded = autoplayAfterUploaded;
    },

    getMsgBar: function() { return this._msgBar; },
    setMsgBar: function(bar) { this._msgBar = bar; },
    getBtnDel: function() {
        return this._btnDel;
    },
    getBtnReplace: function() {
        return this._btnReplace;
    },
    setTaskAudioSize: function(size) {
        this._taskAudioSize = size;
    },
    getAudioSize: function() {
        return this._size;
    },
    setAudioSize: function(size) {
        this._size = size;
    },
    getAudioUrl: function() {
        return this._url;
    },
    //TaskModel 该值只读，无法以任何形式修改
    setTaskModel: function(model) {
        this._taskModel = model;
    }
});
businesscomponents.editors.AudioWithWebUploader.html = '<div>' +
    '<div gi="anchorInitialView"></div>' +
    '<div class="btnGroupOuter1" gi="editView">' +
    '<span gi="filename"></span><div class="AudioBox" gi="ctnPlayer"></div>' +
    '<div class="btnGroup1 clearfix" gi="btnGroup1" >' +
    '<button class="btnDelete" title="删除" gi="btnDel"></button>' +
    '<button class="btnReplace" title="替换" gi="btnReplace"></button>' +
    '</div>' +
    '</div>' +
    '</div>';