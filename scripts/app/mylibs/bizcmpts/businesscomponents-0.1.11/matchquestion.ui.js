var businesscomponents = businesscomponents || {};

businesscomponents.matchquestion = businesscomponents.matchquestion || {};

businesscomponents.matchquestion.ui = {};
businesscomponents.matchquestion.ui.display = {};

businesscomponents.matchquestion.ui.display.Question = function (opt_html) {

    businesscomponents.ui.RnRItem.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.matchquestion.ui.display.Question.ReadingHtml)[0]);

    //要求
    this._topic = $(this._element).find('[gi~="topic"]')[0];
    //答案选择框
    this._choiceSelect = $(this._element).find('[gi~="choiceSelect"]')[0];
    //学生答题框List
    this._answerBox = $(this._element).find('[gi~="answerBox"]')[0];

    //学生答题框table
    this._answerBox2 = $(this._element).find('[gi~="answerBox2"]')[0];

    this._questionBox = $(this._element).find('[gi~="questionBox"]')[0];

};

toot.inherit(businesscomponents.matchquestion.ui.display.Question, businesscomponents.ui.RnRItem);
toot.defineEvent(businesscomponents.matchquestion.ui.display.Question, ["drag", "action"]);
toot.extendClass(businesscomponents.matchquestion.ui.display.Question, {
    _composingSytleName: "R3_layoutboxs clearfix",
    _styleName: "",
    updateUIByModel: function () {
        //要求内容
        if (this.getRequestModel().getTopic())
            this._topic.innerHTML = this.getRequestModel().getTopic();
        else
            this._topic.innerHTML = "";

        //布局显示
        if (this._questionBox && this.getRequestModel().getForm().getType() == 10) {
            if (this.getRequestModel().getComposing()) {
                this._questionBox.className = this._composingSytleName;
            } else {
                if (this._questionBox) {
                    this._questionBox.className = this._styleName;
                }
            }
        }
        //答案内容
        this._choiceSelect.innerHTML = businesscomponents.matchquestion.ui.display.ChoiceSelect.Html(this.getRequestModel().getChoices());
        //学生作答区域内容
        var answerBoxHtml = businesscomponents.matchquestion.ui.display.AnswerBox.Html(this.getRequestModel().getForm());
        if (this.getRequestModel().getForm().getType() == 10) {
            $(this._answerBox).show();
            this._answerBox2.innerHTML = "";
            this._answerBox.innerHTML = answerBoxHtml;
            $(this._answerBox2).hide();
        }
        else {
            if (this._questionBox) {
                this._questionBox.className = this._styleName;
            }
            $(this._answerBox2).show();
            this._answerBox.innerHTML = "";
            this._answerBox2.innerHTML = answerBoxHtml;
            $(this._answerBox).hide();
        }
        //绑定div拖动和如果有答案，绑定答案
        this._initialise();
    },
    updateModelByUI: function () {
        this._setResponseModelIfNull(models.components.matchquestion.QuestionResponse);

        //如果是list
        if (this.getRequestModel().getForm().getType() == 10) {
            var responses = [];
            var questionNum = businesscomponents.matchquestion.ui.display.AnswerBox.ListQuestionNum(this.getRequestModel().getForm().getItems());
            //解决AAATAAA结构，T前面的AAA要为一组
            var answer0 = [];
            $(this._element).find('[group~="group0"]').each(function (j) {
                answer0.push(parseInt($(this).attr("stuAnswer")));
            })
            if (answer0.length > 0)
                responses.push(answer0);

            //遍历T后面的AAA
            for (var i = 1; i < questionNum + 1; i++) {
                var answer = [];
                $(this._element).find('[group~="group' + i + '"]').each(function (j) {
                    answer.push(parseInt($(this).attr("stuAnswer")));
                })
                responses.push(answer);
            }
            this.getResponseModel().setMyAnswer(responses);
        }
        else {
            var responses = [];
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
                var answer = [];

                $(this._element).find('[group~="' + groupList[i] + '"]').each(function (j) {
                    answer.push(parseInt($(this).attr("stuAnswer")));
                })
                responses.push(answer);
            }
            this.getResponseModel().setMyAnswer(responses);
        }
    },

    _initialise: function () {
        var _this = this;
        $(this._element).find('[gi~="aChoice"]').draggable({
            start: function (event, ui) {

            },
            stop: function (event, ui) {

            },
            revert: true
        });
        $(this._element).find('[gi~="optionbox5"]').droppable({
            hoverClass: "",
            drop: function (event, ui) {
                var obj = ui.draggable.clone();
                var optionhtml = obj.html();
                $(this).html('<a href="#">' + optionhtml + '</a>');
                if ($(this).attr("stuAnswer") != -1) {
                    var a = $(this).attr("stuAnswer");
                    $(_this._element).find('[gi~="aChoice"]').each(function () {
                        if ($(this).attr("choicesAnswerValue") == a) {
                            $(this).show();
                        }
                    })
                }
                $(this).attr("stuAnswer", obj.attr("choicesAnswerValue"));
                $(_this._element).find('[gi~="aChoice"]').each(function () {
                    if ($(this).attr("choicesAnswerValue") == obj.attr("choicesAnswerValue")) {
                        $(this).hide();
                    }
                })
                toot.fireEvent(_this, "drag", event);
            }
        });
        $(this._element).find('[gi~="optionbox5"]').click(function () {
            if ($(this).html() != "") {
                $(this).html("");
                var myAnswerValue = $(this).attr("stuAnswer");
                $(this).attr("stuAnswer", "-1");
                $(_this._element).find('[gi~="aChoice"]').each(function () {
                    if ($(this).attr("choicesAnswerValue") == myAnswerValue) {
                        $(this).show();
                    }
                })
            }
            toot.fireEvent(_this, "action", event);
        })
        //绑定答案//"_myAnswer":[[1,2,3],[3,-1,5]]，学生填写存-1
        //如果学生已选择，做题区域显示，答案区域隐藏改choice
        //alert(this.getRequestModel().getForm().getType());
        if (this.getResponseModel() && this.getRequestModel().getForm().getType() == 10) {
            //记录当前是第几个A，A的位置与gi~="optionbox5"一一对应
            var index = 0;
            //遍历组
            for (var i = 0; i < this.getResponseModel().getMyAnswer().length; i++) {
                //alert(this.getResponseModel().getMyAnswer()[i]);
                //遍历组下成员
                for (var j = 0; j < this.getResponseModel().getMyAnswer()[i].length; j++) {

                    var currentAnswer = parseInt(this.getResponseModel().getMyAnswer()[i][j]);
                    if (currentAnswer != -1) {
                        var currentAnswerHtml = $($(this._element).find('[gi~="aChoice"]')[currentAnswer]).html();
                        $($(this._element).find('[gi~="optionbox5"]')[index]).html('<a href="#">' + currentAnswerHtml + '</a>');
                        $($(this._element).find('[gi~="optionbox5"]')[index]).attr("stuAnswer", currentAnswer);
                        $($(this._element).find('[gi~="aChoice"]')[currentAnswer]).hide();
                    }
                    index++;
                }
            }
        }
        if (this.getResponseModel() && this.getRequestModel().getForm().getType() == 20) {

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
            //
            groupList.sort();
            //var aa = groupList;
            for (var i = 0; i < groupList.length; i++) {
                var data = this.getResponseModel().getMyAnswer()[i]
                $(this._element).find('[group~="' + groupList[i] + '"]').each(function (j) {
                    if (data[j] != -1) {
                        var currentAnswerHtml = $($(_this._element).find('[gi~="aChoice"]')[data[j]]).html();
                        $(this).html('<a href="#">' + currentAnswerHtml + '</a>');
                        $(this).attr("stuAnswer", data[j]);
                        $($(_this._element).find('[gi~="aChoice"]')[data[j]]).hide();
                    }

                })
            }
        }

    }
})

//答案选择框
businesscomponents.matchquestion.ui.display.ChoiceSelect = {};
businesscomponents.matchquestion.ui.display.ChoiceSelect.Html = function (choicesList) {
    var html = '';
    for (var i = 0; i < choicesList.length; i++) {
        var choicesAnswerValue = i;
        html += '<div class="optionbox6" gi="answerChoice"><a href="#" gi="aChoice" choicesAnswerValue="' + choicesAnswerValue + '">' + choicesList[i].getContent() + '</a></div>';
    }
    return html;
}




//学生答案框
businesscomponents.matchquestion.ui.display.AnswerBox = {};

businesscomponents.matchquestion.ui.display.AnswerBox.Html = function (form) {
    //list
    if (form.getType() == 10) {
        var html = businesscomponents.matchquestion.ui.display.AnswerBox.ListComposingHtml(form.getItems());
        return html;
    }
    //table
    else {
        var html = businesscomponents.matchquestion.ui.display.AnswerBox.TableHtml(form);
        return html;
    }
}

//学生答题部分，为table类型
businesscomponents.matchquestion.ui.display.AnswerBox.TableHtml = function (tableForm) {
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
businesscomponents.matchquestion.ui.display.AnswerBox.ListHtml = function (listItem) {
    //listItem结构为[T,A,A,A,T,A]
    var html = '';
    var textNum = 0;
    if (listItem) {
        for (var i = 0; i < listItem.length; i++) {
            if (listItem[i].getType() == 20) {
                textNum++;
                html += '<div class="optionbox6" gi="optionbox6" >' + listItem[i].getText() + '</div>';
            }
            else
            //未选都为stuAnswer=-1;
                html += '<div class="optionbox5" gi="optionbox5" stuAnswer="-1" group="group' + textNum + '"></div>';
        }
    }
    return html;
}
//学生答题部分，为list类型(需要支持左右布局的ListHtml)
businesscomponents.matchquestion.ui.display.AnswerBox.ListComposingHtml = function (listItem) {
    //listItem结构为[T,A,A,A,T,A]
    var html = '';
    var textNum = 0;
    var tempItem = [];
    var listArray = [];
    if (listItem) {
        //取出所有T的数组坐标
        for (var i = 0; i < listItem.length; i++) {
            if (listItem[i].getType() == 20) {
                tempItem.push(i);
            }
        }
        if (tempItem.length > 0) {
            tempItem.push(listItem.length - 1);
        }
        if (tempItem.length > 0) {
            //listItem有分组的情况下<根据T分组>
            if (tempItem[0] != 0) {
                var tempItemArray = [];
                tempItemArray[0] = 0;
                for (var t = 0; t <= tempItem.length; t++) {
                    if (tempItem[t]) {
                        tempItemArray.push(tempItem[t]);
                    }
                }
                tempItem = tempItemArray;
            }
            for (var j = 0; j < tempItem.length; j++) {
                if (tempItem[j] != listItem.length - 1) {
                    var tempArray = [];
                    var starVal = tempItem[j];
                    var endVal = tempItem[j + 1] == listItem.length - 1 ? listItem.length : tempItem[j + 1];
                    for (var k = starVal; k < endVal; k++) {
                        tempArray.push(listItem[k]);
                    }
                    listArray.push(tempArray);
                }
            }
        } else {
            if (listItem.length > 0) {
                var listTempArray = [];
                for (var i = 0; i < listItem.length; i++) {
                    listTempArray.push(listItem[i]);
                }
                listArray.push(listTempArray);
            }
        }
        for (var h = 0; h < listArray.length; h++) {
            html += '<div class="R3_AnswerArea">';
            for (var i = 0; i < listArray[h].length; i++) {
                if (listArray[h][i]) {
                    if (listArray[h][i]._type == 20) {
                        textNum++;
                        html += '<div class="optionbox6" gi="optionbox6" >' + listArray[h][i].getText() + '</div>';
                    }
                    else
                    //未选都为stuAnswer=-1;
                        html += '<div class="optionbox5" gi="optionbox5" stuAnswer="-1" group="group' + textNum + '"></div>';
                }
            }
            html += '</div>';
        }
    }

    return html;
}

//学生答题部分，为list类型
businesscomponents.matchquestion.ui.display.AnswerBox.ListQuestionNum = function (listItem) {
    //listItem结构为[T,A,A,A,T,A]
    var html = '';
    var textNum = 0;
    if (listItem) {
        for (var i = 0; i < listItem.length; i++) {
            if (listItem[i].getType() == 20) {
                textNum++;
            }
        }
    }
    return textNum;
}

businesscomponents.matchquestion.ui.display.Question.ReadingHtml = '<div class="readbox3">' +
            '<div class="R3_questionbox" gi="topic">' +

            '</div>' +
            '<div gi="questionBox">' +
            '<div class="R3_AnswerAreaOuter">' +
            '<div gi="answerBox">' +

            '</div>' +
            '<div class="R3_AnswerArea2" gi="answerBox2">' +

            '</div>' +
            '</div>' +
            '<div class="R3_AnswerAreaTitle">Answer Choices</div>' +
            '<div class="R3_answerbox" gi="choiceSelect">' +

            '</div></div>' +

            '<div class="R3_Tipsbox">' +
            	'Drag your answer choices to the spaces where they belong. To remove an answer choice, click on it. <br />To review the passage, click on View Text.' +
            '</div>' +
        '</div>';

businesscomponents.matchquestion.ui.display.Question.ListeningHtml = '<div class="contentbox">' +
    '<div class="readbox3">' +
    '<div class="R3_questionbox" gi="topic">' +
    '</div>' +
    '<div class="R3_AnswerArea" gi="answerBox">' +
    '</div>' +
    '<div class="R3_AnswerArea2" gi="answerBox2">' +
    '</div>' +
    '<div class="R3_AnswerAreaTitle">Answer Choices</div>' +
    '<div class="R3_answerbox" gi="choiceSelect">' +
    '</div>' +
    '<div class="R3_Tipsbox">' +
    'Drag your answer choices to the spaces where they belong. To remove an answer choice, click on it.' +
    '</div>' +
    '</div>' +
    '</div>';