function part1(puzzleInput) {
    return cardsFromInput(puzzleInput).reduce((a, card) => a + getCardPoints(card), 0);
}

function part2(puzzleInput) {
    const cards = cardsFromInput(puzzleInput);
    cards.forEach(card => { card.copies = 0;}); // Initialize copy count
    // Count winning numbers and process copy count
    cards.forEach((card, i) => {
        card.winnerCount = card.winningNumbers.reduce((a, winner) => {
            if (card.cardNumbers.includes(winner)) {
                return a + 1;
            } else {
                return a;
            }
        }, 0);

        for (let offset = 1; offset <= card.winnerCount; offset++) {
            cards[i + offset].copies += 1 + card.copies;
        }
    });

    return cards.reduce((a, card) => a + 1 + card.copies, 0);
}

function cardsFromInput(puzzleInput) {
    const cards = [];
    if (puzzleInput && puzzleInput.length > 0) {
        const lines = puzzleInput.split("\n");
        cards.push(...lines.map(line => {
            const card = {};
            const [cardText, numberText] = line.split(":").map(e => e.trim());
            card.cardNum = parseInt(cardText.substring(5)); // Trimming "Card "
            const [winningNumbersText, cardNumbersText] = numberText.split("|").map(e => e.trim());
            card.winningNumbers = winningNumbersText.split(/ +/).map(e => parseInt(e));
            card.cardNumbers = cardNumbersText.split(/ +/).map(e => parseInt(e));

            return card;
        }));
    }
    return cards;
}

function getCardPoints(card) {
    return card.winningNumbers.reduce((a, winner) =>
        card.cardNumbers.includes(winner) ? (a == 0 ? 1 : a * 2) : a, 0);
}

