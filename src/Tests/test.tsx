import { FlowComponent, FlowMessageBox, FlowObjectDataArray } from 'flow-component-model';
import * as React from 'react';
import { CSSProperties } from 'react';
import { eActivityState, eDelayState, eInactivityState, eRunState } from '../enums';
import { Result, Results } from '../results';
import Dot from './dot';
import OverlayButton from './OverlayButton';
import './test.css';
import TestHeader from './testheader';
import TestOverlay from './testoverlay';


declare const manywho: any;


export default class Test extends FlowComponent {
    
    header: TestHeader;
    headerElement: any;
    overlay: TestOverlay;
    overlayElement: any;
    dot: Dot;
    dotElement: any;

    runState: eRunState = eRunState.stopped;
    activityState: eActivityState = eActivityState.none;
    countdownState: eDelayState = eDelayState.none;
    autoStart: boolean = false;
    numRounds: number = 10;
    roundNumber: number = 0;
    countdownRemaining: number = 0;
    roundStart: number;
    roundEnd: number;
    countdownSeconds: number = 5;
    responseSeconds: number = 30;
    responseDone: boolean = false;
    inactivityTimeoutSeconds: number = 5;
    inactivityRemaining: number = 5;
    inactivityState: eInactivityState = eInactivityState.none;
    inactivityCallback: any;
    inactivityTimer: any;
    displayProgressMessage: string = "";
  
    xPos: number = 0;
    yPos: number = 0;
    

    div: HTMLDivElement;

    previousContent: any;

    results: Results;

    startLabel: string;
    
    accuracy: number;

    buttons: Map<eRunState,any> = new Map();

    messageBox: FlowMessageBox;

    constructor(props: any) {
        super(props);
        this.randomPos = this.randomPos.bind(this);
        this.centerPos = this.centerPos.bind(this);
        this.startTest = this.startTest.bind(this);
        this.dotClicked = this.dotClicked.bind(this);

        this.watchInactivity = this.watchInactivity.bind(this);
        this.unwatchInactivity = this.unwatchInactivity.bind(this);
        this.inactivityPing = this.inactivityPing.bind(this);
    
        this.numRounds = parseInt(this.getAttribute("numRounds","1"));
        this.countdownSeconds = parseInt(this.getAttribute("countdownSeconds","4"));
        this.responseSeconds = parseInt(this.getAttribute("responseSeconds","-1"));
        this.startLabel = this.getAttribute("startLabel","Begin");
        this.autoStart = this.getAttribute("autoStart","false").toLowerCase() === "true";
        this.results = new Results(this.getAttribute("resultTypeName","TestResult"));
        this.displayProgressMessage = this.getAttribute("progressLabel","");
        this.inactivityTimeoutSeconds = parseInt(this.getAttribute("inactivitySeconds","-1"));

        this.buttons.set(
            eRunState.stopped,
            (
                <OverlayButton 
                    label={this.getAttribute("startLabel","Begin")}
                    callback={this.startTest}
                />
            )
        );
        this.buttons.set(
            eRunState.complete,
            (
                <OverlayButton 
                    label={this.getAttribute("submitLabel","Submit")}
                    callback={this.submitTest}
                />
            )
        );

    }

    async componentWillUnmount(): Promise<void> {
        (manywho as any).eventManager.removeDoneListener(this.componentId);
    }

    shouldComponentUpdate(nextprops: any, nextstate: any){
        return true;
    }

    moveHappened(xhr: XMLHttpRequest, request: any) {
        if ((xhr as any).invokeType === 'FORWARD') {
            // this.forceUpdate();
        }
    }

     async componentDidMount(){
        await super.componentDidMount();   
        (manywho as any).eventManager.addDoneListener(this.moveHappened, this.componentId);
        this.headerElement = (
            <TestHeader 
                root={this}
                ref={(element: TestHeader) => {this.header=element}}
            />
        );
        this.overlayElement = (
            <TestOverlay 
                root={this}
                ref={(element: TestOverlay) => {this.overlay=element}}
            />
        );
        this.dotElement = (
            <Dot 
                root={this}
                ref={(element: Dot) => {this.dot=element}}
            />
        );
        if(this.autoStart === true){
            this.startTest();
        }
        else {
            this.forceUpdate();
        }
    }

    refreshInfo() {
        this.overlay?.forceUpdate();
        this.header?.forceUpdate();
        this.dot?.forceUpdate();
    }

    randomPos() {
        if(this.div) {
            let rect: DOMRect = this.div.getBoundingClientRect();
            let xOffset: number = Math.floor((Math.random() * 80)+ 10);
            let yOffset: number = Math.floor((Math.random() * 80)+ 10);

            this.xPos = ( ((rect.width / 100) * xOffset)); //- 120; //(this.dotElement.width / 2) ;
            this.yPos = ( ((rect.height / 100) * yOffset)); //- 120; //(this.dotElement.height / 2);

            let outerPxWidth: number = this.convertRemToPixels(15);
            this.xPos = this.xPos - (outerPxWidth / 2)
            this.yPos = this.yPos - (outerPxWidth / 2)

            //this.xPos -= 120;
            //this.yPos -= 120;
        }
    }

    centerPos() {
        if(this.div) {
            let rect: DOMRect = this.div.getBoundingClientRect();
            let left: number = (rect.width / 2);
            let top: number = (rect.height / 2);
            let outerPxWidth: number = this.convertRemToPixels(15);
            this.xPos = left - (outerPxWidth / 2)
            this.yPos = top - (outerPxWidth / 2)
        }
    }

    convertRemToPixels(rem: number) : number {    
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    async startTest() {
        this.forceUpdate();
        this.results.clear();
        this.runState = eRunState.starting;
        this.roundNumber = 0;
        while(this.roundNumber < this.numRounds) {
            this.roundNumber++;
            await this.startRound();
        }
        // test complete
        //if no results make a single fail one
        if(this.results.items.size === 0) {
            this.results.add(Result.newInstance(1, 0, 0, 0, 0,"",""));
        }
        let results: FlowObjectDataArray = this.results.makeFlowObjectData();
        console.log(JSON.stringify(results));
        this.setStateValue(results);
        if(this.outcomes["OnComplete"]) {
            await this.triggerOutcome("OnComplete");
        }
    }

    async submitTest() {
        if(this.outcomes[this.getAttribute("submitOutcome", "OnSubmit")]) {
            await this.triggerOutcome(this.getAttribute("submitOutcome", "OnSubmit"));
        }
    }

    async sleep(milliseconds: number) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    async countDown(numSeconds : number) : Promise<any>{
        let localThis = this;
        this.countdownRemaining = numSeconds;
        this.countdownState = eDelayState.countdown;
        this.refreshInfo();

        return new Promise(async function (resolve,reject) {
            while(localThis.countdownRemaining > 1) {
                localThis.countdownRemaining-=1;
                localThis.refreshInfo();
                await localThis.sleep(1000);
            }
            localThis.countdownState = eDelayState.none;
            localThis.refreshInfo();
            resolve(undefined);
        });
    }

    watchInactivity(numSeconds : number, callBack: any) {
        this.inactivityRemaining = numSeconds;
        this.inactivityState = eInactivityState.watching;
        this.inactivityCallback = callBack;
        this.inactivityTimer = setTimeout(this.inactivityPing,1000);
    }

    unwatchInactivity() {
        if(this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
            this.inactivityTimer = undefined;
        }
        this.inactivityRemaining = -1;
        this.inactivityState = eInactivityState.none;
        this.inactivityCallback = undefined;
    }

    inactivityPing() {
        if(this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
            this.inactivityTimer = undefined;
        }
        if(this.inactivityRemaining > 0 && this.inactivityState === eInactivityState.watching) {
                this.inactivityRemaining-=1;
                this.inactivityTimer = setTimeout(this.inactivityPing,1000);
        }
        else {
            if(this.inactivityState === eInactivityState.watching) {
                this.inactivityState = eInactivityState.none;
                if(this.inactivityCallback) {
                    this.inactivityCallback();
                }
            }
        }
    }

    stopTest() {
        this.countdownState = eDelayState.none;
        this.activityState = eActivityState.none;
        this.runState = eRunState.stopped;
        if(this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
            this.inactivityTimer = undefined;
        }
        this.refreshInfo();
    }

    async startRound() {
 
    }

    // accuracy 0 is perfect
    async dotClicked(accuracy: number, time: Date) {
        this.accuracy = accuracy;
        this.responseDone=true;
    }

    async getAnswers(maxTime?: number) : Promise<any> {
        return true;
    }

    async getScore(roundNumber: number, time: number, accuracy: number) : Promise<Result> {
        return null;
    }

    
    render() {
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


        return (
            <div
                className="test"
                style={style}
                ref={(e: HTMLDivElement) => {this.div=e}}
            >
                <FlowMessageBox 
                    ref={(element: FlowMessageBox) => {this.messageBox=element}}
                />
                {this.overlayElement}
                <div
                    className="test-title"
                >
                   {this.headerElement} 
                </div>
                <div
                    className="test-body"
                >
                   {this.dotElement}
                </div>                
            </div>
        );
    }
}

