import React = require("react");
import { eRunState } from "../enums";
import DotClicker from "./movingdotclicker";


export default class DotClickerOverlay extends React.Component<any,any> {


    render() {
        let root: DotClicker = this.props.root;
        let button: any;
        let message: any;
        switch(root.runState){
            case eRunState.stopped:
                button=(
                    <div
                        className="dotclick-overlay-button"
                        onClick={root.startTest}
                    >
                        Begin Test
                    </div>
                );  
                message=undefined;
                break;

            case eRunState.starting: 
                /*button=(
                    <div
                        className="dotclick-overlay-button"
                        onClick={root.stopTest}
                    >
                        Stop Test
                    </div>
                );*/
                
                break;

            case eRunState.running: 
                /*button=(
                    <div
                        className="dotclick-overlay-button"
                        onClick={root.stopTest}
                    >
                        Stop Test
                    </div>
                );*/
                
                break;

            
        }
        return(
            <div
                className="dotclick-overlay"
            >
                <div
                    className="dotclick-overlay-center"
                >
                    {button}
                </div>
            </div>
        );
    }
}