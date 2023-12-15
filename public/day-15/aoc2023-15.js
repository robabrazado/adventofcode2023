function part1(puzzleInput) {
    const sequence = puzzleInput.trim().split(",");
    return sequence
        .map(e => hash(e))
        .reduce((a, e) => a + e);
}

function part2(puzzleInput) {
    const allBoxes = new Array(256).fill(null).map((e, i) => new LensBox(i));

    const sequence = puzzleInput.trim().split(",");
    sequence.forEach(instruction => {
        const [label, opSymbol, focalLengthText] = instruction.split(/([=-])/g);
        const focalLength = focalLengthText ? parseInt(focalLengthText) : -1;
        const boxIdx = hash(label);
        
        switch (opSymbol) {
            case "-":
                allBoxes[boxIdx].removeLens(label);
                break;
            case "=":
                allBoxes[boxIdx].addLens(label, focalLength);
                break;
            default:
                throw new Error("Uh oh");
        }
    });

    return allBoxes.reduce((a, e) => a + e.getFocusingPower(), 0);
}

function hash(text) {
    let currentValue = 0;
    const textLen = text.length;
    for (let i = 0; i < textLen; i++) {
        currentValue += text.charCodeAt(i);
        currentValue *= 17;
        currentValue = currentValue % 256;
    }
    return currentValue;
}

class LensBox {
    boxId;
    installedLenses = [];

    constructor(id) {
        this.boxId  = id;
    }

    addLens(label, focalLength) {
        const lens = new Lens(label, focalLength);
        let replaceIdx = this.installedLenses.findIndex(lens => lens.label === label);
        if (replaceIdx >= 0) {
            this.installedLenses[replaceIdx] = lens;
        } else {
            this.installedLenses.push(lens);
        }
    }

    removeLens(label) {
        let removeIdx = this.installedLenses.findIndex(lens => lens.label === label);
        if (removeIdx >= 0) {
            this.installedLenses.splice(removeIdx, 1);
        }
    }

    getFocusingPower() {
        return this.installedLenses.reduce((a, lens, i) => a + ((this.boxId + 1) * (i + 1) * lens.focalLength), 0);
    }
}

class Lens {
    label;
    focalLength;

    constructor(label, focalLength) {
        this.label = label;
        this.focalLength = focalLength;
    }
}