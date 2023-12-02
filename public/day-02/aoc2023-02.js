

function part1(puzzleInput) {
    const games = puzzleInput.split("\n").map(gameLine => gameFromGameLine(gameLine));

    const qualification = new Map();
    qualification.set("red", 12);
    qualification.set("green", 13);
    qualification.set("blue", 14);
    return games.reduce((a, game) => a += doesGameQualify1(game, qualification) ? game.id : 0, 0);
}

function part2(puzzleInput) {
    const games = puzzleInput.split("\n").map(gameLine => gameFromGameLine(gameLine));

    return games.reduce((a, game) => a += getGamePower(game), 0);
}

function gameFromGameLine(gameLine) {
    const game = {};
    const hiCounts = new Map();

    const [gameLabel, pullsLine] = gameLine.split(": ");
    [, game.id] = gameLabel.split(" ");
    game.id = parseInt(game.id);
    game.pulls = pullsLine.split("; ").map(pullLine => 
        pullLine.split(", ").map(colorQuantityLine => {
            let [quantity, color] = colorQuantityLine.split(" ");
            quantity = parseInt(quantity);

            // Store max counts while we're parsing
            if (!hiCounts.has(color) || hiCounts.get(color) < quantity) {
                hiCounts.set(color, quantity);
            }

            return {color: color, quantity: quantity};
        })
    );

    game.hiCounts = hiCounts;

    return game;
}

function doesGameQualify1(game, qualification) {
    return ["red", "green", "blue"].reduce((a, color) => a && (!game.hiCounts.has(color) || game.hiCounts.get(color) <= qualification.get(color)), true);
}

function  getGamePower(game) {
    return ["red", "green", "blue"].reduce((a, color) => a * (game.hiCounts.has(color) ? game.hiCounts.get(color) : 0), 1);
}