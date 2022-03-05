"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SCALE = 0.5;

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length,
        randomIndex = void 0;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        var _ref = [array[randomIndex], array[currentIndex]];
        array[currentIndex] = _ref[0];
        array[randomIndex] = _ref[1];
    }

    return array;
}

var IMG_MANIFEST = [{ src: "img/banana_outline.png", id: "A" }, { src: "img/blueberry_outline.png", id: "B" }, { src: "img/pineapple_outline.png", id: "C" }, { src: "img/strawberry_outline.png", id: "D" }, { src: "img/banana_flat.png", id: "A_flat" }, { src: "img/blueberry_flat.png", id: "B_flat" }, { src: "img/pineapple_flat.png", id: "C_flat" }, { src: "img/strawberry_flat.png", id: "D_flat" }];

var REEL_CONFIG = [shuffle(["A", "B", "C", "D"]), shuffle(["A", "B", "C", "D"]), shuffle(["A", "B", "C", "D"])];

var PR_WIN = 1; //0.25;


//const IMG_WIDTH

var SlotMachine = function () {
    function SlotMachine(slotsContainerId, slotsCanvasId, tryAgainContainerId, spinTo) {
        _classCallCheck(this, SlotMachine);

        this.jsConfetti = new JSConfetti();

        this.spinTo = spinTo;
        var canvas = document.getElementById(slotsCanvasId);
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
        this.flats = {};
        this.initStage();
        //this.loadBitmaps();
    }

    _createClass(SlotMachine, [{
        key: "initStage",
        value: function initStage() {
            this.stage = new createjs.StageGL(this.slotsCanvasId);
            this.stage.setClearColor("#000");
            createjs.Ticker.framerate = 30;

            var THIS = this;
            createjs.Ticker.addEventListener("tick", function (event) {
                THIS.tick(event);
            });
        }
    }, {
        key: "tick",
        value: function tick(event) {
            var _this = this;

            if (this.spinning === undefined) {
                return;
            }

            for (var i = 0; i < this.spinning.length; i++) {
                if (!this.spinning[i]) {
                    continue;
                }

                var topY = this.reels[i][0].y;
                var bottomY = this.reels[i][1].y;

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

                var targetY = this.spinTo[i].targetY;
                //console.log( this.spinTo[i]);
                var reelY = this.reels[i][0].y;

                //console.log(this.numRotations[i], this.spinTo[i].minRotations)
                if (this.numRotations[i] >= this.spinTo[i].minRotations && reelY >= targetY && reelY < targetY + this.spinDeltaY) {
                    var diff = this.reels[i][0].y - targetY;
                    this.reels[i][0].y = targetY; // + this.spinDeltaY;
                    this.reels[i][1].y -= diff;
                    //this.reels[i][1].y -= this.spinDeltaY;
                    //console.log(targetY, this.reels[i][0].y);
                    this.spinning[i] = false;

                    console.log("d,", this.spinTo[i].symbol);

                    var container = this.reels[i][0];
                    container.filters = [];
                    container.updateCache();

                    console.log("x", this.spinTo[i]);

                    container = this.reels[i][1];
                    container.filters = [];
                    container.updateCache();

                    if (i == 2) {
                        (function () {
                            var THIS = _this;
                            if (_this.spinTo.victory) {
                                setInterval(function () {
                                    THIS.jsConfetti.addConfetti();
                                }, 800);
                            }

                            _this.flats[0][0][_this.spinTo[0].symbol + "_flat"].visible = true;
                            _this.flats[1][0][_this.spinTo[1].symbol + "_flat"].visible = true;
                            _this.flats[2][0][_this.spinTo[2].symbol + "_flat"].visible = true;

                            var container = _this.reels[0][0];
                            container.updateCache();
                            container = _this.reels[1][0];
                            container.updateCache();
                            container = _this.reels[2][0];
                            container.updateCache();
                        })();
                    }
                    //ar bounds = container.getBounds();
                    //container.cache(-50+bounds.x, -50+bounds.y, 100+bounds.width, 100+bounds.height);

                    /*
                            container = this.reels[i][1];
                                    container.filters = [];
                            var bounds = container.getBounds();
                            container.cache(-500+bounds.x, -500+bounds.y, 500+bounds.width, 500+bounds.height)*/

                    //this.setSymbol(i);
                }
                //this.reels[i][0].y = targetY + 
            }

            this.stage.update();
        }

        /*setSymbol(index) {
            const reelIds = REEL_CONFIG[index];
            const spin = this.spinTo[index];
             const dy = reelIds.indexOf(spin.symbol) * this.symbolHeight;
             this.reels[index][0].y = -dy;
        }*/

    }, {
        key: "spin",
        value: function spin() {
            this.spinning = [true, true, true];
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

    }, {
        key: "createReel",
        value: function createReel(reelIndex, topOrBottom) {
            var reelIds = REEL_CONFIG[reelIndex];
            var container = new createjs.Container();

            this.stage.addChild(container);

            var y = 0;
            var width = 0;
            var height = 0;
            var bmp = undefined;
            var symbolHeight = 0;

            if (this.flats[reelIndex] === undefined) {
                this.flats[reelIndex] = {};
                /*this.flats[reelIndex] = {
                    true : undefined,
                    false: undefined
                };*/
            }

            if (this.flats[reelIndex][topOrBottom] === undefined) {
                this.flats[reelIndex][topOrBottom] = {};
            }

            //console.l

            console.log(this.flats);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = reelIds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var imgId = _step.value;

                    bmp = this.images[imgId].clone();
                    bmp.scaleX = SCALE;
                    bmp.scaleY = SCALE;

                    container.addChild(bmp);
                    bmp.y = y;
                    width = Math.max(width, bmp.image.width) * SCALE;
                    symbolHeight = Math.max(symbolHeight, bmp.image.height * SCALE);

                    var bmpFlat = this.images[imgId + "_flat"].clone();
                    bmpFlat.scaleX = SCALE;
                    bmpFlat.scaleY = SCALE;
                    container.addChild(bmpFlat);
                    bmpFlat.y = y;
                    bmpFlat.visible = false;

                    y += bmp.image.height * SCALE;
                    height += bmp.image.height * SCALE;

                    this.flats[reelIndex][topOrBottom][imgId + "_flat"] = bmpFlat;

                    //flats[reelIds][imgId + "_flat"] = bmpFlat;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (this.reelWidth == undefined) {
                this.reelWidth = width;
            }

            if (this.reelWidth != width) {
                console.log(this.reelWidth, width);
                throw "Bad width";
            }

            if (height !== symbolHeight * reelIds.length) {
                console.log(height, symbolHeight);
                throw "Bad height";
            }

            this.symbolHeight = symbolHeight;

            this.reelHeight[reelIndex] = height;

            if (topOrBottom === 1) {
                container.y = -height;
            }

            container.x = this.reelWidth * reelIndex;

            this.setTarget(reelIndex);

            var blurFilter = new createjs.BlurFilter(10, 10, 1);
            container.filters = [blurFilter];
            //var bounds = blurFilter.getBounds();

            var bounds = container.getBounds();

            container.cache(-50 + bounds.x, -50 + bounds.y, 100 + bounds.width, 100 + bounds.height);

            //container.filters = []
            //container.cache(-50+bounds.x, -50+bounds.y, 100+bounds.width, 100+bounds.height)
            return container;
        }
    }, {
        key: "setTarget",
        value: function setTarget(reelIndex) {
            var reelIds = REEL_CONFIG[reelIndex];
            //console.log("reelIds", reelIds)
            var symbol = this.spinTo[reelIndex].symbol;
            var symbolIndex = reelIds.indexOf(symbol);
            if (this.spinTo[reelIndex].placement === "top") {
                this.spinTo[reelIndex].targetY = -this.symbolHeight * symbolIndex;
            } else if (this.spinTo[reelIndex].placement === "bottom") {
                this.spinTo[reelIndex].targetY = -this.symbolHeight * (symbolIndex - 1);
            } else {
                this.spinTo[reelIndex].targetY = -this.symbolHeight * symbolIndex + this.symbolHeight / 2;
            }
            //console.log(symbol, symbolIndex, this.spinTo[reelIndex].targetY);
        }
    }, {
        key: "run",
        value: function run() {
            //console.log(3)
            for (var i = 0; i < REEL_CONFIG.length; i++) {
                this.reels[i] = [this.createReel(i, 0), this.createReel(i, 1)];
                //this.reels[i][1].top = this.reels[i][0].height;            
            }

            //this.createReel(1);
            //this.createReel(2);

            this.stage.update();

            this.spin();
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

    }]);

    return SlotMachine;
}();

function main() {

    if (Cookies.get('vtime')) {
        $("#try-again-container").css("display", "");
        return;
    }

    $("#slots-container").css("display", "");

    // https://stackoverflow.com/questions/20683394/code-javascript-for-a-cookie-that-expires-at-midnight
    // let expires;
    // const date = new Date();
    // date.setDate(date.getDate() + 1);
    // expires = date;//.toGMTString();
    var midnight = new Date();
    midnight.setHours(23, 59, 59, 0);
    Cookies.set('vtime', "good", { expires: midnight });

    //let SPIN_TO = undefined;
    var ALL_PLACEMENTS = ["top", "middle", "bottom"];
    var MIN_ROTATIONS = [3, 5, 7];
    var symbols = undefined;
    var placements = undefined;
    var victory = undefined;
    if (Math.random() < PR_WIN) {
        var symbol = REEL_CONFIG[0][0];
        symbols = [symbol, symbol, symbol];
        var placement = shuffle(ALL_PLACEMENTS)[0];
        placements = [placement, placement, placement];
        victory = true;
    } else {
        // hacky way to ensure no match. could be improved
        symbols = [REEL_CONFIG[0][0], REEL_CONFIG[0][1], REEL_CONFIG[0][2]];
        placements = [shuffle(ALL_PLACEMENTS)[0], shuffle(ALL_PLACEMENTS)[0], shuffle(ALL_PLACEMENTS)[0]];
        victory = false;
    }

    var SPIN_TO = {
        victory: victory,
        0: {
            placement: placements[0],
            symbol: symbols[0],
            minRotations: MIN_ROTATIONS[0],
            targetY: undefined
        },
        1: {
            placement: placements[1],
            symbol: symbols[1],
            minRotations: MIN_ROTATIONS[1],
            targetY: undefined
        },
        2: {
            placement: placements[2],
            symbol: symbols[2],
            minRotations: MIN_ROTATIONS[2],
            targetY: undefined
        }
    };

    var machine = new SlotMachine("slots-container", "slots-canvas", "try-again-container", SPIN_TO);

    var queue = new createjs.LoadQueue();
    queue.on("complete", function (event) {
        //machine.images["7"] = new createjs.Bitmap(queue.getResult("7"));
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = IMG_MANIFEST[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var record = _step2.value;

                //src = record.src;
                var id = record.id;
                machine.images[id] = new createjs.Bitmap(queue.getResult(id));
                //machine.images[id].scaleX = SCALE;
                //machine.images[id].scaleY = SCALE;

                //machine.stage.addChild(machine.images[id]);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        machine.run();
        // Do stuff with bitmap
    });

    queue.loadManifest(IMG_MANIFEST);

    return machine;
}

var MACHINE = main();

// function tick(event) {
//     console.log(MACHINE.reels);
// }