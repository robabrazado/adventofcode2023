function part1(puzzleInput) {
    const imageGrid = new ImageGrid(puzzleInput.split("\n"));
    imageGrid.expand();

    let output = "";
    imageGrid.grid.forEach(line => {
        output += line.join("") + "\n";
    });

    // Sum the shortest path between all galaxy pairs
    const galaxies = imageGrid.getGalaxies();
    const galaxyPairs = [];
    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            galaxyPairs.push([galaxies[i], galaxies[j]]);
        }
    }

    output += "\n" + galaxyPairs.reduce((a, e) => a + getGalaxyTaxicabDistance(e[0], e[1]), 0);

    return output;

}

function getGalaxyTaxicabDistance(g1, g2) {
    return Math.abs(g1.rowIdx - g2.rowIdx) + Math.abs(g1.colIdx - g2.colIdx);
}

function part2(puzzleInput) {

}

class ImageGrid {
    grid = [];

    constructor(lines) {
        lines.forEach(line => {
            this.grid.push([]);
            this.grid.at(-1).push(...line.split(""));
        });
    }

    numRows() {
        return this.grid.length;
    }

    numCols() {
        return this.grid.length > 0 ? this.grid[0].length : 0;
    }

    getRowArray(row) {
        return Array.from(this.grid[idx]);
    }

    getColArray(col) {
        const colArr = [];
        this.grid.forEach(rowArr => {
            colArr.push(rowArr[col]);
        });
        return colArr;
    }

    // Expands self per part 1
    expand() {
        // Find rows to expand
        const rowIdxs = [];
        for (let i = 0; i < this.grid.length; i++) {
            if (!ImageGrid.#arrHasGalaxy(this.grid[i])) {
                rowIdxs.push(i);
            }
        }

        // Expand rows backwards to not mess up the indices
        rowIdxs.reverse().forEach(i => {
            this.expandRow(i);
        });

        // Repeat for columns
        const colIdxs = [];
        const numCols = this.numCols();
        for (let i = 0; i <= numCols; i++) {
            if (!ImageGrid.#arrHasGalaxy(this.getColArray(i))) {
                colIdxs.push(i);
            }
        }
        colIdxs.reverse().forEach(i => {
            this.expandCol(i);
        });
    }

    expandRow(row) {
        const newRow = new Array(this.grid[row].length).fill(".");
        this.grid.splice(row, 0, newRow);
        return this;
    }

    expandCol(col) {
        this.grid.forEach(rowArr => {
            rowArr.splice(col, 0, ".");
        });
        return this;
    }

    static #arrHasGalaxy(arr) {
        return arr.some(e => e === "#");
    }

    // Array of {galaxyId:number, rowIdx:number, colIdx:number}
    getGalaxies() {
        const numCols = this.numCols();
        const galaxies = [];
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < numCols; col++) {
                if (this.grid[row][col] === "#") {
                    galaxies.push({galaxyId: galaxies.length, rowIdx: row, colIdx: col});
                }
            }
        }
        return galaxies;
    }
}
