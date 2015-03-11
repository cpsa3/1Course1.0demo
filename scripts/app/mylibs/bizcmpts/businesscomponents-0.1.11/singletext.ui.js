var businesscomponents = businesscomponents || {};

businesscomponents.singletext = businesscomponents.singletext || {};

businesscomponents.singletext.ui = businesscomponents.singletext.ui || {};

businesscomponents.singletext.ui.SingleText = function (opt_html) {
    businesscomponents.singletext.ui.SingleText.superClass.constructor.call(this, $(opt_html === undefined ? businesscomponents.singletext.ui.SingleText.html2 : opt_html).get(0));

    this._lblName = new toot.ui.Label($(this._element).find('[gi="lblName"]').get(0));
    this._txtValue = new toot.ui.TextBox($(this._element).find('[gi="txtValue"]').get(0));
};
toot.inherit(businesscomponents.singletext.ui.SingleText, businesscomponents.ui.ComponentBase);
toot.extendClass(businesscomponents.singletext.ui.SingleText, {
    getLabel: function () {
        return this._lblName;
    },
    setLabel: function (lblName) {
        this._lblName.setText(lblName);
    },
    updateUIByModel: function () {
        this._txtValue.setValue(this._model);
    },
    updateModelByUI: function () {
        this._model = this._txtValue.getValue();
    }
});

//删去onfocus="this.className=\'textareafocus PopupTAw2\'" onblur="this.className=\'textarea PopupTAw2\'" by 小潘
businesscomponents.singletext.ui.SingleText.html1 =
           '<tr>' +
             '<td class="alignR" gi="lblName">题目文本</td>' +
             '<td colspan="5">' +
                '<textarea id="textQuestion" name="textQuestion" class="textarea PopupTAw2"  gi="txtValue"></textarea>'; +
             '</td>' +
           '</tr>';


//删去onfocus="this.className=\'textareafocus PopupTAw2\'" onblur="this.className=\'textarea PopupTAw2\'" by 小潘
businesscomponents.singletext.ui.SingleText.html2 =
         '<div class="itembox1 clearfix">' +
                '<span class="fl labelNameStyle1" gi="lblName">题目文本</span>' +
               ' <div class="marbom fl"><textarea class="textarea PopupTAw5"  gi="txtValue"></textarea></div>' +
        '</div>';
//单行文本框 by 文艺
businesscomponents.singletext.ui.SingleText.html3 =
         '<div class="itembox1 clearfix">' +
                '<span class="fl labelNameStyle1" gi="lblName">题目文本</span>' +
               ' <div class="marbom fl"><input type="text" class="poouptext PopupTw8"  gi="txtValue"></input></div>' +
        '</div>';
//综合写作 by 小宝
businesscomponents.singletext.ui.SingleText.html4 =
        '<div class="itembox1 clearfix">' +
                '<span class="fl labelNameStyle1" gi="lblName">题目文本</span>' +
               '<textarea id="txtQuestion" name="txtQuestion" class="textarea TEtextarea2" gi="txtValue"></textarea>' +
        '</div>';

