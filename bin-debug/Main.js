//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
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
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        Main.instance = _this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        var _this = this;
        if (event.groupName == "preload") {
            var DELAY = 0;
            setTimeout(function () {
                _this.stage.removeChild(_this.loadingView);
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, _this.onResourceLoadComplete, _this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, _this.onResourceLoadError, _this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, _this.onResourceProgress, _this);
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, _this.onItemLoadError, _this);
                _this.createGameScene();
            }, DELAY);
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        Main.stageW = this.stage.stageWidth;
        Main.stageH = this.stage.stageHeight;
        this.gameOther = new GameOther();
        this.stage.addChild(this.gameOther);
        this.scorePanel = new Score(199 * 2, Main.paddingTop, 'SCORE', 0);
        this.stage.addChild(this.scorePanel);
        var best = JSON.parse(egret.localStorage.getItem('best'));
        if (best === undefined || best === null)
            best = 0;
        this.bestPanel = new Best(269 * 2, Main.paddingTop, 'BEST', best);
        this.stage.addChild(this.bestPanel);
        this.restartBtn = new RestartBtn(210 * 2, 85 * 2);
        this.stage.addChild(this.restartBtn);
        this.game = new Game();
        this.stage.addChild(this.game);
        this.stage.addEventListener(GameOverEvent.NAME, this.gameOverHandle, this);
        if (Main.isGameOver) {
            this.gameOverDialog = new GameOverDialog();
            this.stage.addChild(this.gameOverDialog);
        }
    };
    Main.prototype.restart = function () {
        this.scorePanel.restart();
        this.game.restart();
        if (this.gameOverDialog)
            this.gameOverDialog.triggerMaskTap();
        console.log('触发game restart');
    };
    Main.prototype.gameOverHandle = function () {
        console.log('Game Over Event');
        if (!this.gameOverDialog) {
            this.gameOverDialog = new GameOverDialog();
            this.stage.addChild(this.gameOverDialog);
        }
    };
    Main.prototype.setGameOverDialogNull = function () {
        this.gameOverDialog = null;
    };
    Main.prototype.updateScore = function (increment) {
        Main.score += increment;
        if (Main.score > this.bestPanel.getContent()) {
            this.bestPanel.setContent(Main.score);
            egret.localStorage.setItem('best', Main.score.toString());
        }
        this.scorePanel.setContent(Main.score);
    };
    Main.GAME_BG_COLOR = 0x8DECD3;
    Main.FONT_COLOR = 0x5FB4AE;
    Main.FONT_FAMILY = 'PingFang SC';
    Main.paddingTop = 20 * 2;
    Main.paddingLeft = 47 * 2;
    Main.stageW = 0;
    Main.stageH = 0;
    Main.score = 0;
    Main.best = 0;
    Main.isGameOver = false;
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map