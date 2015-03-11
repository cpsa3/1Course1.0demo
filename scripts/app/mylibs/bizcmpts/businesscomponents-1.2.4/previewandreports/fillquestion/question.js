
var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.fillquestion = businesscomponents.previewandreports.fillquestion || {};
//错误提示信息
businesscomponents.previewandreports.fillquestion.WrongTips = function (opt_html) {
    businesscomponents.previewandreports.fillquestion.WrongTips.superClass.constructor.call(this,
               $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.fillquestion.WrongTips.html)[0]);
    this._rightAnswer = new toot.ui.Label($(this._element).find('[gi~="rightAnswer"]')[0]);
    this._worngIndex = new toot.ui.Label($(this._element).find('[gi~="worngIndex"]')[0]);
    this._errorTip = new toot.ui.Label($(this._element).find('[gi~="errorTip"]')[0]);
    this._errorTip.setText("回答错误");
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.previewandreports.fillquestion.WrongTips, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.fillquestion.WrongTips, {
    setWorngIndex: function (idx) {
        this._worngIndex.setText(idx);
    },
    setRightAnswer: function (rightAnswer) {
        this._rightAnswer.setText(rightAnswer.replace(/或/g, ";"));
    },
    setErrorTip: function (text) {
        this._errorTip.setText(text);
    }
});
businesscomponents.previewandreports.fillquestion.WrongTips.html =
                        ' <div class="WrongTipsbox3 clearfix">' +
                            '<em></em>' +
                            '<div class="fl"><span gi="errorTip">回答错误</span>！正确答案：' +
                                '<span gi="rightAnswer"></span>' +
                                '<span gi="worngIndex" class="TipsNum2">12</span>' +
                            '</div>' +
                         '</div>';
//填空项
businesscomponents.previewandreports.fillquestion.Item = function (opt_html) {
    businesscomponents.previewandreports.fillquestion.Item.superClass.constructor.call(this,
               $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.fillquestion.Item.html)[0]);
    //填空部分
    this._itemText = new toot.ui.Label($(this._element).find('[gi~="itemText"]')[0]);
    //标号
    this._itemNum = new toot.ui.Label($(this._element).find('[gi~="itemNum"]')[0]);

    //容器
    this._$itemContent = $($(this._element).find('[gi~="itemContent"]')[0]);
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.previewandreports.fillquestion.Item, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.fillquestion.Item, {
    setWorngOrRight: function (flg) {
        if (flg) {
            this._$itemContent.removeClass("WrongFillbox1").addClass("RightFillbox1");
            this._itemNum.setVisible(false);
        }
        else {
            this._$itemContent.removeClass("RightFillbox1").addClass("WrongFillbox1");
        }

    },
    setItemNum: function (num) {
        this._itemNum.setText(num);
    },
    setItemText: function (text) {
        this._itemText.setText(text);
    }

});
businesscomponents.previewandreports.fillquestion.Item.html =
                        ' <span >' +
                            '<span class="WrongFillbox1" gi="itemContent">' +
                                '<span class="TextStyle" gi="itemText"></span>' +
                                '<span class="TipsNum" gi="itemNum"></span>' +
                            '</span>' +
                         '</span>';
businesscomponents.previewandreports.fillquestion.Question = function (opt_html) {
    businesscomponents.previewandreports.fillquestion.Question.superClass.constructor.call(this,
               $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.fillquestion.Question.html)[0]);
    this._elementContainer = $(this._element).find('[gi~="content"]');
}
toot.inherit(businesscomponents.previewandreports.fillquestion.Question, toot.view.ViewBase);
toot.extendClass(businesscomponents.previewandreports.fillquestion.Question, {
    updateUIByModel: function () {
        var $elementContainer = $(this._elementContainer);
        //设置题目文本
        if (!this._model) {
            $elementContainer.html("");
            return;
        }
        if (this._model && this._model.getChannelQ()) {

            $elementContainer.html(this._model.getChannelQ().getContent());
        }
        var gis = $elementContainer.find('[gi]');
        //        预览
        if (this._model.getRenderingType() == models.previewandreports.RenderingType.Preview) {
            for (var i = 0; i < gis.length; i++) {
                var gi = gis[i];
                var $gi = $(gi);
                var group = $gi.attr("group");
                var elementEdit = $('<span gi="shortfill" type="text" style=" display: inline-block" spellcheck="false" class="textstyle10"  group="' + group + '"  ></span>').get(0);

                gi.parentNode.replaceChild(elementEdit, gi);
            }
        }
        //填空题网页报告和填空题报告一样
        if (this._model.getRenderingType() == models.previewandreports.RenderingType.WebReprot || this._model.getRenderingType() == models.previewandreports.RenderingType.PdfReport || this._model.getRenderingType() == models.previewandreports.RenderingType.DisplayFinish) {
            var answer = this._model.getChannelA().getAnswers();
            //错误index
            var worngIndex = 1;
            //所有组，用于计算组数，当前为第几组
            var allGroupName = [];
            for (var z = 0; z < gis.length; z++) {
                if ($(gis[z]).attr("group")) {
                    var isPushGroup = true;
                    for (var x = 0; x < allGroupName.length; x++) {
                        if (allGroupName[x] == $(gis[z]).attr("group")) {
                            isPushGroup = false;
                        }
                    }
                    if (isPushGroup) {
                        allGroupName.push($(gis[z]).attr("group"));
                    }
                }
            }
            //        已经检验过的组
            var checkedGroup = [];
            for (var i = 0, l = gis.length; i < l; i++) {
                var gi = gis[i];
                var $gi = $(gi);
                var type = $gi.attr("gi");
                var group = $gi.attr("group");
                if (type == "longfill" || type == "shortfill") {
                    //如果是组
                    if (group) {
                        //                    判断是否已经检验过
                        var flg = false;
                        for (var c = 0; c <= checkedGroup.length - 1; c++) {
                            if (group == checkedGroup[c]) {
                                flg = true;
                                break;
                            }
                        }
                        if (flg) {
                            continue;
                        }

                        //                    添加到以检验组
                        checkedGroup.push(group);
                        //渲染改组所有成员
                        //取出改组所有成员所在的idx
                        var groupTemp = [];
                        for (var z = i; z <= gis.length - 1; z++) {
                            if ($(gis[z]).attr("group") == group) {
                                groupTemp.push(z);
                            }
                        }
                        //该组只有一个元素
                        if (groupTemp.length == 1) {
                            var item = new businesscomponents.previewandreports.fillquestion.Item();
                            item.setItemText(answer[groupTemp[0]]);

                            if (services.task.isFillQuestionResponseCorrect(answer[groupTemp[0]], gis[groupTemp[0]].value)) {
                                item.setWorngOrRight(true);

                            }
                            else {
                                item.setWorngOrRight(false);
                                item.setItemNum(worngIndex);
                                var worngTips = new businesscomponents.previewandreports.fillquestion.WrongTips();
                                worngTips.setWorngIndex(worngIndex);
                                worngTips.setRightAnswer(gis[groupTemp[0]].value);
                                $elementContainer.append(worngTips.getElement());
                                worngIndex++;
                                //添加正确答案信息
                            }
                            gis[groupTemp[0]].parentNode.replaceChild(item.getElement(), gis[groupTemp[0]]);
                        }
                        else {
                            var isAllRight = true;

                            //当前组的学生回答
                            var thisGroupStuAnswer = [];
                            //当前组的正确答案
                            var thisGroupTrueAnswer = [];
                            var thisGroupTrueAnswer2 = [];

                            for (var m = 0; m <= groupTemp.length - 1; m++) {
                                thisGroupStuAnswer.push(answer[groupTemp[m]]);
                                thisGroupTrueAnswer.push(gis[groupTemp[m]].value);
                                thisGroupTrueAnswer2.push(gis[groupTemp[m]].value);
                            }

                            //这组对的个数      

                            var truecount = 0;

                            for (var a = 0; a < thisGroupStuAnswer.length; a++) {
                                for (var j = 0; j < thisGroupTrueAnswer2.length; j++) {
                                    if ($.trim(thisGroupStuAnswer[a]) == $.trim(thisGroupTrueAnswer2[j])) {
                                        if (thisGroupStuAnswer[a].indexOf("或") > -1) {
                                            //...
                                        }
                                        else {
                                            //排除已用来运算的项
                                            thisGroupStuAnswer.splice(a, 1);
                                            thisGroupTrueAnswer2.splice(j, 1);
                                            truecount++;
                                            a--;
                                            break;
                                        }
                                    }
                                }
                            }

                            for (var a = 0; a < thisGroupStuAnswer.length; a++) {
                                for (var j = 0; j < thisGroupTrueAnswer2.length; j++) {
                                    if (services.task.isFillQuestionResponseCorrect(thisGroupStuAnswer[a], thisGroupTrueAnswer2[j])) {
                                        //排除已用来运算的项
                                        thisGroupTrueAnswer2.splice(j, 1);
                                        truecount++;
                                        break;
                                    }
                                }
                            }
                            //这个组全没写
                            var answerGroupIsNull = true;
                            for (var m = 0; m <= groupTemp.length - 1; m++) {
                                if (answer[groupTemp[m]]) {
                                    answerGroupIsNull = false;
                                }
                            }

                            //这组全对
                            if (truecount == groupTemp.length) {
                                isAllRight = true;
                            }
                            else {
                                isAllRight = false;
                            }

                            //这组全没写渲染效果
                            if (answerGroupIsNull) {
                                for (var m = 0; m <= groupTemp.length - 1; m++) {
                                    var item = new businesscomponents.previewandreports.fillquestion.Item();
                                    item.setItemText("未作答");
                                    item.setWorngOrRight(false);
                                    item.setItemNum(worngIndex);
                                    gis[groupTemp[m]].parentNode.replaceChild(item.getElement(), gis[groupTemp[m]]);
                                }

                                var rightGroup = [];
                                for (var m = 0; m <= groupTemp.length - 1; m++) {
                                    rightGroup.push(gis[groupTemp[m]].value);
                                }
                                var worngTips = new businesscomponents.previewandreports.fillquestion.WrongTips();
                                worngTips.setErrorTip("未作答");
                                worngTips.setWorngIndex(worngIndex);
                                worngTips.setRightAnswer(rightGroup.toString());
                                $elementContainer.append(worngTips.getElement());
                                worngIndex++;
                            }
                            else {
                                //渲染
                                if (isAllRight) {
                                    for (var m = 0; m <= groupTemp.length - 1; m++) {
                                        var item = new businesscomponents.previewandreports.fillquestion.Item();
                                        item.setItemText(answer[groupTemp[m]]);
                                        item.setWorngOrRight(true);
                                        gis[groupTemp[m]].parentNode.replaceChild(item.getElement(), gis[groupTemp[m]]);
                                    }
                                }
                                else {
                                    //一组的正确答案
                                    var rightGroup = [];
                                    for (var m = 0; m <= groupTemp.length - 1; m++) {
                                        rightGroup.push(gis[groupTemp[m]].value);
                                        var item = new businesscomponents.previewandreports.fillquestion.Item();
                                        if (answer[groupTemp[m]]==null) {
                                            item.setItemText("未作答");
                                        }
                                        else {
                                            item.setItemText(answer[groupTemp[m]]);
                                        }
                                        item.setWorngOrRight(false);
                                        item.setItemNum(worngIndex);
                                        gis[groupTemp[m]].parentNode.replaceChild(item.getElement(), gis[groupTemp[m]]);
                                    }
                                    var worngTips = new businesscomponents.previewandreports.fillquestion.WrongTips();
                                    worngTips.setWorngIndex(worngIndex);
                                    worngTips.setRightAnswer(rightGroup.toString());
                                    $elementContainer.append(worngTips.getElement());
                                    worngIndex++;
                                }
                            }
                        }
                    }
                    else {
                        var item = new businesscomponents.previewandreports.fillquestion.Item();
                        if (answer[i]) {
                            item.setItemText(answer[i]);
                        }
                        else {
                            item.setItemText("未作答");
                        }
                        if (services.task.isFillQuestionResponseCorrect(answer[i], gi.value)) {
                            item.setWorngOrRight(true);
                        }
                        else {
                            item.setWorngOrRight(false);
                            item.setItemNum(worngIndex);
                            //添加正确答案信息
                            var worngTips = new businesscomponents.previewandreports.fillquestion.WrongTips();
                            if (!answer[i]) {
                                worngTips.setErrorTip("未作答");
                            }
                            worngTips.setWorngIndex(worngIndex);
                            worngTips.setRightAnswer(gi.value);
                            $elementContainer.append(worngTips.getElement());
                            worngIndex++;
                        }
                        gi.parentNode.replaceChild(item.getElement(), gi);
                    }
                }
            }
        }

    }
});
businesscomponents.previewandreports.fillquestion.Question.html =
                   '<div class="ReportNewAboxOuter">' +
                      '<span class="NumStyle"></span>' +
                      '<div class="ReportNewAbox clearfix">' +
                        '<div class="AboxInner" gi="content" ></div>' +
                      '</div>' +
                   '</div>';



