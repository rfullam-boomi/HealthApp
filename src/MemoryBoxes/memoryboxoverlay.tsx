import React = require("react");
import MemoryBoxes, { eRunState } from "./memoryboxes";


export default class MemoryBoxOverlay extends React.Component<any,any> {


    render() {
        let root: MemoryBoxes = this.props.root;
        let content: any;

        switch(root.status){
            case eRunState.stopped:
                content=(
                    <div
                        className="membox-overlay-button"
                        onClick={root.startTest}
                    >
                        Start
                    </div>
                );  
                break;

            case eRunState.starting: 
                content=(
                    <div
                        className="membox-overlay-message"
                    >
                        {"starting in " + root.countdown}
                    </div>
                );  
                break;
        }

        


        return(
            <div
                className="membox-overlay"
            >
                <div
                    className="membox-overlay-center"
                >
                    {content}
                </div>
            </div>
        );
    }
}