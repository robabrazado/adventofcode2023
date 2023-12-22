function part1(puzzleInput) {
    const map = GardenMap.parseFromInput(puzzleInput);

    let output = map.toText();

    const result = map.takeSteps(64);
    output += "\n" + map.toText() + "\n" + result;

    return output;
}

function part2(puzzleInput) {
    alert("Not done yet");
}


class GardenMap {
    locationGrid = []; // Location[][]
    locationList = []; // Location[] - I'm going to try out keeping a list as well as a grid; I think it will make some things easier
    numRows;
    numCols;
    startPosIdx;

    constructor(locationList, rows, cols) {
        [this.locationList, this.numRows, this.numCols] = [locationList, rows, cols];

        // Build grid
        let [row, col] = [0, 0];
        let thisRow = []
        locationList.forEach((loc, i) => {
            [loc.row, loc.col] = [row, col++];
            thisRow.push(loc);
            if ((i + 1) % this.numCols === 0) {
                // Start a new row
                this.locationGrid.push(thisRow);
                thisRow = [];
                col = 0;
                row++;
            }
        });

        // Build adjacency graph
        this.locationList.forEach(loc => {
            if (loc.row > 0) {
                loc.neighbors.N = this.locationGrid[loc.row - 1][loc.col];
            }
            if (loc.col < this.numCols - 1) {
                loc.neighbors.E = this.locationGrid[loc.row][loc.col + 1];
            }
            if (loc.row < this.numRows - 1) {
                loc.neighbors.S = this.locationGrid[loc.row + 1][loc.col];
            }
            if (loc.col > 0) {
                loc.neighbors.W = this.locationGrid[loc.row][loc.col - 1];
            }
        });

        this.startPosIdx = this.locationList.findIndex(e => e.isStart);
    }

    /**
     * 
     * @param { number } [numSteps = 1] number of steps to take
     * @returns { number } number of reachable locations reached at the end of the specified steps (just for convenience)
     */
    takeSteps(numSteps = 1) {
        if (numSteps < 1) {
            throw new Error("Stop that");
        }

        // Start (does not count as a step)
        this.locationList[this.startPosIdx].isReachedThisStep = true;

        for (let i = 1; i <= numSteps; i++) {
            this.#takeStep();
        }

        return this.countReachedLocations();
    }

    #takeStep() {
        // Find all locations currently reached, mark their neighbors as reached, and unmark them
        this.locationList.filter(loc => loc.isReachedThisStep).forEach(loc => {
            for (const dir in loc.neighbors) {
                if (loc.neighbors[dir] && loc.neighbors[dir].isPlot) {
                    loc.neighbors[dir].isReachedThisStep = true;
                }
                loc.isReachedThisStep = false;
            }
        });
    }

    countReachedLocations() {
        return this.locationList.reduce((a, loc) => a + (loc.isReachedThisStep ? 1 : 0), 0);
    }

    static parseFromInput(puzzleInput) {
        const locations = [];
        let rows = 0;
        let cols;
        puzzleInput.split("\n").forEach(line => {
            if (cols === undefined) {
                cols = line.length;
            } else {
                if (cols !== line.length) {
                    throw new Error("Input is not rectangular");
                }
            }
            locations.push(...line.split("").map(e => new Location(e)));
            rows++
        });
        return new GardenMap(locations, rows, cols);
    }

    toText() {
        return this.locationGrid.reduce(
            (output, rowArr) => output + rowArr.reduce((a, loc) => a + loc.toText(), "") + "\n",
        "");
    }


}

class Location {
    isPlot; // If not, it's a rock
    isStart;
    isReachedThisStep = false;
    row;
    col;
    neighbors = {
        N: null,
        E: null,
        S: null,
        W: null
    };

    constructor(code) {
        this.isStart = (code === "S");
        switch (code) {
            case "S":
            case ".":
                this.isPlot = true;
                break;
            case "#":
                this.isPlot = false;
                break;
            default:
                throw new Error("Uh oh");
        }
    }

    toText() {
        return this.isReachedThisStep ? "O" :
            this.isStart ? "S" :
                this.isPlot ? "." : "#";
    }
}
