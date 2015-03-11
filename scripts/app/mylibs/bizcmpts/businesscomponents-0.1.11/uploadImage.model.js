var businesscomponents = businesscomponents || {};

businesscomponents.uploadimage = businesscomponents.uploadimage || {};

businesscomponents.uploadimage.model = {};
//上传图片控件
businesscomponents.uploadimage.model.UploadImage = function () {
    this._imageId = 0,
    this._imageUrl = null;

};
toot.extendClass(businesscomponents.uploadimage.model.UploadImage, {
    getImageId: function () {
        return this._imageId;
    },
    setImageId: function (imageId) {
        this._imageId = imageId;
    },
    getImageUrl: function () {
        return this._imageUrl;
    },
    setImageUrl: function (imageUrl) {
        this._imageUrl = imageUrl;
    }
});