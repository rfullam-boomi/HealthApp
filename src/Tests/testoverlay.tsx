import React = require("react");
import { eRunState } from "../enums";
import Test from "./test";


export default class TestOverlay extends React.Component<any,any> {


    render() {
        let root: Test = this.props.root;
        let button: any;
        let message: any;
        switch(root.runState){
            case eRunState.stopped:
                if(root.autoStart === false) {
                    button=root.buttons.get(eRunState.stopped);
                    /*
                    (
                        <div
                            className="test-overlay-button"
                            onClick={root.startTest}
                        >
                            Begin Test
                        </div>
                    );  
                    */
                }
                message=undefined;
                break;
            case eRunState.complete:
                if(!root.outcomes["OnComplete"]) {
                    button=root.buttons.get(eRunState.complete);
                    /*
                    (
                        <div
                            className="test-overlay-button"
                            onClick={root.startTest}
                        >
                            Begin Test
                        </div>
                    );  
                    */
                }
                message=undefined;
                break;

            case eRunState.starting: 
                button=root.buttons.get(eRunState.starting);
                /*button=(
                    <div
                        className="test-overlay-button"
                        onClick={root.stopTest}
                    >
                        Stop Test
                    </div>
                );*/
                
                break;

            case eRunState.running: 
                button=root.buttons.get(eRunState.running);
                /*button=(
                    <div
                        className="test-overlay-button"
                        onClick={root.stopTest}
                    >
                        Stop Test
                    </div>
                );*/
                
                break;

            
        }
        return(
            <div
                className="test-overlay"
            >
                <div
                    className="test-overlay-center"
                >
                    {button}
                </div>
            </div>
        );
    }
}