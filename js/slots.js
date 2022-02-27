
class SlotMachine {

    constructor(slotsContainerId, tryAgainContainerId) {
        this.slotsContainerId = slotsContainerId;
        this.tryAgainContainerId = tryAgainContainerId;
        this.init();
    }

    init() {
        console.log(1);
    }
}

function main() {
    const machine = new SlotMachine("#slots-container", "try-again-container");
}

main();