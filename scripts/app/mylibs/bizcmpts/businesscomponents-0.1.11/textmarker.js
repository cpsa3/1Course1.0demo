var businesscomponents = businesscomponents || {};

businesscomponents.TextMarkIndex = function (opt_html) {
    businesscomponents.TextMarkIndex.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.TextMarkIndex.html)[0]);
    this._lblIndex = new toot.ui.Label($(this._element).find('[gi~="lblIndex"]')[0]);
}
toot.inherit(businesscomponents.TextMarkIndex, toot.ui.Component);
toot.extendClass(businesscomponents.TextMarkIndex, {
    getLblIndex: function () { return this._lblIndex }
});
businesscomponents.TextMarkIndex.html = '<span class="positionLast"><em class="t_Number" gi="lblIndex">1</em></span>';


businesscomponents.TextMarkEditor = function (opt_html) {
    businesscomponents.TextMarkEditor.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.TextMarkEditor.html)[0]);
    this._txt = new toot.ui.TextBox($(this._element).find('[gi~="txt"]')[0]);
    this._btnRemove = new toot.ui.Button($(this._element).find('[gi~="btnRemove"]')[0]);
    this._timerHide = null;
    this._mark = null;
    this._richText = null;
    this._init();
}
toot.inherit(businesscomponents.TextMarkEditor, toot.ui.Component);
toot.extendClass(businesscomponents.TextMarkEditor, {

    _init: function () {
        this._init_manageEvents();
    },

    _init_manageEvents: function () {
        var _this = this;
        toot.connect(this._btnRemove, "action", this, this._onBtnRemoveAction);
        $(this._element).mouseenter(function () {
            _this.setHidingOnTimer(false);
            _this.setVisible(true);
        });
        $(this._element).mouseleave(function () {
            _this.setHidingOnTimer(true);
        });
        $(this._txt.getElement()).blur(function () {
            if (_this._mark) {
                _this._mark.text = _this._txt.getValue();
            }
        });
    },

    setHidingOnTimer: function (hiding) {
        var _this = this;
        if (hiding) {
            this._timerHide = setTimeout(function () {
                _this.setVisible(false);
            }, 800);
        }
        else {
            clearTimeout(this._timerHide);
        }
    },

    _onBtnRemoveAction: function () {
        if (this._richText && this._mark) {
            this._richText.removeMark(this._mark);
        }
        this.setVisible(false);
    },

    getTxt: function () { return this._txt },
    getBtnRemove: function () { return this._btnRemove },
    isFocused: function () { return this._focused },
    getMark: function () { return this._mark },
    setMark: function (mark) {
        if (this._mark == mark) return;
        this._mark = mark
        if (mark) {
            this._txt.setValue(mark.text);
            this.appendTo(mark.pairs[0].label);
        }
    },
    getRichText: function () { return this._richText },
    setRichText: function (richText) { this._richText = richText }
});
businesscomponents.TextMarkEditor.html =
       '<div class="t_textBox"><div class="Uneditor Ineditor"><input class="EdInputStyle" type="text" gi="txt"><div class="t_DelBtnBox"><button class="t_DelBtn" gi="btnRemove"></button></div></div></div>';


businesscomponents.TextMarker = function (opt_html) {
    businesscomponents.TextMarker.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.TextMarker.html)[0]);

    this._pairs = [];
    this._marks = [];

    this._editor = new businesscomponents.TextMarkEditor();
    this._editor.appendTo(document.body);
    this._editor.setRichText(this);

    this._htmlParser = document.createElement("div");

    this._init();
}
toot.inherit(businesscomponents.TextMarker, toot.view.ViewBase);
toot.defineEvent(businesscomponents.TextMarker, ["markAdd"]);
toot.extendClass(businesscomponents.TextMarker, {

    _init: function () {
        this._init_manageEvents();
    },


    //10 rich text 20 plain text
    _mode: 10,
    getMode: function () { return this._mode },
    setMode: function (mode) { this._mode = mode },

    //-1不能添加，0添加作为第一组，1添加做为第二组
    _addEnabled: 0,
    getAddEnabled: function () { return this._addEnabled },
    setAddEnabled: function (enable) {
        if (enable == -1 || enable == 0 || enable == 1)
            this._addEnabled = enable;
        else
            throw "-1 0 1";
    },

    _editable: [true, true],
    isEditable: function () { return this._editable },
    setEditable: function (editable) { this._editable = editable },


    getMarks: function () { return this._marks },

    _init_manageEvents: function () {
        var _this = this;
        $(document).mouseup(function () {
            _this._onDocumentMouseup();
        });
    },

    _setEditorVisibleByMark: function (mark) {
        if (mark) {
            this._editor.setHidingOnTimer(false);
            this._editor.setVisible(true);
            this._editor.setMark(mark);
        }
        else {
            this._editor.setHidingOnTimer(true);
        }
    },

    _onDocumentMouseup: function () {
        if (this._addEnabled == -1) return;

        var thisRange = document.createRange();
        if (this._element.parentNode) {
            thisRange.setStartBefore(this._element);
            thisRange.setEndAfter(this._element);
        }
        else {
            return;
        }

        var range = window.getSelection().rangeCount > 0 ? window.getSelection().getRangeAt(0) : null;
        if (!range || range.collapsed) {
            return;
        }

        var stos = range.compareBoundaryPoints(Range.START_TO_START, thisRange);
        var etoe = range.compareBoundaryPoints(Range.END_TO_END, thisRange);
        if (stos == -1 || etoe == 1) {
            return;
        }

        for (var i = 0, l = this._pairs.length; i < l; i++) {
            var labelRange = document.createRange();
            labelRange.setStartBefore(this._pairs[i].label);
            labelRange.setEndAfter(this._pairs[i].label);
            if (!((labelRange.compareBoundaryPoints(Range.START_TO_START, range) != 1 && labelRange.compareBoundaryPoints(Range.START_TO_END, range) != 1) ||
                  (labelRange.compareBoundaryPoints(Range.END_TO_START, range) != -1 && labelRange.compareBoundaryPoints(Range.END_TO_END, range) != -1))) {
                return;
            }
        }

        var mark = this._createMarkByRange(range.cloneRange(), "", this._addEnabled, true);
        this._setEditorVisibleByMark(mark);
        var idx = this._marks.indexOf(mark);
        window.getSelection().removeAllRanges();
        toot.fireEvent(this, "markAdd", { e: idx });
    },

    _createMarkByRange: function (range, text, group) {
        var _this = this;

        var mark = { pairs: [], text: text ? text : "", group: group };

        if (range.startContainer.nodeType == 3) {
            var text = range.startContainer.splitText(range.startOffset);
            range.setStartBefore(text);
        }
        if (range.endContainer.nodeType == 3) {
            range.endContainer.splitText(range.endOffset);
            range.setEndAfter(range.endContainer);
        }

        var nodeIterator = document.createNodeIterator(range.commonAncestorContainer, NodeFilter.SHOW_TEXT, function (node) {
            var textRange = document.createRange();
            textRange.setStartBefore(node);
            textRange.setEndAfter(node);
            var stos = textRange.compareBoundaryPoints(Range.START_TO_START, range);
            var etoe = textRange.compareBoundaryPoints(Range.END_TO_END, range);
            if ((stos == 0 || stos == 1) && (etoe == -1 || etoe == 0)) {
                return NodeFilter.FILTER_ACCEPT;
            }
            else {
                return NodeFilter.FILTER_REJECT;
            }
        });
        var texts = [];
        while (nodeIterator.nextNode()) {
            texts.push(nodeIterator.referenceNode);
        }
        for (var i = 0, l = texts.length; i < l; i++) {
            var text = texts[i];
            var label = document.createElement('span');
            //            label.style.borderBottom = "1px solid green";
            if (mark.group == 0)
                label.className = "t_dec2";
            else
                label.clasName = "t_dec2 t_teacher";
            text.parentNode.replaceChild(label, text);
            label.appendChild(text);
            var pair = { text: text, label: label, mark: mark }
            mark.pairs.push(pair);
            this._pairs.push(pair);

            $(label).mouseenter(function () {
                if (_this._editable[mark.group])
                    _this._setEditorVisibleByMark(mark);
            });
            $(label).mouseleave(function () {
                if (_this._editable[mark.group])
                    _this._setEditorVisibleByMark(null);
            });

        }
        this._marks.push(mark);
        this._reorder();
        return mark;
    },

    _reorder: function () {
        var l = this._marks.length;
        while (l > 1) {
            for (var i = 0; i < l - 1; i++) {
                var mark1 = this._marks[i];
                var mark2 = this._marks[i + 1];
                var range1 = document.createRange();
                range1.selectNode(mark1.pairs[0].label);
                var range2 = document.createRange();
                range2.selectNode(mark2.pairs[0].label);
                if (range1.compareBoundaryPoints(Range.START_TO_START, range2) == 1) {
                    this._marks[i] = mark2;
                    this._marks[i + 1] = mark1;
                }
            }
            l--;
        }

        for (var i = 0, l = this._marks.length; i < l; i++) {
            var mark = this._marks[i];
            var label = mark.pairs[mark.pairs.length - 1].label;
            if (label.childNodes.length == 2) {
                label.removeChild(label.childNodes[1]);
            }
            var index = new businesscomponents.TextMarkIndex();
            index.getLblIndex().setText(i + 1);
            index.appendTo(label);
        }

    },

    removeMark: function (mark) {
        for (var i = 0, l = mark.pairs.length; i < l; i++) {
            var pair = mark.pairs[i];
            pair.label.parentNode.replaceChild(pair.text, pair.label);
            var idx = this._pairs.indexOf(pair);
            this._pairs.splice(idx, 1);
        }
        this._element.normalize();
        var idx = this._marks.indexOf(mark);
        this._marks.splice(idx, 1);
        this._reorder();
    },

    getDataMarks: function (group) {

        var comments = [];
        for (var i = 0, l = this._marks.length; i < l; i++) {
            var mark = this._marks[i];

            var label0 = mark.pairs[0].label;
            var comment = document.createComment("m");
            label0.parentNode.insertBefore(comment, label0);
            comments.push(comment);

            var labelLast = mark.pairs[mark.pairs.length - 1].label;
            var comment = document.createComment("m");
            if (labelLast.nextSibling)
                labelLast.parentNode.insertBefore(comment, labelLast.nextSibling);
            else
                labelLast.parentNode.appendChild(comment);
            comments.push(comment);
        }
        for (var i = 0, l = this._pairs.length; i < l; i++) {
            var pair = this._pairs[i];
            pair.label.parentNode.replaceChild(pair.text, pair.label);
        }

        var html = this._element.innerHTML;

        for (var i = 0, l = this._pairs.length; i < l; i++) {
            var pair = this._pairs[i];
            pair.text.parentNode.replaceChild(pair.label, pair.text);
            if (pair.label.childNodes.length == 0) {
                pair.label.appendChild(pair.text);
            }
            else {
                pair.label.insertBefore(pair.text, pair.label.childNodes[0]);
            }
        }
        for (var i = 0, l = comments.length; i < l; i++) {
            var comment = comments[i];
            comment.parentNode.removeChild(comment);
        }


        var regMarkPosition = /<!--m-->/g;
        var positions = [];
        do {
            var finding = regMarkPosition.exec(html);
            if (finding) positions.push(finding.index);
        } while (finding)
        for (var i = 1, l = positions.length; i < l; i++) {
            positions[i] = positions[i] - i * 8;
        }

        html = html.replace(regMarkPosition, "");

        if (this._mode == 10) {
            //富文本字符偏移处理
            var regEncoded = /&#?\w+;/g;
            do {
                var finding = regEncoded.exec(this._model);
                if (finding) {
                    var strEncoded = finding[0];
                    var strDecoded = html.substring(finding.index, finding.index + 1);
                    this._htmlParser.innerHTML = strEncoded;
                    var str = this._htmlParser.innerHTML;
                    if (str == strDecoded) {
                        var offset = strEncoded.length - strDecoded.length;
                        for (var i = positions.length - 1; i >= 0; i--) {
                            if (positions[i] > finding.index)
                                positions[i] = positions[i] + offset;
                            else
                                break;
                        }
                        html = html.substring(0, finding.index) + finding[0] + html.substring(finding.index + 1);
                    }
                }
            } while (finding)
        }
        else {
            //平文本偏移处理
            var regText = /<|>| |\r|\n|\r\n/g;
            do {
                var finding = regText.exec(this._model);
                if (finding) {
                    var strText = finding[0];
                    var strHtml = null;
                    var str = null;
                    switch (strText) {
                        case "<": strHtml = html.substring(finding.index, finding.index + 4); str = "&lt;"; break;
                        case ">": strHtml = html.substring(finding.index, finding.index + 4); str = "&gt;"; break;
                        case " ": strHtml = html.substring(finding.index, finding.index + 6); str = "&nbsp;"; break;
                        case "\r":
                        case "\n":
                        case "\r\n": strHtml = html.substring(finding.index, finding.index + 4); str = "<br>"; break;
                    }
                    if (str == strHtml) {
                        var offset = strHtml.length - strText.length;
                        for (var i = positions.length - 1; i >= 0; i--) {
                            if (positions[i] > finding.index)
                                positions[i] = positions[i] - offset;
                            else
                                break;
                        }
                        html = html.substring(0, finding.index) + finding[0] + html.substring(finding.index + strHtml.length);
                    }
                }
            } while (finding)
        }

        if (html != this._model) {
            alert('marker error');
        }

        var marks = [];
        for (var i = 0, l = positions.length / 2; i < l; i++) {
            var mark = {};
            mark.text = this._marks[i].text;
            mark.start = positions[i * 2];
            mark.end = positions[i * 2 + 1]
            marks.push(mark);
        }

        if (group != null) {
            var marks2 = [];
            for (var i = 0, l = marks.length; i < l; i++) {
                if (marks[i].group == group)
                    marks2.push(marks[i]);
            }
            marks = marks2;
        }

        return marks;
    },

    updateMarksByData: function (marks) {

        this._pairs = [];
        this._marks = [];

        var positions = [0];
        for (var i = 0, l = marks.length; i < l; i++) {
            positions.push(marks[i].start);
            positions.push(marks[i].end);
        }
        positions.push(this._model.length);
        var texts = [];
        for (var i = 1, l = positions.length; i < l; i++) {
            texts.push(this._model.substring(positions[i - 1], positions[i]));
        }
        var html = texts.join("<!--m-->");

        //        this._element.innerHTML = html;
        if (this._mode == 10)
            this._element.innerHTML = html;
        else
            this._element.innerHTML = this._textToHTML(html);

        var nodeIterator = document.createNodeIterator(this._element, NodeFilter.SHOW_COMMENT, function (node) {
            if (node.data == "m") {
                return NodeFilter.FILTER_ACCEPT;
            }
            else {
                return NodeFilter.FILTER_REJECT;
            }
        });
        var comments = [];
        while (nodeIterator.nextNode()) {
            comments.push(nodeIterator.referenceNode);
        }

        for (var i = 0, l = marks.length; i < l; i++) {
            var range = document.createRange();
            range.setStartBefore(comments[i * 2]);
            range.setEndAfter(comments[i * 2 + 1]);
            comments[i * 2].parentNode.removeChild(comments[i * 2]);
            comments[i * 2 + 1].parentNode.removeChild(comments[i * 2 + 1]);
            this._createMarkByRange(range, marks[i].text, marks[i].group == null ? 0 : marks[i].group);
        }
    },

    updateMarksByDataTwoGroupsOfMarks: function (group1, group2) {
        //merge
        var marks = [];
        for (var i = 0, l = group1.length; i < l; i++) {
            var mark = group1[i];
            mark.group = 0;
        }
        for (var i = 0, l = group2.length; i < l; i++) {
            var mark = group2[i];
            mark.group = 1;
        }

        //sord by position
        var l = marks.length;
        while (l > 1) {
            for (var i = 0; i < l - 1; i++) {
                var mark1 = marks[i];
                var mark2 = marks[i + 1];
                if (mark1.start > mark2.start) {
                    this._marks[i] = mark2;
                    this._marks[i + 1] = mark1;
                }
            }
            l--;
        }

        this.updateMarksByData(marks);
    },

    updateUIByModel: function () {
        this._pairs = [];
        this._marks = [];
        if (this._mode == 10)
            this._element.innerHTML = this._model;
        else
            this._element.innerHTML = this._textToHTML(this._model);
    },

    _textToHTML: function (text) {
        var text = text.replace(/<!--m-->/g, '&mp;');
        var text = businesscomponents.TextMarker.superClass._textToHTML.call(this, text);
        var text = text.replace(/&mp;/g, '<!--m-->');
        return text;
    }

});
businesscomponents.TextMarker.html = '<div class="RichTextEditor ReportTextEditor"></div>';
