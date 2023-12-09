function part1(puzzleInput) {
    const lines = puzzleInput.split("\n");
    
    // First line is directions
    const directions = lines.shift();
    const dirGiver = new DirectionGiver(directions);
    // Second line is blank
    lines.shift();

    // The rest are nodes
    const allNodes = createNodeMap(lines); // label -> Node

    const startNodeLabel = "AAA";
    const endNodeLabel = "ZZZ";
    // Part 2 made me add this in case I accidentally called part1 solver on the wrong test data :P
    if (!allNodes.has(startNodeLabel) || !allNodes.has(endNodeLabel)) {
        alert("Start or end node missing; is this the right data?");
        return;
    }

    let currentNode = allNodes.get(startNodeLabel);
    let steps = 0;
    while (currentNode.label != endNodeLabel) {
        currentNode = currentNode.takeStep(dirGiver.nextDirection());
        steps++;
    }

    return steps;
}


function part2(puzzleInput) {
    const lines = puzzleInput.split("\n");
    
    // First line is directions
    const directions = lines.shift();
    const dirGiver = new DirectionGiver(directions);
    // Second line is blank
    lines.shift();

    // The rest are nodes
    const allNodes = createNodeMap(lines); // label -> Node

    const startNodes = Array.from(allNodes.keys()).slice().filter(e => e.endsWith("A")).map(label => allNodes.get(label));
    
    /* Okay...first attempt at step 2 taught me that actually following each path
     * simultaneously is taking WAY too long. Now trying for a math solution. Here's
     * the new idea: calculate min steps for each starting node to reach a finish state.
     * In theory, the correct answer should be the LCM of each of those results? This
     * presupposes that the various paths only pass through only one end state OR that
     * one of the end states they pass through is they one they end up on at the right
     * time. That's probably going to bite me in the ass.
     */

    /* Okay...it bit me in the ass. Do I need to collect ALL step counts to ending
     * states? Find an LCM from there?
     */
    const stepCounts = startNodes.map(node => {
        // This is basically part 1 with a different end condition
        dirGiver.reset();
        const seenEnds = new Set();
        // Keep following the directions and log steps to each end state reached until we start to repeat end states
        let currentNode = node;
        let steps = 0;
        let keepLooking = true;
        const nodeStepCounts = [];
        while (keepLooking) {
            currentNode = currentNode.takeStep(dirGiver.nextDirection());
            steps++;
            if (currentNode.label.endsWith("Z")) {
                if (seenEnds.has(currentNode.label)) {
                    keepLooking = false;
                } else {
                    nodeStepCounts.push(steps);
                    seenEnds.add(currentNode.label);
                }
            }
        }
        return nodeStepCounts;
    });
    
    /* At this point, the results indicate that there IS only one end state per start node.
     * Maybe my first try was doing the math wrong. So in theory, I'm looking for the LCM
     * across all the results.
     */
    const sortedStepCounts = stepCounts.flat().sort((a, b) => b - a);
    const largestInterval = sortedStepCounts[0]; // Starting with the largest interval
    const smallestInterval = sortedStepCounts.at(-1);

    // I think I'm blowing out the max int size. Trying with bigint.
    function foundIt(testNum) {
        return sortedStepCounts.reduce((a, e) => a && testNum % BigInt(e) == 0n, true);
    }

    let bigSteps = BigInt(largestInterval);
    while (!foundIt(bigSteps)) {
        bigSteps += BigInt(largestInterval);
    }

    // Still took a little while to calculate, but it worked, and faster than the path-following!
    // There's probably way better math for finding the LCM, but...here we are.

    return bigSteps.toString(10);
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

    reset() {
        this.dirIdx = 0;
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

function createNodeMap(lines) { // label -> Node
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
    });
    return allNodes;
}
