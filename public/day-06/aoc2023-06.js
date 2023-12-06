function part1(puzzleInput) {
    const lines = puzzleInput.split("\n");

    const times = getNumArray(lines[0], "Time:");
    const distances = getNumArray(lines[1], "Distance:");

    const bounds = times.map((time, i) => getMarginBounds(time, distances[i])); // Array of [lower, upper] elements
    const margins = bounds.map(e => e[1] - e[0] + 1); // Array of margins
    return margins.reduce((a, e) => a * e, 1);
}


function part2(puzzleInput) {
    const lines = puzzleInput.split("\n");

    const time = getBadKerningNumber(lines[0]);
    const distance = getBadKerningNumber(lines[1]);
    const bounds = getMarginBounds(time, distance);
    return bounds[1] - bounds[0] + 1;
}

function getNumArray(line, prefix) {
    return line.substring(prefix.length).trim().split(/ +/).map(e => parseInt(e));
}

/**
 * For any given race with total time T, distance D is:
 * 
 * D = m * s
 * 
 * Where m is move time and s is speed. Move time is T - hold time (h), and speed
 * is the same as hold time. So...
 * 
 * D = (T - h) * h
 * 
 * D is a quadratic function of h. It's a downward-opening parabola, so between the two
 * values of h where f(h) = Dbest, f(h) > Dbest, so we want to find those two points.
 * 
 * ((T - h) * h) > Dbest
 * ((T - h) * h) - Dbest > 0
 * (Th - h^2) - Dbest > 0
 * (-1 * h^2) + (T * h) + (-Dbest) = 0; a = -1, b = T, c = -Dbest
 * 
 * h = (-T +/- sqrt(T^2 - 4(-1)(-Dbest))) / 2(-1)
 * h = (-T +/- sqrt(T^2 - (4 * Dbest))) / -2
 * 
 * @param {number} totalTime 
 * @param {number} bestDistance 
 * @returns {number[]} [lowBound, highBound]
 */
function getMarginBounds(totalTime, bestDistance) {
    const rootPart = Math.sqrt((totalTime ** 2) - (4 * bestDistance));

    return [
        Math.floor(((totalTime - rootPart) / 2) + 1),
        Math.ceil(((totalTime + rootPart) / 2) - 1)
    ];
}

function getBadKerningNumber(line) {
    return parseInt(line.split(/ +/).slice(1).join(""));
}
