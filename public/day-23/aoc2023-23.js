function part1(puzzleInput) {
    const graph = TrailGraph.parseFromInput(puzzleInput);

    let output = graph.toText();

    output += "\n" + graph.findPaths().reduce((a, e) => Math.max(a, e.length), 0);

    return output;
}

function part2(puzzleInput) {
    alert("Not done yet");
}

class TrailGraph {
    startNode;

    constructor(startNode) {
        this.startNode = startNode;
    }

    // Returns string[]
    findPaths() {
        const paths = [];
        const nodeQueue = [{node: this.startNode, pathSoFar: "", seenNumsThisPath: new Set()}];

        while (nodeQueue.length) {
            const {node, pathSoFar, seenNumsThisPath} = nodeQueue.shift();

            if (node.isGoal) {
                // We did it!
                console.log("Found a path: " + pathSoFar + " (" + pathSoFar.length + ")");
                paths.push(pathSoFar);
            } else {
                TrailNode.dirCodes.forEach(e => {
                    const dir = e.dir;
                    const newSeen = new Set(seenNumsThisPath.values());
                    newSeen.add(node.nodeNum);

                    const nextNode = node.pathNeighbors[dir];
                    if (nextNode && !seenNumsThisPath.has(nextNode.nodeNum)) {
                        nodeQueue.push({node: nextNode, pathSoFar: pathSoFar + dir,
                            seenNumsThisPath: TrailGraph.#newSeen(seenNumsThisPath, node.nodeNum)});
                    }
                });
            }
        }
        return paths;
    }

    static #newSeen(oldSeen, nodeNum) {
        const newSet = new Set(oldSeen.values());
        newSet.add(nodeNum);
        return newSet;
    }

    // This is NOT going to work if the maze ever extends west of the start tile
    // In fact this whole thing is a mess
    toText() {
        const lines = [];
        const nodeQueue = [{node: this.startNode, row: 0, col: 0}];
        const seenNodeNums = new Set(); // number

        while (nodeQueue.length) {
            const {node, row, col} = nodeQueue.shift();

            if (!lines[row]) {
                lines[row] = [];
            }
            lines[row][col] = node.code;
            seenNodeNums.add(node.nodeNum);

            TrailNode.dirCodes.forEach(e => {
                const dir = e.dir;
                const nextNode = node.pathNeighbors[dir];
                if (nextNode && !seenNodeNums.has(nextNode.nodeNum)) {
                    nodeQueue.push({node: nextNode, row: row + e.rowOffset, col: col + e.colOffset});
                }
            });

        }
        
        return lines.map(line => {
            let output = "";
            let lastCol = -1;
            for (const key in line) {
                output += " ".repeat(key - lastCol - 1) + line[key];
                lastCol = key;
            }
            return output;
        }).join("\n");
    }

    static parseFromInput(puzzleInput) {
        let nodeNum = 0;
        const grid = puzzleInput.split("\n").map(line => line.split("").map(cell => {
            if (cell === "#") {
                return null;
            } else {
                return new TrailNode(cell, nodeNum++);
            }
        }));

        // We're guaranteed only one path tile on the top row - the start node
        const startNode = grid[0].find(e => e && e.code === ".");
        // While we're at it, only one path tile on the bottom row - the end node
        grid.at(-1).find(e => e && e.code === ".").isGoal = true;

        // Build the graph
        const numRows = grid.length;
        const numCols = numRows ? grid[0].length : 0;
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const thisNode = grid[row][col];
                if (thisNode) {
                    if (row > 0) {
                        TrailGraph.#maybeNeighbor(thisNode, grid[row - 1][col], "N");
                    }
                    TrailGraph.#maybeNeighbor(thisNode, grid[row][col + 1], "E");
                    if (row < numRows - 1) {
                        TrailGraph.#maybeNeighbor(thisNode, grid[row + 1][col], "S");
                    }
                    TrailGraph.#maybeNeighbor(thisNode, grid[row][col - 1], "W");
                }
            }
        }

        return new TrailGraph(startNode);
    }

    static #maybeNeighbor(thisNode, maybeNeighborNode, dir) {
        if (maybeNeighborNode && maybeNeighborNode.code !== TrailNode.dirToCode(TrailNode.oppositeDir(dir))) {
            thisNode.pathNeighbors[dir] = maybeNeighborNode;
        }
    }

}

class TrailNode {
    static dirCodes = [
        {dir: "N", code: "^", rowOffset: -1, colOffset: 0},
        {dir: "E", code: ">", rowOffset: 0, colOffset: 1},
        {dir: "S", code: "v", rowOffset: 1, colOffset: 0},
        {dir: "W", code: "<", rowOffset: 0, colOffset: -1}
    ]

    code;
    nodeNum;
    isGoal = false;
    pathNeighbors = {
        N: null,
        E: null,
        S: null,
        W: null
    }

    constructor(code, nodeNum) {
        this.code = code;
        this.nodeNum = nodeNum;
    }

    static oppositeDir(dir) {
        const dirIdx = TrailNode.dirCodes.findIndex(e => e.dir === dir);
        return TrailNode.dirCodes[(dirIdx + 2) % 4].dir;
    }

    static dirToCode(dir) {
        return TrailNode.dirCodes.find(e => e.dir === dir).code;
    }

    static codeToDir(code) {
        return TrailNode.dirCodes.find(e => e.code === code).dir;
    }
}
