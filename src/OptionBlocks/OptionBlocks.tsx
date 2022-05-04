import { FlowComponent, FlowObjectData } from "flow-component-model";
import React = require("react");
import { Result, Results } from "../results";
import OptionBlock from "./OptionBlock";
import './optionblocks.css';
declare const manywho: any;

export default class OptionBlocks extends FlowComponent {
    options: Map<string,FlowObjectData> = new Map();
    selectedOption: string = "";
    results: Results;
    
    constructor(props: any) {
        super(props);

        this.loadOptions = this.loadOptions.bind(this);
        this.selectOption = this.selectOption.bind(this);
        this.results = new Results(this.getAttribute("resultTypeName","TestResult"));
    }

    async componentDidMount(): Promise<void> {
        await super.componentDidMount();  
        this.loadOptions();
    }

    loadOptions() {
        this.options.clear();
        this.model.dataSource.items.forEach((item: FlowObjectData) => {
            if(item.isSelected) {
                this.selectedOption=item.internalId;
            }
            this.options.set(item.internalId, item);
        });
        this.forceUpdate();
    }

    async selectOption(option: string) {
        this.selectedOption = option;
        let opt = this.options.get(option).properties.NumericValue.value;
        let result: Result;
        if(this.results.items.has(1)){
            result = this.results.items.get(1);
            result.result=""+opt;
        }
        else {
            this.results.add(Result.newInstance(1,0,0,0,0,""+opt,""));
        }
        let stateValue = this.results.makeFlowObjectData().items[0];
        await this.setStateValue(stateValue);

        if(this.outcomes?.OnSelect) {
            await this.triggerOutcome("OnSelect")
        }
        else {
           manywho.engine.sync(this.flowKey); 
        }
        //this.forceUpdate();
    }

    render() {

        let blocks: any[] = [];
        this.options.forEach((item: FlowObjectData) => {
            blocks.push(
                <OptionBlock
                    root={this}
                    key={item.internalId}
                    option={item.internalId}
                />
            );
        });

        return (
            <div
                className="opblocs"
            >
                {blocks}
            </div>
        );
    }
}

manywho.component.register('OptionBlocks', OptionBlocks);