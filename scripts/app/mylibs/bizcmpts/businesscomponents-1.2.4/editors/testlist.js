var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.TestList = function () {
    var _this = this;
    this._data = JSON.parse($("#data-testList").val())
    businesscomponents.editors.TestList.superClass.constructor.call(this, $(businesscomponents.editors.TestList.html)[0]);
    this._$testContentList = $(this._element).find('[gi~="testContentList"]')[0];
    this._$showtest = $(this._element).find('[gi~="showtest"]');
    this._$gtlt = $(this._element).find('[gi~="gtlt"]');
    this._$testContet = $(this._element).find('[gi~="testContet"]');
    this._$showtest.click(function () {
        _this._showOrHide();
    })

    //分页代码
    this._$currentPage = $(this._element).find('[gi~="currentPage"]');
    this._$totalPage = $(this._element).find('[gi~="totalPage"]');
    //上一页
    this._$lt = $(this._element).find('[gi~="lt"]');
    //下一页
    this._$gt = $(this._element).find('[gi~="gt"]');
    this._currentPage = 1;
    this._pageSize = 6;
    this._totalPage = parseInt(this._data.length / this._pageSize) + 1;
    if (this._data.length % this._pageSize === 0 && this._data.length > 0) {
       this._totalPage= this._totalPage - 1;
    }
    this._$lt.click(function () {
        _this._lt();
    })
    this._$gt.click(function () {
        _this._gt();
    })
    this._init();
};
toot.inherit(businesscomponents.editors.TestList, toot.ui.Component);
toot.extendClass(businesscomponents.editors.TestList, {
    getElement: function () { return this._element; },
    _init: function () {
        this._$testContentList.innerHTML = this._getTestListUi();
        //分页
        this._pageUi();
        this._showContentByPage();
        this._btnState();
        //默认合上
        this._showOrHide();
    },
    _getTestUi: function (testData) {
        if (testData.State == 1) {
            return '<li class="effectiveIcon" title="已生效">' +'<span title="'+testData.FullName+'">'+ testData.ShowName + '</span></li>';
        }
        else if (testData.State == -1) {
            return '<li class="editIcon" title="配置中">' +'<span title="'+testData.FullName+'">'+ testData.ShowName + '</span></li>';
        }
        else {
            return '<li class="loseeffectiveIcon" title="未生效">'  +'<span title="'+testData.FullName+'">'+ testData.ShowName + '</span></li>';
        }
    },
    _getTestListUi: function () {
        var _this = this;
        var testListHtml = "";
        for (var i = 0; i < this._data.length; i++) {
            testListHtml += _this._getTestUi(_this._data[i]);
        }
        return testListHtml;
    },
    _showOrHide: function () {
        var _this = this;
        if (this._$gtlt.html() == "&gt;") {
            _this._$testContet.hide();
            this._$gtlt.html("&lt;")
        }
        else {
            _this._$testContet.show();
            this._$gtlt.html("&gt;")
        }
    },
    //以下为分页功能
    _lt: function () {
        if (this._currentPage != 1) {
            this._currentPage--;
            this._showContentByPage();
            this._btnState();
            this._pageUi();
        }

    },
    _gt: function () {
        if (this._totalPage != this._currentPage) {
            this._currentPage++;
            this._showContentByPage();
            this._btnState();
            this._pageUi();
        }

    },
    //根据页数显示数据
    _showContentByPage: function () {
        //当前显示试卷
        var minLi = (this._currentPage - 1) * this._pageSize;
        var maxLi = this._currentPage * this._pageSize;
        //alert($(this._element).find('li').length);
        $(this._element).find('li').hide();
        $(this._element).find('li').each(function (i) {
            if (minLi < i + 1 && i + 1 <= maxLi) {
                $(this).show();
            }
        })
    },
    //根据页面绑定下一页，上一页，按钮状态
    _btnState: function () {
        this._$lt.attr("class", "");
        this._$gt.attr("class", "");
        if (this._currentPage === 1) {
            this._$lt.attr("class", "DisNum");
        }
        if (this._totalPage === this._currentPage) {
            this._$gt.attr("class", "DisNum");
        }
    },
    _pageUi: function () {
        this._$currentPage.html(this._currentPage);
        this._$totalPage.html(this._totalPage);
    }
});
businesscomponents.editors.TestList.html =
'<div>' +
'<div class="relatedPaperListOuter">' +
  '<div class="relatedPaperListBox">' +
        '<div class="relatedPaperListL1" gi="showtest">' +
            '关<br />联<br />试<br />卷<br />列<br />表<br /><span gi="gtlt">&gt;</span>' +
        '</div>' +
        '<div class="relatedPaperListL2" gi="testContet">' +
            '<ul class="relatedPaperList" gi="testContentList">' +

            '</ul>' +

            '<div class="quotes3 clearfix" style="display:block;">' +
                '<a href="#"  gi="lt">&lt;</a>' +
                '<div class="pagenum"><em class="current" gi="currentPage"></em>/<em gi="totalPage"></em></div>' +
                '<a href="#" gi="gt">&gt;</a>' +
            '</div>' +
        '</div>' +
    '</div>' +
'</div>' +
'</div>';
$(function () {
    var testList = new businesscomponents.editors.TestList();
    //新增页面不显示试卷列表
    if (getQueryString("id") > 0) {
        $("body").append(testList.getElement());
    }
});