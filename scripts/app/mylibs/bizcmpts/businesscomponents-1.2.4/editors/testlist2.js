var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.TestList = function () {
    var _this = this;
    this._projectList = JSON.parse($("#data-testList").val())
    this.dataList = {};
    this.dataList.course = [];
    this.dataList.assignment = [];
    this.dataList.exam = [];
    for (var i = 0; i < this._projectList.length; i++) {
        if (this._projectList[i].ProjectType == 0) {
            this.dataList.exam.push(this._projectList[i].ProjectName);
        }
        if (this._projectList[i].ProjectType == 1) {
            this.dataList.assignment.push(this._projectList[i].ProjectName);
        }
        if (this._projectList[i].ProjectType == 2) {
            this.dataList.course.push(this._projectList[i].ProjectName);
        }
    }

    this._data = null;

    businesscomponents.editors.TestList.superClass.constructor.call(this, $(businesscomponents.editors.TestList.html)[0]);

    this._$testContentList = $(this._element).find('[gi~="testContentList"]');

    this._$showtest = $(this._element).find('[gi~="showtest"]');
    this._$hidetest = $(this._element).find('[gi~="hidetest"]');
    this._$testContet = $(this._element).find('[gi~="testContet"]');
    this._$openWin = $(this._element).find('[gi~="openWin"]');
    this._$closeWin = $(this._element).find('[gi~="closeWin"]');

    this._$course = $(this._element).find('[gi~="course"]');
    this._$assignment = $(this._element).find('[gi~="assignment"]');
    this._$exam = $(this._element).find('[gi~="exam"]');

    //上一页
    this._$lt = $(this._element).find('[gi~="lt"]');
    //下一页
    this._$gt = $(this._element).find('[gi~="gt"]');
    //分页代码
    this._$currentPage = $(this._element).find('[gi~="currentPage"]');
    this._$totalPage = $(this._element).find('[gi~="totalPage"]');

    this._$hidetest.click(function () {
        _this._showOrHide();
    })

    this._$showtest.click(function () {
        _this._showOrHide();
    })

    this._$lt.click(function () {
        _this._lt();
    })

    this._$gt.click(function () {
        _this._gt();
    })


    this._$course.click(function () {
        _this._initProjectCss();
        _this._$course.addClass("CurrentItem");
        _this._initByProject(2);
    })
    this._$assignment.click(function () {
        _this._initProjectCss();
        _this._$assignment.addClass("CurrentItem");
        _this._initByProject(1);
    })
    this._$exam.click(function () {
        _this._initProjectCss();
        _this._$exam.addClass("CurrentItem");
        _this._initByProject(0);
    })
    //默认显示课程
    _this._initProjectCss();
    _this._$course.addClass("CurrentItem");
    _this._initByProject(2);
};
toot.inherit(businesscomponents.editors.TestList, toot.ui.Component);
toot.extendClass(businesscomponents.editors.TestList, {
    getElement: function () { return this._element; },

    //有关联数据不能修改
    isUnEdit: function () {
        if (this._projectList.length > 0) {
            return true;
        }
        else {
            return false;
        }
    },

    _initProjectCss: function () {
        var _this = this;
        _this._$course.attr("class", "relatedListLTabItem");
        _this._$assignment.attr("class", "relatedListLTabItem");
        _this._$exam.attr("class", "relatedListLTabItem");
    },
    _initByProject: function (type) {
        var _this = this;
        //测试
        if (type == 0) {
            this._data = this.dataList.exam;
        }
        if (type == 1) {
            this._data = this.dataList.assignment;
        }
        if (type == 2) {
            this._data = this.dataList.course;
        }
        _this._initUi();
    },
    //分页显示相关
    _initUi: function () {

        this._currentPage = 1;
        this._pageSize = 6;
        this._totalPage = parseInt(this._data.length / this._pageSize) + 1;
        if (this._data.length % this._pageSize === 0 && this._data.length > 0) {
            this._totalPage = this._totalPage - 1;
        }

        this._$testContentList.html(this._getTestListUi());
        //分页
        this._pageUi();
        this._showContentByPage();
        this._btnState();
        //默认合上
        //this._showOrHide();
    },
    _getTestUi: function (projectName) {
        return '<li class="NoIcon" title="' + projectName + '">' + projectName + '</li>';
    },
    _getTestListUi: function () {
        var _this = this;
        var testListHtml = "";
        for (var i = 0; i < this._data.length; i++) {
            testListHtml += _this._getTestUi(_this._data[i]);
        }
        return testListHtml;
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
        this._$lt.attr("class", "pagePrevious");
        this._$gt.attr("class", "pageNext");
        if (this._currentPage === 1) {
            this._$lt.attr("class", "pagePrevious pagePreviousDis");
        }
        if (this._totalPage === this._currentPage) {
            this._$gt.attr("class", "pageNext pageNextDis");
        }
    },
    _pageUi: function () {
        this._$currentPage.html(this._currentPage);
        this._$totalPage.html(this._totalPage);
    },
    _showOrHide: function () {
        var _this = this;
        if (this._$closeWin.css("display") == "none") {
            this._$closeWin.show();
            this._$openWin.hide();
            this._$testContet.hide();
        }
        else {
            this._$closeWin.hide();
            this._$openWin.show();
            this._$testContet.show();
        }
    }
});
businesscomponents.editors.TestList.html =
'<div>' +
'<div class="relatedPaperListOuter">' +
    '<div class="relatedPaperListBox"> ' +

        '<div style="display:none;" gi="closeWin">' +
          '<dl class="relatedListClosed" gi="hidetest">' +
              '<dd><span class="relatedListClosedItem" >关联项目列表</span></dd>' +
          '</dl>' +
        '</div>' +

        '<div style="display:block;">' +
          '<dl class="relatedListLTab" gi="openWin">' +
              '<dd><span class="relatedListLTabItem CurrentItem" gi="course">课程</span></dd>' +
              '<dd><span class="relatedListLTabItem" gi="assignment">作业</span></dd>' +
              '<dd><span class="relatedListLTabItem" gi="exam">试卷</span></dd>' +
              '<dd gi="showtest"><button class="relatedListLTabBtn"></button></dd>' +
          '</dl>' +
          '<div class="relatedPaperListL2" gi="testContet">' +
              '<ul class="relatedPaperList" gi="testContentList">' +
                  '<li class="NoIcon" title="TPOTPOTPO1123">TPOTPOTPOTPOTPOTPOTPOTPOTPOTPOTPOTPOTPOTPOTPO</li>' +
              '</ul>' +
              '<div class="quotes3_2 clearfix">' +
                  '<a href="#" class="pagePrevious" gi="lt">&lt;</a>' +
                  '<div class="pagenum"><em class="current" gi="currentPage"></em>/<em gi="totalPage"></em></div>' +
                  '<a href="#" class="pageNext" gi="gt">&gt;</a>' +
              '</div>' +
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