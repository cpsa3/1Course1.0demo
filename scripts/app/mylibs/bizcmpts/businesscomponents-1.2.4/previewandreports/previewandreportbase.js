
var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.previewandreportsbase = function(opt_html) {
    businesscomponents.previewandreports.previewandreportsbase.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.previewandreportsbase.html)[0]);
    this._title = new toot.ui.Label($(this._element).find('[gi~="title"]')[0]);;
    this._elementCtnZones = $(this._element).find('[gi~="ctnQuestion"]')[0];
    this._splitLine = $(this._element).find('[gi~="split"]')[0];

    this._nowAt = null;
    this._nowBy = null;
    if ($("#data-nowAt").val()) this._nowAt = new Date($("#data-nowAt").val());
    if ($("#data-nowBy").val()) this._nowBy = $("#data-nowBy").val();

    if (this.constructor == arguments.callee) this._init();

};
toot.inherit(businesscomponents.previewandreports.previewandreportsbase, toot.view.ViewBase);
toot.extendClass(businesscomponents.previewandreports.previewandreportsbase, {
    updateUIByModel: function() {
        if (this._model && this._model.getSectionName()) {
            this._title.setText(this._model.getSectionName());
            this._title.setVisible(true);
            $(this._splitLine).hide();
        } else {
            this._title.setText(null);
            this._title.setVisible(false);
        }
        //删除预览分支的分割线

        if (this._model && this._model.getRenderingType() == models.previewandreports.RenderingType.Preview) {
            $(this._splitLine).hide();
        }
        if (this._model && this._model.getRenderingType() == models.previewandreports.RenderingType.DisplayFinish) {
            $(this._splitLine).hide();
        }
    }
});
businesscomponents.previewandreports.previewandreportsbase.html = '<div class="ReportNewQAbox">' +
    '<div class="ReportNewTaskTitle" gi="title"></div>' +
    '<div class="ReportNewTaskLine" gi="split"></div>' +
    '<div gi="ctnQuestion"></div>' +
    '</div>';