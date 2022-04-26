import React = require("react");
import { eRunState, eDelayState, eActivityState } from "../enums";
import Test from "./test";


export default class TestHeader extends React.Component<any,any> {


    render() {
        let root: Test = this.props.root;
        let content: any;
        let button: any;
        let message: any;
        switch(root.runState){
            case eRunState.stopped:
                message = (
                    <div
                        className="test-overlay-message"
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
                                className="test-overlay-message"
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
                    case eActivityState.answering:
                        message = (
                            <div
                                className="test-overlay-message"
                            >
                                {root.countdownRemaining >= 0 ? "Click the dot - " + (root.countdownRemaining + 1)  : ""}
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
                className="test-header"
            >
                {message}
            </div>
        );
    }
}