function part1(puzzleInput) {
    let output = "";
    if (puzzleInput && puzzleInput.length > 0) {
        const rows = puzzleInput.split("\n"); // Array index is rows, string index is columns
        if (rows.length > 0 && rows[0].length > 0) {
            const [numRows, numCols] = [rows.length, rows[0].length];
            const partNumberRegex = /\d+/gd;
            const symbolRegex = /[^\.\d]/;

            let partNumberSum = 0;
            let i = 0;
            rows.forEach((rowText, rowIdx) => {
                for (const matchResult of rowText.matchAll(partNumberRegex)) { // ["467"]/0,3["114"]/5,8
                    // Found part number; make hitbox
                    const [startRow, endRow, startCol, endCol] = [ // Hitbox range, bound by grid
                        Math.max(rowIdx - 1, 0),
                        Math.min(rowIdx + 1, numRows - 1),
                        Math.max(matchResult.indices[0][0] - 1, 0),
                        Math.min(matchResult.indices[0][1], numCols - 1) // End index is already +1 offset for my purposes
                    ]
                    // The hitbox doesn't even need to be a "box," I guess
                    let hitboxText = "";
                    for (let row = startRow; row <= endRow; row++) {
                        hitboxText += rows[row].substring(startCol, endCol + 1);
                    }
                    
                    // Check for hit
                    if (symbolRegex.test(hitboxText)) {
                        partNumberSum += parseInt(matchResult[0]); // Original match
                    }
                }
            });
            output = partNumberSum;
        } else {
            output = "Unexpected input data";
        }
    }
    return output;
}

/**
 * This is probably a goofy way to go about doing this, but I'm continuing with
 * the technique I started with for part 1. In effect, the hitbox check now
 * scans for * and gets grid coordinates. The coordinates become a "key" for a
 * list of adjacent part numbers. I'm using a multidimensional array instead
 * of a Map, because I need to search for key matches manually. With more time
 * I would have made a class for the key and used a Map.
 */
function part2(puzzleInput) {
    let output = "";
    if (puzzleInput && puzzleInput.length > 0) {
        const possibleGears = []; // [{row, col}, [partNum1, partNum2,...]][]
        const rows = puzzleInput.split("\n"); // Array index is rows, string index is columns
        if (rows.length > 0 && rows[0].length > 0) {
            const [numRows, numCols] = [rows.length, rows[0].length];
            const partNumberRegex = /\d+/gd;
            const symbolRegex = /[^\.\d]/;

            let gearRatioSum = 0;
            let i = 0;
            rows.forEach((rowText, rowIdx) => {
                for (const matchResult of rowText.matchAll(partNumberRegex)) { // ["467"]/0,3["114"]/5,8
                    // Found part number; make hitbox
                    const [startRow, endRow, startCol, endCol] = [ // Hitbox range, bound by grid
                        Math.max(rowIdx - 1, 0),
                        Math.min(rowIdx + 1, numRows - 1),
                        Math.max(matchResult.indices[0][0] - 1, 0),
                        Math.min(matchResult.indices[0][1], numCols - 1) // End index is already +1 offset for my purposes
                    ]
                    for (let hitRow = startRow; hitRow <= endRow; hitRow++) {
                        for (let hitCol = startCol; hitCol <= endCol; hitCol++) {
                            if (rows[hitRow].at(hitCol) == "*") { // If it hits a *...
                                if (possibleGears.findIndex(e => coordinateMatch(e, hitRow, hitCol)) < 0) {
                                    possibleGears.push([{row: hitRow, col: hitCol}, []]);
                                }
                                possibleGears.find(e => coordinateMatch(e, hitRow, hitCol))[1].push(parseInt(matchResult[0])); // ...record the part number under which * it hit
                            }
                        }
                    }
                }
            });

            // From the possible gears, find the actual gears and sum the gear ratios
            possibleGears.filter(e => e[1].length == 2).forEach(f => {
                gearRatioSum += f[1][0] * f[1][1];
            });


            output = gearRatioSum;
        } else {
            output = "Unexpected input data";
        }
    }
    return output;
}

function coordinateMatch(e, row, col) {
    return e[0].row == row && e[0].col == col;
}
