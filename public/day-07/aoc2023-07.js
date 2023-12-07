function part1(puzzleInput) {
    const lines = puzzleInput.split("\n");

    const hands = lines.map(line => line.split(" ")).map(splitLine => new Hand(splitLine[0].split(""), parseInt(splitLine[1])));
    hands.sort((a, b) => b.sortStrongerFirst(a)); // Yeah, I named the method "sortStrongerFirst," but I'm reversing the sort here. My bad.
    return hands.reduce((a, hand, i) => a + ((i + 1) * hand.bid), 0);
}


function part2(puzzleInput) {
    const lines = puzzleInput.split("\n");

    const hands = lines.map(line => line.split(" ")).map(splitLine => new Hand(splitLine[0].split(""), parseInt(splitLine[1]), true));
    hands.sort((a, b) => b.sortStrongerFirst(a, true));
    return hands.reduce((a, hand, i) => a + ((i + 1) * hand.bid), 0);
}

// I miss enums
const cardLabels = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
const cardLabelStrength = new Map(cardLabels.map((label, i, arr) => [label, arr.indexOf(label)]));
const handTypes = [
    "High card",
    "One pair",
    "Two pair",
    "Three of a kind",
    "Full house",
    "Four of a kind",
    "Five of a kind"
];

// For part 2
const cardLabels2 = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"];
const cardLabelStrength2 = new Map(cardLabels2.map((label, i, arr) => [label, arr.indexOf(label)]));

class Hand {
    cards;
    bid;
    type;

    constructor(cards, bid, activateJokers = false) {
        this.cards = cards;
        this.bid = bid;
        this.type = getHandType(cards, activateJokers);
    }

    sortStrongerFirst(otherHand, sortWithJokers = false) {
        const cardStrengthMap = sortWithJokers ? cardLabelStrength2 : cardLabelStrength;
        let sort = otherHand.type.strength - this.type.strength;
        for (let i = 0; i < this.cards.length && sort == 0; i++) {
            sort = cardStrengthMap.get(otherHand.cards[i]) - cardStrengthMap.get(this.cards[i]);
        }
        return sort;
    }


}

/**
 * 
 * 
 * @param {string[]} cards
 * @param {boolean} [activateJokers=false]
 * @return {Object} {name: string, strength: number}
 */
function getHandType(cards, activateJokers = false) {
    const errMsg = "I don't understand this hand: " + JSON.stringify(cards);

    // Each type can be identified by an ordered list of card frequencies
    // E.g. "AAAKQ" -> [3, 1, 1]
    const frequencyMap = new Map();
    cards.forEach((card, i, arr) => {
        if (!frequencyMap.has(card)) {
            frequencyMap.set(card, 0);
        }
        frequencyMap.set(card, frequencyMap.get(card) + 1);
    });
    let frequencies = Array.from(frequencyMap.values()).sort((a, b) => b - a);

    if (activateJokers && frequencyMap.has("J")) {
        /* I think this'll work? Hand type strength is based on frequency counts and not actual cards,
         * so I'll inflate the highest frequency with the number of jokers and remove the joker frequency.
         */
        if (frequencies.length > 1) { // If we got dealt five of a kind, I think we're fine :P
            const numJokers = frequencyMap.get("J");
            const jokerFreqIdx = frequencies.indexOf(numJokers);
            frequencies[jokerFreqIdx ? 0 : 1] += numJokers;
            frequencies.splice(jokerFreqIdx, 1);
        }
    }

    let typeIdx;
    switch (frequencies[0]) {
        case 5:
            typeIdx = 6;
            break;
        case 4:
            typeIdx = 5;
            break;
        case 3:
            switch(frequencies[1]) {
                case 2:
                    typeIdx = 4;
                    break;
                case 1:
                    typeIdx = 3;
                    break;
                default:
                    throw new Error(errMsg);
            }
            break;
        case 2:
            switch (frequencies[1]) {
                case 2:
                    typeIdx = 2;
                    break;
                case 1:
                    typeIdx = 1;
                    break;
                default:
                    throw new Error(errMsg);
            }
            break;
        case 1:
            typeIdx = 0;
            break;
        default:
            throw new Error(errMsg);
    }
    return {name: handTypes[typeIdx], strength: typeIdx};
}
