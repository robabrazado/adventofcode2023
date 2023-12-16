function part1(puzzleInput) {
    const contraption = new Contraption(puzzleInput);

    let output = contraption.toText();

    contraption.light(new BeamHead(0, 0, {row: 0, col: 1}));

    output += "\n" + contraption.toEnergizedText();

    output += "\n" + contraption.countEnergized();

    return output;
}

function part2(puzzleInput) {
    // This seems fast enough that I can maybe brute force it with the code I already have for part 1
    // I need the bounds of the input to build the search space.
    const lines = puzzleInput.split("\n");
    const numRows = lines.length;
    const numCols = numRows ? lines[0].length : 0;

    const startingLights = [];

    // Top and bottom edges
    for (let i = 0; i < numCols; i++) {
        for (const j of [0, numRows - 1]) {
            startingLights.push(new BeamHead(j, i, {row: j ? -1 : 1, col: 0}));
        }
    }

    // Right and left edges (it's okay that the corners overlap; they need two directions)
    for (let i = 0; i < numRows; i++) {
        for (const j of [0, numCols - 1]) {
            startingLights.push(new BeamHead(i, j, {row: 0, col: j ? -1 : 1}));
        }
    }

    // The rest is just try each starting position and save the best result
    return startingLights.reduce((a, startingLight) => {
        const contraption = new Contraption(puzzleInput);
        contraption.light(startingLight);
        return Math.max(a, contraption.countEnergized());
    }, 0);
}

class Contraption {
    grid = []; // Tile[][]
    lightQueue = []; // BeamHead[]

    constructor(puzzleInput) {
        this.grid = puzzleInput.split("\n")
            .map(line => line.split("").map(e => new Tile(e)));
    }

    /**
     * 
     * @param { BeamHead } startingLight 
     */
    light(startingLight) {
        const numRows = this.grid.length;
        const numCols = numRows ? this.grid[0].length : 0;

        this.lightQueue.push(startingLight);

        while (this.lightQueue.length > 0) {
            const light = this.lightQueue.shift();

            if (light.row >= 0 && light.row < numRows && light.col >= 0 && light.col < numCols) {
                const tile = this.grid[light.row][light.col];
                if (!tile.hasPassedThrough(light)) {
                    tile.passThrough(light);

                    if (tile.tileChar === "." ||
                            (tile.tileChar === "-" && light.dir.row === 0) ||
                            (tile.tileChar === "|" && light.dir.col === 0)) {
                        this.lightQueue.push(light.continueStraight());
                    } else if (tile.tileChar === "/") {
                        if (light.dir.row === 0) {
                            this.lightQueue.push(light.turnLeft());
                        } else {
                            this.lightQueue.push(light.turnRight());
                        }
                    } else if (tile.tileChar === "\\") {
                        if (light.dir.row === 0) {
                            this.lightQueue.push(light.turnRight());
                        } else {
                            this.lightQueue.push(light.turnLeft());
                        }
                    } else if (tile.tileChar === "-" || tile.tileChar === "|") {
                        this.lightQueue.push(...light.split());
                    } else {
                        // ???
                        throw new Error("Uh oh");
                    }
                }
            }
        }
    }

    countEnergized() {
        return this.grid.flat(1).reduce((a, e) => a + (e.energized ? 1 : 0), 0);
    }

    toText() {
        let output = "";
        this.grid.forEach(row => {
            output += row.map(e => e.tileChar).join("") + "\n";
        });
        return output;
    }

    toEnergizedText() {
        let output = "";
        this.grid.forEach(row => {
            row.forEach(cell => {
                output += cell.energized ? "#" : ".";
            });
            output += "\n";
        });
        return output;
    }
}

class Tile {
    tileChar;
    energized = false;
    passedThroughDirs = [];

    constructor(tileChar) {
        this.tileChar = tileChar;
    }

    hasPassedThrough(beam) {
        return this.passedThroughDirs.some(e => e.row === beam.dir.row && e.col === beam.dir.col);
    }

    passThrough(beam) {
        this.energized = true;
        if (!this.hasPassedThrough(beam)) {
            this.passedThroughDirs.push(beam.dir);
        }
    }
}

class BeamHead {
    row;
    col;
    dir;

    constructor(row, col, dir) {
        this.row = row;
        this.col = col;
        this.dir = dir;
    }

    clone() {
        return new BeamHead(this.row, this.col, this.dir);
    }

    continueStraight() {
        return new BeamHead(this.row + this.dir.row, this.col + this.dir.col, this.dir);
    }

    turnLeft() {
        return this.#turn(-1);
    }

    turnRight() {
        return this.#turn(1);
    }

    #turn(negativeOneLeft) {
        const newBeam = this.clone();
        if (this.dir.row === 0) {
            newBeam.dir = {row: negativeOneLeft * this.dir.col, col: 0};
        } else {
            newBeam.dir = {row: 0, col: negativeOneLeft * -this.dir.row};
        }
        return newBeam.continueStraight();
    }

    /**
     * 
     * returns { Array } BeamHead[]
     */
    split() {
        return [this.turnLeft(), this.turnRight()];
    }
}