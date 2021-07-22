import React = require("react");
import { FlowComponent } from 'flow-component-model';
import './memoryboxes.css';
import MemoryBox from './memorybox';
import { CSSProperties } from "react";
import MemoryBoxHeader from "./memoryboxheaders";
import MemoryBoxOverlay from "./memoryboxoverlay";


declare const manywho: any;

export enum eRunState {
    stopped,
    starting,
    flashing,
    answering,
    canceled,
    complete
}

export default class MemoryBoxes extends FlowComponent {
    
    boxes: Map<number,MemoryBox>;
    hotBoxes: Array<number> = [];
    boxRows: Array<any>;
    previousContent: any;
    header: MemoryBoxHeader;
    headerElement: any;
    overlay: MemoryBoxOverlay;
    overlayElement: any;
    status: eRunState = eRunState.stopped;

    iterations: number = 10;
    iteration: number = 0;
    countdown: number = 0;
    flashSeconds: number = 3;
    responseSeconds: number = 5;

    setBox(key: number, face: MemoryBox){
        if(face) {
            this.boxes.set(key,face);
        }
        else {
            if(this.boxes.has(key)){
                this.boxes.delete(key);
            }
        }

    }

    shouldComponentUpdate(nextprops: any, nextstate: any){
        return true;
    }

    

    constructor(props: any){
        super(props);
        
        this.moveHappened = this.moveHappened.bind(this);
        this.buildBoxes = this.buildBoxes.bind(this);

        this.startTest = this.startTest.bind(this);
        this.countDown = this.countDown.bind(this);
        this.stopTest = this.stopTest.bind(this);
        this.runIteration = this.runIteration.bind(this);
    

        this.randomizeBoxes = this.randomizeBoxes.bind(this);
        this.showHot = this.showHot.bind(this);
        this.hideHot = this.hideHot.bind(this);
    }

    async componentDidMount(){
        await super.componentDidMount();   
        (manywho as any).eventManager.addDoneListener(this.moveHappened, this.componentId);
        this.headerElement = (
            <MemoryBoxHeader 
                root={this}
                ref={(element: MemoryBoxHeader) => {this.header=element}}
            />
        );
        this.overlayElement = (
            <MemoryBoxOverlay 
                root={this}
                ref={(element: MemoryBoxOverlay) => {this.overlay=element}}
            />
        );
        this.buildBoxes();
        
    }

    async componentWillUnmount(): Promise<void> {
        (manywho as any).eventManager.removeDoneListener(this.componentId);
    }

    moveHappened(xhr: XMLHttpRequest, request: any) {
        if ((xhr as any).invokeType === 'FORWARD') {
            //this.buildFaces();
        }
    }
   
    buildBoxes() {
        this.boxes = new Map();
        this.boxRows = [];
        this.hotBoxes = [];
        for(let row = 1 ; row <= 3 ; row ++) {
            let colElements: Array<any> = [];
            for(let col = 1 ; col <= 3 ; col ++) {
                colElements.push(
                    <MemoryBox
                        key={parseInt(row+""+col)}
                        box={parseInt(row+""+col)}
                        root={this}
                        ref={(element: MemoryBox) => {this.setBox(parseInt(row+""+col),element)}}
                    />
                );
            }
            this.boxRows.push(
                <div
                    className="membox-row"
                >
                    {colElements}
                </div>
            );
        }
        this.forceUpdate();
    }

    startTest() {
        this.status = eRunState.starting;
        this.iteration = 0;
        this.countdown = 5;
        this.countDown();
    }

    countDown() {
        this.status = eRunState.starting;
        if(this.countdown > 0){
            this.countdown-=1;
            this.overlay.forceUpdate();
            setTimeout(this.countDown,1000);
        }
        else {
            //this.status = eRunState.running;
            //this.overlay.forceUpdate();
            this.runIteration();
        }
    }

    stopTest() {
        this.status = eRunState.canceled;
        this.iteration = 0;
        this.header.forceUpdate();
    }

    runIteration() {
        // randomise the hot boxes
        this.randomizeBoxes();
        //make the boxes refresh to show their hot status
        
        //set a timeout to then hide the hot statuses
        setTimeout((this.hideHot), this.flashSeconds * 1000);
        /*
        if(this.status === eRunState.running && this.iteration <= this.iterations){
            this.iteration += 1;
            this.header.forceUpdate();
            this.randomizeBoxes();
        }
        else {
            this.status = eRunState.complete;
            this.iteration = 0;
            this.header.forceUpdate();
        }
        */
    }

    randomizeBoxes() {
        //get 3 randoms between 0 & 8
        this.hotBoxes=[];
        this.hotBoxes.push(12);
        this.hotBoxes.push(23);
        this.hotBoxes.push(31);
        
    }

    showHot() {
        this.boxes.forEach((box: MemoryBox) => {
            box.forceUpdate();
        });
        this.status = eRunState.flashing;
        this.overlay.forceUpdate();
    }

    hideHot() {
        this.boxes.forEach((box: MemoryBox) => {
            box.forceUpdate();
        });
        this.status = eRunState.answering;
        this.overlay.forceUpdate();
    }


    render() {
        const style: CSSProperties = {};
        style.width = '-webkit-fill-available';
        style.height = '-webkit-fill-available';

        if (this.model.visible === false) {
            style.display = 'none';
        }
        if (this.model.width) {
            //.width = this.model.width + 'px';
            //style.height = style.width;
        }
        if (this.model.height) {
            //style.height = this.model.height + 'px';
            //style.width = style.height;
        }

        return (
            <div 
                key="mbxs"
                className="membox"
                style={style}
                onClick={this.randomizeBoxes}
            >
                <div
                    className="membox-title"
                >
                   {this.headerElement} 
                </div>
                <div
                    className="membox-body"
                >
                   {this.boxRows}
                   {this.overlayElement}
                </div>
                
            </div>
        );

    }


}

manywho.component.register('MemoryBoxes', MemoryBoxes);