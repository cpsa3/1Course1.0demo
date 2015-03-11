﻿var businesscomponents = businesscomponents || {};

businesscomponents.listentagainquestion = businesscomponents.listentagainquestion || {};

businesscomponents.listentagainquestion.ui = {};
businesscomponents.listentagainquestion.ui.display = {};

businesscomponents.listentagainquestion.ui.display.Question = function () {
    businesscomponents.listentagainquestion.ui.display.Question.superClass.constructor.call(this, $(businesscomponents.listentagainquestion.ui.display.Question.Html)[0]);
    this._model = null;
    //    this.choice = new businesscomponents.choicequestion.ui.display.Question(2);
    this.choice = new businesscomponents.choicequestion.newui.display.Question();
    this.choice.setReplayListenChoice(true);
    this._$choiceContent = $(this._element).find('[gi~="choice"]')[0];
    this._$imgList = $(this._element).find('[gi~="imgList"]')[0];
    this._$progressBar1 = $(this._element).find('[gi~="progressBar1"]')[0];
    this._$progressBar2 = $(this._element).find('[gi~="progressBar2"]')[0];
    this._$page1 = $(this._element).find('[gi~="page1"]')[0];
    this._$page2 = $(this._element).find('[gi~="page2"]')[0];
    this.timer1 = null;
    this.timer2 = null;
    //这个回调用来重听回答题第2个页面播放完成，外面传进来执行第3个页面的音频和音频播放完显示题目
    this._currentPage = 0;
    this._questionIndex = 0;
    this._questionAudio = 0
}
toot.inherit(businesscomponents.listentagainquestion.ui.display.Question, businesscomponents.ui.ComponentBase);
toot.defineEvent(businesscomponents.listentagainquestion.ui.display.Question, ["actionAudioComplete"]);
toot.defineEvent(businesscomponents.listentagainquestion.ui.display.Question, ["actionAudioStartTimer"]);
toot.extendClass(businesscomponents.listentagainquestion.ui.display.Question, {


    _playAudio: function (id, controlId, playCall, compCall, timeCall) {
        var _this = this;
        id = id || 0;
        var url = '/Common/GetRealUrl';
        var data = {};
        data.id = id;
        var ajax = {
            url: url,
            data: data,
            type: 'POST',
            dataType: 'json',
            cache: false,
            success: function (json) {
                _this._bindAudio(controlId, json.url, playCall, compCall, timeCall);
            }
        };
        $.ajax(ajax);
    },
    _bindAudio: function (idPlayer, urlAudio, playCall, compCall, timeCall) {
        jwplayer(idPlayer).setup({
            flashplayer: "/Scripts/libs/jwplayer/player.swf",
            width: '1',
            height: '1',
            skin: "/Scripts/libs/jwplayer/skin/skinFull.xml",
            file: urlAudio,
            provider: 'sound',
            controlbar: 'bottom',
            autostart: true
        });

        jwplayer(idPlayer).onPlay(function () {
            if (playCall)
                playCall();
        });

        jwplayer(idPlayer).onComplete(function () {
            if (compCall)
                compCall();
        });


        jwplayer(idPlayer).onTime(function () {
            if (timeCall)
                timeCall();
        });
    },
    updateUIByModel_Instruction: function () {


    },


    updateUIByModel_choice: function () {
        var choiceModel = this.getModel().getChoiceQuestion();

        var p = businesscomponents.choicequestion.model.Question.parse(choiceModel);
        p._type = model.core.QuestionType["重听回答题"];
        this.choice.setRequestModel(p);
        //        this.choice.setSingleChoiceMode(true);
        //        this.choice.setChoiceTitleVisible(false);
        this.choice.updateUIByModel();
        $(this._$choiceContent).append(this.choice.getElement());
        //用于富文本编辑框内<p>标签导致耳麦icon换行
        $(this._$choiceContent).find('[gi~="questionTitle"]').children("p").last().css("display", "inline");
    },
    updateUIByModel: function () {
        this.updateUIByModel_choice();
        this.updateImupdateUIByModel_imageList();
        this._showPage();
        //this.page1();
    },
    getChoice: function () {
        return this.choice;
    },
    updateImupdateUIByModel_imageList: function () {
        var imgModel = this.getModel().getImgitems();
        var img;
        for (var j = 0, length = imgModel.length; j < length; j++) {
            img = '<img alt="' + imgModel[j]._start +
                '" src="' + imgModel[j]._src +
                '" style="display:' + (imgModel[j]._start == 0 ? 'block' : 'none') + '"  />';
            this._$imgList.innerHTML += img;
        }
    },
    _showImage: function (obj) {
        var _this = obj;
        var imgList = $(_this._$imgList).find("img");
        imgList.each(function () {
            var img = $(this);
            if (img.attr("alt") != "0" && img.attr("alt") == parseInt(jwplayer("player").getPosition())) {
                imgList.hide();
                img.show();
            }
        });
    },
    page1: function () {

        var _this = this;
        this._showPage();
        if (this.getModel().getInstructionAudioId()) {
            this._playAudio(this.getModel().getInstructionAudioId(), 'player', function () {

            }, function () {
                _this._currentPage++;
                _this._showPage();
                _this._page2();
            }, function () {

                var p = jwplayer("player").getPosition();
                var d = jwplayer("player").getDuration();
                var p1 = parseInt((p / d) * 100);
                $(_this._$progressBar1).find("span").css("width", p1 + "%");
            });
        }
        else {
            $(_this._$progressBar1).hide();
            _this.timer2 = setTimeout(function () {
                _this._currentPage++;
                _this._showPage();
                _this._page2();
            }, 5000);
        }
    },
    _page2: function () {
        var _this = this;
        this._showPage();

        this._playAudio(this.getModel().getImgAudioId(), 'player', function () {
            _this.timer1 = setInterval(function () {
                _this._showImage(_this);
            }, 800);
        }, function () {
            _this._currentPage++;
            _this._showPage();
            if (_this._func3) {
                _this._func3();
            }

        }, function () {

            var p = jwplayer("player").getPosition();
            var d = jwplayer("player").getDuration();
            var p1 = parseInt((p / d) * 100);
            $(_this._$progressBar2).find("span").css("width", p1 + "%");
        });


    },
    _showPage: function () {
        var _this = this;
        if (_this.timer1) {
            window.clearInterval(_this.timer1);
        }
        if (_this.timer2) {
            window.clearTimeout(_this.timer2);
        }
        $(_this._$page1).hide();
        $(_this._$page2).hide();
        $(_this._$choiceContent).hide();
        switch (_this._currentPage) {
            case 0: $(_this._$page1).show(); break;
            case 1: $(_this._$page2).show(); break;
            case 2: $(_this._$choiceContent).show(); break;
        }
    },
    //用于跳过当前页面（试做）
    skipPage: function () {
        var _this = this;
        if (_this._currentPage == 0) {
            _this._currentPage++;
            _this._showPage();
            _this._page2();
            return;
        }
        if (this._currentPage == 1) {
            _this._currentPage++;
            _this._showPage();
            if (_this._func3) {
                _this._func3();
            }
            return;
        }
    },
    //如果是跳过重听回答题内的页面，还是跳过这道题
    isSkipQuestion: function () {
        return this._currentPage == 2
    },
    _func3: function () {
        var _this = this;
        var content = $("#ctnQuestion").children("div").eq(this._questionIndex).find("[gi='choice']");
        content.find("[gi='contentBox']").hide();
        //        content.hide();
        //        content.eq(0).show();
        //        content.eq(1).show();
        _this._playAudio(this._questionAudio, 'player', null, function () {

            content.find("[gi='contentBox']").show();
            toot.fireEvent(_this, "actionAudioComplete");
            toot.fireEvent(_this, "actionAudioStartTimer");
        });
    },
    setQuestionIndex: function (questionIndex) {
        this._questionIndex = questionIndex
    },
    setQuestionAudio: function (questionAudio) {
        this._questionAudio = questionAudio
    }
})

businesscomponents.listentagainquestion.ui.display.Question.Html =
'<div>' +
'<div class="ToeflMidbox"  gi="page1">' +
        '<table border="0" cellpadding="0" cellspacing="0"  class="listenbox4 PreparationTips">' +
            '<tbody>' +
               ' <tr>' +
                   ' <td>' +
                    'Listen again to part of the conversation<br />' +
                      'then answer the question.' +
                   '</td>' +
               '</tr>' +
             '</tbody>' +
      '</table>' +
   '<div gi="progressBar1" class="Progressbar1">' +
       '<div class="Progressbar1inner1"></div>' +
       '<span class="Progressbar1inner2" style="width:100%;"></span>' +
   '</div>' +
'</div>' +

'<div class="ToeflMidbox" gi="page2">' +
    '<div class="listenbox4" >' +
        '<div gi="imgList" class="imgStyleDiv" >' +
        '</div>' +
    '</div>' +
    '<div gi="progressBar2" class="Progressbar1">' +
        '<div class="Progressbar1inner1">' +

        '</div>' +
        '<span class="Progressbar1inner2"></span>' +
    '</div>' +

'</div>' +


'<div  gi ="choice">' +
'</div>' +
'</div>';
