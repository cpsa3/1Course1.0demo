var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.Image = function () {
    businesscomponents.editors.Image.superClass.constructor.call(this, $(businesscomponents.editors.Image.edithtml)[0]);
    this._iv = new businesscomponents.editors.InitialView();

    this._iv.setHeight(140);
    this._iv.replaceTo($(this._element).find('[gi~="anchorInitialView"]')[0]);
    this._$editView = $(this._element).find('[gi~="editView"]');
    this._$img = $(this._element).find('[gi~="img"]');

    this._$lockMask = $(this._element).find('[gi~="lockMask"]');

    this._$btnGroup2 = $(this._element).find('[gi~="btnGroup2"]');
    this._btnReplace = new toot.ui.Button($(this._element).find('[gi~="btnReplace"]')[0]);

    this._btnDel = new toot.ui.Button($(this._element).find('[gi~="btnDel"]')[0]);
    this._url = null;
    this._ajaxUpload = null;

    this._msgBar = null;

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.Image, businesscomponents.editors.SwitchableView);
toot.defineEvent(businesscomponents.editors.Image, "sessionOut");
toot.extendClass(businesscomponents.editors.Image, {

    _init_manageEvents: function () {
        businesscomponents.editors.Image.superClass._init_manageEvents.call(this);
        toot.connect(this._btnDel, "action", this, this._onBtnDelAction);
    },


    _init: function () {
        this._init_manageEvents();

        var _this = this;

        var ajax = {
            action: '/Common/UploadImage',
            name: 'file',
            onSubmit: function (file, ext) {
                if (!(ext && /^(jpg|jpeg|bmp|png)$/.test(ext.toLowerCase()))) {
                    var msg = '上传图片类型不符，系统支持bmp、jpg、jpeg、png图片文件';
                    if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                    else alert(msg);
                    return false;
                }
                greedyint.dialog.lock();
            },
            onComplete: function (file, response) {
                var responseJson = JSON.parse(response);
                _this._model = responseJson.id;
                _this._url = responseJson.url;
                _this.updateUIByModel();
                greedyint.dialog.unLock();
                $(_this._ajaxUpload._input).bind("mouseleave", function () {
                    _this._$lockMask.css("display", "block");
                    _this._$btnGroup2.css("display", "block");
                });
                $(_this._ajaxUpload._input).bind("mouseenter", function () {
                    _this._$lockMask.css("display", "block");
                    _this._$btnGroup2.css("display", "block");
                });

            },
            onError: function (file, errorCode) {
                switch (errorCode) {
                    case "497":
                        //你无权进行该操作
//                        var msg = "无权操作";
//                        if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                        //                        else alert(msg);
                        toot.fireEvent(_this, "sessionOut");
                        break;
                    case "498":
                        //TODO 可能直接显示对话框了
//                        var msg = "会话超时，请重新登录";
//                        if (_this._msgBar) _this._msgBar.setMessage(msg, true);
//                        else alert(msg);
                        //                        top.location.href = '/Account/SwitchIndex?tryCookie=true';
                        toot.fireEvent(_this, "sessionOut");
                        break;
                    case "499":
                    case "500":
                        var msg = "未知错误，通知系统管理员";
                        if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                        else alert(msg);
                        break;
                    default:
                        break;
                }

                greedyint.dialog.unLock();
            },

            zIndex: 5000
        };
        this._ajaxUpload = new AjaxUpload(this._btnReplace.getElement(), ajax);
        new AjaxUpload(this._iv.getElement(), ajax);

        this._ajaxUpload._createInput();
        $(this._ajaxUpload._input).bind("mouseleave", function () {
            _this._$lockMask.css("display", "block");
            _this._$btnGroup2.css("display", "block");
        });
        $(this._ajaxUpload._input).bind("mouseenter", function () {
            _this._$lockMask.css("display", "block");
            _this._$btnGroup2.css("display", "block");
        });
        this._$editView.bind("mouseenter", function () {
            _this._$lockMask.css("display", "block");
            _this._$btnGroup2.css("display", "block");
        });
        this._$editView.bind("mouseleave", function () {
            _this._$lockMask.css("display", "none");
            _this._$btnGroup2.css("display", "none");
        });
        this._init_render();

    },
    _onBtnDelAction: function () {
        this._model = null;
        this._url = null;
        this._viewState = businesscomponents.editors.ViewState.Initial;
        this._renderViewState();
    },
    setModelAndUpdateUI: function (model) {
        if (this._model == model) return;
        businesscomponents.editors.Image.superClass.setModelAndUpdateUI.call(this, model);
    },
    updateUIByModel: function () {
        var _this = this;
        if (this._model) {
            this._viewState = businesscomponents.editors.ViewState.Edit;
            this._renderViewState();

            if (this._url) {
                this._$img.attr("src", this._url);
            }
            else
                $.ajax({
                    url: "/Common/GetShortUrl?id=" + _this._model,
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    success: function (json) {
                        _this._$img.attr("src", json.url);
                    }
                });
        }
        else {
            this._viewState = businesscomponents.editors.ViewState.Initial;
            this._renderViewState();
        }
    },
    _renderViewState: function () {
        if (this._viewState == businesscomponents.editors.ViewState.Initial) {
            this._iv.setVisible(true);
            this._$editView.hide();
        }
        else if (this._viewState == businesscomponents.editors.ViewState.Edit) {
            this._iv.setVisible(false);
            this._$editView.show();
        }
    },
    setTitle: function (title) {
        this._iv.setLb12(title);
    },

    getInitialView: function () {
        return this._iv;
    },

    getMsgBar: function () { return this._msgBar },
    setMsgBar: function (bar) { this._msgBar = bar }
});

businesscomponents.editors.Image.edithtml = '<div>' +
 '<div gi="anchorInitialView"><button class="btnReplace" gi="btnReplace2"></button></div>' +
'<div class="marB10 imageEditor" gi="editView">' +
            	'<img src="/Content/images/pic.jpg" gi="img"/>' +
                '<div class="lockMask" gi="lockMask"></div>' +
               ' <div class="btnGroup2" gi="btnGroup2">' +
                	'<button class="btnReplace" gi="btnReplace"></button>' +
                    '<button class="btnDelete" gi="btnDel"></button>' +
                '</div>' +
                '</div>' +
                  '</div>';


//托福阅读使用图片上传组件
businesscomponents.editors.ReadingImage = function () {
    businesscomponents.editors.ReadingImage.superClass.constructor.call(this, $(businesscomponents.editors.ReadingImage.edithtml)[0]);

    this._btnUploadimg = new toot.ui.Button($(this._element).find('[gi~="btnUploadimg"]')[0]);

    this._btnUploadimgDone = $(this._element).find('[gi~="btnUploadimgDone"]')[0];

    this._$filename = $(this._element).find('[gi~="filename"]');

    this._$btnUploadimg = $(this._element).find('[gi~="btnUploadimg"]');
    this._$uploadFilebox = $(this._element).find('[gi~="uploadFilebox"]');


    this._$editView = $(this._element).find('[gi~="editView"]');
    this._$img = $(this._element).find('[gi~="img"]');




    this._btnDel = new toot.ui.Button($(this._element).find('[gi~="btnDel"]')[0]);
    this._url = null;
    this._ajaxUpload = null;
    //文件名
    this._filename = null;
    this._msgBar = null;

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.ReadingImage, businesscomponents.editors.SwitchableView);
toot.defineEvent(businesscomponents.editors.ReadingImage, "sessionOut");
toot.extendClass(businesscomponents.editors.ReadingImage, {

    _init_manageEvents: function () {
        businesscomponents.editors.ReadingImage.superClass._init_manageEvents.call(this);
        toot.connect(this._btnDel, "action", this, this._onBtnDelAction);
    },


    _init: function () {
        this._init_manageEvents();

        var _this = this;

        var ajax = {
            action: '/Common/UploadImage',
            name: 'file',
            onSubmit: function (file, ext) {
                if (!(ext && /^(jpg|jpeg|bmp|png)$/.test(ext.toLowerCase()))) {
                    var msg = '上传图片类型不符，系统支持bmp、jpg、jpeg、png图片文件';
                    if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                    return false;
                }
//                greedyint.dialog.lock();
            },
            onComplete: function (file, response) {
                var responseJson = JSON.parse(response);
                _this._filename = file;
                _this._model = responseJson.id;
                _this._url = responseJson.url;
                _this.updateUIByModel();
//                greedyint.dialog.unLock();


            },
            onError: function (file, errorCode) {
                switch (errorCode) {
                    case "497":
                        //你无权进行该操作
//                        var msg = "无权操作";
//                        if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                        //                        else alert(msg);
                        toot.fireEvent(_this, "sessionOut");
                        break;
                    case "498":
                        //TODO 可能直接显示对话框了
//                        var msg = "会话超时，请重新登录";
//                        if (_this._msgBar) _this._msgBar.setMessage(msg, true);
//                        else alert(msg);
                        //                        top.location.href = '/Account/SwitchIndex?tryCookie=true';
                        toot.fireEvent(_this, "sessionOut");
                        break;
                    case "499":
                    case "500":
                        var msg = "未知错误，通知系统管理员";
                        if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                        else alert(msg);
                        break;
                    default:
                        break;
                }

                greedyint.dialog.unLock();
            },

            zIndex: 5000
        };
        new AjaxUpload(this._btnUploadimg.getElement(), ajax);


        this._init_render();

    },
    _onBtnDelAction: function () {
        this._model = null;
        this._url = null;
        this._viewState = businesscomponents.editors.ViewState.Initial;
        this._renderViewState();
    },
    setModelAndUpdateUI: function (model) {
        if (this._model == model) return;
        businesscomponents.editors.ReadingImage.superClass.setModelAndUpdateUI.call(this, model);
    },
    updateUIByModel: function () {
        var _this = this;
        if (this._model) {
            this._viewState = businesscomponents.editors.ViewState.Edit;
            this._renderViewState();

            if (this._url) {
                this._$img.attr("src", this._url);
            }
            else
                $.ajax({
                    url: "/Common/GetShortUrl?id=" + _this._model,
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    success: function (json) {
                        _this._$img.attr("src", json.url);
                    }
                });
        }
        else {
            this._viewState = businesscomponents.editors.ViewState.Initial;
            this._renderViewState();
        }
    },
    getMsgBar: function () { return this._msgBar },
    setMsgBar: function (bar) { this._msgBar = bar },
    _renderViewState: function () {
        if (this._viewState == businesscomponents.editors.ViewState.Initial) {
            this._$btnUploadimg.show();
            this._$editView.hide();
        }
        else if (this._viewState == businesscomponents.editors.ViewState.Edit) {
            this._$btnUploadimg.hide();
            this._$editView.show();
        }
    }

});

businesscomponents.editors.ReadingImage.edithtml = '<div>' +
  '<button class="btnUploadimg" gi="btnUploadimg"></button>' +

    '<div gi="editView"> ' +
            '<button class="btnUploadimgDone" gi="btnUploadimgDone"></button>' +
            '<div class="uploadFilebox" gi="uploadFilebox">' +
                '<span class="ThumbnailFile" gi="filename"><img src="" gi="img" /></span>' +
                '<span class="closeItem3" gi="btnDel"></span>' +
            '</div>'+
    '</div>' +
  '</div>';