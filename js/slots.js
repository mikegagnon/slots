const IMG_MANIFEST = [
    {src: "img/7.png", id: "7"},
    {src: "img/Cherry.png", id: "Cherry"},
    {src: "img/BAR.png", id: "BAR"},
    {src: "img/2xBAR.png", id: "2xBAR"},
    {src: "img/3xBAR.png", id: "3xBAR"},
]

const REEL_CONFIG = [
    ["2xBAR", "3xBAR", "7", "BAR", "Cherry"],
    ["Cherry", "Cherry", "7"],
    ["7", "Cherry", "7"]
];

//const IMG_WIDTH

class SlotMachine {

    constructor(slotsContainerId, slotsCanvasId, tryAgainContainerId) {
        this.slotsContainerId = slotsContainerId;
        this.slotsCanvasId = slotsCanvasId;
        this.tryAgainContainerId = tryAgainContainerId;
        this.images = {};
        this.reelWidth = undefined;
        this.reels = [];
        this.initStage();
        //this.loadBitmaps();
    }

    initStage() {
        console.log(1);
        this.stage = new createjs.StageGL(this.slotsCanvasId);
        this.stage.setClearColor("#000");
        createjs.Ticker.addEventListener("tick", this.stage);
    }

    /*loadBitmap(name) {
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

    }*/

    createReel(index) {
        const reelIds = REEL_CONFIG[index];
        const container = new createjs.Container();
        this.stage.addChild(container);

        let y = 0;
        let width = 0
        for (const imgId of reelIds) {
            const bmp = this.images[imgId].clone();
            container.addChild(bmp);
            bmp.y = y
            y += bmp.image.height;
            width = Math.max(width, bmp.image.width);
        }

        if (this.reelWidth == undefined) {
            this.reelWidth = width;
        }

        if (this.reelWidth != width) {
            console.log(this.reelWidth, width);
            throw "Bad width";
        }

        container.x = this.reelWidth * index;
        return container;
    }

    run() {
        console.log(3)
        for (let i = 0; i < REEL_CONFIG.length; i++) {
            this.reels[i] = [this.createReel(i), this.createReel(i)];
            this.reels[i][1].top = this.reels[i][0].height;            
        }

        //this.createReel(1);
        //this.createReel(2);

        this.stage.update();
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
            //machine.stage.addChild(machine.images[id]);
        }
        machine.run();
        // Do stuff with bitmap
    });



    queue.loadManifest(IMG_MANIFEST);


}

main();