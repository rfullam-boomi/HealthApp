import React = require("react");
import { eActivityState } from "../enums";
import MovingDotClicker from "./movingdotclicker";
import Test from "./test";

export default class Dot extends React.Component<any,any> {

    outer: HTMLDivElement;

    constructor(props: any) {
        super(props);
        this.clicked = this.clicked.bind(this);
    }

    clicked(e: any) {
        e.preventDefault();
        e.stopPropagation();
        let rect: DOMRect = this.outer.getBoundingClientRect();
        let xCentre: number = rect.x + (rect.width / 2);
        let yCentre: number = rect.y + (rect.height / 2);
        let xAcc: number = e.clientX - xCentre;
        let yAcc: number = e.clientY - yCentre;
        let avg: number = (xAcc + yAcc) / 2;
        let root: Test = this.props.root;

        root.dotClicked(avg, new Date());
    }

    render() {
        let root: Test = this.props.root;
        let style: React.CSSProperties = {};
        if(root.activityState === eActivityState.answering) {
            // root knows where center of box id
            if(root instanceof MovingDotClicker) {
                //root.randomPos();
            }
            else {
                root.centerPos();
            }
            //let outerPxWidth: number = root.convertRemToPixels(15);
            //let left: number = root.xPos - (outerPxWidth / 2)
            //let top: number = root.yPos - (outerPxWidth / 2)
            style.display="flex";
            style.left=root.xPos; //left; //root.xPos - (7.5rem);
            style.top=root.yPos; //top;
        }
        else {
            style.display="none";
        }
        
        //onTouchStart={this.clicked}
        return(
            <div
                className="test-dotout"
                onClick={this.clicked}
                onTouchStart={this.clicked}
                onTouchEnd={e => e.preventDefault()}
                style={style}
                ref={(element: HTMLDivElement ) => {this.outer = element}}
            >
                <div
                    className="test-dot"
                />
            </div>
            
        );
    }
}