var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.WebUploadAudio = function (opt_html) {
    businesscomponents.editors.WebUploadAudio.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.WebUploadAudio.html)[0]);

    this._lblFilename = new toot.ui.Label($(this._element).find('[gi~="filename"]')[0]);

    this._iv = new businesscomponents.editors.InitialView();
    this._iv.setHeight(50);
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
    this._uploadAddReplace = null;
    this._uploadAdd = null;
    this._justUploaded = false;
    this._fileName = ''; //文件名
    this._msgBar = null;

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.WebUploadAudio, businesscomponents.editors.SwitchableView);
toot.defineEvent(businesscomponents.editors.WebUploadAudio, "sessionOut");
toot.extendClass(businesscomponents.editors.WebUploadAudio, {

    //    _fileZIndex: 5000,
    //    getFileZIndex: function () { return this._fileZIndex },
    //    setFileZIndex: function (zIndex) {
    //        this._fileZIndex = zIndex;
    //        this._renderFileZIndex();
    //    },
    //    _renderFileZIndex: function () {
    //        if (this._ajaxUpload && this._ajaxUpload._input)
    //            this._ajaxUpload._input.style.zIndex = this._fileZIndex;
    //    },

    _init_manageEvents: function () {
        businesscomponents.editors.WebUploadAudio.superClass._init_manageEvents.call(this);
        toot.connect(this._btnDel, "action", this, this._onBtnDelAction);
    },

    _init: function () {
        this._init_manageEvents();

        //        var _this = this;
        //        var ajax1 = {
        //            action: '/Common/UploadWebUploadAudio',
        //            name: 'file',
        //            onSubmit: function (file, ext) {
        //                if (!(ext && /^(mp3)$/.test(ext.toLowerCase()))) {
        //                    var msg = '请您上传mp3文件';
        //                    if (_this._msgBar) _this._msgBar.setMessage(msg, true);
        //                    else alert(msg);
        //                    return false;
        //                }
        //                greedyint.dialog.lock();
        //            },
        //            onComplete: function (file, response) {
        //                var responseJson = JSON.parse(response);
        //                _this._model = responseJson.id;
        //                _this._url = responseJson.url;
        //                _this._justUploaded = true;
        //                _this.updateUIByModel();
        //                _this._fileName = responseJson.fileName;
        //                _this._lblFilename.setText(responseJson.fileName);
        //                greedyint.dialog.unLock();
        //                toot.fireEvent(_this, "change");
        //                _this._ajaxUploadInput = _this._ajaxUpload._input;
        //            },
        //            onError: function (file, errorCode) {
        //                _this._ajaxUploadInput = _this._ajaxUpload._input;
        //                switch (errorCode) {
        //                    case "497":
        //                        //你无权进行该操作
        //                        //                        var msg = "无权操作";
        //                        //                        if (_this._msgBar) _this._msgBar.setMessage(msg, true);
        //                        //                        else alert(msg);
        //                        //                        break;
        //                        toot.fireEvent(_this, "sessionOut");
        //                        break;
        //                    case "498":
        //                        //TODO 可能直接显示对话框了
        //                        //                        var msg = "会话超时，请重新登录";
        //                        //                        if (_this._msgBar) _this._msgBar.setMessage(msg, true);
        //                        //                        else alert(msg);
        //                        //                        top.location.href = '/Account/SwitchIndex?tryCookie=true';
        //                        //修改为直接显示登陆框 2013-10-22 修改人by文艺
        //                        toot.fireEvent(_this, "sessionOut");
        //                        break;
        //                    case "499":
        //                    case "500":
        //                        var msg = "未知错误，通知系统管理员";
        //                        if (_this._msgBar) _this._msgBar.setMessage(msg, true);
        //                        else alert(msg);
        //                        break;
        //                    default:
        //                        break;
        //                }

        //                greedyint.dialog.unLock();
        //            },

        //            zIndex: -5000
        //        };

        //        var ajax2 = {
        //            action: '/Common/UploadWebUploadAudio',
        //            name: 'file',
        //            onSubmit: function (file, ext) {
        //                if (!(ext && /^(mp3)$/.test(ext.toLowerCase()))) {
        //                    var msg = '请您上传mp3文件';
        //                    if (_this._msgBar) _this._msgBar.setMessage(msg, true);
        //                    else alert(msg);
        //                    return false;
        //                }
        //                greedyint.dialog.lock();
        //            },
        //            onComplete: function (file, response) {
        //                var responseJson = JSON.parse(response);
        //                _this._model = responseJson.id;
        //                _this._url = responseJson.url;
        //                _this._justUploaded = true;
        //                _this._fileName = responseJson.fileName;
        //                _this._lblFilename.setText(responseJson.fileName);
        //                _this.updateUIByModel();
        //                greedyint.dialog.unLock();
        //                toot.fireEvent(_this, "change");
        //                _this._addUploadInput = _this._addUpload._input;
        //            },
        //            onError: function (file, errorCode) {
        //                _this._addUploadInput = _this._addUpload._input;
        //                switch (errorCode) {
        //                    case "497":
        //                        //你无权进行该操作
        //                        //                        var msg = "无权操作";
        //                        //                        if (_this._msgBar) _this._msgBar.setMessage(msg, true);
        //                        //                        else alert(msg);
        //                        //                        break;
        //                        toot.fireEvent(_this, "sessionOut");
        //                        break;
        //                    case "498":
        //                        //TODO 可能直接显示对话框了
        //                        //                        var msg = "会话超时，请重新登录";
        //                        //                        if (_this._msgBar) _this._msgBar.setMessage(msg, true);
        //                        //                        else alert(msg);
        //                        //                        top.location.href = '/Account/SwitchIndex?tryCookie=true';
        //                        //修改为直接显示登陆框 2013-10-22 修改人by文艺
        //                        toot.fireEvent(_this, "sessionOut");
        //                        break;
        //                    case "499":
        //                    case "500":
        //                        var msg = "未知错误，通知系统管理员";
        //                        if (_this._msgBar) _this._msgBar.setMessage(msg, true);
        //                        else alert(msg);
        //                        break;
        //                    default:
        //                        break;
        //                }

        //                greedyint.dialog.unLock();
        //            }

        //    };

        //        this._ajaxUpload = new AjaxUpload(this._btnReplace.getElement(), ajax1);
        //        this._ajaxUpload._createInput();
        //        this._ajaxUploadInput = $(this._ajaxUpload._getCurrentInput());
        //        $(this._btnReplace.getElement()).click(function () {
        //            _this._ajaxUploadInput.click();
        //        })

        //        this._addUpload = new AjaxUpload(this._iv.getElement(), ajax2);
        //        this._addUpload._createInput();

        //        this._addUploadInput = $(this._addUpload._getCurrentInput());
        //        $(this._iv.getElement()).click(function () {
        //            _this._addUploadInput.click();

        //        })
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
                "id": ".btn10Replace",
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
            _this._model = responseJson.id;
            _this._url = responseJson.url;
            _this._justUploaded = true;
            _this._fileName = responseJson.fileName;
            _this._lblFilename.setText(responseJson.fileName);
            _this.updateUIByModel();
            greedyint.dialog.unLock();
            toot.fireEvent(_this, "change");
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
                "id": ".marRPatch",
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
            _this._model = responseJson.id;
            _this._url = responseJson.url;
            _this._justUploaded = true;
            _this._fileName = responseJson.fileName;
            _this._lblFilename.setText(responseJson.fileName);
            _this.updateUIByModel();
            greedyint.dialog.unLock();
            toot.fireEvent(_this, "change");
        });


        this._init_render();
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
            file: this._url,
            skin: "/Scripts/libs/jwplayer/oneTestPlayer/oneTestPlayer.xml",
            controlbar: 'top',
            autostart: autoStart
        });
        this._justUploaded = false;
    },

    setModelAndUpdateUI: function (model) {
        if (this._model == model) return;
        businesscomponents.editors.WebUploadAudio.superClass.setModelAndUpdateUI.call(this, model);
    },
    setModel: function (model) {
        if (this._model != model) this._url = null;
        businesscomponents.editors.WebUploadAudio.superClass.setModel.call(this, model);
    },
    getFileName: function () {
        return this._fileName;
    },
    setFileName: function (fileName) {
        this._fileName = fileName;
    },
    updateUIByModel: function () {
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
                    success: function (json) {
                        _this._url = json.url;
                        _this._setupPlayer();
                    }
                });
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

    getMsgBar: function () { return this._msgBar },
    setMsgBar: function (bar) { this._msgBar = bar },
    getBtnDel: function () {
        return this._btnDel;
    },
    getBtnReplace: function () {
        return this._btnReplace;
    }
});
businesscomponents.editors.WebUploadAudio.html = '<div>' +
    '<div gi="anchorInitialView"></div>' +
    '<div class="btnGroupOuter1" gi="editView">' +
    '<span gi="filename"></span><div class="AudioBox" gi="ctnPlayer"></div>' +
    '<div class="btnGroup1 clearfix" gi="btnGroup1" >' +
    '<button class="btnDelete" title="删除" gi="btnDel"></button>' +
    '<button class="btnReplace" title="替换" gi="btnReplace"></button>' +
    '</div>' +
    '</div>' +
    '</div>';