var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};


businesscomponents.editors.PassageEditor = function (opt_html) {
    businesscomponents.editors.PassageEditor.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.PassageEditor.html)[0], businesscomponents.editors.TextInitialView.html2);
    this._iv.getLbl2().setText("阅读文章");
    this._btnPreview = new toot.ui.Button($('<button class="btnPreview2"></button>').get(0));
    this._btnConfirm = new toot.ui.Button($('<button class="btnSave1_3">保存</button>').get(0));
    this._btnDiv = $(this._element).find('[gi~="btnDiv"]')[0];
    this._uploadimage = $(this._element).find('[gi~="uploadimage"]')[0];

    //上传图片组件
    this._readingImage = new businesscomponents.editors.ReadingImage();

    this._readingImage.appendTo(this._uploadimage);

    this._btnPreview.appendTo(this._btnDiv);
    this._btnConfirm.appendTo(this._btnDiv);


    this._urlInfo = null;

    this._msgBar = null;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.PassageEditor, businesscomponents.editors.RichText);
toot.extendClass(businesscomponents.editors.PassageEditor, {
    _minHeight: 524,
    _renderMinHeight: function () {
        this._$rte[0].style.height = this._minHeight + "px";
        this._iv.setHeight(this._minHeight + 18);
    },

    _init_manageEvents: function () {
        businesscomponents.editors.PassageEditor.superClass._init_manageEvents.call(this);
        toot.connect(this._btnPreview, "action", this, this._onPreView);
    },
    _configFile: 'toeflreadingpassage',
    _onPreView: function () {
        //实例化ckeditor之后，才可预览
        //禁止多次上传
        var _this = this;
        this._btnPreview.setEnabled(false);
        var text = ""; //编辑文本
        if (this._rte) {
            text = this._rte.getData();
        }

        var imageId = this._readingImage.updateAndGetModelByUI();
        var orgid = this._urlInfo.orgId;
        var typeid = this._urlInfo.typeId;
        var url = '/Task/SavePassage';
        var data = {};
        var o = {};
        o.text = text;
        o.image = imageId;
        data.text = JSON.stringify(o);

        var ajax = {
            url: url,
            data: data,
            type: 'Post',
            dataType: 'json',
            cache: false,
            success: function (json) {
                greedyint.dialog2.openNewWindow('/Task/PassagePreview?orgid=' + orgid + '&typeid=' + typeid + '&id=' + json.id); 
                //恢复按钮
                _this._btnPreview.setEnabled(true);
            }
        };
        $.ajax(ajax);
        //        else {
        //            
        //            if (this._msgBar) {
        //                this._msgBar.setMessage("请输入文章", this._defaultMessageDuration);
        //            } else {
        //                alert("请输入文章");
        //            }
        //            return false;
        //        }


    },
    getBtnConfirm: function () { return this._btnConfirm; },
    getUrlInfo: function () { return this._urlInfo; },
    setUrlInfo: function (urlInfo) { this._urlInfo = urlInfo; },
    //提供注入错误消息框控件
    getMsgBar: function () { return this._msgBar },
    setMsgBar: function (bar) { this._msgBar = bar },
    //暴露给托福阅读上传图片 
    getUploadImage: function () { return this._uploadimage; },
    getReadingImage: function () { return this._readingImage; }
});
//修改了宽度：原来为820px by xp
businesscomponents.editors.PassageEditor.html = '<div class="Popupbox taskEditArticlePop">' +
                                                  '<div gi="anchorInitialView"></div>' +
                                                  '<div class="marB10 RichTextEditor copyScroll" style="width:800px;" gi="rte"></div>' +
                                               '</div>';


businesscomponents.editors.PassageEditor.html2 = '<div class="Popupbox taskEditArticlePop">' +
                                                  '<div gi="anchorInitialView"></div>' +
                                                  '<div class="marB10 RichTextEditor copyScroll" style="width:800px; height:540px;overflow-y:scroll;" gi="rte"></div>' +
                                                  '<div class="taskEditArticlebtnbox clearfix">' +
                                                  '<div class="fl" gi="uploadimage">' +

                                                    '</div>' +
                                                    '<div class="fr" gi="btnDiv">' +
                                                    '</div>' +
                                                  '</div>' +
                                               '</div>';

businesscomponents.editors.PassageEditorEntrance = function (opt_html) {
    businesscomponents.editors.PassageEditorEntrance.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.PassageEditorEntrance.html)[0]);
    this._$p1 = $(this._element).find('[gi~="p1"]');
    this._$p2 = $(this._element).find('[gi~="p2"]');
    this._btnEdit = new toot.ui.Button($(this._element).find('[gi~="btnEdit"]')[0]);
    this._btnCancel = new toot.ui.Button($(this._element).find('[gi~="btnCancel"]')[0]);
    this._btnConfirm = new toot.ui.Button($(this._element).find('[gi~="btnConfirm"]')[0]);

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.PassageEditorEntrance, toot.ui.Component);
toot.extendClass(businesscomponents.editors.PassageEditorEntrance, {

    _init_manageEvents: function () {
        businesscomponents.editors.PassageEditorEntrance.superClass._init_manageEvents.call(this);
        toot.connect(this._btnEdit, "action", this, this._onBtnEditAction);
        toot.connect([this._btnCancel, this._btnConfirm], "action", this, this._onBtnConfirmCancelAction);
    },

    _init_render: function () {
        businesscomponents.editors.PassageEditorEntrance.superClass._init_render.call(this);
        this._$p1.show();
        this._$p2.hide();
    },
    _onBtnEditAction: function () {
        this._$p1.hide();
        this._$p2.show();
    },
    _onBtnConfirmCancelAction: function () {
        this._$p1.show();
        this._$p2.hide();
    },
    getBtnEdit: function () {
        return this._btnEdit;
    },

    getBtnConfirm: function () { return this._btnConfirm; }
});
businesscomponents.editors.PassageEditorEntrance.html =
                            '<div class="taskTipsTopBox">' +
                                    '<div style="display:block;" gi="p1"><button class="btn4Edit" gi="btnEdit">编辑文章</button></div>' +
                                    '<div class="TipsConfirmbox" gi="p2">' +
                                        '<em class="TipsIco"></em>编辑文章将清空所有题目在文章中的标记位置，确认重新编辑？' +
                                        '<button class="btn4Back" gi="btnCancel">取消</button>' +
                                        '<button class="btn4Next2" gi="btnConfirm">确认</button>' +
                                    '</div>' +
                             '</div>';
//sat语法使用html
businesscomponents.editors.PassageEditorEntrance.sathtml =
                            '<div class="taskSatEditBtnbox">' +
                                    '<div style="display:block;" gi="p1"><button class="btn4Edit" gi="btnEdit">编辑题干</button></div>' +
                                    '<div class="TipsConfirmbox" gi="p2">' +
                                        '<em class="TipsIco"></em>编辑题干将清空题目在题干中的标记位置，确认重新编辑？' +
                                        '<button class="btn4Back" gi="btnCancel">取消</button> ' +
                                        '<button class="btn4Next2" gi="btnConfirm">确认</button>' +
                                    '</div>' +
                             '</div>';