/**
* Created by dayday on 2015/1/29.
*/
var businesscomponents = businesscomponents || {};
businesscomponents.InputTimer = function (model) {
    var _this = this;
    var timerRun = '';
    this.model = model || {};
    //this.$el = this.model.el;
    this.value = 0; //累计的时间
    this.input = this.model.input ? this.model.input : this.$input = $("<input>");
    this._blur = function () {
        clearInterval(timerRun);
    };
    this._focus = function () {

        timerRun = setInterval(runTimer, 1000);
    };
    var runTimer = function () {
        _this.value = 1 + _this.value;
        _this.render();
    };
    this.render = function () {
        //this.$el.html(this.value)
        $(_this).trigger("changeValue", _this.value);
    }; // 绑定事件
    this.input.on("focus", _this._focus);
    this.input.on("blur", _this._blur);
};
////使用方式
//$(function(){
//    var input = $("input");
//    var el =  $("p");
//    var model = {'input' :input , 'el':el }
//    new inputTimer(model);
//});