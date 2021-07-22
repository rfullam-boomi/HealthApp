import React = require("react");
import MemoryBoxes, { eRunState } from "./memoryboxes";


export default class MemoryBoxHeader extends React.Component<any,any> {


    render() {
        let root: MemoryBoxes = this.props.root;
        let content: any;
        switch(root.status){
            case eRunState.stopped:
                content=(
                    <div
                        className="membox-header-button"
                        onClick={root.startTest}
                    >
                        Start
                    </div>
                );  
                break;

            case eRunState.starting: 
                content=(
                    <div
                        className="membox-header-button"
                        onClick={root.stopTest}
                    >
                        {"Cancel " + root.countdown}
                    </div>
                );  
                break;

            case eRunState.stopped: 
                content=(
                    <div
                        className="membox-header-button"
                        onClick={root.stopTest}
                    >
                        {"Stop Test" + root.iteration + "/" + root.iterations}
                    </div>
                );  
                break;

            
            
            case eRunState.canceled:
                content=(
                    <div
                        className="membox-header-button"
                        onClick={root.startTest}
                    >
                        Restart Test
                    </div>
                );  
                break;

            case eRunState.complete:
                content=(
                    <div
                        className="membox-header-button"
                        onClick={root.startTest}
                    >
                        Restart Test
                    </div>
                );  
                break;
        }
        return(
            <div
                className="membox-header"
            >
                {content}
            </div>
        );
    }
}