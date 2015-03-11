var businesscomponents = businesscomponents || {};

businesscomponents.uploadimage = businesscomponents.uploadimage || {};

businesscomponents.uploadimage.ui = businesscomponents.uploadimage.ui || {};
//UploadImage widget
//fileTypeErrorFn 为上传
businesscomponents.uploadimage.ui.UploadImage = function (lblName, fileTypeErrorFn) {
    businesscomponents.ui.ComponentBase.call(this,
        $(
           '<div class="itembox1 clearfix"><span class="fl labelNameStyle1"></span>' +
             '<div class="fl">' +
               '<a class="uploadbtn" style="display:block;" id="btnImageListen"></a><div class="martop"><img title="听力图片" id="holderImageListen" width="50px" height="50px" style="display: none" /></div>' +
             '</div>' +
             '</div>').get(0));

    this._lblName = new toot.ui.Label($(this._element).find('span').get(0));
    this._lblName.setText(lblName);
    this._btnImageListen = new toot.ui.Button($(this._element).find('a').get(0));
    this._holderImageListen = $($(this._element).find('img').get(0));
    var _this = this;
    new AjaxUpload($($(this._element).find('a').get(0)), {
        action: '/Common/UploadImage',
        name: 'file',
        onSubmit: function (file, ext) {
            //            if (!(ext && /^(jpg|jpeg|bmp|png)$/.test(ext.toLowerCase()))) {
            //                alert('上传图片类型不符，系统支持bmp、jpg、jpeg、png图片文件');
            //                return false;
            //            }
            if (!fileTypeErrorFn(file, ext)) {
                return false;
            }
            $($(this._element).find('a').get(0)).text('文件上传中');
            this.disable();
        },
        onComplete: function (file, response) {
            $($(this._element).find('a').get(0)).text('选择文件');
            this.enable();
            //            $("#" + idImage).val(response.split("|")[0]);
            //            _this._holderImageListen.attr("src", response.split("|")[1]);
            //            _this._holderImageListen.show();
            var model = new businesscomponents.uploadimage.model.UploadImage();
            var responseJson = JSON.parse(response);
            model.setImageId(responseJson.id);
            model.setImageUrl(responseJson.url);
            _this.setModelAndUpdateUI(model);
        }
    });
};
toot.inherit(businesscomponents.uploadimage.ui.UploadImage, businesscomponents.ui.ComponentBase);
//toot.defineEvent(businesscomponents.ui.UploadImage, "UploadError");
toot.extendClass(businesscomponents.uploadimage.ui.UploadImage, {
    updateUIByModel: function () {

        if (this.getModel()) {
            if (this.getModel().getImageId() == 0) {
                return false;
            }

            if (!this.getModel().getImageUrl()) {
                var _this = this;
                $.ajax({
                    url: "/Common/GetShortUrl",
                    data: {
                        id: _this.getModel().getImageId()
                    },
                    type: 'POST',
                    dataType: 'text',
                    cache: false,
                    success: function (json) {
                        var responseJson = JSON.parse(json);
                        _this._holderImageListen.attr("src", responseJson.url);
                        _this._holderImageListen.show();
                    },
                    error: function (httpRequest, statusText) {
                        greedyint.common.DealStatus(httpRequest, statusText);
                    }
                });
            }
            else {
                this._holderImageListen.attr("src", this.getModel().getImageUrl());
                this._holderImageListen.show();
            }
        }
    },
    getImageId: function () {
        return this.getModel().getImageId();
    },
    getShortImageUrl: function () {
     
    }
});