import { FlowComponent, FlowObjectData } from "flow-component-model";
import React = require("react");
import OptionBlock from "./OptionBlock";
import './optionblocks.css';
declare const manywho: any;

export default class OptionBlocks extends FlowComponent {
    options: Map<string,FlowObjectData> = new Map();
    selectedOption: string = "";
    
    constructor(props: any) {
        super(props);

        this.loadOptions = this.loadOptions.bind(this);
        this.selectOption = this.selectOption.bind(this);
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
        await this.setStateValue(this.options.get(option));
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