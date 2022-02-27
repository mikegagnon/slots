const IMG_MANIFEST = [
    {src: "img/7.png", id: "7"},
    {src: "img/Cherry.png", id: "Cherry"},
]

class SlotMachine {

    constructor(slotsContainerId, slotsCanvasId, tryAgainContainerId) {
        this.slotsContainerId = slotsContainerId;
        this.slotsCanvasId = slotsCanvasId;
        this.tryAgainContainerId = tryAgainContainerId;
        this.images = {};
        this.initStage();
        //this.loadBitmaps();
    }

    initStage() {
        console.log(1);
        this.stage = new createjs.StageGL(this.slotsCanvasId);
        this.stage.setClearColor("#000");
        createjs.Ticker.addEventListener("tick", this.stage);
    }

    loadBitmap(name) {
        const bmp = new createjs.Bitmap(IMAGES[name]);
        const THIS = this;
        this.bmp.image.onload = function() {

            // console.log(2)
            // THIS.stage.addChild(THIS.bmp)
            // THIS.bmp.x = 0;
            // THIS.bmp.y = 0;
            // THIS.stage.update();

        }        
    }

    loadBitmaps() {

        return;
        this.bmp = new createjs.Bitmap("img/7.png");
        const THIS = this;
        this.bmp.image.onload = function() {

            // console.log(2)
            // THIS.stage.addChild(THIS.bmp)
            // THIS.bmp.x = 0;
            // THIS.bmp.y = 0;
            // THIS.stage.update();

        }

    }

    run() {

    }
}

function main() {
    const machine = new SlotMachine("slots-container", "slots-canvas", "try-again-container");

    const queue = new createjs.LoadQueue();
    queue.on("complete", function(event) {
        //machine.images["7"] = new createjs.Bitmap(queue.getResult("7"));
        for (record of IMG_MANIFEST) {
            //src = record.src;
            id = record.id;
            machine.images[id] = new createjs.Bitmap(queue.getResult(id));
            machine.stage.addChild(machine.images[id]);
        }
        machine.run();
        // Do stuff with bitmap
    });



    queue.loadManifest(IMG_MANIFEST);


}

main();