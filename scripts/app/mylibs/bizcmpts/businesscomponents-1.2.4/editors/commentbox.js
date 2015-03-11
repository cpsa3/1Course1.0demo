//
/*
* 功能:自动增高文本框
* 作者:小潘
* 修改切换时晃动bug，22:06 8/02
* 日期:20130731
* 复制来扩展下： 侯百京 
* update: 修复不能自动增高的bug，修复切换输入状态时输入框会抖动的情况 by xp 2015年2月2日 18:03:23
*/

var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.CommentBox = function(optHtml, jq) {
    businesscomponents.editors.CommentBox.superClass.constructor.call(this, $(optHtml !== undefined ? optHtml : businesscomponents.editors.CommentBox.html)[0]);
    //引入外部jquery版本
    this._$ = jq !== undefined ? jq : $;

    var $Box = $(this._element).find('[gi~="Box"]');
    this._elementBox = $Box.length > 0 ? $Box[0] : this._element;

    this._textareaBox = $(this._element).find('[gi~="textareaBox"]')[0];

    this._InitialView = new toot.ui.Label($(this._element).find('[gi~="InitialView"]')[0]);

    this._$textareaBox = $(this._textareaBox);
    this._$textareaBox.hide();

    this._viewState = 1; //默认状态
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.CommentBox, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.CommentBox, {
    setText: function(text) {
        this._InitialView.setText(text);
    },
    setHtml: function(text) {
        $(this._InitialView.getElement()).html(text);
    },
    _init_manageEvents: function() {
        businesscomponents.editors.CommentBox.superClass._init_manageEvents.call(this);

        $(this._elementBox).click(
            $.proxy(function() {
                this._viewState = 2;
                this._renderViewState();
                this._textareaBox.focus();
            }, this)
        );

        this._$textareaBox.blur(
            $.proxy(function() {
                if (this._$textareaBox.val() == "") {
                    this._viewState = 1;
                    this._renderViewState();
                }
            }, this)
        );

    },

    _render: function() {
        businesscomponents.editors.CommentBox.superClass._render.call(this);
        this._renderMinHeight();
    },

    _minHeight: 30,
    getMinHeight: function() {
        return this._minHeight;
    },
    setMinHeight: function(minHeight) {
        this._minHeight = minHeight;
        this._renderMinHeight();
    },
    _renderMinHeight: function() {
        this._$textareaBox.css("minHeight", this._minHeight + "px");
    },
    getInitialView: function() {
        return this._InitialView;
    },
    ltrim: (function() {
        // We are not using \s because we don't want "non-breaking spaces" to be caught.
        var trimRegex = /^[ \t]+/g;
        return function(str) {
            return str.replace(trimRegex, '');
        };
    })(),
    rtrim: (function() {
        // We are not using \s because we don't want "non-breaking spaces" to be caught.
        var trimRegex = /[ \t]+$/g;
        return function(str) {
            return str.replace(trimRegex, '');
        };
    })(),
    updateUIByModel: function() {
        if (this._model) {
            this._viewState = 2;
            this._renderViewState();
            this._$textareaBox.val(this._model);
            //初始化
            this._$(this._textareaBox).autosize();
            this._$textareaBox.css("resize", "");
            this._$textareaBox.css("display", "block");

        } else {
            this._viewState = 1;
            this._renderViewState();
            this._$textareaBox.val("");
            this._$(this._textareaBox).autosize();
            this._$textareaBox.css("resize", "");
        }


    },
    updateModelByUI: function() {

        if (this._viewState == 1) this._model = '';
        else if (this._viewState == 2) this._model = this.rtrim(this.ltrim(this._$textareaBox.val()));
    },
    _renderViewState: function() {

        if (this._viewState == 1) {
            $(this._elementBox).show();
            this._$textareaBox.hide();
        } else if (this._viewState == 2) {
            $(this._elementBox).hide();
            this._$textareaBox.show();
            this._$textareaBox.css("resize", "");
            this._$textareaBox.css("display", "block");
        }
    }
});
businesscomponents.editors.CommentBox.html =
    '<div>' +
    '<div class="marB10 NotfilledS1" style="height:300px;line-height:300px; width:578px;" gi="Box">' +
    '<span class="colorGray" gi="InitialView"></span>' +
    '</div>' +
    '<textarea  class="marB10 textareastyle2" style="width:568px;height:296px"  gi="textareaBox"> ' +
    '</textarea>' +
    '</div>';

businesscomponents.editors.CommentBox.htmlforintelligentdictation =
    '<div>' +
    '<div class="marB10 textareastyle2" style="height:300px; width:568px; text-align: left;"  gi="Box">' +
    '<span class="colorGray" gi="InitialView"></span>' +
    '</div>' +
    '<textarea  class="marB10 textareastyle2"  gi="textareaBox" style="height:300px; width:568px;">' +
    '</textarea>' +
    '</div>';