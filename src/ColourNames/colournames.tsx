import React = require("react");
import { FlowComponent, FlowObjectData, FlowObjectDataArray } from 'flow-component-model';
import './colournames.css';
import { CSSProperties } from "react";
import { eActivityState, eDelayState, eRunState } from "../enums";
import { Result, Results } from "../results";
import ColourNamesHeader from "./colournamesheaders";
import ColourNamesOverlay from "./colournamesoverlay";
import ColourNamesFooter from "./colournamesfooter";
import ColourName from "./colour";

declare const manywho: any;

export default class ColourNames extends FlowComponent {
 
    colourElement: any;
    colour: ColourName;
    previousContent: any;
    header: ColourNamesHeader;
    headerElement: any;
    overlay: ColourNamesOverlay;
    overlayElement: any;
    footer: ColourNamesFooter;
    footerElement: any;
        
    runState: eRunState = eRunState.stopped;
    activityState: eActivityState = eActivityState.none;
    countdownState: eDelayState = eDelayState.none

    numRounds: number = 3;
    roundNumber: number = 0;
    countdownRemaining: number = 0;
    roundStart: number;
    roundEnd: number;
    countdownSeconds: number = 5;
    flashSeconds: number = 3;
    responseSeconds: number; // = 30;
    responseDone: boolean = false;
    response: boolean;

    results: Results = new Results();

    startLabel: string;
    correctLabel: string;
    incorrectLabel: string;

    shouldComponentUpdate(nextprops: any, nextstate: any){
        return true;
    }

    

    constructor(props: any){
        super(props);
        
        this.moveHappened = this.moveHappened.bind(this);
 
        this.startTest = this.startTest.bind(this);
        this.countDown = this.countDown.bind(this);
        this.stopTest = this.stopTest.bind(this);
        this.startRound = this.startRound.bind(this);
        this.doneAnswering = this.doneAnswering.bind(this);
        this.getAnswers = this.getAnswers.bind(this);
        this.getScore = this.getScore.bind(this);

        this.numRounds = parseInt(this.getAttribute("numRounds","3"));
        this.countdownSeconds = parseInt(this.getAttribute("countdownSeconds","4"));
        this.responseSeconds = parseInt(this.getAttribute("responseSeconds","-1"));
        this.startLabel = this.getAttribute("startLabel","Begin");
        this.correctLabel = this.getAttribute("correctLabel","Correct");
        this.incorrectLabel = this.getAttribute("incorrectLabel","Incorrect");
    }

    async componentDidMount(){
        await super.componentDidMount();   
        (manywho as any).eventManager.addDoneListener(this.moveHappened, this.componentId);
        this.headerElement = (
            <ColourNamesHeader 
                root={this}
                ref={(element: ColourNamesHeader) => {this.header=element}}
            />
        );
        this.overlayElement = (
            <ColourNamesOverlay 
                root={this}
                ref={(element: ColourNamesOverlay) => {this.overlay=element}}
            />
        );
        this.footerElement = (
            <ColourNamesFooter 
                root={this}
                ref={(element: ColourNamesFooter) => {this.footer=element}}
            />
        );   
        this.colourElement = (
            <ColourName
                root={this}
                ref={(element: ColourName) => {this.colour=element}}
            />
        );
        this.forceUpdate();     
    }

    async componentWillUnmount(): Promise<void> {
        (manywho as any).eventManager.removeDoneListener(this.componentId);
    }

    moveHappened(xhr: XMLHttpRequest, request: any) {
        if ((xhr as any).invokeType === 'FORWARD') {
            //this.buildFaces();
        }
    }

    refreshInfo() {
        this.overlay.forceUpdate();
        this.header.forceUpdate();
        this.footer.forceUpdate();
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
        // randomise the colour
        this.colour.randomise();

        // start counting
        let roundStart = new Date().getTime();

        // allow time for answers
        await this.getAnswers();

        // stop counting
        let roundEnd = new Date().getTime();

        // clear the colour
        this.colour.clear();

        
        let score: Result = await this.getScore(this.roundNumber, roundEnd-roundStart);
        this.results.add(score);

        this.runState=eRunState.stopped;
        this.refreshInfo();
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

    async doneAnswering(answer: boolean) {
        this.response = answer;
        this.responseDone=true;
    }

    async getScore(roundNumber: number, durationMilliseaconds: number) : Promise<Result> {
        let correct: number = 0;
        let incorrect: number = 0;

        if(this.colour.correct === this.response){
            correct++;
        }
        else {
            incorrect++;
        }
        
        this.activityState = eActivityState.results;
        this.refreshInfo();
        return new Result(roundNumber, correct, incorrect, durationMilliseaconds,0);
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
                className="colnam"
                style={style}
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
                   {this.colourElement}
                </div>
                <div
                    className="colnam-footer"
                >
                   {this.footerElement} 
                </div>
            </div>
        );

    }


}

manywho.component.register('ColourNames', ColourNames);
