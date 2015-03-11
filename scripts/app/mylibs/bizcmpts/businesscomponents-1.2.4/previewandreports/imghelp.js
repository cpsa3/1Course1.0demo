var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.imgHelp = function () {
};

toot.extendClass(businesscomponents.previewandreports.imgHelp, {
    showImgRealSize: function (containerElement) {
        var _this = this;
        if ($.browser.msie) {
            $(containerElement).find("img").each(function (i) {
                _this._realSize(this);
            });
        }
        else {
            var flg = 0;
            $(containerElement.find("img")).load(function () {
                _this._realSize(this);
            });
        }
    },
    _realSize: function (tempThis) {
        if ($(tempThis).width() >= 411) {
            $(tempThis).css("width", "411px");
            $(tempThis).css("height", "auto");
            $(tempThis).css("cursor", "pointer");
            $(tempThis).attr("title", "点击查看大图");
            var id = 'showImage_' + flg;
            var showDialogMaxWidth = $(document).width() - 100;
            var dialog = greedyint.dialog.loadcontent(id, null, '<img style="max-width:' + showDialogMaxWidth + 'px;" src="' + $(tempThis).attr('src') + '" /><div class="marT10 alignC"><input type="button" value="返回" class="btn5Style" onclick="greedyint.dialog.close(\'' + id + '\')"></div>', false, function () { greedyint.dialog.hide(id); return false; });
            $(tempThis).attr('did', id);
            greedyint.dialog.hide(id);
            $(tempThis).bind('click', function () {
                greedyint.dialog.show($(tempThis).attr('did'));
                greedyint.dialog.loadresize(greedyint.dialog.get($(tempThis).attr('did')));
                greedyint.dialog.zindex(greedyint.dialog.get($(tempThis).attr('did')));
            });
            flg = flg + 1;
        }
    }
});


