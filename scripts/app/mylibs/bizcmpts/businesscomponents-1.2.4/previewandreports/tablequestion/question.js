/*
* 功能:表格题报告
* 作者:侯百京
* 日期：2014.6.10
*/


var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.tablequestion = businesscomponents.previewandreports.tablequestion || {};

businesscomponents.previewandreports.tablequestion.Question = function (opt_html) {

    businesscomponents.previewandreports.tablequestion.Question.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.tablequestion.Question.html)[0]);

    //要求
    this._topic = $(this._element).find('[gi~="topic"]')[0];
    //    //答案选择框
    //    this._choiceSelect = $(this._element).find('[gi~="choiceSelect"]')[0];
    //学生答题框
    this._answerBox = $(this._element).find('[gi~="answerBox"]')[0];
    //图标提示
    this._prompt = $(this._element).find('[gi~="prompt"]');
    //为了不与model冲突
    this._data = null;
    //分析和评语
    this._txtAnalysis = new toot.ui.TextBox($(this._element).find('[gi~="txtAnalysis"]')[0]);
    this._txtComment = new toot.ui.TextBox($(this._element).find('[gi~="txtComment"]')[0]);
    //分析和评语默认都是隐藏的
    this._txtAnalysis.setVisible(false);
    this._txtComment.setVisible(false);
    //判断这题是否正确
    this._isRight = true;

};
toot.inherit(businesscomponents.previewandreports.tablequestion.Question, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.previewandreports.tablequestion.Question, {
    setModelAndUpdateUI: function (data) {
        //报告页面不显示图标文案
        this._data = data;
        if (data.getRenderingType() != models.previewandreports.RenderingType.Preview) {
            this._prompt.show();
        }
        else {
            this._prompt.hide();
        }
        if (data.getRenderingType() == models.previewandreports.RenderingType.StudentAnalysis) {
            //显示评语
            this._txtAnalysis.setVisible(true);
            this.renderAnalysis(data);
        }
        if (data.getRenderingType() == models.previewandreports.RenderingType.StudentView) {
            //显示评语
            this._txtAnalysis.setVisible(true);
            this._txtComment.setVisible(true);
            this.renderAnalysis(data);
        }
        if (data.getRenderingType() == models.previewandreports.RenderingType.TeacherAnalysisView) {
            this._txtAnalysis.setVisible(true);
            this._txtComment.setVisible(true);
            this.renderAnalysis(data);
        }
        this.setRequestModel(models.components.tablequestion.Question.parse(data.getChannelQ()));
        var obj =
                {
                    _myAnswer: data.getChannelA()
                };
        this.setResponseModel(models.components.tablequestion.QuestionResponse.parse(obj));
        this.updateUIByModel();
    },
    updateUIByModel: function () {
        var _this = this;

        this._topic.innerHTML = this.getRequestModel().getTopic();
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
            //如果是预览就不做答案渲染
            if (this._data.getRenderingType() != models.previewandreports.RenderingType.Preview) {
                var answers = this.getResponseModel().getMyAnswer();
                _this = this;
                //给每行赋值
                $(this._answerBox).find('[gi^="trIndex"]').each(function (i) {
                    $($(this).find('[gi~="questionTitle"]')[0]).html(toot.ui.textToHTML(tableForm._contentList[i]._questionTitle));
                    var answer = false;
                    if (answers && answers[i]) {
                        answer = answers[i];
                    }

                    $($(this).find('[gi~="choiceBox"]')).each(function (j) {
                        var qAnswer = _this.getRequestModel().getTable().getContentList()[i].getQuestionChoiceList()[j].getIsAnswer();
                        if ((answer[j] == 'true' || answer[j] == true) && qAnswer == true) {
                            $(this).attr('class', 'RightFillbox1');
                            $(this).append('<span class="checkboxStyleRight"></span>');
                        }
                        //错答,正确答案为勾选，学生未勾选 黑色勾
                        else if ((answer[j] == 'true' || answer[j] == true) && qAnswer == false) {
                            $(this).attr('class', 'NothingFillbox1');
                            $(this).append('<span class="RightFillbox1"></span>');

                            _this._isRight = false;
                        }
                        //漏选 正确答案为不勾，但学生勾选 红色勾
                        else if ((answer[j] == 'false' || answer[j] == false) && qAnswer == true) {
                            $(this).attr('class', 'WrongFillbox1');
                            $(this).append('<span class="checkboxStyleWrong"></span>');
                            _this._isRight = false;
                        }
                        else {

                        }
                    });
                });
            }
        }
    },
    updateModelByUI: function () {
        var _this = this;
        this._setResponseModelIfNull(models.components.tablequestion.QuestionResponse);

        var responses = [];
        $(this._answerBox).find('[gi^="trIndex"]').each(function (i) {

            var trCnotent = $(_this._answerBox).find('[gi~="trIndex' + i + '"]')[0];

            var answerList = [];
            $(trCnotent).find('[gi~="choiceBox"]').each(function () {
                if ($(this).attr("class") == "alreadyChoosed")
                    answerList.push('true');
                else
                    answerList.push('false');
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
        tbodyTd = '<td ><div class="ReportOption3" gi="questionTitle"></div></td>';
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
    renderAnalysis: function (data) {
        if ((data.getRenderingType() == models.previewandreports.RenderingType.StudentView || data.getRenderingType() == models.previewandreports.RenderingType.TeacherAnalysisView)) {
            this._txtAnalysis.setValue(data.getChannelSA() == "" ? "无" : data.getChannelSA());
            $(this._txtAnalysis.getElement()).addClass("ReporStudentextarea");
            $(this._txtAnalysis.getElement()).attr("disabled", true);
            if (data.getRenderingType() == models.previewandreports.RenderingType.TeacherAnalysisView) {
                this._txtComment.setValue(data.getChannelTA());
            }
            else {
                if (!data.getChannelTA()) {
                    this._txtComment.setVisible(false);
                }
                else {
                    this._txtComment.setValue(data.getChannelTA());
                    $(this._txtComment.getElement()).addClass("ReporStudentextarea");
                    $(this._txtComment.getElement()).attr("disabled", true);
                }
            }
        }
    },
    //验证
    Validate: function () {
        if (this._data.getRenderingType() == models.previewandreports.RenderingType.StudentAnalysis) {

            if (!this._isRight) {
                if (this.getAnalysis().trim() == "") {

                    return false;
                }
            }
        }
        return true;
    },
    getAnalysis: function () {
        return this._txtAnalysis.getValue();
    },
    //获取评语内容
    getComment: function () {
        return this._txtComment.getValue();
    },
    getModel: function () {
        var model = this._data || new models.previewandreports.RenderingItem()
        model.setChannelSA(this.getAnalysis());
        model.setChannelTA(this.getComment());
        return model;
    }
});


businesscomponents.previewandreports.tablequestion.Question.html = '<div class="ReportNewAbox clearfix"><span class="NumStyle" gi="lblIndex">&nbsp;</span><div class="AboxInner">' +
    '<div class="QboxInner RichTextEditor" gi="topic">' +
    '</div>' +
    '<div class="ReportQTablebox">' +
    '<div class="R3_AnswerArea2 R3_StyleAdd" gi="answerBox">' +
    '</div><div class="ReportQTableTips" gi="prompt">为未回答项</div>' +
    '</div>' +
    '<textarea class="Reportextarea" placeholder="请输入分析" gi="txtAnalysis" ></textarea>' +
     '<textarea class="Reportextarea" placeholder="请输入评语" gi="txtComment"></textarea>' +
     '</div>' +
     '</div>';