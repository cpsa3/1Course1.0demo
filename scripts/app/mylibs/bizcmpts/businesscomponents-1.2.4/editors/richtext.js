var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.RichText = function (opt_html, opt_html_initialview) {
    businesscomponents.editors.RichText.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.RichText.html)[0]);

    this._iv = new businesscomponents.editors.TextInitialView(opt_html_initialview);
    this._iv.setHeight(this._minHeight);
    this._iv.replaceTo($(this._element).find('[gi~="anchorInitialView"]')[0]);

    this._$rte = $(this._element).find('[gi~="rte"]');
    this._$rte[0].contentEditable = true;
    //        this._$rte[0].style.minHeight = this._minHeight + "px";
    //        this._$rte[0].style.padding = this._padding + "px";
    this._$rte[0].style.overflowY = "auto";
    this._$rte.hide();
    this._rte = null;
    //编辑器是否触发过粘贴事件
    //    this._ckeditorPasteState = false;
    //    this._ckeditorData = "";
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.RichText, businesscomponents.editors.SwitchableView);
toot.extendClass(businesscomponents.editors.RichText, {
    _init_manageEvents: function () {
        businesscomponents.editors.RichText.superClass._init_manageEvents.call(this);

        var _this = this;
        toot.connect(this._iv, "click", this, function () {
            this._viewState = businesscomponents.editors.ViewState.Edit;
            this._renderViewState();
            this._rte.focus();

            this._rte.on("instanceReady", function () {
                //                _this._rte.filter.allowedContent.pop();
                // 测试是否在ckeditor实例化更改filter 失败 by xp 2014年2月12日 18:53:03
                //                _this._rte.filter.allow("img(!align)", "image");
                //                _this._rte.filter.allowedContent[_this._rte.filter.allowedContent.length - 1].requiredAttributes.pan = true;
                ////                _this._rte.filter.allowedContent[_this._rte.filter.allowedContent.length - 1].requiredClasses.pan = true;
                //                _this._rte.filter.allowedContent[_this._rte.filter.allowedContent.length - 1].attributes.pan = true;
                _this._rte.focus();
            });
        });
    },

    _render: function () {
        businesscomponents.editors.RichText.superClass._render.call(this);
        this._renderMinHeight();
        this._renderPadding();
    },

    _minHeight: 50,
    _padding: 10,
    _configFile: '/content3/Scripts/ckeditorconfigs/_this.config.js',
    _attachCKFinder: false,

    getMinHeight: function () {
        return this._minHeight;
    },
    setMinHeight: function (minHeight) {
        this._minHeight = minHeight;
        this._renderMinHeight();
    },
    _renderMinHeight: function () {
        this._$rte[0].style.minHeight = this._minHeight + "px";
        this._iv.setHeight(this._minHeight + 18);
    },

    getPadding: function () {
        return this._padding;
    },
    setPadding: function (padding) {
        this._padding = padding;

        if (!this._initialized) return;
        this._renderPadding();
    },
    _renderPadding: function () {
        this._$rte[0].style.padding = this._padding + "px";
    },

    getConfigFile: function () {
        return this._configFile;
    },
    setConfigFile: function (configFile) {
        this._configFile = configFile;
    },
    isAttachCKFinder: function () {
        return this._attachCKFinder;
    },
    setAttachCKFinder: function (attach) {
        this._attachCKFinder = attach;
    },

    getInitialView: function () {
        return this._iv;
    },

    updateUIByModel: function () {
        if (this._model) {
            this._viewState = businesscomponents.editors.ViewState.Edit;
            this._renderViewState();
            this._rte.setData(this._model);
        } else {
            this._viewState = businesscomponents.editors.ViewState.Initial;
            this._renderViewState();
            if (this._rte) this._rte.setData(null);
        }
    },
    updateModelByUI: function () {
        if (this._viewState == businesscomponents.editors.ViewState.Initial) this._model = null;
        else if (this._viewState == businesscomponents.editors.ViewState.Edit) this._model = this._rte.getData();
    },
    _renderViewState: function () {
        var _this = this;

        if (this._viewState == businesscomponents.editors.ViewState.Initial) {
            this._iv.setVisible(true);
            this._$rte.hide();

        } else if (this._viewState == businesscomponents.editors.ViewState.Edit) {
            this._iv.setVisible(false);
            this._$rte.show();
            if (!this._rte) this._setupRTE();
        }
    },
    //cutFilePath 
    _cutFileName: function (filePath) {
        return filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
    },
    _setupRTE: function () {

        var _this = this;
        //We need to turn off the automatic editor creation first
        //CKEDITOR.disableAutoInline = true;
        //        this._rte = CKEDITOR.inline(this._$rte[0], { customConfig: this._configFile });
        //fix Ie8 ckeditor load
        var element = CKEDITOR.dom.element.get(this._$rte[0]);
        if (element.getEditor())
            element.getEditor().destroy();

        if (this._cutFileName(this.getConfigFile()) == "fillquestion")
            this._rte = CKEDITOR.inline(this._$rte[0], { extraAllowedContent: "input{*}[*](*)" });
        else
            this._rte = CKEDITOR.inline(this._$rte[0]);

        //延迟加载config,修改多config时加载出现错误的bug,待优化
        this._rte.on('configLoaded', function () {
            if (_this._cutFileName(_this.getConfigFile()) == "fillquestion") {
                _this._rte.config.toolbar = [
                        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
                // 汤一说去掉两端对齐 如需还原，请去掉注释 by xp 2014年2月12日 15:30:38
                //                    { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
                        {name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
                        { name: 'styles', items: ['FontSize'] },
                        { name: 'insert', items: ['Table', 'Image', 'InsertFill'] },
                        { name: 'insertgroup', items: ['InsertFillGroup', 'GroupFinish'] }
                //    { name: 'fillquestion', items: ['InsertFill'] }
                    ];
            }


            if (_this._cutFileName(_this.getConfigFile()) == "choicequestion") {
                _this._rte.config.toolbar = [
                        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
                        { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
                        { name: 'styles', items: ['Font', 'FontSize'] }
                //    { name: 'fillquestion', items: ['InsertFill'] }
                    ];
            }
            if (_this._cutFileName(_this.getConfigFile()) == "imageupload") {
                _this._rte.config.toolbar = [
                        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
                        { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
                        { name: 'styles', items: ['Font', 'FontSize'] },
                        { name: 'insert', items: ['Table', 'Image'] }
                    ];
            }
            if (_this._cutFileName(_this.getConfigFile()) == "explanation") {
                _this._rte.config.toolbar = [
                        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
                        { name: 'styles', items: ['Font', 'FontSize'] }
                //    { name: 'fillquestion', items: ['InsertFill'] }
                    ];
            }
            if (_this._cutFileName(_this.getConfigFile()) == "topic") {
                _this._rte.config.toolbar = [
                        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
                        { name: 'styles', items: ['Font', 'FontSize'] }
                //    { name: 'fillquestion', items: ['InsertFill'] }
                    ];

            }

            if (_this._cutFileName(_this.getConfigFile()) == "topic_v2") {
                _this._rte.config.toolbar = [
                        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
                        { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
                        { name: 'styles', items: ['Font', 'FontSize'] }
                //    { name: 'fillquestion', items: ['InsertFill'] }
                    ];
            }
            // 雅思阅读&听力 选择题题干 可以添加图片
            if (_this._cutFileName(_this.getConfigFile()) == "imageTopic") {
                _this._rte.config.toolbar = [
                        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
                        { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
                        { name: 'styles', items: ['Font', 'FontSize'] },
                        { name: 'insert', items: ['Image'] }
                //    { name: 'fillquestion', items: ['InsertFill'] }
                    ];
            }
            //托福阅读文章
            if (_this.getConfigFile() == "toeflreadingpassage") {
                _this._rte.config.toolbar = [
                        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
                // 汤一说去掉两端对齐 如需还原，请去掉注释 by xp 2014年2月12日 15:30:38
                //  { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
                        {name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
                        { name: 'styles', items: ['Font', 'FontSize'] }
                    ];
            }

            if (_this._cutFileName(_this.getConfigFile()) == "translation") {
                _this._rte.config.toolbar = [
                        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
                        { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
                        { name: 'styles', items: ['Font', 'FontSize'] },
                        { name: 'insert', items: ['Table'] }
                    ];
            }
        }
        );


        // 在ckeditor实例创建时，附加创建messagebar
        this._rte.on("loaded", function (evt) {
            //创造messagebar实例，在跟richtext同一个生命周期
            if (!evt.editor.msgBar) {
                evt.editor.msgBar = new businesscomponents.MessageBar();
                evt.editor.msgBar.setZIndex(20000);
                evt.editor.msgBar.setVisible(false);
                evt.editor.msgBar.setMsgDuration(3000);
                //添加DOM至body
                evt.editor.msgBar.appendTo(window.document.body);
            }
        });

        // 在销毁ckeditor时，清除一些自定义实例
        this._rte.on("destroy", function (evt) {
            if (evt.editor.msgBar) {
                evt.editor.msgBar.removeFromParent();
                evt.editor.msgBar = null;
            }
        });
        //暂时移除Ckfinder by xp 2014年2月16日 19:43:28
        //        if (this._attachCKFinder) CKFinder.setupCKEditor(this._rte, '/content3/Scripts/ckfinder/');
        this._rte.on("blur", function () {

            if (!_this._rte.getData()) {
                _this._viewState = businesscomponents.editors.ViewState.Initial;
                //销毁
                _this._rte.destroy();
                _this._rte = null;
                _this._renderViewState();
            }
            //改掉添加图片失去焦点的bug
            if (_this._rte) {
                if (_this._rte.getData() == '<p><input type="hidden" /></p>') {
                    _this._rte.setData("");
                }
            }
        });
        this._rte.on("focus", function () {
            if (_this._cutFileName(_this.getConfigFile()) == "fillquestion") {
                if (_this._rte.commands.InsertFill.state != CKEDITOR.TRISTATE_DISABLED) {
                    _this._rte.commands.GroupFinish.setState(CKEDITOR.TRISTATE_DISABLED);
                }
            }
        });
        // 禁止粘贴图片 监控粘贴事件 自定义过滤 将src中有file开头的img节点干掉  
        this._rte.on("paste", function (evt) {
            var filter = new CKEDITOR.htmlParser.filter({
                elements: {
                    img: function (element) {
                        //匹配规则待增加
                        //                        if (element.attributes.src.substr(0, 4) == "file") {
                        //                        if (element.attributes.src.substr(0, 8) != "ckfinder") {
                        //                            element.remove();
                        //                        }
                        //匹配规则：只允许使用ckfinder上传图片粘贴
                        //                        if (!element.attributes.hasOwnProperty("data-cke-saved-src")) {
                        //                            element.remove();
                        //                        }
                        //ckeditor 不支持任何图片粘贴 包括自己上传的。T_T
                        element.replaceWith(new CKEDITOR.htmlParser.element('span'));
                        //这种方式过滤，连续element会少过滤
                        //                        element.remove();
                    }
                },
                attributes: {
                    group: function (value, element) {
                        // 填空题组禁止粘贴
                        element.replaceWith(new CKEDITOR.htmlParser.element('span'));
                    }
                }
            });
            var fragment = CKEDITOR.htmlParser.fragment.fromHtml(evt.data.dataValue),
                writer = new CKEDITOR.htmlParser.basicWriter();

            filter.applyTo(fragment);

            fragment.writeHtml(writer);

            evt.editor.insertHtml(writer.getHtml());

            //停止向上冒泡
            evt.stop();
        });


        // 点击图片按钮，直接跳转到文件选择
        /**
        this._rte.on('dialogShow', function(ev) {
        console.log(1);
        //            var dialogName = ev.data.name;
        var dialogDefinition = ev.data.definition;
        var tEv = ev;
        var timeId = 0;
        if (ev.data.hasOwnProperty("imageEditMode")) {
        //                dialogDefinition.onShow = function () {
        //                    // 跳转到上传页面
        //                    this.selectPage('Upload');
        //                    this.stop();+
        //                };
        ev.data.selectPage("Upload");
        //                dialogDefinition.onFocus = function() {
        //
        //                    var fileInput = this.getContentElement("Upload", "upload");
        //                    fileInput.select();
        ////                    fileInput.getInputElement().$.click();
        //                };
        clearTimeout(timeId);

        //延迟方法也未能解决 自定义点击  -》跟管道模型有关
        timeId = setTimeout(function () {
        tEv.data.getContentElement("Upload", "upload").getInputElement().focus(500);
        tEv.data.getContentElement("Upload", "upload").getInputElement().$.click();
        tEv.stop();
        }, 200);

        //                ev.data._.contents["Upload"]["uploadButton"].click("uploadButton");
        //                
        //                ev.data._.contents["Upload"]["upload"].getInputElement().focus(500);
        //                //                ev.data._.contents["Upload"]["upload"].fire("click");
        //                tEv.data._.contents["Upload"]["upload"].getInputElement().$.click();
        //                ev.stop();
        }

        });
        */


        // 点击图片按钮，直接跳转到文件选择 v2 by xp
        CKEDITOR.on("dialogDefinition", function (ev) {
            var dialogName = ev.data.name;
            var dialogDefinition = ev.data.definition;


            if (dialogName == "image") {
                dialogDefinition.onFocus = function () {
                    //重置弹窗大小
                    //                    this.resize(300, 150);
                    //图片上传起始页设为，upload ——>
                    if (!this.imageEditMode) {
                        this.selectPage("Upload");
                    }
                    //TODO 禁用image控件不必要项 tlab需求 图片上传控件重构 by xp 2014年3月19日 16:27:05
                    //                    console.log(1);
                    //                    basic: CKEDITOR.ui.dialog.vbox
                    //                    browse: CKEDITOR.plugins.add.onLoad.CKEDITOR.tools.extend.button
                    //                    cmbAlign: CKEDITOR.plugins.add.onLoad.CKEDITOR.tools.extend.select
                    //                    htmlPreview: CKEDITOR.plugins.add.onLoad.CKEDITOR.tools.extend.html
                    //                    ratioLock: CKEDITOR.plugins.add.onLoad.CKEDITOR.tools.extend.html
                    //                    txtAlt: CKEDITOR.plugins.add.onLoad.CKEDITOR.tools.extend.textInput
                    //                    txtBorder: CKEDITOR.plugins.add.onLoad.CKEDITOR.tools.extend.textInput
                    //                    txtHSpace: CKEDITOR.plugins.add.onLoad.CKEDITOR.tools.extend.textInput
                    //                    txtHeight: CKEDITOR.plugins.add.onLoad.CKEDITOR.tools.extend.textInput
                    //                    txtUrl: CKEDITOR.plugins.add.onLoad.CKEDITOR.tools.extend.textInput
                    //                    txtVSpace: CKEDITOR.plugins.add.onLoad.CKEDITOR.tools.extend.textInput
                    //                    txtWidth: CKEDITOR.plugins.add.onLoad.CKEDITOR.tools.extend.textInput

                    //
                    //                    this.getContentElement("info", "basic").getElement().hide();

                    //                    this.getContentElement("info", "browse").getElement().hide();
                    //                    //对齐方式
                    //                    this.getContentElement("info", "cmbAlign").getElement().hide();
                    //                    //预览
                    //                    this.getContentElement("info", "htmlPreview").getElement().hide();
                    //                    //高宽锁定
                    //                    this.getContentElement("info", "ratioLock").getElement().hide();
                    //                    //替换文本
                    //                    this.getContentElement("info", "txtAlt").getElement().hide();
                    //                    //边框大小
                    //                    this.getContentElement("info", "txtBorder").getElement().hide();
                    //                    //水平间距
                    //                    this.getContentElement("info", "txtHSpace").getElement().hide();
                    //                    //高度
                    //                    //                    this.getContentElement("info", "txtHeight").getElement().hide();
                    //                    //图片URL
                    //                    this.getContentElement("info", "txtUrl").getElement().hide();
                    //                    //垂直间距
                    //                    this.getContentElement("info", "txtVSpace").getElement().hide();
                    //宽度
                    //                    this.getContentElement("info", "txtWidth").getElement().hide();

                    //                    var fileInput = this.getContentElement("Upload", "upload");

                    //                    var fileInput = this.getContentElement("Upload", "upload");
                    //不给力，功能偶现
                    //                    fileInput.getInputElement().$.click();
                };
            };

            if (dialogName == "textfield") {
                dialogDefinition.onFocus = function () {

                    //                    _cke_saved_name: CKEDITOR.tools.extend.textInput
                    //                    maxLength: CKEDITOR.tools.extend.textInput
                    //                    size: CKEDITOR.tools.extend.textInput
                    //                    type: CKEDITOR.tools.extend.select
                    //                    undefined: CKEDITOR.ui.dialog.hbox
                    //                    value: CKEDITOR.tools.extend.textInput
                    //名称
                    //                    this.getContentElement("info", "_cke_saved_name").getElement().hide();
                    //最多字符数
                    this.getContentElement("info", "maxLength").getElement().hide();
                    //字符宽度
                    this.getContentElement("info", "size").getElement().hide();
                    //类型
                    this.getContentElement("info", "type").getElement().hide();

                    //初始值
                    //                    this.getContentElement("info", "value").getElement().hide();

                };

            }
        });

        //        this._rte.on("afterCommandExec", function (evt) {
        //                       
        //           // evt.data.command.setState(CKEDITOR.TRISTATE_DISABLED);
        //        });

        // 禁止粘贴图片 当内容发生改变时，自定义过滤 将src中有file开头的img节点干掉  行不通 导致了无效循环，内存泄漏
        //        this._rte.on("change", function () {
        ////            if ((!_this._ckeditorData)||(_this._ckeditorPasteState&&_this._ckeditorData!=_this._rte.getData())) {
        //            if (_this._ckeditorData!=_this._rte.getData()) {
        //                var filter = new CKEDITOR.htmlParser.filter({
        //                    elements: {
        //                        img: function(element) {
        //                            //匹配规则待增加
        //                            if (element.attributes.src.substr(0, 4) == "file") {
        //                                element.remove();
        //                            }
        //                        }
        //                    }
        //                });
        //
        //                var fragment = CKEDITOR.htmlParser.fragment.fromHtml(_this._rte.getData()),
        //                    writer = new CKEDITOR.htmlParser.basicWriter();
        //                filter.applyTo(fragment);
        //                fragment.writeHtml(writer);
        //                _this._rte.setData("");
        //                _this._rte.insertHtml(writer.getHtml());
        //
        //                _this._ckeditorData = _this._rte.getData();
        //
        ////                _this._ckeditorPasteState = false;
        //            }
        //        });
    }
});

businesscomponents.editors.RichText.html =
    '<div>' +
    '<div gi="anchorInitialView"></div>' +
    '<div class="marB10 RichTextEditor" gi="rte"></div>' +
    '</div>';

businesscomponents.editors.RichText.sathtml =
    '<div>' +
    '<div gi="anchorInitialView"></div>' +
    '<div class="taskInsertSentenceBox copyScroll taskSatBoxPatch MarkboxStyle" gi="rte" style="height:120px;" ></div>' +
    '</div>';
