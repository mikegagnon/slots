
class SlotMachine {

    constructor(slotsContainerId, slotsCanvasId, tryAgainContainerId) {
        this.slotsContainerId = slotsContainerId;
        this.slotsCanvasId = slotsCanvasId;
        this.tryAgainContainerId = tryAgainContainerId;
        this.init();
    }

    init() {
        console.log(1);
        this.stage = new createjs.Stage(this.slotsCanvasId);



        var circle = new createjs.Shape();
        circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
        circle.x = 0;
        circle.y = 0;
        this.stage.addChild(circle);
        this.stage.update();


    }
}

function main() {
    const machine = new SlotMachine("slots-container", "slots-canvas", "try-again-container");
}

main();