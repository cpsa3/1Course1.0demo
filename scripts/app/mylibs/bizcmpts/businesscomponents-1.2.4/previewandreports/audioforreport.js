var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.Audio = function (opt_html) {
    businesscomponents.previewandreports.Audio.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.Audio.html)[0]);
    this._$ctnPlayer = $(this._element).find('[gi~="ctnPlayer"]');
    this._$ctnPlayerPrint = $(this._element).find('[gi~="ctnPrint"]');
    this._$ctnPlayerNull = $(this._element).find('[gi~="ctnNull"]');
    this._$ctnPlayerNull.hide();
    this._$ctnPlayer[0].id = "gi-" + (Math.random() + "").substring(2) + (Math.random() + "").substring(2);
    this._audioId = 0;
    this._renderModel = 0; //0表示正常生成模式，1表示打印模式
    this._audionModel = 0; //0题目，1学生作答
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.Audio, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.Audio, {
    _setupPlayer: function () {
        this._player = jwplayer(this._$ctnPlayer[0].id).setup({
            flashplayer: "/Scripts/libs/jwplayer/player.swf",
            width: '578',
            height: '30',
            skin: "/Scripts/libs/jwplayer/oneTestPlayer/oneTestPlayer.xml?key=" + Math.random(),
            file: this._url,
            controlbar: 'top',
            autostart: false,
            showicons: false
        });
        this._justUploaded = false;
    },
    renderPlayer: function () {
        var _this = this;
        if (this._renderModel == 1) {
            if (this._audionModel == 1) {
                if (this._audioId && this._audioId != 0 && this._audioId != '') {
                    this._$ctnPlayerPrint.show();
                    this._$ctnPlayerNull.hide();
                }
                else {
                    this._$ctnPlayerPrint.hide();
                    this._$ctnPlayerNull.show();
                }
            }
            else {
                this._$ctnPlayerPrint.show();
                this._$ctnPlayerNull.hide();
            }
            //            if (this._audioId && this._audioId != 0 && this._audioId != '') {
            //                this._$ctnPlayerPrint.show();
            //            }
            //            else {
            //                this._$ctnPlayerPrint.hide();
            //                this._$ctnPlayerNull.show();
            //            }
            this._$ctnPlayer.hide();
        }
        else {
            this._$ctnPlayerPrint.hide();
            if (this._audioId && this._audioId != 0 && this._audioId != '') {
                if (this._url) {
                    this._setupPlayer();
                } else
                    $.ajax({
                        url: "/Common/GetShortUrl?id=" + _this._audioId,
                        type: 'GET',
                        dataType: 'json',
                        cache: false,
                        success: function (json) {
                            _this._url = json.url;
                            _this._setupPlayer();
                        }
                    });
            } else {
                if (this._audionModel == 1) {
                    this._$ctnPlayerPrint.hide();
                    this._$ctnPlayer.hide();
                    this._$ctnPlayerNull.show();
                }
                else {
                    this._$ctnPlayerPrint.hide();
                    this._$ctnPlayer.hide();
                    this._$ctnPlayerNull.hide();
                }
            }
        }
    },
    setRenderModel: function (model) {
        this._renderModel = model;
    },
    setAudioId: function (id) {
        this._audioId = id;
    },
    setAudionModel: function (model) {
        this._audionModel = model;
    }

});
businesscomponents.previewandreports.Audio.html = '<div class="AudioBox">' +
    '<div  gi="ctnPlayer"></div>' +
    '<div class="AudioBoxPrint" gi="ctnPrint">音频文档</div>' +
     '<div class="WrongTipsbox3 clearfix" gi="ctnNull"><em></em><div class="fl">未作答！</div></div>' +
    '</div>';