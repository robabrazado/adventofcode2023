function part1(puzzleInput) {
    const graph = new PipeGraph(puzzleInput.split("\n"));

    const mainLoopNodes = Array.from(graph.allNodes.values());
    return mainLoopNodes.reduce((a, node) => Math.max(a, node.distanceFromStart), 0);
}


function part2(puzzleInput) {
    const graph = new PipeGraph(puzzleInput.split("\n"));

    // Make an int grid describing tile regions: null undefined; -1 main; 0 outside; 1+ enclosed
    const regionGrid = [];
    for (let row = 0; row <= graph.lastRowIdx; row++) {
        regionGrid.push(new Array(graph.lastColIdx + 1).fill(null));
    }

    // Start by marking the main loop
    const mainNodesRemaining = [graph.startNode];
    while (mainNodesRemaining.length > 0) {
        const thisNode = mainNodesRemaining.shift();
        if (regionGrid[thisNode.coords.row][thisNode.coords.col] == null) {
            regionGrid[thisNode.coords.row][thisNode.coords.col] = -1;
            thisNode.exits.forEach(exitDir => {
                const nextCoords = thisNode.coords.move(exitDir);
                if (graph.areValidCoords(nextCoords) && regionGrid[nextCoords.row][nextCoords.col] == null) {
                    mainNodesRemaining.push(graph.allNodes.get(nextCoords.getLabel()));
                }
            });
        } else {
            if (regionGrid[thisNode.coords.row][thisNode.coords.col] !== -1) {
                throw new Error("Uh oh");
            }
        }
    }

    /* Many hours and tribulations later... */

    /* All right, complete redesign time, because what I was doing before was not working out.
     * New plan. Make a separate "intersection" grid, where intersections are the points between
     * tiles. First, this will let me describe a graph of intersections that are "accessible"
     * via pipe squeezing. Between two adjacent intersections is an edge with a tile on either
     * side, and they are accessible if neither tile has a main loop "exit" that crosses the
     * edge between them. Second, once the accessibility has been mapped, the graph can describe
     * intersections which have access to the outside. At that point, tiles abutting
     * intersections that can access intersections that access the outside become known outside tiles.
     */
    const lastIntxRowIdx = graph.lastRowIdx + 1;
    const lastIntxColIdx = graph.lastColIdx + 1;
    const intxGrid = new Array(lastIntxRowIdx + 1).fill(null);
    intxGrid.forEach((e, i, arr) => {
        arr[i] = new Array(lastIntxColIdx + 1).fill(null);
        arr[i].forEach((f, j, arrr) => {
            arrr[j] = {rowIdx: i, colIdx: j, outsideAccessible: false};
        })
    });

    // First mark all outer intersections as outside-accessible
    // Basically, anyone who can reach the border can reach the outside
    for (const row of [0, lastIntxRowIdx]) {
        for (let col = 0; col <= lastIntxColIdx; col++) {
            intxGrid[row][col].outsideAccessible = true;
        }
    }
    for (let row = 1; row < lastIntxRowIdx; row++) {
        for (const col of [0, lastIntxColIdx]) {
            intxGrid[row][col].outsideAccessible = true;
        }
    }

    // Spread outsideness via accessibility.
    /* Each intersection has up to 4 neighboring intersections. An outside intersection can mark its
     * neighbor as outside if it is accessible to the neighbor via pipe squeeze (or otherwise, I guess).
     */
    // Start with the initial list of outside intersections
    const outsideIntxToSpread = intxGrid.flat().filter(e => e.outsideAccessible);

    /* I *think* this should work? The check for neighboring intersection accessibility depends on the
     * two tiles "between" them, so I think I can get by with just checking the two tiles?
     */
    function canSqueezeBetween(tile1Coords, tile2Coords) {
        // It is only NOT accessible if both tiles are main loop and connected to each other
        // I'm checking all the exits so I don't need to know which direction is important
        return !(regionGrid[tile1Coords.row][tile1Coords.col] === -1 &&
            regionGrid[tile2Coords.row][tile2Coords.col] === -1 &&
            graph.allNodes.get(tile1Coords.getLabel()).exits.some(dir => tile1Coords.move(dir).getLabel() === tile2Coords.getLabel()));
    }

    while (outsideIntxToSpread.length > 0) {
        /* Check all four (potential) neighboring intersections and see if they're accessible.
         * If they are, mark them as "outside" and add them to the spread list (if they're not
         * already marked).
         */
        /* I need a reference. Intersections and tiles are like below. That's [row][col], NOT (x, y).
         *
         *       tile[0][0]     |     tile[0][1]
         *                      |
         *                   NW | NE
         * -------------- intersection[1][1] --------------
         *                   SW | SE
         *                      |
         *       tile[1][0]     |     tile[1][1]
         * 
         * 
         */
        const toSpread = outsideIntxToSpread.shift();
        tileSECoords = new Coords(toSpread.rowIdx, toSpread.colIdx);
        tileSWCoords = tileSECoords.move(Direction.W);
        tileNWCoords = tileSWCoords.move(Direction.N);
        tileNECoords = tileNWCoords.move(Direction.E);

        // I can already tell this is going to be an unholy mess

        // Check N
        if (toSpread.rowIdx > 0 && !intxGrid[toSpread.rowIdx - 1][toSpread.colIdx].outsideAccessible && canSqueezeBetween(tileNECoords, tileNWCoords)) {
            intxGrid[toSpread.rowIdx - 1][toSpread.colIdx].outsideAccessible = true;
            outsideIntxToSpread.push(intxGrid[toSpread.rowIdx - 1][toSpread.colIdx]);
        }

        // Check S
        if (toSpread.rowIdx < lastIntxRowIdx && !intxGrid[toSpread.rowIdx + 1][toSpread.colIdx].outsideAccessible && canSqueezeBetween(tileSECoords, tileSWCoords)) {
            intxGrid[toSpread.rowIdx + 1][toSpread.colIdx].outsideAccessible = true;
            outsideIntxToSpread.push(intxGrid[toSpread.rowIdx + 1][toSpread.colIdx]);
        }

        // Check W
        if (toSpread.colIdx > 0 && !intxGrid[toSpread.rowIdx][toSpread.colIdx - 1].outsideAccessible && canSqueezeBetween(tileNWCoords, tileSWCoords)) {
            intxGrid[toSpread.rowIdx][toSpread.colIdx - 1].outsideAccessible = true;
            outsideIntxToSpread.push(intxGrid[toSpread.rowIdx][toSpread.colIdx - 1]);
        }

        // Check E
        if (toSpread.colIdx < lastIntxColIdx && !intxGrid[toSpread.rowIdx][toSpread.colIdx + 1].outsideAccessible && canSqueezeBetween(tileNECoords, tileSECoords)) {
            intxGrid[toSpread.rowIdx][toSpread.colIdx + 1].outsideAccessible = true;
            outsideIntxToSpread.push(intxGrid[toSpread.rowIdx][toSpread.colIdx + 1]);
        }
    }

    // All non-regioned tiles adjacent to an outside-accessible intersection can be marked as outside tiles
    for (let row = 0; row <= graph.lastRowIdx; row++) {
        for (let col = 0; col <= graph.lastColIdx; col++) {
            if (regionGrid[row][col] === null) {
                const cornerOffsets = [{row: 0, col: 0}, {row: 0, col: 1}, {row: 1, col: 0}, {row: 1, col: 1}];
                let outside = false;
                while (cornerOffsets.length > 0 && !outside) {
                    const offset = cornerOffsets.shift();
                    outside = intxGrid[row + offset.row][col + offset.col].outsideAccessible;
                }
                if (outside) {
                    regionGrid[row][col] = 0;
                }
            }

        }
    }

    // Mark any remaining no-region tiles as inside
    // In hindsight, I guess I didn't really need this step
    for (let row = 0; row <= graph.lastRowIdx; row++) {
        for (let col = 0; col < graph.lastColIdx; col++) {
            if (regionGrid[row][col] == null) {
                regionGrid[row][col] = 1;
            }
        }
    }

    let output = ((grid) => {
        let output = "";
        grid.forEach(line => {
            line.forEach(e => {
                if (e.outsideAccessible) {
                    output += "o";
                } else {
                    output += " ";
                }
            });
            output += "\n";
        });
        return output;
    })(intxGrid);

    output += "\n";

    output += ((grid) => {
        let output = "";
        grid.forEach(line => {
            line.forEach(regionCode => {
                if (regionCode === null) {
                    output += ".";
                } else if (regionCode === -1) {
                    output += "m";
                } else if (regionCode === 0) {
                    output += "o";
                } else {
                    output += "I";
                }
            });
            output += "\n";
        });
        return output;
    })(regionGrid);

    output += "\n" + regionGrid.flat().filter(e => e > 0).length;

    return output;
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

    static parseLabel(label) {
        const [row, col] = label.split(",").map(e => parseInt(e));
        return new Coords(row, col);
    }
}

class PipeGraph {
    grid;
    lastRowIdx;
    lastColIdx;
    startNode;
    allNodes = new Map(); // label:string -> PipeNode

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

