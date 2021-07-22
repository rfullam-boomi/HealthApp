import React = require("react");
import MemoryBoxes, { eRunState } from "./memoryboxes";


export default class MemoryBox extends React.Component<any,any> {
    

    render() {
        let root: MemoryBoxes = this.props.root;
        let boxclass: string = "membox-box-box";
        if(root.status===eRunState.flashing && root.hotBoxes.indexOf(this.props.box) >= 0){
            boxclass += " membox-box-box-hot"
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
                    />
                </div>
        </div>
        );
    }
}