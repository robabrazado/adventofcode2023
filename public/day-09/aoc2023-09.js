function part1(puzzleInput) {
    const lines = puzzleInput.split("\n");

    return lines.map(line => pyramidPredictionRight(line.split(" ").map(e => parseInt(e))))
        .reduce((a, f) => a + f, 0);
}


function part2(puzzleInput) {
    const lines = puzzleInput.split("\n");

    return lines.map(line => pyramidPredictionLeft(line.split(" ").map(e => parseInt(e))))
        .reduce((a, f) => a + f, 0);
}

/**
 * 
 * 
 * @param {number[]} history 
 * @return {number}
 */
function pyramidPredictionRight(history) {
    const rows = buildPyramid(history);

    // Add a trailing 0 to the bottom row
    rows.at(-1).push(0);

    // Starting at second-to-bottom row, add new elements going up
    for (let i = rows.length - 2; i >= 0; i--) {
        const newValue = rows[i].at(-1) + rows[i + 1].at(-1);
        rows[i].push(newValue);
    }

    return rows[0].at(-1);
}

/**
 * 
 * 
 * @param {number[]} history 
 * @return {number}
 */
function pyramidPredictionLeft(history) {
    const rows = buildPyramid(history);

    // Add a leading 0 to the bottom row
    rows.at(-1).unshift(0);

    // Starting at second-to-bottom row, add new elements going up
    for (let i = rows.length - 2; i >= 0; i--) {
        const newValue = rows[i][0] - rows[i + 1][0];
        rows[i].unshift(newValue);
    }

    return rows[0][0];
}

/**
 * 
 * @param {number[]} history 
 * @return {number[][]}
 */
function buildPyramid(history) {
    const rows = [history];

    // Build the pyramid
    let prevRow = history;
    while (prevRow.filter(e => e == 0).length < prevRow.length) {
        const newRow = [];
        for (let i = 1 /* not 0! */; i < prevRow.length; i++) {
            newRow.push(prevRow[i] - prevRow[i - 1]);
        }

        rows.push(newRow);
        prevRow = newRow;
    }

    return rows;
}