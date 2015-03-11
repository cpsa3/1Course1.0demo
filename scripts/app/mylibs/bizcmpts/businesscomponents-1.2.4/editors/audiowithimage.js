//部分代码重复：有待重构

var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.audiowithimage = businesscomponents.editors.audiowithimage || {};

businesscomponents.editors.audiowithimage.Audiowithimage = function (opt_html) {

    businesscomponents.editors.audiowithimage.Audiowithimage.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.audiowithimage.Audiowithimage.html)[0]);
    //音频信息
    this._iv = new businesscomponents.editors.InitialView();
    this._title = " 听力音频";

    this._$lblPrompt = $(this._element).find('[gi~="lblPrompt"]');

    this._iv.setLb12(this._title);
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
    this._justUploaded = false;
    //音频总长
    this._duration = 0;
    //当前上传图片位置
    this._position = 0;

    this._ajaxImageUpload = null;
    //结束音频信息



    //音频上显示图片定位信息
    this._$imagePosition = $(this._element).find('[gi~="showImagePosition"]');
    this._dataPositionList = null;
    this._iPosition = null;
    this._width = "420px";
    //结束音频上显示图片定位信息



    //上传图片
    //显示图片区域
    this._$showImageConent = $(this._element).find('[gi~="showImageConent"]');
    this._imageList = null;
    //添加图片
    this._$unImage = $(this._element).find('[gi~="unImage"]');
    this._btnUnImage = new toot.ui.Button($(this._element).find('[gi~="unImage"]')[0]);
    //数据实体
    this._audioId = 0;
    this._imgItems = [];

    this._msgBar = null;
    this._ajaxUploadInput = null;
    this._addUploadInput = null;
    this._currentImageInput = null;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.audiowithimage.Audiowithimage, businesscomponents.editors.SwitchableView);
toot.defineEvent(businesscomponents.editors.audiowithimage.Audiowithimage, "sessionOut");
toot.extendClass(businesscomponents.editors.audiowithimage.Audiowithimage, {

    setTitle: function (title) {
        this._title = title;
        this._iv.setLb12(this._title);
    },

    setImagePrompt: function (promptHtml) {
        this._$lblPrompt.html(promptHtml);
    },

    //操作音频信息
    _fileZIndex: -5000,
    getFileZIndex: function () { return this._fileZIndex },
    setFileZIndex: function (zIndex) {
        this._fileZIndex = zIndex;
        this._renderFileZIndex();
    },
    _renderFileZIndex: function () {
        if (this._ajaxUpload && this._ajaxUpload._input)
            this._ajaxUpload._input.style.zIndex = this._fileZIndex;
    },

    _init_manageEvents: function () {
        businesscomponents.editors.audiowithimage.Audiowithimage.superClass._init_manageEvents.call(this);
        toot.connect(this._btnDel, "action", this, this._onBtnDelAction);
    },

    _init: function () {
        this._$unImage.hide();
        this._init_manageEvents();

        var _this = this;
        var ajax1 = {
            action: '/Common/UploadAudio',
            name: 'file',
            onSubmit: function (file, ext) {
                if (!(ext && /^(mp3)$/.test(ext.toLowerCase()))) {
                    var msg = '请您上传mp3文件';
                    if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                    else alert(msg);

                    return false;
                }
                greedyint.dialog.lock();
            },
            onComplete: function (file, response) {
                var responseJson = JSON.parse(response);

                //音频上传静止状态无法获取，默认总长度为-1，后面上传图片时会计算;
                _this._duration = -1;
                //让光标停留在0位置，后面暂停上传时会改变值
                _this._position = -0.5;
                _this._$unImage.show();
                //                alert(_this._duration);
                //                alert(responseJson.durtaion);
                //给这个组件的audioId赋值
                _this._audioId = responseJson.id;
                _this._url = responseJson.url;
                _this._justUploaded = true;
                _this.updateUIByModel();
                greedyint.dialog.unLock();
                toot.fireEvent(_this, "change");
                //每次重新上传input对象都会更改
                //                $(_this._ajaxUpload._input).bind("mouseleave", function () {
                //                    _this._$btnGroup1.hide();
                //                });
                //                $(_this._ajaxUpload._input).bind("mouseenter", function () {
                //                    _this._$btnGroup1.show();
                //                });
                _this._imgItems = [];
                _this._updateUiByImageDate();
                _this._ajaxUploadInput = _this._ajaxUpload._input;
            },
            onError: function (file, errorCode) {
                _this._ajaxUploadInput = _this._ajaxUpload._input;
                switch (errorCode) {
                    case "497":
                        //你无权进行该操作
                        //var msg = "无权操作";
                        // if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                        // else alert(msg);
                        toot.fireEvent(_this, "sessionOut");
                        break;
                    case "498":
                        //TODO 可能直接显示对话框了
                        // var msg = "会话超时，请重新登录";
                        // if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                        // else alert(msg);
                        // top.location.href = '/Account/SwitchIndex?tryCookie=true';
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

            zIndex: -5000
        };

        var ajax2 = {
            action: '/Common/UploadAudio',
            name: 'file',
            onSubmit: function (file, ext) {
                if (!(ext && /^(mp3)$/.test(ext.toLowerCase()))) {
                    var msg = '请您上传mp3文件';
                    if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                    else alert(msg);

                    return false;
                }
                greedyint.dialog.lock();
            },
            onComplete: function (file, response) {
                var responseJson = JSON.parse(response);

                //音频上传静止状态无法获取，默认总长度为-1，后面上传图片时会计算;
                _this._duration = -1;
                //让光标停留在0位置，后面暂停上传时会改变值
                _this._position = -0.5;
                _this._$unImage.show();
                //                alert(_this._duration);
                //                alert(responseJson.durtaion);
                //给这个组件的audioId赋值
                _this._audioId = responseJson.id;
                _this._url = responseJson.url;
                _this._justUploaded = true;
                _this.updateUIByModel();
                greedyint.dialog.unLock();
                toot.fireEvent(_this, "change");
                //每次重新上传input对象都会更改
                //                $(_this._ajaxUpload._input).bind("mouseleave", function () {
                //                    _this._$btnGroup1.hide();
                //                });
                //                $(_this._ajaxUpload._input).bind("mouseenter", function () {
                //                    _this._$btnGroup1.show();
                //                });
                _this._imgItems = [];
                _this._updateUiByImageDate();
                _this._addUploadInput = _this._addUpload._input;
            },
            onError: function (file, errorCode) {
                _this._addUploadInput = _this._addUpload._input;
                switch (errorCode) {
                    case "497":
                        //你无权进行该操作
                        //var msg = "无权操作";
                        // if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                        // else alert(msg);
                        toot.fireEvent(_this, "sessionOut");
                        break;
                    case "498":
                        //TODO 可能直接显示对话框了
                        // var msg = "会话超时，请重新登录";
                        // if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                        // else alert(msg);
                        // top.location.href = '/Account/SwitchIndex?tryCookie=true';
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

            zIndex: -5000
        };
        //处理上传组件隐藏的input样式冲突问题

        this._ajaxUpload = new AjaxUpload(this._btnReplace.getElement(), ajax1);
        this._ajaxUpload._createInput();

        this._ajaxUploadInput = $(this._ajaxUpload._getCurrentInput());
        $(this._btnReplace.getElement()).click(function () {
            _this._ajaxUploadInput.click();

        })

        this._addUpload = new AjaxUpload(this._iv.getElement(), ajax2);
        this._addUpload._createInput();

        this._addUploadInput = $(this._addUpload._getCurrentInput());
        $(this._iv.getElement()).click(function () {
            _this._addUploadInput.click();

        })


        //        $(this._ajaxUpload._input).bind("mouseleave", function () {
        //            _this._$btnGroup1.hide();
        //        });
        //        $(this._ajaxUpload._input).bind("mouseenter", function () {
        //            _this._$btnGroup1.show();
        //        });
        //        this._$editView.bind("mouseenter", function () {
        //            _this._$btnGroup1.show();
        //        });
        //        this._$editView.bind("mouseleave", function () {
        //            _this._$btnGroup1.hide();
        //        });
        //        this._$btnGroup1.bind("mouseleave", function () {
        //            _this._$btnGroup1.hide();
        //        });

        this.imageUploadAjax = {
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


                //上传时：取进度条最新定位
                _this._duration = _this._player.getDuration()
                //这个值不去最新：可能被编辑的时会取编辑当前的图片的位置
                _this._position = parseInt(_this._player.getPosition());
                if (_this._position == 0)
                    _this._position = -0.5;
                //这个position为百分比用来定位
                //alert(_this._duration);
                var position = parseFloat((_this._position + 0.5) * 100 / _this._duration) + "%";
                //                alert(_this._position);
                //                alert(_this._duration);
                //                alert(position);
                var start = 0;
                if (_this._position > 0)
                    start = _this._position;
                var addItem = { _start: start, _src: responseJson.url, _fileId: responseJson.id, _position: position };
                //_start处已有图片，执行编辑
                _this._addImage(addItem);
                greedyint.dialog.unLock();
                _this._currentImageInput = _this._ajaxImageUpload._input;
            },
            onError: function (file, errorCode) {
                _this._currentImageInput = _this._ajaxImageUpload._input;
                switch (errorCode) {
                    case "497":
                        //你无权进行该操作
                        // var msg = "无权操作";
                        // if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                        // else alert(msg);
                        toot.fireEvent(_this, "sessionOut");
                        break;
                    case "498":
                        //TODO 可能直接显示对话框了
                        // var msg = "会话超时，请重新登录";
                        // if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                        // else alert(msg);
                        // top.location.href = '/Account/SwitchIndex?tryCookie=true';
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

            zIndex: -5000
        };


        this.imageEditAjax = {
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

                if (_this._player.getDuration() == -1) {
                    _this._player.play();
                    //播放器未加载音频时：编辑图片 为了能拿到_this._duration值
                    setTimeout(function () {
                        _this._player.pause(); _this._duration = _this._player.getDuration();
                        //这个position为百分比用来定位
                        //alert(_this._duration);
                        var position = parseFloat((_this._position + 0.5) * 100 / _this._duration) + "%";
                        //                alert(_this._position);
                        //                alert(_this._duration);
                        //                alert(position);
                        var start = 0;
                        if (_this._position > 0)
                            start = _this._position;
                        var addItem = { _start: start, _src: responseJson.url, _fileId: responseJson.id, _position: position };
                        //_start处已有图片，执行编辑
                        _this._addImage(addItem);
                        greedyint.dialog.unLock();
                    }, 200);
                }
                else {
                    //这个position为百分比用来定位
                    //alert(_this._duration);
                    var position = parseFloat((_this._position + 0.5) * 100 / _this._duration) + "%";
                    //                alert(_this._position);
                    //                alert(_this._duration);
                    //                alert(position);
                    var start = 0;
                    if (_this._position > 0)
                        start = _this._position;
                    var addItem = { _start: start, _src: responseJson.url, _fileId: responseJson.id, _position: position };
                    //_start处已有图片，执行编辑
                    _this._addImage(addItem);
                    greedyint.dialog.unLock();
                }
            },
            onError: function (file, errorCode) {
                switch (errorCode) {
                    case "497":
                        //你无权进行该操作
                        // var msg = "无权操作";
                        // if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                        // else alert(msg);
                        toot.fireEvent(_this, "sessionOut");
                        break;
                    case "498":
                        //TODO 可能直接显示对话框了
                        // var msg = "会话超时，请重新登录";
                        // if (_this._msgBar) _this._msgBar.setMessage(msg, true);
                        // else alert(msg);
                        //  top.location.href = '/Account/SwitchIndex?tryCookie=true';
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

            zIndex: -5000
        };

        //上传图片
        this._ajaxImageUpload = new AjaxUpload(this._btnUnImage.getElement(), this.imageUploadAjax);
        this._ajaxImageUpload._createInput();

        this._currentImageInput = $(this._ajaxImageUpload._getCurrentInput());
        $(this._btnUnImage.getElement()).click(function () {
            _this._currentImageInput.click();

        })
        _this._currentImageInput = _this._ajaxImageUpload._input;
        this._init_render();
    },

    _onBtnDelAction: function () {
        if (this._player) this._player.stop();
        this._model = null;
        this._url = null;
        this._viewState = businesscomponents.editors.ViewState.Initial;
        this._renderViewState();
        toot.fireEvent(this, "change");


        //清空图片
        this._imgItems = [];
        this._audioId = 0;
        this._$unImage.hide();

        this._updateUiByImageDate();
    },
    _setupPlayer: function () {
        var _this = this;
        this._player = jwplayer(this._$ctnPlayer[0].id).setup({
            flashplayer: "/Scripts/libs/jwplayer/player.swf",
            width: '578',
            height: '30',
            provider: 'sound',
            file: this._url,
            skin: "/Scripts/libs/jwplayer/oneTestPlayer/oneTestPlayer.xml",
            controlbar: 'top',
            autostart: false
        });

        _this._player.onPlay(function () {
            _this._$unImage.hide();
            _this._ajaxImageUpload._setInputClass();
        });

        _this._player.onPause(function () {
            //暂停时去获取总长度
            _this._duration = _this._player.getDuration()
            _this._position = parseInt(_this._player.getPosition());
            _this._$unImage.show();
            _this._ajaxImageUpload._setInputClass();
        });
    },

    _stopBubble: function (e) {
        if (e && e.stopPropagation)
            e.stopPropagation()
        else
            window.event.cancelBubble = true
    },
    //重现绘制图片部分
    _updateUiByImageDate: function () {
        var _this = this;
        this._$imagePosition[0].innerHTML = "";
        this._$showImageConent[0].innerHTML = "";
        this._dataPositionList = this._getpositionByImage();
        this._iPosition = new businesscomponents.editors.audiowithimage.ImagePositionList(this._dataPositionList);
        this._iPosition.appendTo(this._$imagePosition[0]);

        this._imageList = new businesscomponents.editors.audiowithimage.ImageList(this._imgItems);
        this._imageList.appendTo(this._$showImageConent[0]);
        //绑定图片删除事件
        $(this._$showImageConent[0]).find('[gi~="imageDel"]').each(function (i) {
            $(this).click(function (e) {
                _this._imgItems.splice(i, 1);
                _this._updateUiByImageDate();
                //阻止冒泡，禁止触发上传事件
                _this._stopBubble(e);
            })
        })
        //定义鼠标滑过图片

        $(this._$showImageConent[0]).find('[gi~="imageHtml"]').each(function (i) {
            this._zIndexImage = -5000;
            //每张图片绑定编辑功能
            var currentImageDiv = new toot.ui.Button(this);
            var currentImage = new AjaxUpload(currentImageDiv.getElement(), _this.imageEditAjax);
            currentImage._createInput();
            var currentImageInput = $(currentImage._getCurrentInput());
            //如果通过点击隐藏input上传的话，图片上的删除按钮样式将被覆盖，上面将iuput属性z-index：-5000
            //通过点击图片来触发点击input事件
            $(this).click(function () {
                //将播放器进度与原有保持一致
                _this._position = _this._imgItems[i]._start;
                if (_this._position == 0) {
                    _this._position = -0.5;
                }
                currentImageInput.click();
            })

            $(this).mouseenter(function () {
                $($(_this._$imagePosition[0]).find('[gi~="imagePosition1"]')[i]).hide();
                $($(_this._$imagePosition[0]).find('[gi~="imagePosition2"]')[i]).show();
            })
            $(this).mouseleave(function () {
                $($(_this._$imagePosition[0]).find('[gi~="imagePosition1"]')[i]).show();
                $($(_this._$imagePosition[0]).find('[gi~="imagePosition2"]')[i]).hide();
            })
        })
    },

    _updateUiByAudioDate: function () {
        var _this = this;
        if (this._audioId) {
            _this._$unImage.show();
            this._viewState = businesscomponents.editors.ViewState.Edit;
            this._renderViewState();

            if (this._url) {
                this._setupPlayer();
                //音频上传静止状态无法获取，默认总长度为-1，后面上传图片时会计算;
                _this._duration = -1;
                //让光标停留在0位置，后面暂停上传时会改变值
                _this._position = -0.5;
            } else
                $.ajax({
                    url: "/Common/GetShortUrl?id=" + _this._audioId,
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    success: function (json) {
                        _this._url = json.url;
                        _this._setupPlayer();
                        //音频上传静止状态无法获取，默认总长度为-1，后面上传图片时会计算;
                        _this._duration = -1;
                        //让光标停留在0位置，后面暂停上传时会改变值
                        _this._position = -0.5;
                    }
                });

        } else {
            this._viewState = businesscomponents.editors.ViewState.Initial;
            this._renderViewState();
            this._$unImage.hide();
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

    //image数据集合转换成图标定位集合
    _getpositionByImage: function () {
        var arr = [];
        var _this = this;
        var data = this._imgItems;
        for (var i = 0, l = data.length; i < l; i++) {
            var position = data[i]._position;
            var time = _this._setTimeByPostion(data[i]._start);
            arr.push({ position: position, time: time });
        }
        return arr;
    },
    _setTimeByPostion: function (start) {
        var timeShow = '';
        if (start == 0) {
            timeShow = "00:00";
        }
        else {

            var second = Math.floor(start % 60);             // 计算秒     
            var minite = Math.floor((start / 60) % 60);      //计算分 
            if (minite < 10) {
                minite = "0" + minite;
            }
            if (second < 10) {
                second = "0" + second;
            }

            timeShow = minite + ":" + second;
        }
        return timeShow;
    },

    //添加图片
    _addImage: function (imageItem) {
        var _this = this;
        var _currentData = this._imgItems;
        //用来记录当前要插入的位置
        var addIndex = 0;
        var isReplace = false;
        for (var i = 0, l = _currentData.length; i < l; i++) {
            //如果添加图片比当前第一个_start还小，就加到第一个前面
            if (imageItem._start < _currentData[0]._start) {
                addIndex = -1;
                break;
            }
            if (imageItem._start == _currentData[i]._start) {
                addIndex = i;
                isReplace = true;
                break;
            }
            //取最接近该图片位置的索引
            if (imageItem._start > _currentData[i]._start) {
                addIndex = i;
            }

        }
        if (_currentData.length == 0) {
            _this._imgItems.splice(0, 0, imageItem);
        }
        else {
            if (isReplace)
                _this._imgItems.splice(addIndex, 1, imageItem);
            else
                _this._imgItems.splice(addIndex + 1, 0, imageItem);
        }
        this._updateUiByImageDate();
        //alert(this.getAudioId());
        //alert(this.getImgitems());
    },




    setModelAndUpdateUI: function (model) {
        if (this._model == model) return;
        businesscomponents.editors.audiowithimage.Audiowithimage.superClass.setModelAndUpdateUI.call(this, model);
    },
    updateUIByModel: function () {
        this._url = null;
        //绑定音频
        this._updateUiByAudioDate()
        //绑定图片
        this._updateUiByImageDate();
    },
    getInitialView: function () {
        return this._iv;
    },
    //开放给外面的数据接口
    getAudioId: function () { return this._audioId; },
    setAudioId: function (audioId) { this._audioId = audioId; },

    //[{"_start":151,"_fileId":306,"_src":"http://duji1test.oss.aliyuncs.com/Image/20130813164007-9b2ab.jpg","_position":"20%"}]
    getImgitems: function () { return this._imgItems },
    setImgitems: function (imgitems) {
        if (imgitems)
            this._imgItems = imgitems;
    },
    validate: function () {
        if (this._audioId)
            return true;
        else
            return false;
    },
    //由于不同浏览器jwplay宽度不一样，开放定位图标宽度，为以后做兼容
    setWidth: function (width) {
        if (width)
            this._width = width;
        this._$imagePosition.css("width", this._width);
    },

    getMsgBar: function () { return this._msgBar },
    setMsgBar: function (bar) { this._msgBar = bar },
    getInitialView: function () { return this._iv }
});

//音频和图片HTML
businesscomponents.editors.audiowithimage.Audiowithimage.html = '<div style="position:relative;">' +
    '<div gi="anchorInitialView"></div>' +
    '<div class="btnGroupOuter1 marT32" gi="editView">' +
    '<div class="PlayerNodeOuter" gi="showImagePosition"></div>' +
    '<div class="AudioBox" gi="ctnPlayer"></div>' +
    '<div class="btnGroup1 clearfix" gi="btnGroup1" >' +
    '<button class="btnDelete" title="删除" gi="btnDel"></button>' +
    '<button class="btnReplace" title="替换" gi="btnReplace"></button>' +
    '</div>' +
    '</div>' +

         '<div class="imgUploadGroup clearfix">' +
            '<div gi="showImageConent">' +
             '</div>' +
             '<div class="imgUploadbox1 NotfilledS2" gi="unImage">' +
                	'<span class="colorGray"><span class="font20">+</span>添加</span><span>听力图片</span><div class="colorGray textbox2" gi="lblPrompt"></div>' +
             '</div>' +
        '</div>';



//三角形图标List
businesscomponents.editors.audiowithimage.ImagePositionList = function (data) {
    businesscomponents.editors.audiowithimage.ImagePositionList.superClass.constructor.call(this, $(businesscomponents.editors.audiowithimage.ImagePositionList.html)[0]);
    this._$imagePositionList = $(this._element).find('[gi~="imagePositionList"]');
    this._data = data;
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.audiowithimage.ImagePositionList, toot.ui.Component);

toot.extendClass(businesscomponents.editors.audiowithimage.ImagePositionList, {
    //初始化图标
    _init: function () {
        this._updateUIByModel();
    },
    _updateUIByModel: function () {
        var _thisImagePositionList = this._$imagePositionList[0];
        //这个data为当前最新的data
        var _currentData = this._data;
        //每次更新时置空
        _thisImagePositionList.innerHTML = "";
        for (var i = 0, l = _currentData.length; i < l; i++) {
            var image = new businesscomponents.editors.audiowithimage.ImagePosition(_currentData[i].position, _currentData[i].time, i);
            image.appendTo(_thisImagePositionList);
        }
    }
});

businesscomponents.editors.audiowithimage.ImagePositionList.html = '<div><div gi="imagePositionList"></div></div>';








//三角形小图标定位
businesscomponents.editors.audiowithimage.ImagePosition = function (position, time, index) {

    businesscomponents.editors.audiowithimage.ImagePosition.superClass.constructor.call(this, $(businesscomponents.editors.audiowithimage.ImagePosition.html)[0]);

    //鼠标经过前
    this._$imagePosition1 = $(this._element).find('[gi~="imagePosition1"]');
    //鼠标经过后
    this._$imagePosition2 = $(this._element).find('[gi~="imagePosition2"]');
    this._$imagePositionTime = $(this._element).find('[gi~="imagePositionTime"]');

    //这个定位图标位置，为百分必
    this._position = position;
    //定位时间
    this._time = time;
    //图标索引
    this._index = index;
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.audiowithimage.ImagePosition, toot.ui.Component);
toot.extendClass(businesscomponents.editors.audiowithimage.ImagePosition, {
    _init: function () {
        var _this = this;
        _this._$imagePosition1.css("left", _this._position);
        _this._$imagePosition2.css("left", _this._position);
        this._$imagePositionTime.text(_this._time);

        _this._$imagePosition1.show();
        _this._$imagePosition2.hide();

        //鼠标已过小图标效果
        _this._$imagePosition1.bind("mouseenter", function () {
            _this._$imagePosition1.hide();
            _this._$imagePosition2.show();

        });
        _this._$imagePosition1.bind("mouseleave", function () {
            _this._$imagePosition1.show();
            _this._$imagePosition2.hide();
        });
        _this._$imagePosition2.bind("mouseenter", function () {
            _this._$imagePosition1.hide();
            _this._$imagePosition2.show();
        });
        _this._$imagePosition2.bind("mouseleave", function () {
            _this._$imagePosition1.show();
            _this._$imagePosition2.hide();
        });

    },
    mouseenterImage: function () {
        _this._$imagePosition1.hide();
        _this._$imagePosition2.show();
    }
});
businesscomponents.editors.audiowithimage.ImagePosition.html = '<div><div class="PlayerNodebox1" gi="imagePosition1"></div>' +
                                                                    '<div class="PlayerNodebox2" gi="imagePosition2">' +
                                                                         '<span class="timebox" gi="imagePositionTime"></span>' +
                                                                    '</div>' +
                                                               '</div>';








//图片组
businesscomponents.editors.audiowithimage.ImageList = function (dataImage) {
    businesscomponents.editors.audiowithimage.ImageList.superClass.constructor.call(this, $(businesscomponents.editors.audiowithimage.ImageList.html)[0]);
    this._$imageList = $(this._element).find('[gi~="ImageList"]');
    this._dataImage = dataImage;
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.audiowithimage.ImageList, toot.ui.Component);

toot.extendClass(businesscomponents.editors.audiowithimage.ImageList, {
    _init: function () {
        var _this = this;
        this._updateUIByModel();

    },
    _updateUIByModel: function () {
        var _this = this;
        var _imageList = _this._$imageList[0];
        var _currentData = this._dataImage;
        _imageList.innerHTML = "";
        for (var i = 0, l = _currentData.length; i < l; i++) {
            var image = new businesscomponents.editors.audiowithimage.Image(_currentData[i]._start, _currentData[i]._src, i);
            image.appendTo(_imageList);
        }
    }
});
businesscomponents.editors.audiowithimage.ImageList.html = '<div><div gi="ImageList"></div></div>';







//图片
businesscomponents.editors.audiowithimage.Image = function (start, url, index) {
    businesscomponents.editors.audiowithimage.Image.superClass.constructor.call(this, $(businesscomponents.editors.audiowithimage.Image.html)[0]);
    //图片的开始位置
    this._start = start;
    this._index = index;


    this._$img = $(this._element).find('[gi~="img"]');

    this._url = url;

    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.audiowithimage.Image, toot.ui.Component);

toot.extendClass(businesscomponents.editors.audiowithimage.Image, {
    _init: function () {
        if (this._url) {
            this._$img.attr("src", this._url);
        }
    },
    getIndex: function () {
        return this._index;
    }
});
businesscomponents.editors.audiowithimage.Image.html = '<div><div class="imgUploadbox2 closeBox" gi="imageHtml">' +
                	                                           '<img title="替换当前图片" gi="img" />' +
                                                               '<span class="closeItem" gi="imageDel"></span>' +
                                                        '</div></div>';

//内部使用
//ModelImagePosition = function () {
//    this.position = 0;
//    this.time = null;
//    this.index = -1;
//}

//businesscomponents.editors.ModelAudiowithimage = function () {
//    this.audioId = 0;
//    this.imgitems = null;
//}