import React = require("react");
import { eRunState } from "../enums";
import MemoryBoxes from "./memoryboxes";


export default class MemoryBoxOverlay extends React.Component<any,any> {


    render() {
        let root: MemoryBoxes = this.props.root;
        let button: any;
        let message: any;
        switch(root.runState){
            case eRunState.stopped:
                button=(
                    <div
                        className="membox-overlay-button"
                        onClick={root.startTest}
                    >
                        Begin Game
                    </div>
                );  
                message=undefined;
                break;

            case eRunState.starting: 
                /*button=(
                    <div
                        className="membox-overlay-button"
                        onClick={root.stopTest}
                    >
                        Stop Test
                    </div>
                );*/
                
                break;

            case eRunState.running: 
                /*button=(
                    <div
                        className="membox-overlay-button"
                        onClick={root.stopTest}
                    >
                        Stop Test
                    </div>
                );*/
                
                break;

            
        }
        return(
            <div
                className="membox-overlay"
            >
                <div
                    className="membox-overlay-center"
                >
                    {button}
                </div>
            </div>
        );
    }
}