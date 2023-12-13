function part1(puzzleInput) {
    // Okay, going to try something inspired by a line of thinking from yesterday
    /* Rather than maintain a grid and looking things up on demand, instead consider
     * each row or column a bit string and convert to a number. That way I can
     * have a list of rows and a list of columns, and they should be easy to access
     * and compare.
     */
    const patterns = RockPattern.parseListFromInput(puzzleInput);

    let output = "";
    let total = 0;
    patterns.forEach(pattern => {
        output += pattern.toText();

        const rowsAbove = pattern.getRowsAboveMirror();
        const colsToLeft = pattern.getColumnsLeftOfMirror();

        output += "\n" + rowsAbove + "/" + colsToLeft + "\n\n";

        total += (100 * rowsAbove) + colsToLeft;
    });

    output += total;

    return output;
}

function part2(puzzleInput) {
    alert("Not done yet");
}

class RockPattern {
    textRowLen;
    rows = [];
    cols = [];

    constructor(grid) {
        this.textRowLen = grid[0].length;
        const colTextArr = [];
        grid.forEach(rowText => {
            this.rows.push(RockPattern.#textToNum(rowText));
            rowText.split("").forEach((cellText, i) => {
                if (!colTextArr[i]) {
                    colTextArr[i] = [];
                }
                colTextArr[i].push(cellText);
            });
        });
        colTextArr.forEach(colText => this.cols.push(RockPattern.#textToNum(colText.join(""))));
    }

    // 0 means no reflection
    getColumnsLeftOfMirror() {
        return RockPattern.#getElementsBeforeMirror(this.cols);
    }

    // 0 means no reflection
    getRowsAboveMirror() {
        return RockPattern.#getElementsBeforeMirror(this.rows);
    }

    toText() {
        let output = "";
        this.rows.forEach(rowNum => {
            output += RockPattern.#numToText(rowNum, this.textRowLen) + "\n";
        });
        return output;
    }

    // Will be between indices (n - 1) and n; 0 means no reflection
    static #getElementsBeforeMirror(arr) {
        const arrLen = arr.length;
        const candidates = [];
        for (let i = 1; i < arrLen; i++) {
            if (RockPattern.#testMirrorNum(i, arr)) {
                candidates.push(i);
            }
        }

        if (candidates.length === 0) {
            return 0;
        } else if (candidates.length === 1) {
            return candidates[0];
        } else {
            console.log("Found multiple candidates in " + JSON.stringify(arr));
            // It has to be the one closest to the middle of the array...right?
            const middle = arrLen / 2; // This could be fractional, but I don't think it matters?
            candidates.sort((a, b) => Math.abs(middle - a) - Maths.abs(middle - b));
            return candidates[0];
        }
    }

    static #testMirrorNum(num, arr) {
        const arrLen = arr.length;
        let isMirrorNum = true;

        for (let [i, j] = [num - 1, num]; i >= 0 && j < arrLen && isMirrorNum; [i, j] = [i - 1, j + 1]) {
            isMirrorNum = arr[i] === arr[j];
        }

        return isMirrorNum;
    }

    static #textToNum(text) {
        text = text.replace(/\./g, "0").replace(/#/g, "1");
        return parseInt(text, 2);
    }

    static #numToText(num, len) {
        return num.toString(2).padStart(len, "0").replace(/0/g, ".").replace(/1/g, "#");
    }

    static parseListFromInput(puzzleInput) {
        const patterns = [];
        const lines = puzzleInput.split("\n");

        let nextGrid = [];
        lines.forEach(line => {
            if (line.length) {
                nextGrid.push(line);
            } else {
                patterns.push(new RockPattern(nextGrid));
                nextGrid = [];
            }
        });
        if (nextGrid.length) {
            patterns.push(new RockPattern(nextGrid));
        }


        return patterns;
    }
}