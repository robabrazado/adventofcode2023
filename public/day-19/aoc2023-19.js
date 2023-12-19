function part1(puzzleInput) {
    const [manager, parts] = parseInput(puzzleInput);
    parts.forEach(part => {
        manager.evaluate(part);
    });

    const attrs = "xmas".split("");
    return parts.reduce((a, part) => a + (part.accepted ? part.getTotal() : 0), 0);
}

function part2(puzzleInput) {
    alert("Not done yet");
}

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
        return new Part(line);
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

    constructor(partLine) {
        partLine.slice(1, -1).split(",").forEach(attVal => {
            const [attribute, value] = attVal.split("=").map((e, i) => i ? parseInt(e) : e);
            this[attribute] = value;
        });
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
