const IMG_MANIFEST = [
    {src: "img/7.png", id: "7"},
    {src: "img/Cherry.png", id: "Cherry"},
    {src: "img/BAR.png", id: "BAR"},
    {src: "img/2xBAR.png", id: "2xBAR"},
    {src: "img/3xBAR.png", id: "3xBAR"},
]

const REEL_CONFIG = [
    ["2xBAR", "3xBAR", "7", "BAR", "Cherry"],
    ["Cherry", "7", "2xBAR"],//, "BAR", "3xBAR"],
    ["7", "2xBAR", "Cherry"]//, "BAR", "3xBAR"],
];

//const IMG_WIDTH

class SlotMachine {

    constructor(slotsContainerId, slotsCanvasId, tryAgainContainerId) {
        const canvas = document.getElementById(slotsCanvasId);
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        //this.spinReelDuration = 1000;
        this.spinDeltaY = 50;
        this.slotsContainerId = slotsContainerId;
        this.slotsCanvasId = slotsCanvasId;
        this.tryAgainContainerId = tryAgainContainerId;
        this.images = {};
        this.reelWidth = undefined;
        this.reels = [];
        this.reelHeight = [];
        this.spinning = undefined;
        this.numRotations = [0, 0, 0];
        this.initStage();
        //this.loadBitmaps();
    }

    initStage() {
        this.stage = new createjs.StageGL(this.slotsCanvasId);
        this.stage.setClearColor("#000");
        createjs.Ticker.framerate = 30;

        const THIS = this;
        createjs.Ticker.addEventListener("tick", function(event) {
            THIS.tick(event);
        });
    }

    tick(event) {
        if (this.spinning === undefined) {
            return;
        }

        for (let i = 0; i < this.spinning.length; i++) {
            if (!this.spinning[i]) {
                continue;
            }

            const topY = this.reels[i][0].y;
            const bottomY = this.reels[i][1].y;



            this.reels[i][0].y += this.spinDeltaY;
            if (this.reels[i][0].y > this.canvasHeight) {
                //this.reels[i][0].y = -this.reelHeight[i] - this.reels[i][1].y ;// - this.canvasHeight;
                this.reels[i][0].y = bottomY - this.reelHeight[i] + this.spinDeltaY;
                this.numRotations[i] += 1;
            }

            this.reels[i][1].y += this.spinDeltaY;
            if (this.reels[i][1].y > this.canvasHeight) {
                this.reels[i][1].y = topY - this.reelHeight[i] + this.spinDeltaY;
                this.numRotations[i] += 1;
                //this.reels[i][1].y = -this.reelHeight[i] - this.reels[i][0].y // - this.canvasHeight;
            }

            /*let symbolTop;
            let symbolMiddle;
            let symbolBottom;
            console.log(this.reels[i][0].y)*/
            /*if (this.reels[i][0].y > 0 & this.reels[i][0] < this.spinDeltaY) {
                this.spinning[i] = false;
            } else {

                //this.spinning[i] = false;
            }*/


            console.log(this.numRotations[i], this.spinTo[i].minRotations)
            if (this.numRotations[i] >= this.spinTo[i].minRotations) {
                console.log("foo")
                this.spinning[i] = false;
            }
        }

        this.stage.update();

    }

    spin(spinTo) {
        this.spinning = [true, true, true];
        this.spinTo = spinTo;

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

    createReel(reelIndex, topOrBottom) {
        const reelIds = REEL_CONFIG[reelIndex];
        const container = new createjs.Container();
        this.stage.addChild(container);

        let y = 0;
        let width = 0
        let height = 0;
        let bmp = undefined;
        for (const imgId of reelIds) {
            bmp = this.images[imgId].clone();
            container.addChild(bmp);
            bmp.y = y
            y += bmp.image.height;
            width = Math.max(width, bmp.image.width);
            height += bmp.image.height; 
        }

        if (this.reelWidth == undefined) {
            this.reelWidth = width;
        }

        if (this.reelWidth != width) {
            console.log(this.reelWidth, width);
            throw "Bad width";
        }

        this.reelHeight[reelIndex] = height;

        if (topOrBottom === 1) {
            container.y = -height;
        }

        container.x = this.reelWidth * reelIndex;



        var blurFilter = new createjs.BlurFilter(10, 10, 1);
        container.filters = [blurFilter];
        //var bounds = blurFilter.getBounds();

        var bounds = container.getBounds();

        container.cache(-50+bounds.x, -50+bounds.y, 100+bounds.width, 100+bounds.height)

        //container.filters = []
        //container.cache(-50+bounds.x, -50+bounds.y, 100+bounds.width, 100+bounds.height)
        return container;
    }

    run(spinTo) {
        //console.log(3)
        for (let i = 0; i < REEL_CONFIG.length; i++) {
            this.reels[i] = [this.createReel(i, 0), this.createReel(i, 1)];
            //this.reels[i][1].top = this.reels[i][0].height;            
        }

        //this.createReel(1);
        //this.createReel(2);

        this.stage.update();

        this.spin(spinTo);
    }

    /*spin() {

        function handleComplete() {
            console.log("complete")
        }

        const reelContainer = this.reels[0][0];
        createjs.Tween.get(reelContainer)
            .wait(1)
            .to({y:100,}, 1000)
            .call(handleComplete);
    }*/
}

function main() {
    const machine = new SlotMachine("slots-container", "slots-canvas", "try-again-container");

    const SPIN_TO = {
        0: {
            placement: "top",
            symbol: "3xBAR",
            minRotations: 1,
        },
        1: {
            placement: "top",
            symbol: "3xBAR",
            minRotations: 2,
        },
        2: {
            placement: "top",
            symbol: "3xBAR",
            minRotations: 3,
        },
    };

    const queue = new createjs.LoadQueue();
    queue.on("complete", function(event) {
        //machine.images["7"] = new createjs.Bitmap(queue.getResult("7"));
        for (record of IMG_MANIFEST) {
            //src = record.src;
            id = record.id;
            machine.images[id] = new createjs.Bitmap(queue.getResult(id));
            //machine.stage.addChild(machine.images[id]);
        }
        machine.run(SPIN_TO);
        // Do stuff with bitmap
    });



    queue.loadManifest(IMG_MANIFEST);

    return machine;
}

const MACHINE = main();

// function tick(event) {
//     console.log(MACHINE.reels);
// }
