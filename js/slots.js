
class SlotMachine {

    constructor(slotsContainerId, slotsCanvasId, tryAgainContainerId) {
        this.slotsContainerId = slotsContainerId;
        this.slotsCanvasId = slotsCanvasId;
        this.tryAgainContainerId = tryAgainContainerId;
        this.initStage();
        this.loadBitmaps();
    }

    initStage() {
        console.log(1);
        this.stage = new createjs.StageGL(this.slotsCanvasId);
        this.stage.setClearColor("#000");
        createjs.Ticker.addEventListener("tick", this.stage);

        // var circle = new createjs.Shape();
        // circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
        // circle.x = 0;
        // circle.y = 0;
        // this.stage.addChild(circle);
        // this.stage.update();
    }

    loadBitmaps() {
        this.bmp = new createjs.Bitmap("img/7.png");
        const THIS = this;
        this.bmp.image.onload = function() {
            console.log(2)
            THIS.stage.addChild(THIS.bmp)
            THIS.bmp.x = 0;
            THIS.bmp.y = 0;
            THIS.stage.update();

        }

    }
}

function main() {
    const machine = new SlotMachine("slots-container", "slots-canvas", "try-again-container");
}

main();