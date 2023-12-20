function part1(puzzleInput, buttonPushCount) {
    console.log(buttonPushCount);
    const system = CableSystem.parseFromInput(puzzleInput);

    for (let i = 1; i <= buttonPushCount; i++) {
        system.pushTheButton();
    }

    return system.getPulseValue();
}

function part2(puzzleInput) {
    alert("Not done yet");
}

// Throughout this monstrosity, pulses are represented by booleans: false for low and true for high
// Or, as I suspect will eventually be the case, they'll be bits: 0 for low, 1 for high

class CableSystem {
    modules = new Map(); // name:string -> module:Module
    lowCount = 0;
    highCount = 0;

    constructor(moduleList) {
        moduleList.forEach(module => {
            this.modules.set(module.name, module);
        });

        // Register inputs
        for (const module of this.modules.values()) {
            module.destinationNames.forEach(destName => {
                if (this.modules.has(destName)) {
                    this.modules.get(destName).registerInput(module.name);
                } else {
                    // I thought this was just for the second example, but it turns out no, I needed it
                    // console.log("Unable to register inputs for " + destName + "; creating empty module");
                    this.modules.set(destName, new Module());
                }
            });
        }
    }

    pushTheButton() {
        const pulseQueue = [new Pulse("button", "broadcaster", false)];

        while (pulseQueue.length) {
            const currentPulse = pulseQueue.shift();
//console.log("Processing " + currentPulse);

            if (currentPulse.isHigh) {
                this.highCount++;
            } else {
                this.lowCount++;
            }

            const destModule = this.modules.get(currentPulse.destinationName);
            const nextPulses = destModule.sendPulse(currentPulse);
            nextPulses.forEach(pulse => {
//console.log("\tQueueing " + pulse);
                pulseQueue.push(pulse);
            });
        }
    }

    getPulseValue() {
console.log("Low: " + this.lowCount + "; high: " + this.highCount);
        return this.lowCount * this.highCount;
    }

    static parseFromInput(puzzleInput) {
        return new CableSystem(puzzleInput.split("\n").
            map(line => Module.parseFromInput(line)));
    }
}

class Pulse {
    sourceName;
    destinationName;
    isHigh;

    constructor(sourceName, destinationName, isHigh) {
        this.sourceName = sourceName;
        this.destinationName = destinationName;
        this.isHigh = isHigh;
    }

    toString() {
        return this.sourceName + " -" + (this.isHigh ? "high" : "low") + "-> " + this.destinationName;
    }
}

class Module {
    name;
    destinationNames = []; // string[]
    inputNames = []; // string[]

    constructor(name, destinationNames = []) {
        this.name = name;
        this.destinationNames.push(...destinationNames);
    }

    /**
     * Default behavior is dev/null mode. Specialized modules override.
     * 
     * @param { Pulse } pulse 
     * @returns { Pulse[] } 
     */
    sendPulse(pulse) {
        // console.log("Warning: pulse sent to emtpy module: " + pulse);
        return [];
    }

    // Constructs only; does not automatically register inputs for conjunction modules!
    static parseFromInput(inputLine) {
        const [namePart, destinationText] = inputLine.split(" -> ");
        const moduleTypeCode = ((namePart.charAt(0) === "%" || namePart.charAt(0) === "&") ? namePart.charAt(0) : undefined);
        const moduleName = namePart.substring(moduleTypeCode ? 1 : 0);
        const destinationNames = destinationText.split(", ");
        
        if (moduleName === "broadcaster") {
            return new BroadcasterModule(moduleName, destinationNames);
        } else {
            switch (moduleTypeCode) {
                case "%":
                    return new FlipFlopModule(moduleName, destinationNames);
                case "&":
                    return new ConjunctionModule(moduleName, destinationNames);
                default:
                    throw new Error("Unexpected module configuration: " + namePart);
            }
        }
    }

    // Probably only conjunction modules are going to use this, but it's easier to put it up top rather than have to type check
    registerInput(inputName) {
        this.inputNames.push(inputName);
    }
}

class BroadcasterModule extends Module {
    constructor(name, destinationNames) {
        super(name, destinationNames);
    }

    sendPulse(pulse) {
        return this.destinationNames.map(destName => new Pulse(this.name, destName, pulse.isHigh));
    }
}

class FlipFlopModule extends Module {
    isOn = false;

    constructor(name, destinationNames) {
        super(name, destinationNames);
    }

    sendPulse(pulse) {
        const nextPulses = [];

        if (!pulse.isHigh) {
            this.isOn = !this.isOn;
            nextPulses.push(...this.destinationNames.map(destName => new Pulse(this.name, destName, this.isOn)));
        }

        return nextPulses;
    }
}

class ConjunctionModule extends Module {
    inputStates = new Map(); // name:string -> lastPulse:boolean

    constructor(name, destinationNames) {
        super(name, destinationNames);
    }

    sendPulse(pulse) {
        const nextPulses = [];

        this.inputStates.set(pulse.sourceName, pulse.isHigh);
        const nextisHigh = !this.#areAllHigh();
        nextPulses.push(...this.destinationNames.map(destName => new Pulse(this.name, destName, nextisHigh)));

        return nextPulses;
    }

    #areAllHigh() {
        return !(Array.from(this.inputStates.values()).some(e => !e));
    }

    registerInput(inputName) {
        this.inputStates.set(inputName, false);
    }
}

