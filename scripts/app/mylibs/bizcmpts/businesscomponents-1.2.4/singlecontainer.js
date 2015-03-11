var businesscomponents = businesscomponents || {};

businesscomponents.SingleContainer = function(opt_html) {
    businesscomponents.SingleContainer.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.SingleContainer.html)[0]);

};
toot.inherit(businesscomponents.SingleContainer, toot.ui.Component);
toot.extendClass(businesscomponents.SingleContainer, {
    getElementContainer: function () {
        return this.getElement();
    }
});

businesscomponents.SingleContainer.html = '';
businesscomponents.SingleContainer.html_taskMarkPaperBox = '<div class="taskMarkPaperBox"></div>';
businesscomponents.SingleContainer.html_checkResultBox = '<div class="ReportNewQAbox"></div>';
businesscomponents.SingleContainer.html_feedBackBox = '<div class="alignL"></div>';
businesscomponents.SingleContainer.html_empty = '<div class="marT10">学生回答为空</div>';
businesscomponents.SingleContainer.html_checkResultBoxRe = '<div class="ReportNewQAbox"></div>';
