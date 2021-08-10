import React = require("react");
import { eRunState, eDelayState, eActivityState } from "../enums";
import DotClicker from "./dotclicker";


export default class DotClickerHeader extends React.Component<any,any> {


    render() {
        let root: DotClicker = this.props.root;
        let content: any;
        let button: any;
        let message: any;
        switch(root.runState){
            case eRunState.stopped:
                message = (
                    <div
                        className="dotclick-overlay-message"
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
                                className="dotclick-overlay-message"
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
                                className="dotclick-overlay-message"
                            >
                                {"Click the dot" + (root.countdownRemaining > 0? " - " + root.countdownRemaining : "")}
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
                className="dotclick-header"
            >
                {message}
            </div>
        );
    }
}