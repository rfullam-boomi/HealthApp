import React = require("react");
import { eActivityState } from "../enums";
import DotClicker from "./movingdotclicker";

export default class Dot extends React.Component<any,any> {

    outer: HTMLDivElement;

    constructor(props: any) {
        super(props);
        this.clicked = this.clicked.bind(this);
    }

    clicked(e: any) {
        let rect: DOMRect = this.outer.getBoundingClientRect();
        let xCentre: number = rect.x + (rect.width / 2);
        let yCentre: number = rect.y + (rect.height / 2);
        let xAcc: number = e.clientX - xCentre;
        let yAcc: number = e.clientY - yCentre;
        let avg: number = (xAcc + yAcc) / 2;
        let root: DotClicker = this.props.root;

        root.dotClicked(avg);
    }

    render() {
        let root: DotClicker = this.props.root;
        let style: React.CSSProperties = {};
        if(root.activityState === eActivityState.answering) {
            style.display="flex";
            style.left=root.xPos;
            style.top=root.yPos;
        }
        else {
            style.display="none";
        }
        
        return(
            <div
                className="dotclick-dotout"
                onClick={this.clicked}
                onTouchStart={this.clicked}
                style={style}
                ref={(element: HTMLDivElement ) => {this.outer = element}}
            >
                <div
                    className="dotclick-dot"
                />
            </div>
            
        );
    }
}