import { FlowComponent, FlowObjectDataArray } from 'flow-component-model';
import * as React from 'react';
import { CSSProperties } from 'react';
import { eActivityState, eDelayState, eRunState } from '../enums';
import { Result, Results } from '../results';
import Dot from './dot';
import './dotclicker.css';
import DotClickerHeader from './dotclickerheader';
import DotClickerOverlay from './dotclickeroverlay';


declare const manywho: any;


export default class DotClicker extends FlowComponent {
    
    header: DotClickerHeader;
    headerElement: any;
    overlay: DotClickerOverlay;
    overlayElement: any;
    dot: Dot;
    dotElement: any;

    runState: eRunState = eRunState.stopped;
    activityState: eActivityState = eActivityState.none;
    countdownState: eDelayState = eDelayState.none;

    numRounds: number = 10;
    roundNumber: number = 0;
    countdownRemaining: number = 0;
    roundStart: number;
    roundEnd: number;
    countdownSeconds: number = 5;
    responseSeconds: number = 30;
    responseDone: boolean = false;
  
    xPos: number = 0;
    yPos: number = 0;
    

    div: HTMLDivElement;

    previousContent: any;

    results: Results = new Results();

    startLabel: string;
    
    accuracy: number;

    constructor(props: any) {
        super(props);
        this.randomPos = this.randomPos.bind(this);
        this.startTest = this.startTest.bind(this);
        this.dotClicked = this.dotClicked.bind(this);
    
        this.numRounds = parseInt(this.getAttribute("numRounds","3"));
        this.countdownSeconds = parseInt(this.getAttribute("countdownSeconds","4"));
        this.responseSeconds = parseInt(this.getAttribute("responseSeconds","-1"));
        this.startLabel = this.getAttribute("startLabel","Begin");

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
            <DotClickerHeader 
                root={this}
                ref={(element: DotClickerHeader) => {this.header=element}}
            />
        );
        this.overlayElement = (
            <DotClickerOverlay 
                root={this}
                ref={(element: DotClickerOverlay) => {this.overlay=element}}
            />
        );
        this.dotElement = (
            <Dot 
                root={this}
                ref={(element: Dot) => {this.dot=element}}
            />
        );
        this.forceUpdate();
    }

    refreshInfo() {
        this.overlay.forceUpdate();
        this.header.forceUpdate();
        this.dot.forceUpdate();
    }

    randomPos() {
        if(this.div) {
            let rect: DOMRect = this.div.getBoundingClientRect();
            let xOffset: number = Math.floor((Math.random() * 80)+ 10);
            let yOffset: number = Math.floor((Math.random() * 80)+ 10);

            this.xPos = ( ((rect.width / 100) * xOffset)); //- 120; //(this.dotElement.width / 2) ;
            this.yPos = ( ((rect.height / 100) * yOffset)); //- 120; //(this.dotElement.height / 2);

            this.xPos -= 120;
            this.yPos -= 120;
        }
    }

    async startTest() {
        this.results.clear();
        this.runState = eRunState.starting;
        this.roundNumber = 0;
        while(this.roundNumber < this.numRounds) {
            this.roundNumber++;
            await this.startRound();
        }
        // test complete
        let results: FlowObjectDataArray = this.results.makeFlowObjectData();
        console.log(JSON.stringify(results));
        this.setStateValue(results);
        if(this.outcomes["OnComplete"]) {
            await this.triggerOutcome("OnComplete");
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


    stopTest() {
        this.countdownState = eDelayState.none;
        this.activityState = eActivityState.none;
        this.runState = eRunState.stopped;
        this.refreshInfo();
    }

    async startRound() {
        
        this.countdownState = eDelayState.none;
        this.activityState = eActivityState.none;
        this.runState = eRunState.starting;

        this.refreshInfo();
        await this.countDown(this.countdownSeconds);

        this.runState = eRunState.running;
        this.refreshInfo();
        // randomise the hot boxes
        this.randomPos();

        // start counting
        let roundStart = new Date().getTime();

        // allow time for answers
        await this.getAnswers(this.responseSeconds);

        // stop counting
        let roundEnd = new Date().getTime();

        let score: Result = await this.getScore(this.roundNumber, roundEnd-roundStart);

        this.results.add(score);

        this.runState=eRunState.stopped;
        this.refreshInfo();
    }

    // accuracy 0 is perfect
    dotClicked(accuracy: number) {
        this.accuracy = accuracy;
        this.responseDone=true;
    }

    async getAnswers(maxTime?: number) : Promise<any> {
        this.activityState = eActivityState.answering;
        this.responseDone = false;
        if(maxTime && maxTime > 0) {
            this.countdownRemaining=maxTime;
        }
        else {
            this.countdownRemaining=-1;
        }
        this.refreshInfo();

        while (this.responseDone === false && this.countdownRemaining !== 0){
            if(this.countdownRemaining > 0) {
                this.countdownRemaining--;
            }
            this.refreshInfo();
            await this.sleep(1000);
        }
        //await this.countDown(numSeconds);
        this.activityState = eActivityState.none;
        this.refreshInfo();
        return;
    }

    async getScore(roundNumber: number, durationMilliseaconds: number) : Promise<Result> {
        let correct: number = 0;
        let incorrect: number = 0;
    
        this.activityState = eActivityState.results;
        this.refreshInfo();
        return new Result(roundNumber, this.accuracy, 0, durationMilliseaconds);
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
                className="dotclick"
                style={style}
                ref={(e: HTMLDivElement) => {this.div=e}}
            >
                {this.overlayElement}
                <div
                    className="colnam-title"
                >
                   {this.headerElement} 
                </div>
                <div
                    className="colnam-body"
                >
                   {this.dotElement}
                </div>                
            </div>
        );
    }
}

manywho.component.register('DotClicker', DotClicker);
