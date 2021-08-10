import React = require("react");
import { eRunState, eActivityState } from "../enums";
import MemoryBoxes from "./memoryboxes";


export default class MemoryBoxFooter extends React.Component<any,any> {


    render() {
        let root: MemoryBoxes = this.props.root;
        let content: any;
        let button: any;
        let message: any;
        switch(root.runState){
            case eRunState.stopped:
                break;

            case eRunState.starting: 
                button=(
                    <div
                        className="membox-overlay-button"
                        onClick={root.stopTest}
                    >
                        Cancel Test
                    </div>
                );

            case eRunState.running: 
                switch(root.activityState){
                    case eActivityState.flashing:
                        button=(
                            <div
                                className="membox-overlay-button"
                                onClick={root.stopTest}
                            >
                                Cancel Test
                            </div>
                        );
                        break;
                    case eActivityState.answering:
                        button=([
                            <div
                                className="membox-overlay-button"
                                onClick={root.doneAnswering}
                            >
                                Submit
                            </div>
                        ]
                        );
                        break;
                    
                    default:
                        button=undefined;

                }
                break;
            
            default:
                button = undefined;
                
            
        }
        return(
            <div
                className="membox-footer"
            >
                {button}
            </div>
        );
    }
}