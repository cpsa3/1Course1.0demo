//
/*
* 功能:音频展示，没有其他交互
* 作者:小潘
* 日期:20130731
*/
var businesscomponents = businesscomponents || {};

businesscomponents.correctors = businesscomponents.correctors || {};

businesscomponents.correctors.Audio = function(opt_html) {
    businesscomponents.correctors.Audio.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.correctors.Audio.html)[0]);

    this._$ctnPlayer = $(this._element).find('[gi~="ctnPlayer"]');

    this._player = null;

    this._url = null;
    
    this._$ctnPlayer[0].id = "gi-" + (Math.random() + "").substring(2) + (Math.random() + "").substring(2);

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.correctors.Audio, toot.view.ViewBase);
toot.extendClass(businesscomponents.correctors.Audio, {
    _init_manageEvents: function() {
        businesscomponents.correctors.Audio.superClass._init_manageEvents.call(this);
    },

    _init: function() {
        this._init_manageEvents();


        this._init_render();
    },
    _setupPlayer: function() {

        var autoStart = this._autoplayAfterSet;
        this._player = jwplayer(this._$ctnPlayer[0].id).setup({
            flashplayer: "/Scripts/libs/jwplayer/player.swf",
            width: '578',
            height: '30',
            skin: "/Scripts/libs/jwplayer/oneTestPlayer/oneTestPlayer.xml?key=" + Math.random(),
            file: this._url,
            controlbar: 'top',
            autostart: autoStart,
            showicons: false
        });
    },

    setModelAndUpdateUI: function(model) {
        if (this._model == model) return;
        businesscomponents.correctors.Audio.superClass.setModelAndUpdateUI.call(this, model);
    },
    updateUIByModel: function() {
        var _this = this;
        if (this._model) {

            if (this._url) {
                this._setupPlayer();
            } else
                $.ajax({
                    url: "/Common/GetShortUrl?id=" + _this._model,
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    success: function(json) {
                        _this._url = json.url;
                        _this._setupPlayer();
                    }
                });
        }
    },

    _autoplayAfterSet: false,//加载时是否自动播放

    setAutoPlayAfterSet: function(autoplayAfterSet) {
        this._autoplayAfterSet = autoplayAfterSet;
    }  
});
businesscomponents.correctors.Audio.html = '<div>' +
    '<div class="btnGroupOuter1 marT32" gi="editView">' +
    '<div class="AudioBox" gi="ctnPlayer"></div>' +
    '</div>' +
    '</div>';