var businesscomponents = businesscomponents || {};

businesscomponents.Option = function (opt_html) {
    businesscomponents.Option.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.Option.html)[0]);

    this._value = "";
    this._text = "";

    var $findBase = $('<div></div>').append(this._element);
    this._lblText = new toot.ui.Label($findBase.find('[gi~="lblText"]')[0]);
    this._$selectBox = $findBase.find('[gi~="selectBox"]');
    this.removeFromParent();

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.Option, toot.ui.Component);
toot.extendClass(businesscomponents.Option, {

    _render: function () {
        businesscomponents.Option.superClass._render.call(this);
        this._renderText();
    },

    getText: function () {
        return this._text;
    },
    setText: function (text) {
        this._text = text;
        this._value = this._text;
        this._renderText();
    },
    _renderText: function () {
        this._lblText.setText(this._text);
    },
    getValue: function () {
        return this._value;
    },
    setValue: function (value) {
        this._value = value;
    },
    getSlectBox: function () {
        return this._$selectBox;
    }

});
businesscomponents.Option.html = '<a href="javascript:;" gi="lblText"></a>';
businesscomponents.Option.html = '<a href="javascript:;" gi="lblText"></a>';


businesscomponents.Select = function (opt_html) {
    businesscomponents.Select.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.Select.html)[0]);

    this._options = [];
    this._selectedIndex = -1;
    this._lblSelected = new toot.ui.Label($(this._element).find('[gi~="lblSelected"]')[0]);
    this._unselectedText = "";
    this._elementCtnOptions = $(this._element).find('[gi~="ctnOptions"]')[0];

    this._$title = $(this._element).find('[gi~="title"]');
    this._$options = $(this._element).find('[gi~="options"]');
    this._showOptions = false;
    this._titleStyleConfig = { open: "copySelectOpen", closed: "" }

    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.Select, toot.ui.Component);
toot.extendClass(businesscomponents.Select, {

    _render: function () {
        businesscomponents.Select.superClass._render.call(this);
        this._renderSelectedIndex();
        this._renderShowOptions();
    },

    _init_manageEvents: function () {
        businesscomponents.Select.superClass._init_manageEvents.call(this);
        var _this = this;
        this._$title.bind("click", function () {
            if (!_this._showOptions) {
                _this._showOptions = true;
                _this._renderShowOptions();
                setTimeout(function () {
                    $(document).one("click", function () {
                        _this._showOptions = false;
                        _this._renderShowOptions();
                    })
                }, 0);
            }
        });
    },

    _renderShowOptions: function () {
        if (this._showOptions) {
            this._$options.show();
            this._$title.removeClass(this._titleStyleConfig.closed).addClass(this._titleStyleConfig.open);
        }
        else {
            this._$options.hide();
            this._$title.removeClass(this._titleStyleConfig.open).addClass(this._titleStyleConfig.close);
        }
    },

    getUnselectedText: function () {
        return this._unselectedText;
    },
    setUnselectedText: function (text) {
        this._unselectedText = text;
        this._renderUnselectedText();
    },
    _renderUnselectedText: function () {
        if (this._selectedIndex == -1) this._lblSelected.setText(this._unselectedText);
    },

    getSelectedIndex: function () {
        return this._selectedIndex;
    },
    setSelectedIndex: function (selectedIndex) {
        if (isNaN(parseInt(selectedIndex))) return;

        if (selectedIndex >= 0 && selectedIndex < this._options.length)
            this._selectedIndex = selectedIndex;
        else
            this._selectedIndex = -1;
        this._renderSelectedIndex();
    },
    _renderSelectedIndex: function () {
        if (this._selectedIndex == -1) this._lblSelected.setText(this._unselectedText);
        else this._lblSelected.setText(this._options[this._selectedIndex].getText());
    },


    getOptions: function () {
        return this._options;
    },

    add: function (option, before) {
        var idx = -1;
        if (before != null)
            idx = this._options.indexOf(before);
        if (idx == -1) {
            option.appendTo(this._elementCtnOptions);
            this._options.push(option);
        }
        else {
            option.insertBefore(before.getElement());
            this._options.splice(idx, 0, option);
        }

        toot.connect(option, "click", this, this._onOptionClick);

        if (this._selectedIndex != -1 && idx != -1 && this._selectedIndex >= idx) {
            this._selectedIndex++;
            this._renderSelectedIndex();
        }
    },
    remove: function (index) {
        if (index < 0 || index > this._options.length - 1) return;

        toot.disconnect(this._options[index], "click", this, this._onOptionClick);
        this._options[index].removeFromParent();
        this._options.splice(index, 1);

        if (this._selectedIndex >= index) {
            if (this._selectedIndex == index) this._selectedIndex = -1;
            else if (this._selectedIndex > index) this._selectedIndex--;
            this._renderSelectedIndex();
        }
    },

    _onOptionClick: function (sender) {
        var idx = this._options.indexOf(sender);
        if (idx != -1 && idx != this._selectedIndex) {
            var e = { preventDefault: false };
            toot.fireEvent(this, "beforeChange", e);
            if (e.preventDefault) return;
            this._selectedIndex = idx;
            this._renderSelectedIndex();
            toot.fireEvent(this, "change");
        }
    }
});
businesscomponents.Select.html = '<div class="copySelect fl" gi="selectBox" style="width:60px;">' +
                                   '<div class="copySelectText copySelectOpen" gi="lblSelected title">答案</div>' +
                                   '<div class="copySelectBox copySelectBoxMH90 copyScroll" style="width:58px; display:block;" gi="ctnOptions options">' +
                                   '</div>' +
                                 '</div>';
//文章阅读选择题组 使用下拉框样式 by xp
businesscomponents.Select.readingQuestionHtml = '<div class="copySelect fr" gi="selectBox" style="width:96px;">' +
                                   '<div class="copySelectText copySelectOpen" gi="lblSelected title">答案</div>' +
                                   '<div class="copySelectBox copySelectBoxMH90 copyScroll" style="width:94px; display:block;" gi="ctnOptions options">' +
                                   '</div>' +
                                 '</div>';
//
businesscomponents.Select.toeflIntegratedWritingWithEssayRaterHtml = '<div class="copySelect fl" gi="selectBox" style="width:96px;">' +
                                   '<div class="copySelectText copySelectOpen" gi="lblSelected title">答案</div>' +
                                   '<div class="copySelectBox copySelectBoxMH90 copyScroll" style="width:94px; display:block;" gi="ctnOptions options">' +
                                   '</div>' +
                                 '</div>';
//听英写英中
businesscomponents.Select.vocabularydictationHtml = '<div class="copySelect fl" gi="selectBox" style="width:106px;">' +
                                   '<div class="copySelectText copySelectOpen" gi="lblSelected title">答案</div>' +
                                   '<div class="copySelectBox copySelectBoxMH90 copyScroll" style="width:104px; display:block;" gi="ctnOptions options">' +
                                   '</div>' +
                                 '</div>';