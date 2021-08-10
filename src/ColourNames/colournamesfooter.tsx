import React = require("react");
import { eActivityState, eRunState } from "../enums";
import ColourNames from "./ColourNames";


export default class ColourNamesFooter extends React.Component<any,any> {


    render() {
        let root: ColourNames = this.props.root;
        let content: any;
        let button: any;
        let message: any;
        switch(root.runState){
            case eRunState.stopped:
                break;

            case eRunState.starting: 
                button=(
                    <div
                        className="colnam-overlay-button"
                        onClick={root.stopTest}
                    >
                        Cancel Test
                    </div>
                );

            case eRunState.running: 
                switch(root.activityState){
                    case eActivityState.answering:
                        button=([
                            <div
                                className="colnam-overlay-button"
                                onClick={(e: any) => {root.doneAnswering(true)}}
                            >
                                {root.correctLabel}
                            </div>,
                            <div
                                className="colnam-overlay-button"
                                onClick={(e: any) => {root.doneAnswering(false)}}
                            >
                                {root.incorrectLabel}
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
                className="colnam-footer"
            >
                {button}
            </div>
        );
    }
}