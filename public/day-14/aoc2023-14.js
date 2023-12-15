function part1(puzzleInput) {
    const platform = new ControlPlatform(puzzleInput);

    let output = platform.toText();

    platform.tiltNorth();

    output += "\n" + platform.toText();

    output += "\n" + platform.getTotalLoadNorth();

    return output;
}

function part2(puzzleInput) {
    alert("Not done yet");
}

class ControlPlatform {
    grid = [];

    constructor(puzzleInput) {
        puzzleInput.split("\n").forEach(line => {
            this.grid.push(line.split(""));
        });
    }

    tiltNorth() {
        const numRows = this.grid.length;
        const numCols = numRows > 0 ? this.grid[0].length : 0;

        for (let col = 0; col < numCols; col++) {
            for (let row = 1; row < numRows; row++) {
                if (this.grid[row][col] === "O") {
                    // Roll it up!
                    let toRow = row - 1;
                    while (toRow >= 0 && this.grid[toRow][col] === ".") {
                        this.grid[toRow][col] = "O";
                        this.grid[toRow + 1][col] = ".";
                        toRow--;
                    }
                }
            }
        }
    }

    getTotalLoadNorth() {
        const numRows = this.grid.length;
        let totalLoad = 0;

        for (let row = 0; row < numRows; row++) {
            const rowValue = numRows - row;
            totalLoad += rowValue * this.grid[row].filter(e => e === "O").length;
        }

        return totalLoad;
    }

    toText() {
        let output = "";
        this.grid.forEach(line => {
            output += line.join("") + "\n";
        });
        return output;
    }
}