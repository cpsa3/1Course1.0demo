//听写报告学生作答一栏显示
var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.TitleforDictation = function (opt_html) {
    businesscomponents.previewandreports.TitleforDictation.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.TitleforDictation.html)[0]);

    this._lblTitle = new toot.ui.Label(this._element);

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.TitleforDictation, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.TitleforDictation, {
    setTitle: function (title) {
        $(this._element).html(title);
    }
});
businesscomponents.previewandreports.TitleforDictation.html =
    '<h5 class="ReportNewSTitle" gi="item"></h5>';


businesscomponents.previewandreports.TitlesForDictation = function (opt_html) {
    businesscomponents.previewandreports.TitlesForDictation.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.TitlesForDictation.html)[0]);
    this._playCount = $(this._element).find('[gi~="playCount"]')[0];
    this._userTime = $(this._element).find('[gi~="useTime"]')[0];
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.TitlesForDictation, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.TitlesForDictation, {
   render: function(playcount,usetime) {
       $(this._playCount).html(playcount);
   //    $(this._userTime).html(usetime);

   }
});
businesscomponents.previewandreports.TitlesForDictation.html =
    '  <div class="ReportNewSBox2 clearfix">' +
    '<h5 class="ReportNewSTitle">学生作答</h5>' +
    '<div class="RecordBarBox">播放次数<span class="Textbox" gi="playCount">12</span></div>' +
 //   '<div class="RecordBarBox">用时<span class="Textbox" gi="useTime">00:12:00</span></div>'+
        '</div>';
