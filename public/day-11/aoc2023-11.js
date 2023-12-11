function part1(puzzleInput) {
    const chart = new GalaxyChart(puzzleInput);

    let output = chart.toText();

    chart.expand();
    output += "\n" + chart.toText();

    output += "\n" + chart.sumShortestDistanceBetweenEachPair();

    return output;
}

function part2(puzzleInput, scale) {
    const chart = new GalaxyChart(puzzleInput);
    chart.expand(scale);

    return chart.sumShortestDistanceBetweenEachPair();
}

/* Complete rewrite for part 2. In part 1 I was literally making and expanding a 2D array,
 * which proved untenable for part 2. New plan is just to store and modify galaxy positions.
 * Should be able support both part 1 and part 2, so part 1 is getting refactored for this, too.
 */

class GalaxyChart {
    galaxies = []; // {galaxyId:number, rowIdx:number, colIdx:number}

    constructor(puzzleInput) {
        puzzleInput.split("\n").forEach((line, row) => {
            let col = -1;
            while ((col = line.indexOf("#", col + 1)) >= 0) {
                this.galaxies.push({
                    galaxyId: this.galaxies.length,
                    rowIdx: row,
                    colIdx: col
                });
            }
        });
    }

    expand(scale = 2) {
        const numToAdd = scale - 1;

        // Collect empty row indices (from highest to lowest)
        const rowsToExpand = [];
        const lastRowIdx = this.galaxies.reduce((a, e) => Math.max(a, e.rowIdx), 0);
        for (let row = lastRowIdx; row >= 0; row--) {
            if (!this.galaxies.some(e => e.rowIdx === row)) {
                rowsToExpand.push(row);
            }
        }

        // Slide all coordinates greater than row by the specified scale (will never be equal to row since it's empty)
        // This is why we did highest to lowest; the highest one gets slid for every one that follows, etc.
        while (rowsToExpand.length > 0) {
            const slideIdx = rowsToExpand.shift();
            this.galaxies.filter(e => e.rowIdx > slideIdx)
                .forEach(e => {
                    e.rowIdx += numToAdd;
                });
        }

        // Repeat the process for columns
        const colsToExpand = [];
        const lastColIdx = this.galaxies.reduce((a, e) => Math.max(a, e.colIdx), 0);
        for (let col = lastRowIdx; col >= 0; col--) {
            if (!this.galaxies.some(e => e.colIdx === col)) {
                colsToExpand.push(col);
            }
        }
        while (colsToExpand.length > 0) {
            const slideIdx = colsToExpand.shift();
            this.galaxies.filter(e => e.colIdx > slideIdx)
                .forEach(e => {
                    e.colIdx += numToAdd;
                });
        }
    }

    // This is a snapshot
    getGalaxyPairs() {
        const galaxyPairs = []; // [galaxy1, galaxy2]
        const numGalaxies = this.galaxies.length;
        for (let i = 0; i <= numGalaxies - 1; i++) {
            for (let j = i + 1; j < numGalaxies; j++) {
                galaxyPairs.push([this.galaxies[i], this.galaxies[j]]);
            }
        }
        return galaxyPairs;
    }

    // This is a snapshot
    sumShortestDistanceBetweenEachPair() {
        return this.getGalaxyPairs().reduce((a, pair) =>
            a + GalaxyChart.getGalaxyTaxicabDistance(pair[0], pair[1]), 0);
    }

    // Only call this on a reasonable size chart
    toText() {
        let output = "";
        const lastRowIdx = this.galaxies.reduce((a, e) => Math.max(a, e.rowIdx), 0);
        const lastColIdx = this.galaxies.reduce((a, e) => Math.max(a, e.colIdx), 0);
        for (let row = 0; row <= lastRowIdx; row++) {
            for (let col = 0; col <= lastColIdx; col++) {
                if (this.galaxies.find(e => e.rowIdx === row && e.colIdx === col)) {
                    output += "#";
                } else {
                    output += ".";
                }
            }
            output += "\n";
        }
        return output;
    }

    static getGalaxyTaxicabDistance(g1, g2) {
        return Math.abs(g1.rowIdx - g2.rowIdx) + Math.abs(g1.colIdx - g2.colIdx);
    }
    
}
