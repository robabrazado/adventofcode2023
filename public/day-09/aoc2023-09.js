function part1(puzzleInput) {
    const lines = puzzleInput.split("\n");

    return lines.map(line => pyramidPrediction(line.split(" ").map(e => parseInt(e))))
        .reduce((a, f) => a + f, 0);
}


function part2(puzzleInput) {

}

/**
 * 
 * 
 * @param {number[]} history 
 * @return {number}
 */
function pyramidPrediction(history) {
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
    
    // Add a trailing 0 to the bottom row
    rows.at(-1).push(0);

    // Starting at second-to-bottom row, add new elements going up
    for (let i = rows.length - 2; i >= 0; i--) {
        const newValue = rows[i].at(-1) + rows[i + 1].at(-1);
        rows[i].push(newValue);
    }

    return rows[0].at(-1);
}
