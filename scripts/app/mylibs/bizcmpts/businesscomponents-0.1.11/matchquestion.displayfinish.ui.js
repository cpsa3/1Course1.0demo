/*
* 功能:概括题 排序题 报告页面
* 作者:杜吉
* 日期：2013.8.29
*/

var businesscomponents = businesscomponents || {};

businesscomponents.matchquestion = businesscomponents.matchquestion || {};

businesscomponents.matchquestion.ui = businesscomponents.matchquestion.ui || {};

businesscomponents.matchquestion.ui.displayfinish = businesscomponents.matchquestion.ui.displayfinish || {};

businesscomponents.matchquestion.ui.displayfinish.Question = function () {
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

toot.inherit(businesscomponents.matchquestion.ui.displayfinish.Question, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.matchquestion.ui.displayfinish.Question, {
    updateUIByModel: function () {
        this._topic.innerHTML = this.getRequestModel().getTopic();
        this._choiceSelect.innerHTML = businesscomponents.matchquestion.ui.displayfinish.ChoiceSelect.Html(this.getRequestModel().getChoices());
        if (this.getRequestModel().getForm().getType() == 10) {
            this._answerBox2.innerHTML = "";
            $(this._answerBox2).hide();
            this._answerBox.innerHTML = businesscomponents.matchquestion.ui.displayfinish.AnswerBox.Html(this.getRequestModel().getForm());
        }
        else {
            this._answerBox.innerHTML = "";
            $(this._answerBox).hide();
            this._answerBox2.innerHTML = businesscomponents.matchquestion.ui.displayfinish.AnswerBox.Html(this.getRequestModel().getForm());
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
            for (var j = 0; j < from.getItems().length; j++) {
                //题目
                if (from.getItems()[j].getType() == 30) {
                    //上一题不是答案，则代表需要重新分组
                    if (!hasAnswer) {
                        answerItem = {};
                        //下标+1;答案位置清空
                        answerItem.index = answerGroups.length;
                        answerItem.answerIndex = [];
                        answerGroups.push(answerItem);
                    }
                    else {
                        answerItem.index = answerGroups.length;
                    }
                    var answer = from.getItems()[j].getAnswer()
                    if (!answerItem.answerIndex) {
                        answerItem.answerIndex = [];
                    }
                    answerItem.answerIndex.push(answer + 1);
                    hasAnswer = true;
                    num++;
                }
                else {
                    hasAnswer = false;
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
                        //分组
                        var group = cell.getGroup();
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


        answerGroups.sort(function compare(a, b) {
            return a.index - b.index;
        });
        return answerGroups;
    },
    _initialise: function () {
        var _this = this;
        var answerGroups;
        var rtCountArr = []; //正确题量,总题量数组 [[r=1;t=2],[r=3;t=3]]
        //概括题
        if (this.getResponseModel() && this.getRequestModel().getForm().getType() == 10) {
            //答案数组
            answerGroups = this._getAnswerGroups(this.getRequestModel().getForm().getType(), this.getRequestModel().getForm());
            var index = 0;
            var qCount = 0; //题目数量
            var qRightCount = 0;    //答对数量
            var qIndex = 0; //getMyAnswer数组包含t，answergroups不包含t，所以加一个计数器，否则answergroup[i]取不到值

            for (var i = 0; i < this.getResponseModel().getMyAnswer().length; i++) {
                var rtCount = {}; //正确题量/总题量 {r=1;t=2}
                rtCount.rightCount = 0;
                rtCount.totalCount = 0;
                for (var j = 0; j < this.getResponseModel().getMyAnswer()[i].length; j++) {
                    var isRight = false;
                    var rightIndex;
                    var currentAnswer = parseInt(this.getResponseModel().getMyAnswer()[i][j]);

                    if (answerGroups[qIndex]) {
                        for (var n = 0; n < answerGroups[qIndex].answerIndex.length; n++) {
                            if (answerGroups[qIndex].answerIndex[n] == currentAnswer + 1) {
                                isRight = true;
                                rtCount.rightCount++;
                                break;
                            }
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
                    rtCount.totalCount++;
                }

                if (this.getResponseModel().getMyAnswer()[i].length > 0) {
                    qIndex++;
                    rtCountArr.push(rtCount);
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
            groupList.sort();
            for (var i = 0; i < groupList.length; i++) {
                var data = this.getResponseModel().getMyAnswer()[i];
                if (!data) {
                    data = [];
                    for (var i2 = 0; i2 < answerGroups[i].answerIndex.length; i2++) {
                        data.push(-1);
                    }
                }

                var rtCount = {}; //正确题量/总题量 {r=1;t=2}
                rtCount.rightCount = 0;
                rtCount.totalCount = 0;

                $(this._element).find('[group~="' + groupList[i] + '"]').each(function (j) {
                    if (data[j] != -1) {
                        var isRight = false;
                        if (answerGroups[i]) {
                            for (var n = 0; n < answerGroups[i].answerIndex.length; n++) {
                                if (answerGroups[i].answerIndex[n] == parseInt(data[j]) + 1) {
                                    isRight = true;
                                    rtCount.rightCount++;
                                    break;
                                }
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
                    rtCount.totalCount++;
                    qCount++;
                })

                rtCountArr.push(rtCount);
            }
        }

        if (answerGroups.length > 0) {
            for (var i = 0; i < answerGroups.length; i++) {
                if (rtCountArr[i]) {
                    var html = '';
                    if (rtCountArr[i].totalCount == rtCountArr[i].rightCount && rtCountArr[i].rightCount > 0) {
                        html += "<div class=rightTipsbox>第" + (i + 1) + "组 正确答案：<span>";
                        html += answerGroups[i].answerIndex.join(',') + "";
                        html += "</span></div>";
                        //全错
                        $(this._choiceAnswers).append(html);
                    }
                    else if (rtCountArr[i].rightCount == 0) {
                        html += '<div class="errorTipsbox2">第' + (i + 1) + '组 正确答案：<span>';
                        html += answerGroups[i].answerIndex.join(', ') + "";
                        html += "</span></div>";
                        $(this._choiceAnswers).append(html);
                    }
                    else {
                        html += '<div class="TipsboxStyle3">第' + (i + 1) + '组 正确答案：<span>';
                        html += answerGroups[i].answerIndex.join(', ') + "";
                        html += "</span></div>";
                        $(this._choiceAnswers).append(html);
                    }
                }
                else {
                    var html = '';
                    html += '<div class="errorTipsbox2">第' + (i + 1) + '组 正确答案：<span>';
                    html += answerGroups[i].answerIndex.join(', ') + "";
                    html += "</span></div>";
                    $(this._choiceAnswers).append(html);
                }
            }
        }
        else {
            var html = '';
            html += '<div class="errorTipsbox2">正确答案：<span>未配置';
            html += "</span></div>";
            $(this._choiceAnswers).append(html);
        }
    }
})

//答案选择框
businesscomponents.matchquestion.ui.displayfinish.ChoiceSelect = {};
businesscomponents.matchquestion.ui.displayfinish.ChoiceSelect.Html = function (choicesList) {
    var html = '';
    for (var i = 0; i < choicesList.length; i++) {
        var choicesAnswerValue = i;
        html += '<div class="optionbox6"><div class="fl optionbox2">' + (choicesAnswerValue + 1) + '</div><div class="TxtboxStyle3">' + choicesList[i].getContent() + '</div></div>';
    }
    return html;
}

//学生答案框
businesscomponents.matchquestion.ui.displayfinish.AnswerBox = {};
businesscomponents.matchquestion.ui.displayfinish.AnswerBox.Html = function (form) {
    //list
    if (form.getType() == 10) {
        var html = businesscomponents.matchquestion.ui.displayfinish.AnswerBox.ListHtml(form.getItems());
        return html;
    }
    //table
    else {
        var html = businesscomponents.matchquestion.ui.displayfinish.AnswerBox.TableHtml(form);
        return html;
    }
}

//学生答题部分，为table类型
businesscomponents.matchquestion.ui.displayfinish.AnswerBox.TableHtml = function (tableForm) {
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
businesscomponents.matchquestion.ui.displayfinish.AnswerBox.ListHtml = function (listItem) {
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
businesscomponents.matchquestion.ui.displayfinish.AnswerBox.ListQuestionNum = function (listItem) {
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
