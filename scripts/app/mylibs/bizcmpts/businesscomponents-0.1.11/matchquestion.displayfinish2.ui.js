/*
* 功能:概括题 排序题 报告页面 托福听力专用
* 作者:杜吉
* 日期：2013.8.29
*/

var businesscomponents = businesscomponents || {};

businesscomponents.matchquestion = businesscomponents.matchquestion || {};

businesscomponents.matchquestion.ui = businesscomponents.matchquestion.ui || {};

businesscomponents.matchquestion.ui.displayfinish2 = businesscomponents.matchquestion.ui.displayfinish2 || {};

businesscomponents.matchquestion.ui.displayfinish2.Question = function () {
    businesscomponents.ui.RnRItem.call(this,
     $('<div class="readbox3">' +
            '<div class="R3_questionbox" gi="topic">' +

            '</div>' +
            '<div class="R3_AnswerArea" gi="answerBox">' +

            '</div>' +
            '<div class="R3_AnswerArea2" gi="answerBox2">' +

            '</div>' +
            '<div class="R3_AnswerAreaTitle">Answer Choices</div>' +
            '<div class="R3_answerbox clearfix" gi="choiceSelect">' +
            '</div><div class="R3_AnswerArea" gi="choiceAnswers"></div>' +
        '</div>').get(0), null);

    //要求
    this._topic = $(this._element).find('[gi~="topic"]')[0];
    //答案选择框
    this._choiceSelect = $(this._element).find('[gi~="choiceSelect"]')[0];
    //学生答题框List
    this._answerBox = $(this._element).find('[gi~="answerBox"]')[0];

    //学生答题框table
    this._answerBox2 = $(this._element).find('[gi~="answerBox2"]')[0];

    //学生正确答案提示
    this._choiceAnswers = $(this._element).find('[gi~="choiceAnswers"]')[0];
};

toot.inherit(businesscomponents.matchquestion.ui.displayfinish2.Question, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.matchquestion.ui.displayfinish2.Question, {
    updateUIByModel: function () {
        this._topic.innerHTML = this.getRequestModel().getTopic();
        this._choiceSelect.innerHTML = businesscomponents.matchquestion.ui.displayfinish2.ChoiceSelect.Html(this.getRequestModel().getChoices());
        if (this.getRequestModel().getForm().getType() == 10) {
            this._answerBox2.innerHTML = "";
            $(this._answerBox2).hide();
            this._answerBox.innerHTML = businesscomponents.matchquestion.ui.displayfinish2.AnswerBox.Html(this.getRequestModel().getForm());
        }
        else {
            this._answerBox.innerHTML = "";
            $(this._answerBox).hide();
            this._answerBox2.innerHTML = businesscomponents.matchquestion.ui.displayfinish2.AnswerBox.Html(this.getRequestModel().getForm());
        }
        //绑定div拖动和如果有答案，显示结果
        this._initialise();
    },
    //获取分组后的答案
    //[{index:1;answerIndex:[1,2,3]},{index:2;answerindex:[2,3,1]}] 返回数组下标从1开始
    _getAnswerGroups: function (type, from) {
        var from = this.getRequestModel().getForm();
        var answerGroups = [];
        var answerItem = {};
        var num = 0;
        var hasAnswer = true;  //上一个是否答案
        //搭配题
        if (type == 10) {

            answerItem = {};
            answerItem.index = 0;
            answerItem.answerIndex = [];
            answerGroups.push(answerItem);
            for (var j = 0; j < from.getItems().length; j++) {
                //题目
                if (from.getItems()[j].getType() == 30) {
                    var answer = from.getItems()[j].getAnswer()
                    answerItem.answerIndex.push(answer + 1);
                    num++;
                }
            }

            if (num == 0) {
                answerGroups = [];
            }
        }
        //表格题
        else if (type == 20) {
            for (var i = 0; i < from.getRows().length; i++) {
                var row = from.getRows()[i];
                for (var j = 0; j < row.getCells().length; j++) {
                    var cell = row.getCells()[j];
                    //题目
                    if (cell != null && cell.getType() == 30) {
                        //分组 听力永远只有一组题
                        var group = 0;
                        //答案
                        var answer = cell.getAnswer();
                        var isGroupExist = false;
                        var tAnswerGroup;
                        for (var n = 0; n < answerGroups.length; n++) {
                            answerGroup = answerGroups[n];
                            if (answerGroup.index == group) {
                                isGroupExist = true;
                                tAnswerGroup = answerGroup;
                                break;
                            }
                        }
                        //分组是否存在
                        if (isGroupExist) {
                            //存在,则把当前位置存储到答案集合里
                            tAnswerGroup.answerIndex.push((answer + 1));
                        }
                        else {
                            answerItem = {};
                            //不存在,创建一个新集合
                            answerItem.index = group;
                            answerItem.answerIndex = [];
                            answerItem.answerIndex.push((answer + 1));
                            answerGroups.push(answerItem);
                        }

                        num++;
                    }
                }

                if (num == 0) {
                    answerGroups = [];
                }
            }
        }

        answerGroups = answerGroups.sort();
        return answerGroups;
    },
    _initialise: function () {
        var _this = this;
        var answerGroups;
        //概括题
        if (this.getResponseModel() && this.getRequestModel().getForm().getType() == 10) {
            //答案数组
            answerGroups = this._getAnswerGroups(this.getRequestModel().getForm().getType(), this.getRequestModel().getForm());
            var index = 0;
            var qCount = 0; //题目数量
            var qRightCount = 0;    //答对数量

            for (var i = 0; i < this.getResponseModel().getMyAnswer().length; i++) {
                for (var j = 0; j < this.getResponseModel().getMyAnswer()[i].length; j++) {
                    var isRight = false;
                    var rightIndex;
                    var currentAnswer = parseInt(this.getResponseModel().getMyAnswer()[i][j]);
                    if (answerGroups[0]) {
                        if (answerGroups[0].answerIndex[index] == currentAnswer + 1) {
                            isRight = true;
                        }
                    }

                    if (currentAnswer != -1) {
                        var currentAnswerHtml = $($(this._element).find('[gi~="aChoice"]')[currentAnswer]).html();

                        if (isRight) {
                            qRightCount++;
                            $($(this._element).find('[gi~="optionbox5"]')[index]).html('<span class="answerTxt1">' + (currentAnswer + 1) + '</span><em class="rightIcon"></em>');
                        }
                        else {
                            $($(this._element).find('[gi~="optionbox5"]')[index]).html('<span class="answerTxt2">' + (currentAnswer + 1) + '</span><span class="wrongIcon"></span>');
                        }
                        qCount++;
                    }
                    else {
                        $($(this._element).find('[gi~="optionbox5"]')[index]).html('<span class="answerTxt2">未选</span><span class="wrongIcon"></span>');
                    }
                    index++;
                }
            }
        }
        //表格题
        else if (this.getResponseModel() && this.getRequestModel().getForm().getType() == 20) {
            //答案数组
            answerGroups = this._getAnswerGroups(this.getRequestModel().getForm().getType(), this.getRequestModel().getForm());
            var qCount = 0; //题目数量
            var qRightCount = 0;    //答对数量
            //[3,1,4,5]组的
            var groupList = [];
            $(this._element).find('[gi~="optionbox5"]').each(function () {
                var group = $(this).attr("group");
                var isHas = true;
                for (var i = 0; i < groupList.length; i++) {
                    if (groupList[i] == group) {
                        isHas = false;
                    }
                }
                if (isHas) {
                    groupList.push(group);
                }
            })

            for (var i = 0; i < groupList.length; i++) {
                var data = this.getResponseModel().getMyAnswer()[i];
                if (data) {
                    $(this._element).find('[group~="' + groupList[i] + '"]').each(function (j) {
                        if (data[j] != -1) {
                            var isRight = false;
                            if (answerGroups[0]) {
                                if (answerGroups[0].answerIndex[j] == parseInt(data[j]) + 1) {
                                    isRight = true;
                                }
                            }

                            if (isRight) {
                                qRightCount++;
                                $(this).html('<span class="answerTxt1">' + (parseInt(data[j]) + 1) + '</span><em class="rightIcon"></em>');
                            }
                            else {
                                $(this).html('<span class="answerTxt2">' + (parseInt(data[j]) + 1) + '</span><span class="wrongIcon"></span>');
                            }
                        }
                        else {
                            $(this).html('<span class="answerTxt2">未选</span><span class="wrongIcon"></span>');
                        }
                        qCount++;
                    })
                }
            }
        }


        if (answerGroups.length > 0) {
            if (qRightCount == qCount && qCount != 0) {
                var html = '';
                //全对
                for (var i = 0; i < answerGroups.length; i++) {
                    html += "<div class=rightTipsbox>第" + (i + 1) + "组 正确答案：<span>";
                    html += answerGroups[i].answerIndex.join(',') + "";
                    html += "</span></div>";
                }
                //全错
                $(this._choiceAnswers).append(html);
            }
            else if (qRightCount == 0) {
                var html = '';
                for (var i = 0; i < answerGroups.length; i++) {
                    html += '<div class="errorTipsbox2">第' + (i + 1) + '组 正确答案：<span>';
                    html += answerGroups[i].answerIndex.join(', ') + "";
                    html += "</span></div>";
                }

                //全错
                $(this._choiceAnswers).append(html);
            }
            else {
                var html = '';
                //半对半错
                for (var i = 0; i < answerGroups.length; i++) {
                    html += '<div class="TipsboxStyle3">第' + (i + 1) + '组 正确答案：<span>';
                    html += answerGroups[i].answerIndex.join(', ') + "";
                    html += "</span></div>";
                }
                //全错
                $(this._choiceAnswers).append(html);
            }
        }
        else {
            var html = '';
            html += '<div class="errorTipsbox2">第' + (i + 1) + '组 正确答案：<span>未配置';
            html += "</span></div>";
            $(this._choiceAnswers).append(html);
        }
    }
})

//答案选择框
businesscomponents.matchquestion.ui.displayfinish2.ChoiceSelect = {};
businesscomponents.matchquestion.ui.displayfinish2.ChoiceSelect.Html = function (choicesList) {
    var html = '';
    for (var i = 0; i < choicesList.length; i++) {
        var choicesAnswerValue = i;
        html += '<div class="optionbox6"><div class="fl optionbox2">' + (choicesAnswerValue + 1) + '</div><div class="TxtboxStyle3">' + choicesList[i].getContent() + '</div></div>';
    }
    return html;
}

//学生答案框
businesscomponents.matchquestion.ui.displayfinish2.AnswerBox = {};
businesscomponents.matchquestion.ui.displayfinish2.AnswerBox.Html = function (form) {
    //list
    if (form.getType() == 10) {
        var html = businesscomponents.matchquestion.ui.displayfinish2.AnswerBox.ListHtml(form.getItems());
        return html;
    }
    //table
    else {
        var html = businesscomponents.matchquestion.ui.displayfinish2.AnswerBox.TableHtml(form);
        return html;
    }
}

//学生答题部分，为table类型
businesscomponents.matchquestion.ui.displayfinish2.AnswerBox.TableHtml = function (tableForm) {
    var html = '';
    var headerData = tableForm._header;
    var rowsData = tableForm._rows;
    var headerHtml = '<thead><tr>';
    var thWidth = (100 / headerData._cells.length) + '%';
    for (var i = 0; i < headerData._cells.length; i++) {
        if (headerData._cells[i] == null) {
            headerHtml += '<th width="' + thWidth + '"></th>';
        }
        else {
            headerHtml += '<th width="' + thWidth + '">' + headerData._cells[i]._text + '</th>';
        }
    }
    headerHtml += '</tr></thead>';

    var bodyHtml = '<tbody>';

    for (var i = 0; i < rowsData.length; i++) {
        bodyHtml += '<tr>';
        for (var j = 0; j < rowsData[i]._cells.length; j++) {
            if (rowsData[i]._cells[j] == null) {
                bodyHtml += '<td><div class="optionbox6"></div></td>';
            }
            else {
                if (rowsData[i]._cells[j]._type == 30) {
                    bodyHtml += '<td><div class="optionbox5" gi="optionbox5" stuAnswer="-1" group="' + rowsData[i]._cells[j]._group + '"></div></td>';
                }
                else {

                    bodyHtml += '<td><div class="optionbox6">' + toot.ui.textToHTML(rowsData[i]._cells[j]._text) + '</div></td>';
                }
            }
        }
        bodyHtml += '</tr>';
    }

    html = '<table>' + headerHtml + bodyHtml + '</table>';

    return html;
}

//学生答题部分，为list类型
businesscomponents.matchquestion.ui.displayfinish2.AnswerBox.ListHtml = function (listItem) {
    //listItem结构为[T,A,A,A,T,A]
    var html = '';
    var textNum = 0;
    for (var i = 0; i < listItem.length; i++) {
        if (listItem[i].getType() == 20) {
            textNum++;
            html += '<div class="optionbox6" gi="optionbox6" >' + listItem[i].getText() + '</div>';
        }
        else {
            html += '<div class="optionbox5" gi="optionbox5" stuAnswer="-1" group="group' + textNum + '"></div>';
        }
    }
    return html;
}

//学生答题部分，为list类型
businesscomponents.matchquestion.ui.displayfinish2.AnswerBox.ListQuestionNum = function (listItem) {
    //listItem结构为[T,A,A,A,T,A]
    var html = '';
    var textNum = 0;
    for (var i = 0; i < listItem.length; i++) {
        if (listItem[i].getType() == 20) {
            textNum++;
        }
    }
    return textNum;
}



