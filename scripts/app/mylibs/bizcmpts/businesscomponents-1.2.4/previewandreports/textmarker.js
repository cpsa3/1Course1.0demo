var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.MarkItem = function (opt_html) {
    businesscomponents.previewandreports.MarkItem.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.MarkItem.html)[0]);
    this._lblIndex = new toot.ui.Label($(this._element).find('[gi~="lblIndex"]')[0]);
    this._lblInfo = new toot.ui.Label($(this._element).find('[gi~="lblInfo"]')[0]);
    //    this._txt = new toot.ui.TextBox($(this._element).find('[gi~="txt"]')[0]);
    this._lblText = new toot.ui.Label($(this._element).find('[gi~="lblText"]')[0]);
    this._btnRemove = new toot.ui.Button($(this._element).find('[gi~="btnRemove"]')[0])

    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.previewandreports.MarkItem, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.MarkItem, {
    _init_render: function () {
        //        this._txt.setState(toot.ui.TextBoxState.Readonly);
        this._lblInfo.setVisible(false);
        this._btnRemove.setVisible(false);
    },
    getLblIndex: function () { return this._lblIndex },
    getLblInfo: function () { return this._lblInfo },
    getLblText: function () { return this._lblText },
    setUserType: function (userType) {
        if (userType == 10) {
            this._lblIndex.getElement().className = "HeadNoteNumber";
        }
        else {
            this._lblIndex.getElement().className = "HeadNoteNumber Note_teacher";
        }
    }
});
businesscomponents.previewandreports.MarkItem.html = '<div class="ReporHeadNoteItem clearfix"><span class="HeadNoteNumber" gi="lblIndex">1</span><div class="HeadNoteInputDiv"><em gi="lblInfo"></em><div class="HeadNoteDiv" gi="lblText"></div></div><button class="HeadNoteBnt" gi="btnRemove"></button></div>';


businesscomponents.previewandreports.TextMarker = function (opt_html) {
    businesscomponents.previewandreports.TextMarker.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.TextMarker.html)[0]);
    this._marker = new businesscomponents.TextMarker(); this._marker.replaceTo($(this._element).find('[gi~="anchorMarker"]')[0]);
    this._marker.setAddSettings(null);
    this._$ctn = $(this._element).find('[gi~="ctn"]');
    this._lblTitle = new toot.ui.Label($(this._element).find('[gi~="lblTitle"]')[0]);
    this._lblTitle.setText("批注");

    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.previewandreports.TextMarker, toot.view.ViewBase);
toot.extendClass(businesscomponents.previewandreports.TextMarker, {

    _init_render: function () {
        this._lblTitle.setVisible(false);
    },

    getMode: function () { return this._marker.getMode() },
    setMode: function (mode) { this._marker.setMode(mode) },

    getMarker: function () {
        return this._marker;
    },

    updateUIByModel: function () {
        this._marker.setModelAndUpdateUI(this._model);
    },
    updateMarksByData: function (dataMarks) {
        this._marker.updateMarksByData(dataMarks);
        this._renderMarkItems();
    },
    _renderMarkItems: function () {
        var marks = this._marker.getMarks();
        for (var i = 0, l = marks.length; i < l; i++) {
            var mark = marks[i];
            var item = new businesscomponents.previewandreports.MarkItem();
            item.setUserType(mark.userType);
            item.getLblIndex().setText(i + 1);
            item.getLblText().setText(mark.text);
            if (mark.at && mark.by) {
                item.getLblInfo().setText(mark.by + " " + (function (date) {
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    return year + "/" + (month < 10 ? "0" + month : month) + "/" + (day < 10 ? "0" + day : day);
                })(new Date(mark.at)));
                item.getLblInfo().setVisible(true);
            }
            else {
                item.getLblInfo().setText(null);
                item.getLblInfo().setVisible(false);
            }
            item.appendTo(this._$ctn[0]);
        }

        if (marks.length == 0) {
            this._lblTitle.setVisible(false);
        }
        else {
            this._lblTitle.setVisible(true);
        }
    }
});
businesscomponents.previewandreports.TextMarker.html = '<div><div gi="anchorMarker"></div><div class="ReporHeadNoteBox" gi="ctn"><div class="ReporHeadNote" gi="lblTitle">批注</div></div></div>';