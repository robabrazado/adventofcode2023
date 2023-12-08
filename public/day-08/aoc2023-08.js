function part1(puzzleInput) {
    const lines = puzzleInput.split("\n");
    
    // First line is directions
    const directions = lines.shift();
    const dirGiver = new DirectionGiver(directions);
    // Second line is blank
    lines.shift();

    // The rest are nodes
    const allNodes = new Map(); // label -> Node
    lines.forEach(line => {
        // Using indices instead of parsing; if the line format changes, I'm screwed
        const label = line.substring(0, 3);
        const leftLabel = line.substring(7, 10);
        const rightLabel = line.substring(12, 15);

        let leftChild;
        if (allNodes.has(leftLabel)) {
            leftChild = allNodes.get(leftLabel);
        } else {
            leftChild = new Node(leftLabel);
            allNodes.set(leftLabel, leftChild);
        }

        let rightChild;
        if (allNodes.has(rightLabel)) {
            rightChild = allNodes.get(rightLabel);
        } else {
            rightChild = new Node(rightLabel);
            allNodes.set(rightLabel, rightChild);
        }

        let thisNode;
        if (allNodes.has(label)) {
            thisNode = allNodes.get(label);
        } else {
            thisNode = new Node(label, leftLabel, rightLabel);
            allNodes.set(label, thisNode);
        }
        thisNode.leftChild = leftChild;
        thisNode.rightChild = rightChild;
        allNodes.set(label, thisNode);
    });

    const startNodeLabel = "AAA";
    const endNodeLabel = "ZZZ";

    let currentNode = allNodes.get(startNodeLabel);
    let steps = 0;
    while (currentNode.label != endNodeLabel) {
        currentNode = currentNode.takeStep(dirGiver.nextDirection());
        steps++;
    }

    return steps;
}


function part2(puzzleInput) {

}

class DirectionGiver {
    dirText;
    dirIdx = 0;

    constructor(directionText) {
        this.dirText = directionText;
    }

    nextDirection() {
        const dir = this.dirText.charAt(this.dirIdx++);
        if (this.dirIdx >= this.dirText.length) {
            this.dirIdx = 0;
        }
        return dir;
    }
}

class Node {
    label;
    leftChildLabel;
    leftChild;
    rightChildLabel;
    rightChild;

    constructor(label, leftChildLabel = undefined, rightChildLabel = undefined) {
        [this.label, this.leftChildLabel, this.rightChildLabel] = [label, leftChildLabel, rightChildLabel];
        return;
    }

    takeStep(direction) {
        switch (direction) {
            case "L":
                return this.leftChild;
            case "R":
                return this.rightChild;
            default:
                throw new Error("Unrecognized direction: " + direction);
        }
    }
}