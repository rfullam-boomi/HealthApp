import { eContentType, FlowObjectData, FlowObjectDataArray, FlowObjectDataProperty } from "flow-component-model";

export class Results {
    items: Map<number,Result>;
    typeName: string;

    constructor(outputTypeName: string) {
        this.items = new Map();
        this.typeName = outputTypeName;
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
            items.addItem(item.makeFlowObjectData(this.typeName));
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
    result: string;
    stimulus: string;
    internalId: string;
    module: string;

    constructor(){

    }

    static newInstance(round: number, correct: number, incorrect: number, time: number,accuracy: number, result: string, stimulus: string) {
        let res: Result = new Result();
        res.round = round;
        res.correct = correct;
        res.incorrect = incorrect;
        res.timeSeconds = time;
        res.accuracy = accuracy;
        res.result = result;
        res.stimulus = stimulus;
        return res;
    }

    static fromObjectData(objectData: FlowObjectData){
        let res = Result.newInstance(
            objectData.properties.round.value as number,
            objectData.properties.correct.value as number,
            objectData.properties.incorrect.value as number,
            objectData.properties.time.value as number,
            objectData.properties.accuracy.value as number,
            objectData.properties.result.value as string,
            objectData.properties.stimulus.value as string
        );
        res.internalId=objectData.internalId;
        res.module=objectData.properties.module.value as string;
        return res;
    }

    makeFlowObjectData(typeName: string) : FlowObjectData {
        let result: FlowObjectData = FlowObjectData.newInstance(typeName); 
        result.isSelected=true;
        result.internalId=this.internalId;
        result.addProperty(FlowObjectDataProperty.newInstance("round",eContentType.ContentNumber,this.round));
        result.addProperty(FlowObjectDataProperty.newInstance("correct",eContentType.ContentNumber,this.correct));
        result.addProperty(FlowObjectDataProperty.newInstance("incorrect",eContentType.ContentNumber,this.incorrect));
        result.addProperty(FlowObjectDataProperty.newInstance("time",eContentType.ContentNumber,this.timeSeconds));
        result.addProperty(FlowObjectDataProperty.newInstance("accuracy",eContentType.ContentNumber,this.accuracy));
        result.addProperty(FlowObjectDataProperty.newInstance("result",eContentType.ContentString,this.result));
        result.addProperty(FlowObjectDataProperty.newInstance("stimulus",eContentType.ContentString,this.stimulus));
        result.addProperty(FlowObjectDataProperty.newInstance("module",eContentType.ContentString,this.module));
        return result;
    }
}