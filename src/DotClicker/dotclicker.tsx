import { FlowComponent } from 'flow-component-model';
import * as React from 'react';
import { CSSProperties } from 'react';
import './dotclicker.css';


declare const manywho: any;


export default class DotClicker extends FlowComponent {
    
    running: boolean = false;
    xPos: number = 0;
    yPos: number = 0;
    timeout: number = -1;
    startTime: Date;
    endTime: Date;

    div: HTMLDivElement;

    constructor(props: any) {
        super(props);
        this.randomPos = this.randomPos.bind(this);
        this.start = this.start.bind(this);
        this.started = this.started.bind(this);
        this.clicked = this.clicked.bind(this);
        this.failed = this.failed.bind(this);
    }

    async componentWillUnmount(): Promise<void> {
        (manywho as any).eventManager.removeDoneListener(this.componentId);
    }

    moveHappened(xhr: XMLHttpRequest, request: any) {
        if ((xhr as any).invokeType === 'FORWARD') {
            // this.forceUpdate();
        }
    }

    

    async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        (manywho as any).eventManager.addDoneListener(this.moveHappened, this.componentId);

        this.start();
    }

    randomPos() {
        if(this.div) {
            let xOffset: number = Math.floor(Math.random() * (95 - 5 + 1) + 5);
            let yOffset: number = Math.floor(Math.random() * (95 - 5 + 1) + 5);

            this.xPos = (this.div.clientWidth / 100) * xOffset;
            this.yPos = (this.div.clientHeight / 100) * yOffset;

            //console.log(this.xPos + " = " + this.yPos);
            this.running=true;
            this.forceUpdate();
            this.timeout = window.setTimeout(this.failed,3000);
        }
    }

    //set random interval
    start() {
        this.running=false;
        window.setTimeout(this.started, Math.floor(Math.random() * (3000 - 1000 + 1) + 1000));
        this.forceUpdate();
    }

    started() {
        // log time
        this.randomPos();
    }

    clicked(e : any) {
        // log time
        this.endTime = new Date();
        window.clearTimeout(this.timeout);

        console.log(this.endTime.getTime() - this.startTime.getTime());
        this.start();
    }

    failed(e : any) {
        // log time
        window.clearTimeout(this.timeout);
        this.start();
        console.log("failed");
    }

    
    render() {
        this.startTime = new Date();
        const style: CSSProperties = {};
        style.width = '-webkit-fill-available';
        style.height = '-webkit-fill-available';

        if (this.model.visible === false) {
            style.display = 'none';
        }
        if (this.model.width) {
            style.width = this.model.width + 'px';
        }
        if (this.model.height) {
            style.height = this.model.height + 'px';
        }

        let dotStyle: CSSProperties = {};
        dotStyle.display = this.running===true? "block" : "none";
        dotStyle.left = this.xPos;
        dotStyle.top = this.yPos;

        return (
            <div
                className="rt"
                style={style}
                ref={(e: HTMLDivElement) => {this.div=e}}
            >
                <div
                    style={dotStyle}
                    className="rt-dot"
                    onClick={this.clicked}
                    onTouchStart={this.clicked}
                >

                </div>
            </div>
        );
    }
}

manywho.component.register('DotClicker', DotClicker);
