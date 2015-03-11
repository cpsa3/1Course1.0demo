var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.RichTextMarkerLikeDisplayer = function (opt_html) {
    businesscomponents.editors.RichTextMarkerLikeDisplayer.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.RichTextMarkerLikeDisplayer.html)[0]);

    var $findBase = $('<div></div>').append(this._element);
    this._$rte = $findBase.find('[gi~="rte"]');
    this._rte = null;
    this.removeFromParent();
    this._text = "";

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.RichTextMarkerLikeDisplayer, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.RichTextMarkerLikeDisplayer, {
    initializeEditor: function () {
        var _this = this;
        this._rte = CKEDITOR.inline(this._$rte[0], { removePlugins: 'toolbar', allowedContent: true });
        this._rte.on("instanceReady", function () {
            _this._rte.setReadOnly();
            //            _this._rte.setData(_this._text);
        });
    },

    getText: function () {
        return this._text;
    },
    setText: function (text) {
        this._text = text;
        this._renderText();
    },
    _renderText: function () {
        if (this._rte) this._rte.setData(this._text);
    },

    getRTE: function () { return this._rte; }
});
businesscomponents.editors.RichTextMarkerLikeDisplayer.html = '<div style="position:relative"><div class="taskInsertSentenceBox copyScroll" gi="rte"></div></div>';
//用于sat语法
businesscomponents.editors.RichTextMarkerLikeDisplayer.sathtml = '<div style="position:relative"><div class="taskInsertSentenceBox copyScroll taskSatBoxPatch MarkboxStyle" style="height:120px;" gi="rte"></div></div>';

businesscomponents.editors.ParagraphButtonHtml = '<button class="btnTagsTo"></button>';
businesscomponents.editors.MarkButtonHtml = '<button class="btnTagsAdd"></button>';
businesscomponents.editors.UnmarkButtonHtml = '<button class="btnTagsDel"></button>';


businesscomponents.editors.RichTextMarkerBase = function (opt_html) {
    businesscomponents.editors.RichTextMarkerBase.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.RichTextMarkerBase.html)[0]);

    var $findBase = $('<div></div>').append(this._element);
    this._$rte = $findBase.find('[gi~="rte"]');
    this._rte = null;
    this.removeFromParent();
    this._text = "";
    this._content = "";
    this._btnParagraph = new toot.ui.Button($(businesscomponents.editors.ParagraphButtonHtml)[0]);
    this._btnParagraph.setEnabledStyleConfig({ "disabled": "btnTagsTo btnTagsToDis", "enabled": "btnTagsTo" });
    this._btnParagraph.getElement().style.position = "absolute";
    this._btnParagraph.getElement().style.top = "0px";
    this._btnParagraph.getElement().style.right = "-40px";
    this._btnParagraph.appendTo(this._element);
    this._btnMark = new toot.ui.Button($(businesscomponents.editors.MarkButtonHtml)[0]);
    this._btnMark.setEnabledStyleConfig({ "disabled": "btnTagsAdd btnTagsAddDis", "enabled": "btnTagsAdd" });
    this._btnMark.getElement().style.position = "absolute";
    this._btnMark.getElement().style.top = "40px";
    this._btnMark.getElement().style.right = "-40px";
    this._btnMark.appendTo(this._element);
    this._btnUnmark = new toot.ui.Button($(businesscomponents.editors.UnmarkButtonHtml)[0]);
    this._btnUnmark.setEnabledStyleConfig({ "disabled": "btnTagsDel btnTagsDelDis", "enabled": "btnTagsDel" });
    this._btnUnmark.getElement().style.position = "absolute";
    this._btnUnmark.getElement().style.top = "80px";
    this._btnUnmark.getElement().style.right = "-40px";
    this._btnUnmark.appendTo(this._element);

    this_msgBar = null;

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.RichTextMarkerBase, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.RichTextMarkerBase, {
    initializeEditor: function () {
        var _this = this;
        this._rte = CKEDITOR.inline(this._$rte[0], { removePlugins: 'toolbar', menu_groups: '', allowedContent: true });
        this._rte.on("instanceReady", function () {
            _this._rte.setReadOnly(false);
            //            _this._rte.setData(_this._text);
        });
        _this._rte.on("key", function () {
            if (_this._content != _this._rte.getData()) {
                _this._rte.setData(_this._content);
            }
            return false;
        });
    },

    _init_manageEvents: function () {
        businesscomponents.editors.RichTextMarkerBase.superClass._init_manageEvents.call(this);
        toot.connect(this._btnParagraph, "action", this, this._onBtnParagraphAction);
        toot.connect(this._btnMark, "action", this, this._onBtnMarkAction);
        toot.connect(this._btnUnmark, "action", this, this._onBtnUnmarkAction);
    },

    _init_render: function () {
        businesscomponents.editors.RichTextMarkerBase.superClass._init_manageEvents.call(this);
        this._btnParagraph.setEnabled(false);
        this._btnParagraph.setVisible(false);
        this._btnMark.setEnabled(false);
        this._btnUnmark.setEnabled(false);
    },

    updateAndGetModelByUI: function () {
        return this._model;
    },
    _onBtnParagraphAction: function () {
    },
    _onBtnMarkAction: function () {
    },
    _onBtnUnmarkAction: function () {
    },

    getText: function () {
        return this._text;
    },
    setText: function (text) {
        this._text = text;
        this._content = text;
        this._renderText();
    },
    _renderText: function () {
        if (this._rte) this._rte.setData(this._text);
    },
    getBtnParagraph: function () { return this._btnParagraph; },
    getBtnMark: function () { return this._btnMark; },
    getBtnUnmark: function () { return this._btnUnmark; },

    getMsgBar: function () { return this._msgBar; },
    setMsgBar: function (bar) { this._msgBar = bar; },
    _confirm: function (msg, yes, no) {
        greedyint.dialog.confirm(msg, yes, no, null, null, null, null, 90000);
    }
});
businesscomponents.editors.RichTextMarkerBase.html = '<div style="position:relative"><div class="taskInsertSentenceBox copyScroll " style="ime-mode:disabled" gi="rte"></div></div>';


businesscomponents.editors.RichTextLocationMarker = function () {
    businesscomponents.editors.RichTextLocationMarker.superClass.constructor.call(this);

    //段落标示为1，其他标示为2。两个同时点亮的为0
    this._state = 0;

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.RichTextLocationMarker, businesscomponents.editors.RichTextMarkerBase);
toot.extendClass(businesscomponents.editors.RichTextLocationMarker, {
    _mouseDownOnEditor: false,
    _markEnable: false,
    initializeEditor: function () {
        businesscomponents.editors.RichTextLocationMarker.superClass.initializeEditor.call(this);
        var _this = this;
        this._btnParagraph.setVisible(true);
        $(_this._rte.element.$).bind("mousedown", function () {
            _this._mouseDownOnEditor = true;
        });
        //        $(document).bind("mousedown", function (e) {
        //            if (e.target.parentElement == _this._rte.element.$ || e.target == _this._rte.element.$) {
        //                //                if (e.target.className == "btnTagsAdd") {
        //                //                    _this._markEnable = true;
        //                //                }
        //                //                _this._mouseDownOnEditor = false;
        //                //                _this._btnMark.setEnabled(false);
        //                _this._mouseDownOnEditor = true;
        //            }
        //            else {

        //            }


        //        });
        $(document).bind("mouseup", function (e) {
            var selection = _this._rte.getSelection();

            if (_this._mouseDownOnEditor) {
                //没有选择或者选择了空行
                if (selection && selection.getSelectedText() == "" || selection.getSelectedText() == "\n") {

                    _this._btnMark.setEnabled(false);
                    _this._btnParagraph.setEnabled(false);
                }
                else {
                    if (_this._state == 2) {
                        _this._btnMark.setEnabled(true);
                    }
                    if (_this._state == 1) {
                        _this._btnParagraph.setEnabled(true);
                    }
                    if (_this._state == 3) {
                        _this._btnParagraph.setEnabled(true);
                        _this._btnMark.setEnabled(true);
                    }
                }
            }
            else {
                if (e.target.className == "btnTagsAdd") {
                    if (selection && selection.getSelectedText() != "") {
                        _this._btnMark.setEnabled(true);
                    }

                }
                else {
                    _this._btnMark.setEnabled(false);
                }

                if (e.target.className == "btnTagsTo") {
                    if (selection && selection.getSelectedText() != "") {
                        _this._btnParagraph.setEnabled(true);
                    }

                }
                else {
                    _this._btnParagraph.setEnabled(false);
                }
            }
            _this._mouseDownOnEditor = false;
        });

    },
    _hasData: false,
    updateUIByModel: function () {
        var _this = this;
        if (!this._rte) return;
        if (this._model) {
            var strMarkedStart = '<font style="background-color:#d5d2d6;">';
            var strMarkedEnd = '</font>';
            var content = this._text;
            for (var i = this._model.length - 1; i >= 0; i--) {
                content = content.substr(0, this._model[i].getEnd()) + strMarkedEnd + content.substr(this._model[i].getEnd());
                content = content.substr(0, this._model[i].getStart()) + strMarkedStart + content.substr(this._model[i].getStart());
            }
            this._rte.setData(content);
            this._content = content;
            this._btnUnmark.setEnabled(true);
            //            $(_this._btnUnmark.getElement()).removeClass("btnTagsDel btnTagsDelDis");
            //            $(_this._btnUnmark.getElement()).addClass("btnTagsDel");
        } else {
            this._rte.setData(this._text);
            this._content = this._text;
            this._btnUnmark.setEnabled(false);
            //            $(_this._btnUnmark.getElement()).removeClass("btnTagsDel");
            //            $(_this._btnUnmark.getElement()).addClass("btnTagsDel btnTagsDelDis");
        }
    },

    updateModelByUI: function () {
        var strMarkedStart = '<font style="background-color:#d5d2d6;">';
        var strMarkedEnd = '</font>';

        var content = this._rte.getData();
        this._content = content;
        var idxStart, idxEnd;
        var positionList = [];
        while ((idxStart = content.indexOf(strMarkedStart)) != -1) {
            content = content.substr(0, idxStart) + content.substr(idxStart + 40);
            idxEnd = content.indexOf(strMarkedEnd, idxStart);
            if (idxEnd == -1) continue;
            content = content.substr(0, idxEnd) + content.substr(idxEnd + 7);
            positionList.push({ start: idxStart, end: idxEnd });
        }
        var locations = [];
        if (positionList.length > 0) {
            for (var i = 0; i <= positionList.length - 1; i++) {

                var location = new models.components.choicequestionwithlocation.Location();
                location.setStart(positionList[i].start);
                location.setEnd(positionList[i].end);
                locations.push(location);
            }
            this._model = locations;
        } else
            this._model = null;
    },

    _onBtnParagraphAction: function () {
        var _this = this;
        var r = this.mark();
        //1代表标示段落
        this._state = 1;
        this.updateModelByUI();
        if (this._model) {
            this._btnParagraph.setEnabled(false);
            this._btnMark.setEnabled(false);
            this._btnUnmark.setEnabled(true);
            toot.fireEvent(this, "change");
        }
    },

    _onBtnMarkAction: function () {
        var _this = this;
        var r = this.mark();
        //2代表不是段落
        this._state = 2;
        this.updateModelByUI(0);
        if (this._model) {
            this._btnParagraph.setEnabled(false);
            this._btnMark.setEnabled(false);
            this._btnUnmark.setEnabled(true);
            toot.fireEvent(this, "change");
        }
    },

    _onBtnUnmarkAction: function () {
        var _this = this;
        _this._confirm(StatusMessage[2121], function () {
            _this._model = null;
            _this.updateUIByModel();
            _this._state = 3;
            toot.fireEvent(_this, "change");
        });


    },

    mark: function () {
        var _this = this;
        var selection = this._rte.getSelection();
        if (selection.getSelectedText() == "") {
            return false;
        }
        var editor = this._rte;
        var dataOld = editor.getData();
        var range = selection.getRanges()[0];
        //方案一，通过逻辑进行判断
        //        console.log("末尾：" +range.endContainer.$.parentElement.localName);
        //        console.log("开始："+range.startContainer.$.parentElement.localName);
        //        if (range.startContainer.$.localName == "font") {
        //            //            if (range.startContainer.getNext().$.localName == "font") {
        //            alert("已被标记");
        //            return false;
        //            //            }
        //        }
        //        if (range.endContainer.$.localName == "font") {
        //            //            if (range.endContainer.getPrevious().$.localName == "font") {
        //            alert("已被标记");
        //            return false;
        //            //            }
        //        }
        //        if (range.startContainer.getParent().$.localName == "font") {
        //            alert("已被标记");
        //            return false;
        //        }
        //        if (range.endContainer.getParent().$.localName == "font") {
        //            alert("已被标记");
        //            return false;
        //        }
        //        if (range.startContainer.getNext() && range.endContainer.getPrevious()) {
        //            //            if (!(range.startContainer.getNext().$.localName == "font" && range.startContainer.getPrevious().$.localName == "font")) {
        //            if (range.startContainer.getNext().$.localName == "font" && range.endContainer.getPrevious().$.localName == "font") {
        //                if (range.startContainer.getIndex() != range.endContainer.getIndex()) {
        //                    alert("已被标记");
        //                    return false;
        //                }

        //            }
        //            //            }

        //        }
        //        if (!range.startContainer.getNext() && range.endContainer.getPrevious()) {

        //            if (range.endContainer.getPrevious().$.localName == "font") {

        //                if (range.startContainer.getIndex() != range.endContainer.getIndex()) {
        //                    alert("已被标记");
        //                    return false;
        //                }
        //            }
        //        }
        //        if (!(range.startContainer.getNext() && range.endContainer.getPrevious())) {

        //            if (range.startContainer.getParent().getIndex() != range.endContainer.getParent().getIndex()) {
        //                for (var i = range.startContainer.getParent().getIndex() + 1; i < range.endContainer.getParent().getIndex(); i++) {
        //                    //                    if (range.startContainer.getParent().getParent().$.childNodes[i]) {
        //                    //                    }
        //                    for (var j = 0; j < range.startContainer.getParent().getParent().$.childNodes[i].childNodes.length; j++) {
        //                        if (range.startContainer.getParent().getParent().$.childNodes[i].childNodes[j].nodeName == "FONT") {
        //                            alert("已被标记");
        //                            return false;
        //                        }
        //                    }

        //                }
        //            }

        //        }

        //        if (range.startContainer.getNext().$.localName == "font" || range.endContainer.getPrevious().$.localName == "font") {
        //            //            if (range.endContainer.$.nodeName == "FONT" || range.endContainer.$.parentElement.nodeName == "FONT") {
        //            //                alert("已被标记");
        //            //            }
        //            //            else if (range.startContainer.$.nodeName == "FONT" || range.startContainer.$.parentElement.nodeName == "FONT") {
        //            //                alert("已被标记");
        //            //            }
        //            alert("已被标记");
        //            return false;
        //        }
        //        var format = {
        //            element: 'font',
        //            styles: { 'background-color': '#d5d2d6' }
        //        };
        //        var style = new CKEDITOR.style(format);
        //        style.applyToRange(range);
        //方案二，通过插入特殊字符式进行判断
        //插入特殊字符
        //        var strMarkedStart = ["→", "&rarr;"];
        //        var strMarkedEnd = ["←", "&larr;"];
        //        //        var strMarkedStartCha
        //        var tempContentStart = range.startContainer.getText().substring(0, range.startOffset) + strMarkedStart[0] + range.startContainer.getText().substring(range.startOffset, range.startContainer.length);


        //        range.startContainer.setText(tempContentStart);
        //        var tempContentEnd = range.endContainer.getText().substring(0, range.endOffset + 1) + strMarkedEnd[0] + range.endContainer.getText().substring(range.endOffset + 1, range.endContainer.length);

        //        range.endContainer.setText(tempContentEnd);
        //        var temp = "";
        //        if (range.endContainer.getText().indexOf(strMarkedStart[0]) > range.endContainer.getText().indexOf(strMarkedEnd[0])) {
        //            temp = range.endContainer.getText().substring(0, range.endContainer.getText().indexOf(strMarkedEnd[0])) + range.endContainer.getText().substring(range.endContainer.getText().indexOf(strMarkedEnd[0]) + strMarkedEnd[0].length) + strMarkedEnd[0];
        //        }
        //        if (temp != "") {
        //            //取出标记的内容
        //            var verificationStr = temp.substring(temp.indexOf(strMarkedStart[0]) + strMarkedStart[0].length, temp.indexOf(strMarkedEnd[0]));
        //        }
        //        else {


        //取出标记的内容
        //        var verificationStr = editor.getData().substring(editor.getData().indexOf(strMarkedStart[1]) + strMarkedStart[1].length, editor.getData().indexOf(strMarkedEnd[1]));
        //        //        }
        //        //进行判断
        //        var customStr = "<font";
        //        var customStr1 = "</font>";

        //        if (verificationStr.indexOf(customStr) > 0 || verificationStr.indexOf(customStr1) > 0) {
        //            editor.setData(dataOld);
        //            _this._info(StatusMessage[2120]);
        //            return false;
        //        }
        //        var verificationFlg = true;
        //        var rangeParent = range.startContainer.getParent();
        //        while (verificationFlg) {
        //            if (rangeParent) {

        //                if (rangeParent.getName() != "p") {

        //                    if (rangeParent.getName() == "font") {
        //                        editor.setData(dataOld);
        //                        _this._info(StatusMessage[2120]);
        //                        verificationFlg = false;
        //                        return false;
        //                    }
        //                    if (rangeParent.getParent()) {
        //                        rangeParent = rangeParent.getParent();
        //                    }
        //                    else {
        //                        verificationFlg = false;
        //                    }

        //                    continue;
        //                }
        //            }
        //            verificationFlg = false;
        //        }
        //方案3
        //插入特殊标识
        var strMarkedStart = "<big>";
        var strMarkedEnd = "</big>";
        var format = {
            element: 'big'
        };
        var style = new CKEDITOR.style(format);
        style.applyToRange(range);
        //取出特殊位置的
        var verificationStr = editor.getData().substring(editor.getData().indexOf(strMarkedStart) + strMarkedStart.length, editor.getData().lastIndexOf(strMarkedEnd));
        var customStr = "<font";
        var customStr1 = "</font>";

        if (verificationStr.indexOf(customStr) > 0 || verificationStr.indexOf(customStr1) > 0) {
            editor.setData(dataOld);
            _this._info(StatusMessage[2120]);
            return false;
        }
        //大标记里标记的情况
        var verificationFlg = true;
        var rangeParent = range.startContainer.getParent();
        while (verificationFlg) {
            if (rangeParent) {

                if (rangeParent.getName() != "p") {

                    if (rangeParent.getName() == "font") {
                        editor.setData(dataOld);
                        _this._info(StatusMessage[2120]);
                        verificationFlg = false;
                        return false;
                    }
                    if (rangeParent.getParent()) {
                        rangeParent = rangeParent.getParent();
                    }
                    else {
                        verificationFlg = false;
                    }
                    continue;
                }
            }
            verificationFlg = false;
        }


        var dataNew = editor.getData();
        while (dataNew.indexOf(strMarkedStart) > 0) {
            dataNew = dataNew.replace(strMarkedStart, '<font style="background-color:#d5d2d6;">');
        }
        while (dataNew.indexOf(strMarkedEnd) > 0) {
            dataNew = dataNew.replace(strMarkedEnd, '</font>');
        }

        editor.setData(dataNew);
        this._content = dataNew;
        return true;
    },

    setText: function (text) {
        businesscomponents.editors.RichTextLocationMarker.superClass.setText.call(this, text);
        if (this._model != null) {
            this._model = null;
            toot.fireEvent(this, "change");
        }
    },
    _info: function (content) {
        greedyint.dialog.info(content, function () {
        });
    },
    getState: function () {
        return this._state;
    },
    setState: function (state) {
        this._state = state;
    }
});

businesscomponents.editors.RichTextSentenceMarker = function () {
    businesscomponents.editors.RichTextLocationMarker.superClass.constructor.call(this);
    this._iMarkedCount = 0;
    this._idxLastMarked = -1;
    this._StrMarkedPlaceholder = String.fromCharCode(0x25A0);
    this._iMarkedChar = 0x245f;
    if (this.constructor == arguments.callee) this._init();

};
toot.inherit(businesscomponents.editors.RichTextSentenceMarker, businesscomponents.editors.RichTextMarkerBase);
toot.extendClass(businesscomponents.editors.RichTextSentenceMarker, {
    _mouseDownOnEditor1: false,
    initializeEditor: function () {
        businesscomponents.editors.RichTextLocationMarker.superClass.initializeEditor.call(this);
        var _this = this;
        $(_this._rte.element.$).bind("mousedown", function () {
            _this._mouseDownOnEditor1 = true;
            _this._btnMark.setEnabled(true);

        });

        $(document).bind("mouseup", function (e) {
            var selection = _this._rte.getSelection();
            if (_this._mouseDownOnEditor1) {
                _this._btnMark.setEnabled(true);
            }
            else {
                if (e.target.className == "btnTagsAdd") {
                    if (selection.isLocked != 0) {
                        _this._btnMark.setEnabled(true);

                    }

                }
                else {
                    _this._btnMark.setEnabled(false);

                }
            }
            _this._mouseDownOnEditor1 = false;
        });

        $(_this._rte.element.$).bind("dragstart dragenter dragover drop ", function (e) {
            e.preventDefault();
        });
    },
    _enableMark: false,
    updateUIByModel: function () {
        if (!this._rte) return;

        this._iMarkedCount = 0;
        this._idxLastMarked = -1;

        if (this._model && this._model.length > 0) {
            var StrMarkedPlaceholder = String.fromCharCode(0x25A0);
            var iMarkedChar = 0x245f;

            var content = this._text;
            for (var i = 0; i <= this._model.length - 1; i++) {
                var strMarked = this._StrMarkedPlaceholder + String.fromCharCode(this._iMarkedChar + i + 1);
                content = content.substr(0, this._model[i]) + strMarked + content.substr(this._model[i]);
            }

            this._iMarkedCount = this._model.length;
            if (this._model.length == 1) {
                this._idxLastMarked = this._model[this._model.length - 1] + 2;
            } else {
                this._idxLastMarked = this._model[this._model.length - 1] + (this._model.length - 1) * 2 + 2;
            }

            this._rte.setData(content);
            this._content = content;
            this._btnUnmark.setEnabled(true);
        } else {
            this._rte.setData(this._text);
            this._content = this._text;
            this._btnUnmark.setEnabled(false);
        }

    },
    updateModelByUI: function () {
        var editor = this._rte;

        var positionList = [];
        var content = editor.getData();
        this._content = content;
        var idx = 1;
        for (; idx <= this._iMarkedCount; idx++) {
            var strMarked = this._StrMarkedPlaceholder + String.fromCharCode(this._iMarkedChar + idx);
            positionList.push(content.indexOf(strMarked));
            //                    content = content.replace(strMarked, "");
        }
        if (positionList.length > 0) this._model = positionList;
    },

    _onBtnMarkAction: function () {
        var _this = this;
        var r = this.mark();
        this.updateModelByUI();
        if (r == 10) {
            this._btnUnmark.setEnabled(true);
            toot.fireEvent(this, "change");
        } else if (r == 20) {
            //            if (this._msgBar) this._msgBar.setMessage("请选中文字进行标记", 3000);
        } else if (r == 30) {
            if (this._msgBar) this._msgBar.setMessage("您已标记该位置", 3000);
        } else if (r == 40) {
            if (this._msgBar) this._msgBar.setMessage("请按顺序标记位置", 3000);
        }
        _this._btnMark.setEnabled(false);
    },

    _onBtnUnmarkAction: function () {
        var _this = this;
        _this._confirm(StatusMessage[2121], function () {
            _this._iMarkedCount = 0;
            _this._idxLastMarked = -1;
            _this._model = null;
            _this.updateUIByModel();
            toot.fireEvent(_this, "change");
        });

    },

    mark: function () {
        var editor = this._rte;

        //保证特换内容特殊
        var strMarkedStart = 'gi~=veryspecial';

        var selection = editor.getSelection();


        var range = selection.getRanges()[0];

        var tempContent = range.startContainer.getText().substring(0, range.startOffset) + strMarkedStart + range.startContainer.getText().substring(range.startOffset, range.startContainer.length);

        range.startContainer.setText(tempContent);


        var content = editor.getData();
        //标记位置必须大于最后一次标记的位置
        var idxMarked = content.indexOf(strMarkedStart);
        if (idxMarked > this._idxLastMarked) {
            this._iMarkedCount++;
            var strMarked = this._StrMarkedPlaceholder + String.fromCharCode(this._iMarkedChar + this._iMarkedCount);

            this._idxLastMarked = idxMarked + 2;

            content = content.replace(new RegExp(strMarkedStart), strMarked);
            //bugfix：当有多段时，都会添加font标签，只使用第一个即可
            content = content.replace(new RegExp(strMarkedStart, "g"), "");
            editor.setData(content);
            this._isMark = true;
        } else {
            content = content.replace(new RegExp(strMarkedStart, "g"), "");
            editor.setData(content);

            // 您已标记该位置
            if (idxMarked == this._idxLastMarked)
                return 30;
            // 请按顺序标记位置
            else
                return 40;

        }

        return 10;
    }
});


//sat语法标记 create by xiaobao 14/3/7
//'<div class="taskSatEditBtnbox">' +
//添加的html定义

businesscomponents.editors.SatSaveBtnBoxHtml = '<div class="taskSatEditBtnbox"></div>';
businesscomponents.editors.SatSaveBtnHtml = '<button class="btnSave1_3" gi="btnSave">保存</button>';
businesscomponents.editors.SatRichTextLocationMarker = function () {
    businesscomponents.editors.SatRichTextLocationMarker.superClass.constructor.call(this);

    this._arrayNO = ["A", "B", "C", "D", "E"];
    this._flgNO = -1;
    this._isRead = false;
    this._maxMark = 5;
    this._currentMark = 0;

    this._satSaveBtnBox = $(businesscomponents.editors.SatSaveBtnBoxHtml);
    this._satSaveBtn = new toot.ui.Button($(businesscomponents.editors.SatSaveBtnHtml)[0]);
    this._rtd = new businesscomponents.editors.RichTextMarkerLikeDisplayer(businesscomponents.editors.RichTextMarkerLikeDisplayer.sathtml);
    this._rtd.appendTo(this._element);
    this._rtd.initializeEditor();
    this._rtd.setVisible(false);


    this._satSaveBtnBox.append(this._satSaveBtn.getElement());
    $(this._element).append(this._satSaveBtnBox[0]);
    this._pee = new businesscomponents.editors.PassageEditorEntrance(businesscomponents.editors.PassageEditorEntrance.sathtml);
    this._pee.appendTo(this._element);
    this._pee.setVisible(false);
    if (this.constructor == arguments.callee) this._init();


};
toot.inherit(businesscomponents.editors.SatRichTextLocationMarker, businesscomponents.editors.RichTextMarkerBase);
toot.extendClass(businesscomponents.editors.SatRichTextLocationMarker, {
    _mouseDownOnEditor: false,
    _markEnable: false,
    initializeEditor: function () {
        //        businesscomponents.editors.SatRichTextLocationMarker.superClass.initializeEditor.call(this);

        this._rte = new businesscomponents.editors.RichText(businesscomponents.editors.RichText.sathtml, businesscomponents.editors.TextInitialView.sathtml);
        this._rte.getInitialView().setLb12("题干");
        this._rte.setConfigFile('/content3/Scripts/ckeditorconfigs/choicequestion.js');
        this._rte.setAttachCKFinder(false);
        this._rte.setMinHeight(120);
        this._rte.replaceTo($(this._element).find('[gi~="rte"]')[0]);
        var _this = this;

        //各种点击事件
        toot.connect(this._satSaveBtn, "action", this, this._onBtnSaveAction);
        toot.connect(this._pee.getBtnConfirm(), "action", this, this._onPeeBtnConfirmAction);

        $(_this._rtd._element).bind("mousedown", function () {
            _this._mouseDownOnEditor = true;
        });
        $(document).bind("mouseup", { event: this, base: _this }, _this._mouseDownOnEditorFn);
        this.bindMouseDownOnEditorFn();

    },
    _mouseDownOnEditorFn: function (event) {
        var _this = event.data.base;
        var selection = _this._rtd.getRTE().getSelection();

        if (_this._mouseDownOnEditor) {
            //没有选择或者选择了空行
            if (selection && selection.getSelectedText() == "" || selection.getSelectedText() == "\n") {
                _this._btnMark.setEnabled(false);
            }
            else {
                if (_this._currentMark < _this._maxMark) {
                    _this._btnMark.setEnabled(true);
                }

            }
        }
        else {
            if (event.target.className == "btnTagsAdd") {
                if (_this._currentMark < _this._maxMark) {
                    _this._btnMark.setEnabled(true);
                }

            }
            else {
                _this._btnMark.setEnabled(false);
            }
        }
        _this._mouseDownOnEditor = false;
    },
    bindMouseDownOnEditorFn: function () {
        //        var _this = this;

        //        if (this._isRead) {
        //            return;
        //        }
        //        if ($(document).data("events").mouseup) {
        //            this._isRead = true;
        //            return;
        //        }
        //        $(document).bind("mouseup", { event: this, base: _this }, _this._mouseDownOnEditorFn);
        //        this._isRead = true;

    },
    unbindMouseDownOnEditorFn: function () {
        //        $(document).unbind("mouseup");
        //        this._isRead = false;
    },
    _hasData: false,
    updateUIByModel: function () {
        var _this = this;
        if (!this._rte) return;
        if (this._model) {


            var content = this._text;
            //            for (var i = this._model.loctions.length - 1; i >= 0; i--) {
            //                var strMarkedEnd = '</span><span class="ChoiceMark">' + _this._arrayNO[i] + '</span></font>';
            //                content = content.substr(0, this._model.loctions[i].getEnd()) + strMarkedEnd + content.substr(this._model.loctions[i].getEnd());
            //                content = content.substr(0, this._model.loctions[i].getStart()) + strMarkedStart + content.substr(this._model.loctions[i].getStart());
            //            }
            for (var i = this._model.length - 1; i >= 0; i--) {
                //                for (var j = this._model.loctions[i].length - 1; j >= 0; j--) {
                var strMarkedStart = '<font class="addTagStyle2" gi="idx' + i + '"><span class="TextMark">';
                if (this._model[i].getLoctions().length <= 1) {
                    //                        if (j == 0) {
                    var strMarkedEnd = '</span><span class="ChoiceMark">' + _this._arrayNO[i] + '</span></font>';
                    content = content.substr(0, this._model[i].getLoctions()[0].getEnd()) + strMarkedEnd + content.substr(this._model[i].getLoctions()[0].getEnd());
                    content = content.substr(0, this._model[i].getLoctions()[0].getStart()) + strMarkedStart + content.substr(this._model[i].getLoctions()[0].getStart());
                    //                        }


                }
                else {
                    for (var z = this._model[i].getLoctions().length - 1; z >= 0; z--) {
                        if (z == 0) {
                            var strMarkedEnd = '</span><span class="ChoiceMark">' + _this._arrayNO[i] + '</span></font>';
                            content = content.substr(0, this._model[i].getLoctions()[0].getEnd()) + strMarkedEnd + content.substr(this._model[i].getLoctions()[0].getEnd());
                            content = content.substr(0, this._model[i].getLoctions()[0].getStart()) + strMarkedStart + content.substr(this._model[i].getLoctions()[0].getStart());
                        }
                        else {
                            var strMarkedEnd = '</span><span class="ChoiceMark"> </span></font>';
                            content = content.substr(0, this._model[i].getLoctions()[z].getEnd()) + strMarkedEnd + content.substr(this._model[i].getLoctions()[z].getEnd());
                            content = content.substr(0, this._model[i].getLoctions()[z].getStart()) + strMarkedStart + content.substr(this._model[i].getLoctions()[z].getStart());
                        }

                    }

                    //                    }
                }
            }
            this._rtd.getRTE().setData(content);
            this._content = content;
            this._btnUnmark.setEnabled(true);
        } else {
            this.setText(this._text);
            this._content = this._text;
        }
    },

    updateModelByUI: function () {
        var strMarkedStart = '<font class="addTagStyle2"><span class="TextMark">';
        var strMarkedEnd = '</font>';

        var content = this._rtd.getRTE().getData();
        this._content = content;
        var idxStart, idxEnd;
        var positionList = [];
        var data = [];
        for (var i = 0; i <= this._flgNO; i++) {

            var strMarkedStart = '<font class="addTagStyle2" gi="idx' + i + '"><span class="TextMark">';
            while ((idxStart = content.indexOf(strMarkedStart)) != -1) {
                content = content.substr(0, idxStart) + content.substr(idxStart + 60);
                idxEnd = content.indexOf(strMarkedEnd, idxStart) - 40;
                if (idxEnd == -1) continue;
                content = content.substr(0, idxEnd) + content.substr(idxEnd + 47);
                positionList.push({ start: idxStart, end: idxEnd });
            }
            data.push({ locations: positionList });
            positionList = [];
        }

        //        while ((idxStart = content.indexOf(strMarkedStart)) != -1) {
        //            content = content.substr(0, idxStart) + content.substr(idxStart + 50);
        //            idxEnd = content.indexOf(strMarkedEnd, idxStart) - 40;
        //            if (idxEnd == -1) continue;
        //            content = content.substr(0, idxEnd) + content.substr(idxEnd + 47);
        //            positionList.push({ start: idxStart, end: idxEnd });
        //        }
        var locations = [];
        if (data.length > 0) {
            for (var i = 0; i <= data.length - 1; i++) {
                var locationsTemp = new models.components.choicelocationgroup.Locations();
                var tempArray = [];
                for (var j = 0; j <= data[i].locations.length - 1; j++) {
                    var location = new models.components.choicelocationgroup.Location();
                    location.setStart(data[i].locations[j].start);
                    location.setEnd(data[i].locations[j].end);
                    tempArray.push(location);
                }
                locationsTemp.setLoctions(tempArray);
                locations.push(locationsTemp);
            }

            this._model = locations;
        } else
            this._model = null;
    },

    _onBtnMarkAction: function () {

        var _this = this;
        //超过5个选项

        var r = this.mark();
        this.updateModelByUI();
        if (this._model) {
            this._btnMark.setEnabled(false);
            this._btnUnmark.setEnabled(true);

        }
        if (r) {
            toot.fireEvent(this, "change");
        }
    },

    _onBtnUnmarkAction: function () {
        var _this = this;
        _this._confirm(StatusMessage[2121], function () {

            _this._model = null;
            _this.updateUIByModel();
            //            _this.this._rtd.setText(_this.);
            _this._btnUnmark.setEnabled(false);
            _this._flgNO = -1;
            _this._currentMark = 0;
            _this.bindMouseDownOnEditorFn();
            toot.fireEvent(_this, "change");
        });


    },
    _onBtnSaveAction: function () {
        if (this._rte.updateAndGetModelByUI() == "") {
            return false;
        }
        this._isRead = false;
        this.bindMouseDownOnEditorFn();
        this._satSaveBtnBox.hide();
        this._pee.setVisible(true);
        //设置富文本编辑器不可用
        //        this._rtd.setText(this._rte.updateAndGetModelByUI());
        this._text = this._rte.updateAndGetModelByUI();
        this._rtd.getRTE().setData(this._text);
        this._rtd.setVisible(true);
        this._rte.setVisible(false);
    },
    _onPeeBtnConfirmAction: function () {
        //清空所有标记
        this._currentMark = 0;
        this._model = null;
        this.updateUIByModel();
        //            _this.this._rtd.setText(_this.);
        this._btnUnmark.setEnabled(false);
        this._rte.setModelAndUpdateUI(this._text);
        this.getSaveBtnBox().show();
        this.getPee().setVisible(false);
        this._rte.setVisible(true);
        this._rtd.setVisible(false);
        this._flgNO = -1;
        this.bindMouseDownOnEditorFn();
        toot.fireEvent(this, "change");
    },

    mark: function () {
        this._flgNO++;

        if (this._flgNO >= 4) {
            this._btnMark.setEnabled(false);
            this.unbindMouseDownOnEditorFn();
            this._isRead = false;
            //            return false;
        }
        var _this = this;
        var selection = _this._rtd.getRTE().getSelection();
        if (selection.getSelectedText() == "") {
            return false;
        }

        var editor = _this._rtd.getRTE();
        var dataOld = editor.getData();
        var customStr = "<font";
        var customStr1 = "</font>";
        var lastMarkedindex = dataOld.lastIndexOf(customStr);
        var range = selection.getRanges()[0];
        //插入特殊标识
        var strMarkedStart = "<big>";
        var strMarkedEnd = "</big>";
        var format = {
            element: 'big'
        };
        var style = new CKEDITOR.style(format);
        style.applyToRange(range);
        //取出特殊位置的
        var verificationStr = editor.getData().substring(editor.getData().indexOf(strMarkedStart) + strMarkedStart.length, editor.getData().lastIndexOf(strMarkedEnd));
        //        <span class="addTagStyle2"><span class="TextMark">he was very angry</span><span class="ChoiceMark">A</span></span>



        if (verificationStr.indexOf(customStr) > 0 || verificationStr.indexOf(customStr1) > 0) {
            editor.setData(dataOld);
            _this._flgNO--;
            //            _this._info(StatusMessage[2120]);
            if (_this._msgBar) _this._msgBar.setMessage("您已标记该位置", 3000);
            return false;
        }
        //大标记里标记的情况
        var verificationFlg = true;
        var rangeParent = range.startContainer.getParent();
        while (verificationFlg) {
            if (rangeParent) {

                if (rangeParent.getName() != "p") {

                    if (rangeParent.getName() == "font") {
                        editor.setData(dataOld);
                        this._flgNO--;
                        if (_this._msgBar) _this._msgBar.setMessage("您已标记该位置", 3000);
                        verificationFlg = false;
                        return false;
                    }
                    if (rangeParent.getParent()) {
                        rangeParent = rangeParent.getParent();
                    }
                    else {
                        verificationFlg = false;
                    }
                    continue;
                }
            }
            verificationFlg = false;
        }

        var dataNew = editor.getData();
        var newMarkedindex = dataNew.indexOf(strMarkedStart);
        if (newMarkedindex < lastMarkedindex) {
            editor.setData(dataOld);
            _this._flgNO--;
            //            _this._info(StatusMessage[2120]);
            if (_this._msgBar) _this._msgBar.setMessage("请按顺序标记位置", 3000);
            return false;
        }
        while (dataNew.indexOf(strMarkedStart) > 0) {
            dataNew = dataNew.replace(strMarkedStart, '<font class="addTagStyle2" gi="idx' + this._flgNO + '"><span class="TextMark">');
        }
        if (dataNew.indexOf(strMarkedEnd) > 0) {
            var strTemp = '</span><span class="ChoiceMark">' + _this._arrayNO[_this._flgNO] + '</span></font>';
            dataNew = dataNew.replace(strMarkedEnd, strTemp);
        }
        while (dataNew.indexOf(strMarkedEnd) > 0) {
            var strTemp = '</span><span class="ChoiceMark"> </span></font>';
            dataNew = dataNew.replace(strMarkedEnd, strTemp);
        }
        this._currentMark++;
        editor.setData(dataNew);
        this._content = dataNew;
        return true;
    },

    //    setText: function (text) {
    //        //        businesscomponents.editors.RichTextLocationMarker.superClass.setText.call(this, text);
    //        //        if (this._model != null) {
    //        //            this._model = null;
    //        //            toot.fireEvent(this, "change");
    //        //        }
    //    },
    setText: function (text) {
        this._text = text;
        this._renderText();
    },
    getText: function () {
        return this._text;
    },
    setFlgNO: function (flgNO) {
        this._flgNO = flgNO;
    },
    getFlgNO: function (flgNO) {
        return this._flgNO;
    },
    setCurrentMark: function (currentMark) {
        this._currentMark = currentMark;
    },
    _renderText: function () {
        if (this._rtd) this._rtd.setText(this._text);
        if (this._rte) this._rte.setModelAndUpdateUI(null);
    },
    _info: function (content) {
        //        greedyint.dialog.info(content, function () {
        //        });
    },
    getPee: function () {
        return this._pee
    },
    getSaveBtnBox: function () {
        return this._satSaveBtnBox;
    },
    getRtd: function () {
        return this._rtd;
    },
    getRte: function () {
        return this._rte;
    }
});
