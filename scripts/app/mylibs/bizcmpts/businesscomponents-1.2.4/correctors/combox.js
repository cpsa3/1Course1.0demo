//
/*
* 功能:下拉框
* 作者:小潘
* 日期:20130730
* 示例代码 var test_combox = new businesscomponents.correctors.ComBox();  test_combox.setSelectText("请选择一个")
* test_combox.setItemData([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9])
*/
var businesscomponents = businesscomponents || {};

businesscomponents.correctors = businesscomponents.correctors || {};

businesscomponents.correctors.ComBox = function (opt_html) {
    businesscomponents.correctors.Topbar.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.correctors.ComBox.html)[0]);
    //选择框样式
    this._selectClass = "copySelectText copySelectEllipsis";
    this._selectOpenClass = "copySelectText copySelectOpen copySelectEllipsis";
    this._selectErrClass = "copySelectText copySelectError copySelectEllipsis";
    this._selectDisClass = "copySelectText copySelectDis copySelectEllipsis";
    //选择框默认文本
    this._selectText = "请选择";

    this._dropMaxClass2 = "copySelectBox copyScroll copySelectBoxMH90";
    this._dropMaxCount = 3;

    this._$selectText = $($(this._element).find('[gi~="selectText"]')[0]);
    this._$selectBox = $($(this._element).find('[gi~="selectBox"]')[0]);

    this._ItemData = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];
    
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.correctors.ComBox, toot.view.ViewBase);
toot.extendClass(businesscomponents.correctors.ComBox, {
    _init_manageEvents: function () {
        businesscomponents.correctors.ComBox.superClass._init_manageEvents.call(this);
        var _this = this;
        //绑定点击事件

        this._$selectText.bind("click", { classThis: _this }, _this.showSelect);
        //点击页面隐藏下拉框
        $(document).click(function () {
            if (!_this._$selectBox.is(":hidden")) {
                _this._$selectBox.hide();
            }
            
        });
    },

    _init: function () {
        this._init_manageEvents();
        this._init_render();

    },

    setModelAndUpdateUI: function (model) {
        if (this._model == model) return;
        businesscomponents.correctors.ComBox.superClass.setModelAndUpdateUI.call(this, model);
    },
    updateUIByModel: function () {
        //设置默认值
        if (this._model) {
            this._$selectText.html(this._model);
            this._$selectText.attr("title", this._model);
        } else {
            this._$selectText.html(this._selectText);
        }
        //渲染下拉数据
        var selectItem = "";
        for (var i = 0; i < this._ItemData.length; i++) {
            selectItem = selectItem + "<a href='javascript:;' title='" + this._ItemData[i] + "' >" + this._ItemData[i] + "</a>";
        }
        this._$selectBox.html(selectItem);
        
        //
        if (this._ItemData.length > this._dropMaxCount) {
            this._$selectBox.attr("class", this._dropMaxClass2);
        }

        var _this = this;
        //绑定点击事件
        var item = this._$selectBox.find("a");

        for (var i = 0; i < item.length; i++) {
            $(item[i]).bind("click", { classThis: _this }, _this.choseItem);
        }
        //默认隐藏
        this._$selectBox.hide();
    },

    setSelectClass: function (selectclass) {
        this._selectClass = selectclass;
    },
    setSelectOpenClass: function (selectopenclass) {
        this._selectOpenClass = selectopenclass;
    },
    setSelectErrClass: function (selecterrclass) {
        this._selectErrClass = selecterrclass;
    },
    setSelectDisClass: function (selectdisclass) {
        this._selectDisClass = selectdisclass;
    },
    setSelectText: function (selecttext) {
        this._selectText = selecttext;
    },

    //设置下拉数据
    setItemData: function (itemdata) {
        this._ItemData = itemdata;
        this.updateUIByModel();
    },

    choseItem: function (event) {
        var classThis = event.data.classThis;
        var itemValue = $(this).html();
        classThis._$selectText.html(itemValue);
        //设置model
        classThis.setModel(itemValue);
        classThis._$selectBox.hide();
    },
    showSelect: function (event) {
        var classThis = event.data.classThis;
        if (event && event.stopPropagation)
        //因此它支持W3C的stopPropagation()方法
            event.stopPropagation();
        else
        //否则，我们需要使用IE的方式来取消事件冒泡
            window.event.cancelBubble = true;
        
        if (classThis._$selectBox.is(":hidden")) {
            classThis._$selectBox.attr("class", this._selectOpenClass);
            classThis._$selectBox.show();
        }
        else {
            classThis._$selectBox.attr("class", this._selectClass);
            classThis._$selectBox.hide();
        }
    },
    updateSelect: function () {



    }


});

businesscomponents.correctors.ComBox.html = '<div class="copySelect fl" style="width:78px;">' +
    '<div class="copySelectText copySelectEllipsis" gi="selectText"></div>' +
    '<div class="copySelectBox" style="width:76px; " gi="selectBox">' +
    '</div>' +
    '</div>';


//    下拉菜单
//    默认样式： <div class="copySelectText">请选择</div>
//    打开下拉菜单时样式： <div class="copySelectText copySelectOpen">请选择</div>
//    报错时样式：<div class="copySelectText copySelectError">请选择</div>
//    不可用时样式：<div class="copySelectText copySelectDis">请选择</div>
            