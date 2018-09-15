var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var RestartBtn = (function (_super) {
    __extends(RestartBtn, _super);
    function RestartBtn(_x, _y, text) {
        if (text === void 0) { text = 'New Game'; }
        var _this = _super.call(this) || this;
        _this._x = _x;
        _this._y = _y;
        _this.text = text;
        _this.BG_COLOR = 0xA3D4DC;
        _this.FONT_COLOR = 0xffffff;
        _this._width = 119 * 2;
        _this._height = 40 * 2;
        _this._radius = 3 * 2;
        _this.x = _this._x;
        _this.y = _this._y;
        _this.addBg();
        _this.addText();
        _this.touchEnabled = true;
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTouchTap, _this, false);
        _this.addEventListener(RestartEvent.NAME, _this.restartHandle, _this);
        return _this;
    }
    RestartBtn.prototype.restartHandle = function () {
        Main.instance.restart();
        console.log('触发game restart');
    };
    RestartBtn.prototype.addBg = function () {
        var bg = new egret.Shape();
        bg.graphics.beginFill(this.BG_COLOR);
        bg.graphics.drawRoundRect(0, 0, this._width, this._height, this._radius);
        bg.graphics.endFill();
        this.addChild(bg);
    };
    RestartBtn.prototype.addText = function () {
        var btn = new egret.TextField();
        btn.text = this.text;
        btn.size = 15 * 2;
        btn.textColor = this.FONT_COLOR;
        btn.width = this._width;
        btn.height = this._height;
        btn.textAlign = egret.HorizontalAlign.CENTER;
        btn.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(btn);
    };
    RestartBtn.prototype.onTouchTap = function () {
        // alert('重新开始游戏')
        console.log(this);
        var restartEvent = new RestartEvent(RestartEvent.NAME);
        this.dispatchEvent(restartEvent);
    };
    return RestartBtn;
}(egret.DisplayObjectContainer));
__reflect(RestartBtn.prototype, "RestartBtn");
//# sourceMappingURL=RestartBtn.js.map