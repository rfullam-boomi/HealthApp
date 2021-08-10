import React = require("react");
import { eActivityState, eDelayState, eRunState } from "../enums";
import ColourNames from "./ColourNames";



export default class ColourNamesHeader extends React.Component<any,any> {


    render() {
        let root: ColourNames = this.props.root;
        let content: any;
        let button: any;
        let message: any;
        switch(root.runState){
            case eRunState.stopped:
                message = (
                    <div
                        className="colnam-overlay-message"
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
                                className="colnam-overlay-message"
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
                                className="colnam-overlay-message"
                            >
                                {"Answer" + (root.countdownRemaining > 0? " - " + root.countdownRemaining : "")}
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
                className="colnam-header"
            >
                {message}
            </div>
        );
    }
}