function part1(puzzleInput) {
    const [manager, parts] = parseInput(puzzleInput);
    parts.forEach(part => {
        manager.evaluate(part);
    });

    return parts.reduce((a, part) => a + (part.accepted ? part.getTotal() : 0), 0);
}

function part2(puzzleInput) {
    const allLines = puzzleInput.split("\n");
    const analyzer = new WorkflowAnalyzer(allLines.slice(0, allLines.indexOf("")));
    const results = analyzer.analyze();

    return results.reduce((a, state) => a + (state.accepted ? state.getTotal() : 0), 0);
}

// //////////////// Part 1 stuff ////////////////

function parseInput(puzzleInput) {
    const allLines = puzzleInput.split("\n");
    const blankIdx = allLines.indexOf("");
    return [
        new WorkflowManager(allLines.slice(0, blankIdx)),
        parseParts(allLines.slice(blankIdx + 1))
    ];
}

function parseParts(partLines) {
    return partLines.map(line => {
        return Part.parseLine(line);
    });
}

class Part {
    static totalKeys = ["x", "m", "a", "s"];
    x;
    m;
    a;
    s;
    workflow;
    accepted;

    constructor(x, m, a, s) {
        this.x = x;
        this.m = m;
        this.a = a;
        this.s = s;
    }

    static parseLine(partLine) {
        const obj = {};
        partLine.slice(1, -1).split(",").forEach(attVal => {
            const [attribute, value] = attVal.split("=").map((e, i) => i ? parseInt(e) : e);
            obj[attribute] = value;
        });
        const {x, m, a, s} = obj;
        return new Part(x, m, a, s);
    }

    getTotal() {
        return Part.totalKeys.reduce((a, key) => a + this[key], 0);
    }
}

class WorkflowManager {
    workflows = new Map(); // name:string -> workflow:Workflow

    constructor(workflowTextLines) {
        workflowTextLines.forEach(workflowLine => {
            const braceIdx = workflowLine.indexOf("{");
            this.workflows.set(workflowLine.slice(0, braceIdx), new Workflow(workflowLine.slice(braceIdx)));
        });
    }

    evaluate(part) {
        part.workflow = "in";

        while (part.workflow) {
            this.workflows.get(part.workflow).evaluate(part);
        }
    }

}

class Workflow {
    workflowText;
    rules = [];

    constructor(workflowText) {
        this.workflowText = workflowText;

        const ruleTextLines = workflowText.slice(1, -1).split(",");
        ruleTextLines.forEach(ruleText => {
            const ruleTextParts = ruleText.split(":");
            const actionPart = ruleTextParts.at(-1);
            let result;
            switch (actionPart) {
                case "A":
                    result = ResultAccept.getInstance();
                    break;
                case "R":
                    result = ResultReject.getInstance();
                    break;
                default:
                    result = new ResultGoto(actionPart);
            }
    
            let rule;
            if (ruleTextParts.length === 1) {
                rule = new RuleAlways(result);
            } else {
                const [attribute, value] = [ruleTextParts[0].charAt(0), parseInt(ruleTextParts[0].slice(2))];
                switch (ruleTextParts[0].charAt(1)) {
                    case "<":
                        rule = new RuleLessThan(attribute, value, result);
                        break;
                    case ">":
                        rule = new RuleGreaterThan(attribute, value, result);
                        break;
                    default:
                        throw new Error("Unable to parse operator in rule text " + ruleText);
                }
            }

            this.rules.push(rule);
        });
    }

    evaluate(part) {
        let result;
        for (let i = 0; i < this.rules.length && !result; i++) {
            result = this.rules[i].evaluate(part);
        }
        if (result) {
            result.action(part);
        } else {
            throw new Error("No result found for " + JSON.stringify(part) + " with " + this.workflowText);
        }
    }
}

class RuleAlways {
    result;

    constructor(result) {
        this.result = result;
    }

    evaluate() {
        return this.result;
    }
}

class RuleLessThan {
    attribute;
    value;
    result;

    constructor(attribute, value, result) {
        this.attribute = attribute;
        this.value = value;
        this.result = result;
    }

    evaluate(part) {
        if (part[this.attribute] < this.value) {
            return this.result;
        } else {
            return null;
        }
    }
}

class RuleGreaterThan {
    attribute;
    value;
    result;

    constructor(attribute, value, result) {
        this.attribute = attribute;
        this.value = value;
        this.result = result;
    }

    evaluate(part) {
        if (part[this.attribute] > this.value) {
            return this.result;
        } else {
            return null;
        }
    }
}

class ResultAccept { // Singleton
    static #instance;

    constructor() {}

    action(part) {
        part.workflow = undefined;
        part.accepted = true;
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new ResultAccept();
        }
        return this.#instance;
    }
}

class ResultReject { // Singleton
    static #instance;

    constructor() {}

    action(part) {
        part.workflow = undefined;
        part.accepted = false;
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new ResultReject();
        }
        return this.#instance;
    }
}

class ResultGoto {
    workflowName;

    constructor(workflowName) {
        this.workflowName = workflowName;
    }

    action(part) {
        part.workflow = this.workflowName;
    }
}

// //////////////// Part 2 stuff ////////////////

class WorkflowAnalyzer {
    workflowMap = new Map(); // name:string => workflow:WorkflowTrack

    constructor(lines) {
        lines.forEach(line => {
            const braceIdx = line.indexOf("{");
            this.workflowMap.set(line.slice(0, braceIdx), new WorkflowTrack(line.slice(braceIdx)));
        });
    }

    /**
     * 
     * 
     * @returns { PartState[] }
     */
    analyze() {
        const retVal = [];
        const queue = [];
        const initialState = new PartState();
        initialState.workflow = "in";
        queue.push(initialState);

        while (queue.length > 0) {
            const state = queue.shift();
            const results = this.workflowMap.get(state.workflow).analyze(state);
            results.forEach(resultState => {
                (resultState.accepted === undefined ? queue : retVal).push(resultState);
            });
        }
        return retVal;
    }
}

// Instead of evaluating a part for a result, this will return a list of part states with various results
class WorkflowTrack {
    workflowText;
    rules = [];

    constructor(workflowText) {
        this.workflowText = workflowText
        workflowText.slice(1, -1).split(",").forEach(ruleText => this.rules.push(new RuleTrack(ruleText)));
    }

    /**
     * 
     * 
     * @param { PartState } state 
     * @returns { PartState[] }
     */
    analyze(state) {
        const resolved = [];

        for (let i = 0; i < this.rules.length && state; i++) {
            const passFailResults = this.rules[i].analyze(state);
            if (passFailResults.passing) {
                resolved.push(passFailResults.passing);
            }
            state = passFailResults.failing;
        }
        if (state) {
            // I don't think we should ever get here, but I want to know if we do
            throw new Error("Ran out of rules but fail states remain");
        }

        return resolved;
    }

}

// A rule now takes a starting state and returns up to two other states: passing and failing
class RuleTrack {
    ruleText;
    attribute;
    operator;
    value;
    result;

    constructor(ruleText) {
        this.ruleText = ruleText;
        const ruleTextParts = ruleText.split(":");
        this.result = ruleTextParts.at(-1);
        if (ruleTextParts.length > 1) {
            this.attribute = ruleText.charAt(0);
            this.operator = ruleText.charAt(1);
            this.value = parseInt(ruleTextParts[0].substring(2));
        } else {
            this.operator = "^"; // Yeah, whatever. I introduced a new symbol.
        }
    }

    /**
     * 
     * @param { PartState } state 
     * @returns { Object } {passing:PartState, failing:PartState} and either property could be null
     */
    analyze(state) {
        const retVal = {passing: null, failing: null};
        switch (this.operator) {
            case "^": // Everyone passes!
                retVal.passing = state.clone();
                break;
            case ">":
                if (state.hasValuesAbove(this.attribute, this.value)) {
                    retVal.passing = state.clone().newMin(this.attribute, this.value + 1);
                    retVal.failing = state.clone().newMax(this.attribute, this.value);
                } else {
                    retVal.failing = state.clone();
                }
                break;
            case "<":
                if (state.hasValuesBelow(this.attribute, this.value)) {
                    retVal.passing = state.clone().newMax(this.attribute, this.value - 1);
                    retVal.failing = state.clone().newMin(this.attribute, this.value);
                } else {
                    retVal.failing = state.clone();
                }
                break;
            default:
                throw new Error("Uh oh");
        }

        // Whatever state is passing gets the results
        if (retVal.passing) {
            switch (this.result) {
                case "A":
                    retVal.passing.accepted = true;
                    break;
                case "R":
                    retVal.passing.accepted = false;
                    break;
                default:
                    retVal.passing.workflow = this.result;
            }
        }

        return retVal;
    }
}

// Each of the xmas properties are a list of [min, max] ranges
// Both newMax and newMin assume an attribute will never have overlapping ranges; we'll see if I live to regret that decision
// Later: does this even need to be an array of ranges? Will we ever have more than one range at a time in a given state? Oh, well.
class PartState {
    static attrs = ["x", "m", "a", "s"];
    x = [[1, 4000]];
    m = [[1, 4000]];
    a = [[1, 4000]];
    s = [[1, 4000]];
    accepted;
    workflow;

    constructor() {}

    newMax(attribute, value) {
        const rangeIdx = this.#findRangeIdx(attribute, value);
        if (rangeIdx >= 0) {
            this[attribute][rangeIdx][1] = value;
            this[attribute].splice(rangeIdx + 1);
        }
        return this;
    }

    newMin(attribute, value) {
        const rangeIdx = this.#findRangeIdx(attribute, value);
        if (rangeIdx >= 0) {
            this[attribute][rangeIdx][0] = value;
            this[attribute].splice(0, rangeIdx);
        }
        return this;
    }

    #findRangeIdx(attribute, value) {
        return this[attribute].findIndex(e => e[0] <= value && e[1] >= value);
    }

    // Only copies attribute ranges!
    clone() {
        const twin = new PartState();
        PartState.attrs.forEach(attr => {
            twin[attr] = this[attr].map(arr => arr.slice());
        });
        return twin;
    }

    hasValuesAbove(attribute, value) {
        return this[attribute].some(range => range[1] > value);
    }

    hasValuesBelow(attribute, value) {
        return this[attribute].some(range => range[0] < value);
    }

    getTotal() {
        let total = 1;
        PartState.attrs.forEach(attr => {
            this[attr].forEach(range => {
                total *= range[1] - range[0] + 1;
            });
        });
        return total;
    }
}
