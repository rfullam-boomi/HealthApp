import { eContentType, FlowObjectData, FlowObjectDataArray, FlowObjectDataProperty } from "flow-component-model";

export class Results {
    items: Map<number,Result>;

    constructor() {
        this.items = new Map();
    }

    clear() {
        this.items.clear();
    }

    add(result: Result) {
        this.items.set(result.round, result);
    }

    makeFlowObjectData() : FlowObjectDataArray {
        let items: FlowObjectDataArray = new FlowObjectDataArray();
        this.items.forEach((item: Result) => {
            items.addItem(item.makeFlowObjectData());
        });
        return items;
    }
}

export class Result {
    round: number;
    correct: number;
    incorrect: number;
    timeSeconds: number;
    accuracy: number;

    constructor(round: number, correct: number, incorrect: number, time: number,accuracy: number) {
        this.round = round;
        this.correct = correct;
        this.incorrect = incorrect;
        this.timeSeconds = time;
        this.accuracy = accuracy;
    }

    makeFlowObjectData() : FlowObjectData {
        let result: FlowObjectData = FlowObjectData.newInstance("TestResult"); 
        result.addProperty(FlowObjectDataProperty.newInstance("round",eContentType.ContentNumber,this.round));
        result.addProperty(FlowObjectDataProperty.newInstance("correct",eContentType.ContentNumber,this.correct));
        result.addProperty(FlowObjectDataProperty.newInstance("incorrect",eContentType.ContentNumber,this.incorrect));
        result.addProperty(FlowObjectDataProperty.newInstance("time",eContentType.ContentNumber,this.timeSeconds));
        result.addProperty(FlowObjectDataProperty.newInstance("accuracy",eContentType.ContentNumber,this.accuracy));
        return result;
    }
}