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
var GameOverDialog = (function (_super) {
    __extends(GameOverDialog, _super);
    function GameOverDialog() {
        var _this = _super.call(this) || this;
        _this.restartBtn = new RestartBtn(127 * 2, 423 * 2, '再玩一次');
        _this.x = 0;
        _this.y = 0;
        _this.width = Main.stageW;
        _this.height = Main.stageH;
        _this.addMask();
        _this.addChild(_this.restartBtn);
        _this.addText();
        _this.addCry();
        return _this;
    }
    GameOverDialog.prototype.triggerMaskTap = function () {
        this.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
    };
    GameOverDialog.prototype.addMask = function () {
        var mask = new egret.Shape();
        this.maskDisplayObject = mask;
        // mask.name = 'mask'
        mask.graphics.beginFill(0xffffff, .8);
        mask.graphics.drawRect(0, 0, Main.stageW, Main.stageH);
        mask.graphics.endFill();
        this.touchEnabled = true;
        // 取消冒泡
        this.restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.stopRestartBtnPropagation, this);
        // 事件只能绑定在 显示容器 上
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMaskTouchTap, this, false);
        this.addChild(mask);
    };
    GameOverDialog.prototype.stopRestartBtnPropagation = function (event) {
        event.stopPropagation();
    };
    GameOverDialog.prototype.onMaskTouchTap = function (event) {
        // 关闭当前 图层
        console.log('mask 被触发啦');
        if (this.parent) {
            this.parent.removeChild(this);
            // removeChild 并不会
            Main.instance.setGameOverDialogNull();
        }
    };
    GameOverDialog.prototype.addText = function () {
        var text = new egret.TextField();
        text.text = 'Game Over !';
        text.size = 48 * 2;
        text.textColor = Main.FONT_COLOR;
        text.width = Main.stageW;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.y = 166 * 2;
        text.rotation = -6;
        this.addChild(text);
    };
    GameOverDialog.prototype.addCry = function () {
        var img = new egret.Bitmap();
        img.texture = RES.getRes('cry_png');
        img.width = 101 * 2;
        img.height = 101 * 2;
        img.y = 226 * 2;
        img.x = 138 * 2;
        this.addChild(img);
    };
    return GameOverDialog;
}(egret.DisplayObjectContainer));
__reflect(GameOverDialog.prototype, "GameOverDialog");
//# sourceMappingURL=GameOverDialog.js.map