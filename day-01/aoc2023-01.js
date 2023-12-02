/**
 * 
 * @param {string} puzzleData 
 * @return {string}
 */
function doTheThing(puzzleData) {
    // return puzzleData.split("\n").map(line => lineToNumber(line)).reduce((a, e) => a + e, 0);
    return puzzleData.split("\n").map(line => lineToNumberBetter(line)).reduce((a, e) => a + e, 0);
}

function doTheOtherThing(puzzleData) {
    return puzzleData.split("\n").map(line => lineToNumber2(line)).reduce((a, e) => a + e, 0);
}

function lineToNumber(line) {
    const len = line.length;
    const digits = Array(2).fill(null);

    for (let i = 0; i < len && !digits[0]; i++) {
        const n = Number.parseInt(line.at(i), 10);
        if (!isNaN(n)) {
            digits[0] = n;
        }
    }

    for (let i = -1; i >= -len && !digits[1]; i--) {
        const n = Number.parseInt(line.at(i), 10);
        if (!isNaN(n)) {
            digits[1] = n;
        }
    }
    return digits[0] * 10 + digits[1];
}

function lineToNumberBetter(line) {
    const len = line.length;
    const digits = [];

    const digitWords = line.match(/[0-9]/g);
    digits.push(digitWordToDigit(digitWords.at(0)));
    digits.push(digitWordToDigit(digitWords.at(-1)));

    return digits[0] * 10 + digits[1];
}

function lineToNumber2(line) {
    const len = line.length;
    const digits = [];

    const digitWords = line.match(/zero|one|two|three|four|five|six|seven|eight|nine|[0-9]/g);
    digits.push(digitWordToDigit(digitWords.at(0)));

    const reverseLine = line.split("").reverse().join("");
    const digitWords2 = reverseLine.match(/orez|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin|[0-9]/g);
    digits.push(digitWordToDigit2(digitWords2.at(0)));

    return digits[0] * 10 + digits[1];
}

function digitWordToDigit(word) {
    const words = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine"
    ];

    let n = Number.parseInt(word, 10);
    if (isNaN(n)) {
        n = words.indexOf(word);
        if (n < 1) {
            throw new Error("uh oh");
        }
    }
    return n;
}

function digitWordToDigit2(word) {
    const words = [
        "orez",
        "eno",
        "owt",
        "eerht",
        "ruof",
        "evif",
        "xis",
        "neves",
        "thgie",
        "enin"
    ];

    let n = Number.parseInt(word, 10);
    if (isNaN(n)) {
        n = words.indexOf(word);
        if (n < 1) {
            throw new Error("uh oh");
        }
    }
    return n;
}

function testOut(puzzleData) {
    let retVal = '';

    puzzleData.split("\n").forEach(line => {
        retVal += line + " - " + lineToNumber2(line) + "\n";
    });

    return retVal;
}
