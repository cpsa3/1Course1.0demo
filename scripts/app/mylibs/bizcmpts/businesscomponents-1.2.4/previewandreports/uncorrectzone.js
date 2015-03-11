var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.UnCorrectZone = function (opt_html) {
    businesscomponents.previewandreports.UnCorrectZone.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.UnCorrectZone.html)[0]);
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.UnCorrectZone, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.UnCorrectZone, {
   
});
businesscomponents.previewandreports.UnCorrectZone.html =
     ' <div  style=" font-size:16; font-weight:bold">' +
            '请耐心等待批改结果。' +
    '</div>';
businesscomponents.previewandreports.UnCorrectZone.htmlForReport =
     ' <div  style=" font-size:16; font-weight:bold; text-align:left">' +
            '请耐心等待批改结果。' +
    '</div>';
