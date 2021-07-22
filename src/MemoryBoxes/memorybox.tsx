import React = require("react");
import MemoryBoxes, { eActivityState, eRunState } from "./memoryboxes";


export default class MemoryBox extends React.Component<any,any> {
    
    constructor(props: any){
        super(props);

        this.setSelected = this.setSelected.bind(this);
    }
    setSelected(e: any) {
        let root: MemoryBoxes = this.props.root;
        root.toggleSelected(this.props.box);
        this.forceUpdate()
    }

    render() {
        let root: MemoryBoxes = this.props.root;
        let boxclass: string = "membox-box-box";
        let resultIcon: any;
        if((root.activityState===eActivityState.flashing || root.activityState===eActivityState.results) && root.hotBoxes.indexOf(this.props.box) >= 0){
            boxclass += " membox-box-box-hot"
        }
        if(root.selectedBoxes.indexOf(this.props.box) >= 0) {
            boxclass += " membox-box-box-tagged"
        }
        if(root.activityState===eActivityState.answering) {
            boxclass += " membox-box-box-clickable"
        }
        if(root.activityState===eActivityState.results) {
            if(root.resultBoxes.get(this.props.box) === true) {
                resultIcon=(
                    <span
                        className = "glyphicon glyphicon-ok membox-box-result membox-box-result-good"
                    />
                );
            }
            else {
                resultIcon=(
                    <span
                        className = "glyphicon glyphicon-remove membox-box-result membox-box-result-bad"
                    />
                );
            }
        }
        return(
            <div
                className="membox-box"
            >
                <div 
                    className="membox-box-internal"
                >
                    <div 
                        className={boxclass}
                        onClick={this.setSelected}
                    >
                        {resultIcon}
                    </div>
                </div>
        </div>
        );
    }
}