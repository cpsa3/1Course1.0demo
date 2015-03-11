//
/*
* 功能:配置表格
* 作者:小潘
* 日期:20130817
* code：businesscomponents.editors.AddTable()
*/
var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.tablequestion = businesscomponents.editors.tablequestion || {};




businesscomponents.editors.tablequestion.Table = function (opt_html) {
    businesscomponents.editors.tablequestion.Table.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.tablequestion.Table.html)[0]);
    this._iv = new businesscomponents.editors.InitialView();
    this._iv.getLbl1().setText("添加");
    this._iv.getLbl2().setText("表格");
    this._iv.setLayoutboxClass("marB10 NotfilledS4 taskTableEditor");

    this._iv.replaceTo($(this._element).find('[gi~="anchorInitialView"]')[0]);


    //    this._rtQuestion = new businesscomponents.editors.RichText();
    //    this._rtQuestion.getInitialView().getLbl2().setText("题干");
    //    this._rtQuestion.appendTo($(this._element).find('[gi~="topic"]')[0]);
    //    this._rtQuestion.setConfigFile('/content3/Scripts/ckeditorconfigs/choicequestion.js');


    this._$editView = $(this._element).find('[gi~="EditView"]');

    this._$rows = $(this._element).find('[gi~="rows"]');

    this._$columns = $(this._element).find('[gi~="columns"]');

    this._$showTable = $(this._element).find('[gi~="showTable"]');

    this._rowsTextBox = new toot.ui.TextBox(this._$rows[0]);

    this._columnsTextBox = new toot.ui.TextBox(this._$columns[0]);

    this._rows = null;
    this._colums = null;

    this._inputStyle = "textSytle9 boxStyle1";
    this._inputErrorStyle = "textstyle9_error boxStyle1";

    this._isCheck = "checkboxStyle2";

    this._unCheck = "checkboxStyle";

    this._detailTable = $(this._element).find('[gi~="detailTable"]')[0];

    this._viewState = "Initial";
    //确认
    this._btnSub = new toot.ui.Button($(this._element).find('[gi~="btnSub"]')[0]);

    this._btnCancel = new toot.ui.Button($(this._element).find('[gi~="btnCancel"]')[0]);

    this._btnCloseItem = new toot.ui.Button($(this._element).find('[gi~="closeItem"]')[0]);

    this._msgBar = null;


    if (this.constructor == arguments.callee) this._init();
};

toot.inherit(businesscomponents.editors.tablequestion.Table, businesscomponents.editors.SwitchableView);

toot.extendClass(businesscomponents.editors.tablequestion.Table, {
    _init_manageEvents: function () {
        businesscomponents.editors.tablequestion.Table.superClass._init_manageEvents.call(this);
        var _this = this;
        toot.connect(this._btnCancel, "action", this, this._onBtnCancelAction);
        toot.connect(this._btnSub, "action", this, this._onBtnSubAction);
        toot.connect(this._btnCloseItem, "action", this, this._onbtnCloseTable);
        this._$rows.focus(function () {
            _this._$rows.attr("class", _this._inputStyle);
        });
        this._$columns.focus(function () {
            _this._$columns.attr("class", _this._inputStyle);
        });

        toot.connect(this._iv, "click", this, function () {
            this.setViewState("Edit");
        });

        this._$showTable.hide();
    },

    _init: function () {
        this._init_manageEvents();
        this._renderViewState();
    },
    //cancel btn
    _onBtnCancelAction: function () {
        this.setViewState("Initial");
    },

    _validate: function () {

        var state = true;
        if (!this._rows || isNaN(this._rows) || this._rows > 20 || this._rows < 2) {
            this._$rows.attr("class", this._inputErrorStyle);
            state = false;
        }
        if (!this._colums || isNaN(this._rows) || this._colums > 10 || this._colums < 2) {
            this._$columns.attr("class", this._inputErrorStyle);
            state = false;
        }

        if (!state && this._msgBar) this._msgBar.setMessage("请正确填写行列数", true);

        return state;
    },
    _onBtnSubAction: function () {
        this._rows = this._rowsTextBox.getValue();
        this._colums = this._columnsTextBox.getValue();
        if (this._validate()) {
            //添加表格，并隐藏自己
            this.setViewState("Hide");
            this._$showTable.show();
            this._detailTable.innerHTML = "";
            var detailTableHtml = this._detailTableHtml()
            $(detailTableHtml).appendTo(this._detailTable);
            //拼完表格之后绑定checkbox点击事件
            var _this = this;
            _this._bindChoiceClick();
        }
    },
    //绑定点击事件
    _bindChoiceClick: function () {
        var _this = this;
        $(this._detailTable).find('[gi^="choiceBox"]').each(function (i) {
            $(this).click(function () {
                if ($(this).attr("class") == _this._isCheck)
                    $(this).attr("class", _this._unCheck);
                else
                    $(this).attr("class", _this._isCheck);
            })
        })
    },
    _renderViewState: function () {
        if (this._viewState == "Initial") {

            this._rowsTextBox.setValue("");
            this._columnsTextBox.setValue("");

            this._iv.setVisible(true);
            this._$editView.hide();
        }
        else if (this._viewState == "Edit") {
            this._iv.setVisible(false);
            this._$editView.show();
        }
        else if (this._viewState == "Hide") {
            this._iv.setVisible(false);
            this._$editView.hide();
        }
    },
    //--public function
    //设置状态，并改变UI。对应值：Initial（初始），Edit（编辑），Hide（隐藏）
    setViewState: function (state) {
        this._viewState = state;
        this._renderViewState();
    },
    //行数输入框：type:TextBox
    getRowsTextBox: function () {
        return this._rowsTextBox;
    },
    //列数输入框：type:TextBox
    getColumsTextBox: function () {
        return this._columnsTextBox;
    },
    //确定按钮,type:Button
    getBtnSub: function () {
        return this._btnSub;
    },
    //错误样式：type:string
    getErrorStyle: function () {
        return this._inputErrorStyle;
    },
    //验证规则：返回bool值
    getValidate: function () {
        return this._validate();
    },
    //表格是否填写完整
    //    getValidateTable: function () {
    //        return this._validateTable();
    //    },
    _onbtnCloseTable: function () {
        this._rows = null;
        this._colums = null;

        this._rowsTextBox.setValue("");
        this._columnsTextBox.setValue("");

        this._model = null;
        this.updateUIByModel();

        //        this._iv.setVisible(true);
        //        this._$editView.hide();

        //        this._$showTable.hide();

    },
    //自定义表格格式
    _detailTableHtml: function () {
        var _this = this;
        var allTrHtml = '<tbody>';

        //遍历每一行
        for (var i = 0; i < _this._rows - 1; i++) {
            var thisTr = _this._tbodyTrHtml(i);
            allTrHtml += thisTr;
        }
        allTrHtml += '</tbody>';


        var tableHtml = '<table>';
        tableHtml += _this._theadThHtml();
        tableHtml += allTrHtml;

        tableHtml += '</table>';
        return tableHtml;
    },
    //表格第一行TH
    _theadThHtml: function () {
        var _this = this;
        //计算每个th的宽度
        var thWidth = parseInt(1 / (parseInt(_this._colums) + 2) * 100) + '%';

        //第一行的html
        var theadHtml = '';

        theadHtml += '<thead><tr>'

        //第一行的Th Html
        var theadThHtml = '<th width="' + thWidth + '"><input type="text" class="inputTh" gi="theadTitle" /></th>';

        for (var i = 0; i < _this._colums; i++) {
            theadHtml += theadThHtml;
        }
        theadHtml += '</tr></thead>';
        return theadHtml;
    },
    //自定义表格TR
    _tbodyTrHtml: function (row) {
        var _this = this;
        //tbody开始的第1列Html实体
        var tbodyTr = '<tr gi="trIndex' + row + '">';
        tbodyTd = '<td><input type="text" class="inputTd" value="" gi="questionTitle" /></td>';
        tbodyTr += tbodyTd;
        //生成一行的checkBoxHtml
        var tdChoic = '';
        for (var i = 0; i < _this._colums - 1; i++) {
            var tdChoic = '<td class="optionbox4"><span class="checkboxStyle" gi="choiceBox"></span></td>';
            tbodyTr += tdChoic;
        }
        tbodyTr += '</tr>';
        return tbodyTr;
    },
    //拼数据
    updateModelByUI: function () {
        var _this = this;
        if (this._viewState != "Hide")
            this._model = null;
        else {
            var model = new models.components.tablequestion.Table();
            var theadTitleList = [];
            var contentList = [];
            $(this._detailTable).find('[gi~="theadTitle"]').each(function () {
                theadTitleList.push($(this).val());
            })
            $(this._detailTable).find('[gi^="trIndex"]').each(function (i) {
                var trContent = _this.updateTrContentByUI(i);
                contentList.push(trContent);
            })
            model.setTheadTitleList(theadTitleList);
            model.setContentList(contentList);
            //            model.setTopic(this._rtQuestion.updateAndGetModelByUI());
            this._model = model;
        }
    },
    updateTrContentByUI: function (trIndex) {
        var _this = this;
        var trModel = new models.components.tablequestion.Content();
        var TrCnotent = $(this._detailTable).find('[gi~="trIndex' + trIndex + '"]')[0];
        var questionTitle = $($(TrCnotent).find('[gi~="questionTitle"]')[0]).val();
        var questionChoiceList = [];
        $(TrCnotent).find('[gi~="choiceBox"]').each(function () {
            var choiceModel = new models.components.tablequestion.Choice();
            if ($(this).attr("class") == _this._isCheck)
                choiceModel.setIsAnswer(true);
            else
                choiceModel.setIsAnswer(false);
            questionChoiceList.push(choiceModel);
        })
        trModel.setQuestionTitle(questionTitle);
        trModel.setQuestionChoiceList(questionChoiceList);
        return trModel;
    },
    //get,set,parse什么的真心麻烦，希望从数据库拿json化之后
    //直接拿属性处理
    updateUIByModel: function () {
        var _this = this;
        if (this._model) {
            this._viewState = "Hide";
            this._iv.setVisible(false);
            this._$editView.hide();
            this._$showTable.show();

            //            this._rtQuestion.setModelAndUpdateUI(this._model.getTopic());
            //初始化列数
            this._colums = this._model._theadTitleList.length;
            //初始化行书
            this._rows = this._model._contentList.length + 1;
            //绘制表格数据和行列
            this._detailTable.innerHTML = "";
            var detailTableHtml = this._detailTableHtml()
            var detailTableHtml = this._detailTableHtml();

            $(detailTableHtml).appendTo(this._detailTable);


            //赋值theadTitle
            $(this._detailTable).find('[gi~="theadTitle"]').each(function (i) {
                $(this).val(_this._model._theadTitleList[i]);
            });
            //给每行赋值
            $(this._detailTable).find('[gi^="trIndex"]').each(function (i) {
                $($(this).find('[gi~="questionTitle"]')[0]).val(_this._model._contentList[i]._questionTitle);
                $(this).find('[gi~="choiceBox"]').each(function (j) {
                    if (_this._model._contentList[i]._questionChoiceList[j]._isAnswer == true)
                        $(this).attr("class", _this._isCheck);
                    else
                        $(this).attr("class", _this._unCheck);
                });
            })
            _this._bindChoiceClick();
        }
        else {
            this._viewState = "Initial";
            this._iv.setVisible(true);
            this._$editView.hide();
            this._$showTable.hide();

            this._rowsTextBox.setValue("");
            this._columnsTextBox.setValue("");
        }

    },

    getMsgBar: function () { return this._msgBar },
    setMsgBar: function (bar) { this._msgBar = bar }

    //    ,
    //    _validateTable: function () {
    //        var _this = this;
    //        //theadTitle没写
    //        var isValidate = true;
    //        $(this._detailTable).find('[gi~="theadTitle"]').each(function (i) {
    //            isValidate = isValidate && ($(this).val() != "")
    //        });
    //        $(this._detailTable).find('[gi^="trIndex"]').each(function (i) {
    //            //当前行questionTitle没写
    //            isValidate = isValidate && ($($(this).find('[gi~="questionTitle"]')[0]).val() != "");

    //            //每行只能选一个
    //            var trThis = this;
    //            //当前行是否有选上
    //            var currentIsCheck = false;
    //            $(trThis).find('[gi^="choiceBox"]').each(function () {
    //                currentIsCheck = currentIsCheck || ($(this).attr("class") == _this._isCheck);
    //            })

    //            isValidate = isValidate && currentIsCheck;
    //        })
    //        return isValidate;
    //    }
});




businesscomponents.editors.tablequestion.Table.html =
    '<div>' +
//    '<div gi="topic"></div>' +
      '<div gi="anchorInitialView"></div>' +
    '<div class="marB10 NotfilledS4 taskTableEditor"  gi="EditView">' +
    '<span class="colorGray"><span class="font20">+</span>添加</span><span>表格</span>' +
    '<div class="lockMask"></div>' +
    '<div class="taskTableFormNew" >' +
    '<div class="clearfix">' +
    '<div class="fl">' +
    '<span>行数</span>' +
    '<input type="text" class="textSytle9 boxStyle1" gi="rows">' +
    '</div>' +
    '<div class="fr">' +
    '<span>列数</span>' +
    '<input type="text" class="textSytle9 boxStyle1" gi="columns">' +
    '</div>' +
    '</div>' +
    '<div class="btnGroup3 clearfix">' +
    '<button class="fl btn4Back3" gi="btnCancel">返回</button>' +
    '<button class="fr btn4Next3" gi="btnSub">确认</button>' +
    '</div>' +

    '</div>' +
    '</div>' +
    '<div class="taskTableBox taskListen" gi="showTable">' +
    '<span class="closeItem" gi="closeItem"></span>' +
    '<div gi="detailTable">' +
    '</div>'
'</div>' +
    '</div>';


//            <!-- 错误样式：<input type="text" class="textstyle9_error StyleW6 StyleH1" /> -->
//              <!-- 错误样式：<input type="text" class="textstyle9_error StyleW6 StyleH1" /> -->