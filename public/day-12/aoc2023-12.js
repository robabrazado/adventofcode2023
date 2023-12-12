function part1(puzzleInput) {
    // I know in my heart that the brute-forcing isn't going to do it for part 2, but it's what I can do right now
    return bruteForceCounts(puzzleInput).reduce((a, e) => a + e);
}

function part2(puzzleInput) {

}

function bruteForceCounts(puzzleInput) {
    const lines = puzzleInput.split("\n");
    return lines.map(line => {
        const [damagedData, checksum] = line.split(" ");

        // Generating every string that could match the damaged data and checking against checksum
        /* The number of possible damaged data arrangements is 2 ^ the number of question marks,
         * because there are only two states a ? could be. More immediately, this means each
         * possibility can be represented by (and generated from) a bit string (number). Longer term,
         * this gives me an idea of maybe how to approach this mathematically, but I'll investigate
         * that later.
         */
        const dataArr = damagedData.split("");
        const possCount = 2 ** (dataArr.reduce((a, e) => a + (e === "?" ? 1 : 0), 0));
        console.log(damagedData + ": " + possCount);

        /* Each instance of the counter is a fixed number of bits that represent the values of the
         * various ? places in the original damaged data. Generate the data, and match it against
         * the checksum. Arbitrarily, I'm saying true = damaged.
         * 
         * For the time being, bit significance doesn't have to match index order or anything,
         * since I'm generating all possibilities. As long as it's consistent between iterations,
         * it'll be fine.
         */
        // Count ? instances
        const damageCount = dataArr.reduce((a, e) => a + (e === "?" ? 1 : 0), 0);
        let matchCount = 0;
        for (let possId = 0; possId < possCount; possId++) {
            let testString = damagedData;
            for (let i = 0; i < damageCount; i++) {
                const fixedData = (possId & (2 ** i)) ? "#" : ".";
                testString = testString.replace("?", fixedData);
            }
            if (getChecksum(testString) === checksum) {
                matchCount++;
            }
        }
        console.log(damagedData + ": " + matchCount);
        return matchCount;
    });
}

function getChecksum(data) {
    const damagedBlockLengths = [];
    let currentBlockLength = 0;
    for (const c of data) {
        if (c === "#") {
            currentBlockLength++;
        } else if (c === ".") {
            if (currentBlockLength > 0) {
                damagedBlockLengths.push(currentBlockLength);
                currentBlockLength = 0;
            }
        } else {
            throw new Error("I'm not equipped to handle " + data);
        }
    }
    if (currentBlockLength > 0) {
        damagedBlockLengths.push(currentBlockLength);
    }
    return damagedBlockLengths.join(",");
}
