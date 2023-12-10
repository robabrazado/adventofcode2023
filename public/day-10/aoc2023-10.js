function part1(puzzleInput) {
    const graph = new PipeGraph(puzzleInput.split("\n"));

    const mainLoopNodes = Array.from(graph.allNodes.values());
    return mainLoopNodes.reduce((a, node) => Math.max(a, node.distanceFromStart), 0);
}


function part2(puzzleInput) {

}

class Coords {
    row;
    col;

    constructor(row, col) {
        this.row = row;
        this.col = col;
    }

    move(direction) {
        return new Coords(this.row + direction.offset.row,
            this.col + direction.offset.col);
    }

    getLabel() {
        return this.row + "," + this.col;
    }
}

class PipeGraph {
    grid;
    lastRowIdx;
    lastColIdx;
    startNode;
    allNodes = new Map(); // string -> PipeNode

    constructor(lines) {
        this.grid = lines;
        this.lastRowIdx = lines.length - 1;
        this.lastColIdx = this.lastRowIdx > 0 ? lines[0].length - 1 : 0; // Assumes rectangular input

        // First find the start node
        const [startRow, startCol] = lines.reduce((a, line, row) => {
            const col = line.indexOf("S");
            if (col >= 0) {
                a = [row, col];
            }
            return a;
        });
        const startCoords = new Coords(startRow, startCol);

        // Figure out the start node shape
        // Leaning on stated puzzle assumption that there are exactly two connectors leading into the S tile and both are valid
        const startExits = [];
        [Direction.N, Direction.S, Direction.E, Direction.W].forEach(dir => {
            const newExit = this.getExitFromNeighbor(startCoords, dir);
            if (newExit) {
                startExits.push(newExit);
            }
        });
        
        // Make the start node
        this.startNode = new PipeNode(startCoords, startExits, 0);

        // Build the graph
        // This is basically a breadth-first traversal tracking distances as we go
        const nodesToVisit = [this.startNode];
        while (nodesToVisit.length > 0) {
            // Visit this node
            const thisNode = nodesToVisit.shift();
            if (!this.allNodes.has(thisNode.coords.getLabel())) {
                this.allNodes.set(thisNode.coords.getLabel(), thisNode);
    
                // Queue its neighbors for visits
                thisNode.exits.forEach(exitDir => {
                    const neighborCoords = thisNode.coords.move(exitDir); // I don't think I have to validate these; it's a closed loop, right?
                    // Only queue neighbor visits if they haven't been visited yet
                    if (!this.allNodes.has(neighborCoords.getLabel())) {
                        nodesToVisit.push(new PipeNode(
                            neighborCoords,
                            Direction.getExitsFromTile(this.getTile(neighborCoords)),
                            thisNode.distanceFromStart + 1));
                    }
                });
            } else {
                // I don't know what to do here. Validate, I guess?
                if (thisNode.distanceFromStart != this.allNodes.get(thisNode.coords.getLabel()).distanceFromStart) {
                    throw new Error("This was unexpected");
                }
            }
        }
    }

    areValidCoords(coords) {
        return coords != null &&
            coords.row >= 0 && coords.row <= this.lastRowIdx &&
            coords.col >= 0 && coords.col <= this.lastColIdx;
    }

    // Validate before calling this! Invalid coords throws error.
    getTile(coords) {
        if (!this.areValidCoords(coords)) {
            throw new Error(JSON.stringify(coords) + " are not valid coordinates for this grid");
        }
        return this.grid[coords.row].charAt(coords.col);
    }

    // Returns direction if exit present based on neighbor; undefined if not
    getExitFromNeighbor(myCoords, direction) {
        const newCoords = myCoords.move(direction);
        let exit;
        if (this.areValidCoords(newCoords)) {
            const neighborExits = Direction.getExitsFromTile(this.getTile(newCoords));
            if (neighborExits.some(e => e === direction.getOppositeDirection())) {
                exit = direction;
            }
        }
        return exit;
    }
}

class PipeNode {
    coords;
    exits;
    distanceFromStart;

    constructor(coords, exits, distanceFromStart) {
        this.coords = coords;
        this.exits = exits;
        this.distanceFromStart = distanceFromStart;
    }
}

// Trying to make this work like an enum
class Direction {
    label;
    oppositeLabel;
    offset;

    constructor(label, opppositeLabel, offset) {
        this.label = label;
        this.oppositeLabel = opppositeLabel;
        this.offset = offset;
    }

    getOppositeDirection() {
        return Direction[this.oppositeLabel];
    }

    static N = new Direction("N", "S", {row: -1, col: 0});
    static S = new Direction("S", "N", {row: 1, col: 0});
    static E = new Direction("E", "W", {row: 0, col: 1});
    static W = new Direction("W", "E", {row: 0, col: -1});

    static getExitsFromTile(tile) {
        switch (tile) {
            case "|":
                return [Direction.N, Direction.S];
            case "-":
                return [Direction.E, Direction.W];
            case "L":
                return [Direction.N, Direction.E];
            case "J":
                return [Direction.N, Direction.W];
            case "7":
                return [Direction.S, Direction.W];
            case "F":
                return [Direction.S, Direction.E];
            case ".":
                return [];
            default:
                throw new Error("Cannot get exits from tile " + tile);
        }
    }
}

