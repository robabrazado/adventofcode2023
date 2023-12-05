function part1(puzzleInput) {
    const almanac = new Almanac(puzzleInput);

    const locations = almanac.seeds.map(seed => almanac.getDestinationId(new ItemId("seed", seed), "location"));
    locations.sort((a, b) => a.id - b.id);

    return locations[0].id;
}

class Almanac {
    seeds = [];
    maps = new Map(); // fromType => AlmanacMap

    constructor (puzzleInput) {
        const lines = puzzleInput.split("\n");

        // Get seeds and remove lines
        this.seeds.push(...lines[0].substr(7).split(" ").map(e => parseInt(e)));
        lines.splice(0, 2);

        // Get maps
        while (lines.length > 0) {
            // First line is type of map
            const [fromType, ,toType] = lines.shift().split(" ")[0].split("-");
            const currentMap = new AlmanacMap(fromType, toType);

            // Add map lines (until blank line reached)
            for (let line = lines.shift(); line; line = lines.shift()) {
                currentMap.addMapLine(...line.split(" ").map(e => parseInt(e)));
            }

            // Store map in almanac
            this.maps.set(currentMap.fromType, currentMap);
        }

    }

    /**
     * 
     * @param {ItemId} fromId 
     * @param {string} [toType=null]
     * @param {ItemId}
     */
    getDestinationId(fromId, toType = null) {
        let retVal = null;
        const map = this.maps.get(fromId.type);
        if (toType == null) {
            retVal = map.getDestinationId(fromId.id);
        } else {
            retVal = this.getDestinationId(fromId);
            while (retVal.type && retVal.type != toType) {
                retVal = this.getDestinationId(retVal, toType);
            }
        }
        return retVal;
    }
}

class AlmanacMap {
    fromType;
    toType;
    mapLines = [];

    constructor(fromType, toType) {
        this.fromType = fromType;
        this.toType = toType;
    }

    addMapLine(from, to, len) {
        this.mapLines.push(new AlmanacMapLine(from, to, len));
    }

    /**
     * 
     * @param {number} sourceId
     * @return {ItemId} destination ID
     */
    getDestinationId(sourceId) {
        let destId = null;
        const numMapLines = this.mapLines.length;

        for (let i = 0; i < numMapLines && destId == null; i++) {
            destId = this.mapLines[i].getDestinationId(sourceId);
        }

        if (destId == null) {
            destId = sourceId;
        }

        return new ItemId(this.toType, destId);
    }
}

class AlmanacMapLine {
    fromIdxStart;
    fromIdxEnd;
    toIdxOffset;

    constructor(to, from, len) {
        this.fromIdxStart = from;
        this.fromIdxEnd = from + len;
        this.toIdxOffset = to - from;
    }

    /**
     * 
     * @param {number} fromId
     * @return {number | null} destination ID or null if sourceId not covered by this map line
     */
    getDestinationId(fromId) {
        return ((fromId >= this.fromIdxStart && fromId <= this.fromIdxEnd) ?
            fromId + this.toIdxOffset :
            null);
    }
}

class ItemId {
    type;
    id;

    constructor(type, id) {
        this.type = type;
        this.id = id;
    }
}

function part2(puzzleInput) {
    const almanac = new Almanac(puzzleInput);
    let lowestLocation = Infinity;

    const seedRanges = almanac.seeds.slice();
    while (seedRanges.length > 0) {
        // console.log(seedRanges.length / 2 + " ranges remain");
        const seedStart = seedRanges.shift();
        const seedLen = seedRanges.shift();
        
        for (let i = 0; i < seedLen; i++) {
            lowestLocation = Math.min(lowestLocation, almanac.getDestinationId(new ItemId("seed", seedStart + i), "location").id);
        }
        // console.log("Lowest location so far: " + lowestLocation);
    }

    return lowestLocation;
}

