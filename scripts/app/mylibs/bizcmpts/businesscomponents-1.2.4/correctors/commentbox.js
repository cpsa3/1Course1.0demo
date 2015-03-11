//
/*
* 功能:自动增高文本框
* taskanswer-taskquestion-taskcorrect
* 作者:小潘
* 修改切换时晃动bug，22:06 8/02
* 日期:20130731
*/
var businesscomponents = businesscomponents || {};

businesscomponents.correctors = businesscomponents.correctors || {};

businesscomponents.correctors.CommentBox = function (opt_html, jq) {
    businesscomponents.correctors.CommentBox.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.correctors.CommentBox.html)[0]);
    //引入外部jquery版本
    this._$ = jq !== undefined ? jq : $;

    var $Box = $(this._element).find('[gi~="Box"]');
    this._elementBox = $Box.length > 0 ? $Box[0] : this._element;

    this._textareaBox = $(this._element).find('[gi~="textareaBox"]')[0];
    
    this._InitialView = new toot.ui.Label($(this._element).find('[gi~="InitialView"]')[0]);
    this._InitialView.setText("请填写评语");
    this._$textareaBox = $(this._textareaBox);
    this._$textareaBox.hide();
    this._viewState = 1; //默认状态
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.correctors.CommentBox, toot.view.ViewBase);
toot.extendClass(businesscomponents.correctors.CommentBox, {
    _init_manageEvents: function () {
        businesscomponents.correctors.CommentBox.superClass._init_manageEvents.call(this);
        var _this = this;

        $(this._elementBox).click(function () {
            _this._viewState = 2;
            _this._renderViewState();
            _this._textareaBox.focus();
        });

        this._$textareaBox.blur(function () {
            if (_this._$textareaBox.val() == "") {
                _this._viewState = 1;
                _this._renderViewState();
            }
        });

    },

    _render: function () {

        //businesscomponents.correctors.CommentBox.superClass._render.call(this);
        this._renderMinHeight();
    },

    _minHeight: 30,
    getMinHeight: function () {
        return this._minHeight;
    },
    setMinHeight: function (minHeight) {
        this._minHeight = minHeight;
        this._renderMinHeight();
    },
    _renderMinHeight: function () {
//        this._$textareaBox.css("minHeight", this._minHeight + "px");
    },
    getInitialView: function () {
        return this._InitialView;
    },
    ltrim: (function () {
        // We are not using \s because we don't want "non-breaking spaces" to be caught.
        var trimRegex = /^[ \t]+/g;
        return function (str) {
            return str.replace(trimRegex, '');
        };
    })(),
    rtrim: (function () {
        // We are not using \s because we don't want "non-breaking spaces" to be caught.
        var trimRegex = /[ \t]+$/g;
        return function (str) {
            return str.replace(trimRegex, '');
        };
    })(),
    updateUIByModel: function () {
        var _this = this;
        if (this._model) {
            this._viewState = 2;
            this._renderViewState();

            //            this._$(this._textareaBox).autosize({append:_this._model});
            this._$textareaBox.val(this._model);
            //初始化
            this._$(this._textareaBox).autosize();

        } else {
            this._viewState = 1;
            this._renderViewState();
            this._$textareaBox.val("");
            //初始化
            this._$(this._textareaBox).autosize();
        }


    },
    updateModelByUI: function () {
        
        if (this._viewState == 1) this._model = '';
        else if (this._viewState == 2) this._model = this.rtrim(this.ltrim(this._$textareaBox.val()));
    },
    _renderViewState: function () {
        var _this = this;

        if (this._viewState == 1) {
            $(this._elementBox).show();
      
            this._$textareaBox.hide();
        } else if (this._viewState == 2) {
            $(this._elementBox).hide();
            this._$textareaBox.show();
        }
    }
});
//初始视图：请输入评语
businesscomponents.correctors.CommentBox.html =
    '<div>'+
    '<div class="marL20 NotfilledS1 fl" style="height:30px;line-height:30px; width:498px;" gi="Box">' +
        '<span class="colorGray" gi="InitialView"></span>' +
        '</div>'+
    '<textarea  class="marL20 fl NotfilledS3" maxlength="1000"; style="height:23px; line-height:23px;padding:4px 5px 3px 5px;width:488px;resize:none;"  gi="textareaBox"  id="textareaBox"> ' +
        '</textarea>'+
    '</div>';