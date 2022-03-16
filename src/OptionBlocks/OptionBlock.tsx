import { FlowObjectData } from "flow-component-model";
import React = require("react");
import OptionBlocks from "./OptionBlocks";

export default class OptionBlock extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
        this.selectOption = this.selectOption.bind(this);
    }

    selectOption(e: any) {
        let root: OptionBlocks = this.props.root;
        root.selectOption(this.props.option);
    }

    render() {
        let root: OptionBlocks = this.props.root;
        let objData: FlowObjectData = root.options.get(this.props.option)
        let className: string = "opbloc";
        if(root.selectedOption === this.props.option) {
            className += " opbloc-selected"
        }
        return(
            <div
                className={className}
                onClick={this.selectOption}
            >
                <span
                    className="opbloc-label"
                >
                    {objData.properties?.Label?.value}
                </span>
            </div>
        );
    }
}