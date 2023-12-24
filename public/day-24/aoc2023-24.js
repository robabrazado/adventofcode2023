function part1(puzzleInput, useSampleRange) {
    const rangeBounds = {
        lo: useSampleRange ? 7 : 200000000000000,
        hi: useSampleRange ? 27 : 400000000000000
    };

    const hailstones = puzzleInput.split("\n").map(line => Hailstone.parse(line));
    let output = hailstones.map(e => e.toText()).join("\n");


    output += "\n\n";
    intersections = [];
    hailstones.forEach((hailstoneA, i, arr) => {
        arr.slice(i + 1).forEach((hailstoneB) => {
            intersections.push({hailstoneA: hailstoneA, hailstoneB: hailstoneB, intx: hailstoneA.intersectsAtNoZ(hailstoneB)});
        });
    });

    intersections.forEach(e => {
        output += e.hailstoneA.toText() + " intersects " + e.hailstoneB.toText() + " at " +
        intersectionToText(e.intx) + "\n";
    });

    const results = intersections.filter(e => {
        const intx = e.intx;
        return (intx && Number.isFinite(intx.thisT) &&
            intx.x >= rangeBounds.lo && intx.x <= rangeBounds.hi &&
            intx.y >= rangeBounds.lo && intx.y <= rangeBounds.hi &&
            intx.thisT >= 0 && intx.otherT >= 0);
    }).length;
    output += "\n" + results;


    return output;
}

function intersectionToText(intxObj) {
    let output;
    if (intxObj === null) {
        output = "never";
    } else if (!Number.isFinite(intxObj.thisT)) {
        output = "always";
    } else {
        output = "(" + intxObj.x.toFixed(3) + "," +
            intxObj.y.toFixed(3) + ") " +
            "t1=" + intxObj.thisT.toFixed(3) + ", " +
            "t2=" + intxObj.otherT.toFixed(3);
    }
    return output;
}

function part2(puzzleInput) {
    alert("Not done yet");
}

class Hailstone {
    static sameCoords = {x: Infinity, y: Infinity, thisT: Infinity, otherT: Infinity};

    startPos; // {x, y, z}
    velocityOffset; // {x, y, z}

    constructor(startPos, velocityOffset) {
        [this.startPos = startPos, this.velocityOffset = velocityOffset];

    }

    // Returns the time index where this hailstone has the specified X coordinate
    getTimeAtX(x) {
        return (x - this.startPos.x) / this.velocityOffset.x;
        
    }

    // Ignoring the z-axis, the value of y when x is 0
    getStartYNoZ() {
        const txZero = this.getTimeAtX(0);
        return this.startPos.y + (this.velocityOffset.y * txZero);
    }

    getSlopeNoZ() {
        return this.velocityOffset.y / this.velocityOffset.x;
    }

    // Returns the coordinates ({x, y, thisT, otherT}) where this hailstone's path intersects the specified other hailstone's path, ignoring the z-axis
    // Returns null if the lines are parallel and distinct (i.e. never intersect); returns {x: Infinity, y: Infinity, thisT: Infinity, otherT: Infinity}
    // if the paths are the same
    intersectsAtNoZ(other) {
        const [myStartY, otherStartY] = [this.getStartYNoZ(), other.getStartYNoZ()];
        const [mySlope, otherSlope] = [this.getSlopeNoZ(), other.getSlopeNoZ()];

        let coords;
        if (mySlope === otherSlope) {
            if (myStartY === otherStartY) {
                coords = Hailstone.sameCoords;
            } else {
                coords = null;
            }
        } else {
            // Math
            /*
             * Given two lines expressed by y = mx + b (and we've already ruled out parallels), start with:
             *
             * y1 = m1x1 + b1
             * y2 = m2x2 + b2
             * 
             * They intersect when the two xs are equal and the two ys are equal. Start by setting the ys equal.
             * When y1 = y2 then:
             * 
             * m1x1 + b1 = m2x2 + b2
             * 
             * Solve for the xs by assuming x1 and x2 are equal, or x = x1 = x2
             * 
             * m1x + b1 = m2x + b2
             * m1x = m2x + b2 - b1
             * m1x - m2x = b2 - b1
             * (m1 - m2)x = b2 - b1
             * x = (b2 - b1)/(m1 - m2) <-- when the two ys are equal, the two xs are this
             * 
             * Then this should also be true:
             * 
             * y = m1x + b1 = m2x + b2
             */
            const intxX = (otherStartY - myStartY)/(mySlope - otherSlope);
            const intxY = (mySlope * intxX) + myStartY;
            // const checkY = (otherSlope * intxX) + otherStartY; I was trying to check my work, but the floating point precision stuff was killing me
            const myT = this.getTimeAtX(intxX);
            const otherT = other.getTimeAtX(intxX);
            // if (intxY !== checkY) {
            //     throw new Error("That didn't work: " + [intxY, checkY].join(","));
            // }
            coords = {x: intxX, y: intxY, thisT: myT, otherT: otherT};
        }
        return coords;
    }

    toText() {
        return Hailstone.coordsToArr(this.startPos).join(", ") + " @ " +
            Hailstone.coordsToArr(this.velocityOffset).join(", ");
    }

    static parse(input) {
        const pieces = input.split(" @ ").map(e => e.split(", ").map(f => parseInt(f)));
        return new Hailstone(Hailstone.arrToCoords(pieces[0]), Hailstone.arrToCoords(pieces[1]));
    }

    static arrToCoords(arr) {
        const coords = {};
        [coords.x, coords.y, coords.z] = arr;
        return coords;
    }
    
    static coordsToArr(coords) {
        return [coords.x, coords.y, coords.z];
    }

}
