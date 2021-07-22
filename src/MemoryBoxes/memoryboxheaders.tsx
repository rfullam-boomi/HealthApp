import React = require("react");
import MemoryBoxes, { eActivityState, eDelayState, eRunState } from "./memoryboxes";


export default class MemoryBoxHeader extends React.Component<any,any> {


    render() {
        let root: MemoryBoxes = this.props.root;
        let content: any;
        let button: any;
        let message: any;
        switch(root.runState){
            case eRunState.stopped:
                message = (
                    <div
                        className="membox-overlay-message"
                    >
                        {""}
                    </div>
                );
                break;

            case eRunState.starting: 
                switch(root.countdownState){
                    case eDelayState.countdown:
                        message = (
                            <div
                                className="membox-overlay-message"
                            >
                                {"Get Ready - " + root.countdownRemaining }
                            </div>
                        );
                        break;
                    
                    default:
                        message=undefined;

                }
                break;

            case eRunState.running: 
                switch(root.activityState){
                    case eActivityState.flashing:
                        message = (
                            <div
                                className="membox-overlay-message"
                            >
                                {"Remember The Yellow Squares - " + root.countdownRemaining }
                            </div>
                        );
                        break;
                    case eActivityState.answering:
                        message = (
                            <div
                                className="membox-overlay-message"
                            >
                                {"Tag the squares which were yellow - " + root.countdownRemaining }
                            </div>
                        );
                        break;
                    
                    default:
                        message=undefined;

                }
                break;
            
            default:
                message = undefined;
                
            
        }
        return(
            <div
                className="membox-header"
            >
                {message}
            </div>
        );
    }
}