﻿//
/*
* 功能:表格题做题页面
* 作者:xp
* 日期：2013.8.28
*/


var businesscomponents = businesscomponents || {};

businesscomponents.tablequestion = businesscomponents.tablequestion || {};

businesscomponents.tablequestion.ui = {};
businesscomponents.tablequestion.ui.display = {};

businesscomponents.tablequestion.ui.display.Question = function (opt_html) {

    businesscomponents.ui.RnRItem.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.tablequestion.ui.display.Question.html)[0]);

    //要求
    this._topic = $(this._element).find('[gi~="topic"]')[0];
    //    //答案选择框
    //    this._choiceSelect = $(this._element).find('[gi~="choiceSelect"]')[0];
    //学生答题框
    this._answerBox = $(this._element).find('[gi~="answerBox"]')[0];


};

toot.inherit(businesscomponents.tablequestion.ui.display.Question, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.tablequestion.ui.display.Question, {
    updateUIByModel: function () {
        var _this = this;

        if (this.getRequestModel().getTopic())
            this._topic.innerHTML = this.getRequestModel().getTopic();
        else
            this._topic.innerHTML = "";

        var tableForm = this.getRequestModel().getTable();

        if (tableForm) {
            //初始化列数
            this._colums = tableForm._theadTitleList.length;
            //初始化行书
            this._rows = tableForm._contentList.length + 1;
            //绘制表格数据和行列
            this._answerBox.innerHTML = "";
            var detailTableHtml = this._detailTableHtml();

            $(detailTableHtml).appendTo(this._answerBox);


            //赋值theadTitle
            $(this._answerBox).find('[gi~="theadTitle"]').each(function (i) {
                $(this).html(toot.ui.textToHTML(tableForm._theadTitleList[i]));
            });
            //给每行赋值
            $(this._answerBox).find('[gi^="trIndex"]').each(function (i) {

                $($(this).find('[gi~="questionTitle"]')[0]).html(toot.ui.textToHTML(tableForm._contentList[i]._questionTitle));

            });
            _this._bindChoiceClick();
        }

    },
    //绑定点击事件
    _bindChoiceClick: function () {
        $(this._answerBox).find('[gi^="choiceBox"]').each(function (i) {
            $(this).click(function () {
                if ($(this).attr("class") == "alreadyChoosed")
                    $(this).attr("class", "checkChoice");
                else
                    $(this).attr("class", "alreadyChoosed");
            });
        });
    },
    updateModelByUI: function () {
        var _this = this;
        //清空之前页面的答案，后面重新遍历
        this.setResponseModel(null);
        this._setResponseModelIfNull(models.components.tablequestion.QuestionResponse);

        var responses = [];
        $(this._answerBox).find('[gi^="trIndex"]').each(function (i) {

            var trCnotent = $(_this._answerBox).find('[gi~="trIndex' + i + '"]')[0];

            var answerList = [];
            $(trCnotent).find('[gi~="choiceBox"]').each(function () {
                if ($(this).attr("class") == "alreadyChoosed")
                    answerList.push(true);
                else
                    answerList.push(false);
            });
            responses.push(answerList);
        });
        this.getResponseModel().setMyAnswer(responses);
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
        var thWidth = parseInt(1 / (parseInt(_this._colums - 1)) * 60) + '%';

        //第一行的html
        var theadHtml = '';
        var first = true;
        theadHtml += '<thead><tr>'; //第一行的Th Html


        for (var i = 0; i < _this._colums; i++) {
            if (first) {
                var theadThHtml = '<th gi="theadTitle" width="40%"></th>';
                first = false;
            } else {
                var theadThHtml = '<th gi="theadTitle" width="' + thWidth + '"></th>';
            }

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
        tbodyTd = '<td ><div class="optionbox6" gi="questionTitle"></div></td>';
        tbodyTr += tbodyTd;
        //生成一行的checkBoxHtml
        var isCheckClass = '';
        for (var i = 0; i < _this._colums - 1; i++) {
            //如果有答案
            if (this.getResponseModel()) {
                //绑定答案
                if (this.getResponseModel()[row][i]) {
                    var isCheckClass = 'alreadyChoosed';
                }
                else {
                    var isCheckClass = 'checkChoice';
                }
            }
            else {
                var isCheckClass = 'checkChoice';
            }
            tbodyTr += '<td class="optionbox4"><span class="' + isCheckClass + '" gi="choiceBox"></span></td>';
        }
        tbodyTr += '</tr>';
        return tbodyTr;
    }
});


businesscomponents.tablequestion.ui.display.Question.html = '<div class="contentbox">' +
    '<div class="listenbox1">' +
    '<div class="R3_questionbox" gi="topic">' +
    '</div>' +
    '<div class="R3_AnswerArea2 R3_StyleAdd" gi="answerBox">' +
//    '<table >' +
//    '<thead>' +
//    '<tr>' +
//    '<th></th>' +
//    '<th width="20%">YES</th>' +
//    '<th width="20%">NO</th>' +
//    '</tr>' +
//    '</thead>' +
//    '<tbody>' +
//    '<tr>' +
//    '<td>' +
//    '<div class="optionbox6">There is ice on the Saturn</div>' +
//    '</td>' +
//    '<td class="optionbox4">' +
//    '<span class="checkChoice"></span>' +
//    '</td>' +
//    '<td class="optionbox4">' +
//    '<span class="alreadyChoosed"></span>' +
//    '</td>' +
//    '</tr>' +
//    '<tr>' +
//    '<td>' +
//    '<div class="optionbox6">Saturn has been known since prehistoric times.</div>' +
//    '</td>' +
//    '<td class="optionbox4">' +
//    '<span class="checkChoice"></span>' +
//    '</td>' +
//    '<td class="optionbox4">' +
//    '<span class="checkChoice"></span>' +
//    '</td>' +
//    '</tr>' +
//    '</tbody>' +
//    '</table>' +
    '</div>' +
    '</div>' +
    '</div>';