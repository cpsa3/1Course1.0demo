
var businesscomponents = businesscomponents || {};

businesscomponents.taskJwplay = businesscomponents.taskJwplay || {};

businesscomponents.taskJwplay.ui = {};

businesscomponents.taskJwplay.ui.TaskJwplay = function (labelName, audioId) {
    var _this = this;
    var audioContainer = (Math.random() * (0 - 100) + 100).toString();
    businesscomponents.taskJwplay.ui.TaskJwplay.superClass.constructor.call(this, $(
             '<div class="itembox1 clearfix">' +
            '<span class="fl labelNameStyle1">' + labelName + '</span>' +

            '<div class="fl">' +
                '<button class="uploadbtn"></button>' +
                '<div class="martop">' +
                    '<div id="' + audioContainer + '">' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>').get(0));

    //数据
    this._model = audioId;

    //容器
    this._audioContainer = audioContainer;
    this._audioSelect = $($(this._element).find('button').get(0));
    //方法
    this.updateUIByModel();



    //初始化上传按钮
    var button = this._audioSelect;
    this._audioUpload = new AjaxUpload(button, {
        action: '/Common/UploadAudio',
        name: 'file',
        onSubmit: function (file, ext) {

            if (!(ext && /^(mp3)$/.test(ext.toLowerCase()))) {
                alert('请您上传mp3文件');
                return false;
            }
            greedyint.dialog.lock();
            //button.text('文件上传中');

            this.disable();
        },
        onComplete: function (file, response) {
            var responseJson = JSON.parse(response);
            //button.text('选择文件');
            greedyint.dialog.unLock();
            this.enable();
            _this._model = responseJson.id;
            jwplayer(_this._audioContainer).setup({
                flashplayer: "/Scripts/libs/jwplayer/player.swf",
                width: '534',
                height: '28',
                skin: "/Scripts/libs/jwplayer/skin/skinFull.xml",
                file: responseJson.url,
                provider: 'sound',
                controlbar: 'bottom'
            });
        }
    });

};
toot.inherit(businesscomponents.taskJwplay.ui.TaskJwplay, businesscomponents.ui.ComponentBase);
toot.extendClass(businesscomponents.taskJwplay.ui.TaskJwplay, {
    updateUIByModel: function () {

        var _this = this;
        if (this._model > 0) {
            $.ajax({
                url: "/Common/GetShortUrl",
                data: {
                    id: this._model
                },
                type: 'POST',
                dataType: 'json',
                cache: false,
                success: function (json) {
                    jwplayer(_this._audioContainer).setup({
                        flashplayer: "/Scripts/libs/jwplayer/player.swf",
                        width: '534',
                        height: '28',
                        skin: "/Scripts/libs/jwplayer/skin/skinFull.xml",
                        file: json.url,
                        provider: 'sound',
                        controlbar: 'bottom'
                    });
                },
                error: function (httpRequest, statusText) {
                    greedyint.common.DealStatus(httpRequest, statusText);
                }
            });
        }
    },
    validate: function () {
        return this._model > 0;
    }
});