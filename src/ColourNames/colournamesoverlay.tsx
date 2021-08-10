import React = require("react");
import { eRunState } from "../enums";
import ColourNames from "./ColourNames";

export default class ColourNamesOverlay extends React.Component<any,any> {


    render() {
        let root: ColourNames = this.props.root;
        let button: any;
        let message: any;
        switch(root.runState){
            case eRunState.stopped:
                button=(
                    <div
                        className="colnam-overlay-button"
                        onClick={root.startTest}
                    >
                        {root.startLabel}
                    </div>
                );  
                message=undefined;
                break;

            case eRunState.starting: 
                /*button=(
                    <div
                        className="colnam-overlay-button"
                        onClick={root.stopTest}
                    >
                        Stop Test
                    </div>
                );*/
                
                break;

            case eRunState.running: 
                /*button=(
                    <div
                        className="colnam-overlay-button"
                        onClick={root.stopTest}
                    >
                        Stop Test
                    </div>
                );*/
                
                break;

            
        }
        return(
            <div
                className="colnam-overlay"
            >
                <div
                    className="colnam-overlay-center"
                >
                    {button}
                </div>
            </div>
        );
    }
}