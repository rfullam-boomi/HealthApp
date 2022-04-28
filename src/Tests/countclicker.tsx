import { FlowComponent, FlowObjectDataArray, modalDialogButton } from 'flow-component-model';
import * as React from 'react';
import { CSSProperties } from 'react';
import { eActivityState, eDelayState, eInactivityState, eRunState } from '../enums';
import { Result, Results } from '../results';
import Dot from './dot';
import './test.css';
import Test from './test';
import OverlayButton from './OverlayButton';


declare const manywho: any;


export default class CountClicker extends Test {
    
    testTargetCount: number = 0;
    testMaxCount: number = 0;
    testRemainingCount: number = 0;
    testStartedTime: number;
    testEndedTime: number;
    round: number = 0;
    submitted: boolean = false;


    constructor(props: any) {
        super(props);
        this.testTargetCount = parseInt(this.getAttribute("clickCount","10"));
        this.testMaxCount = parseInt(this.getAttribute("clickLimit","15"));

        this.submit = this.submit.bind(this);
        this.cancelTest = this.cancelTest.bind(this);
        this.ignoreTimeout = this.ignoreTimeout.bind(this);

        this.buttons.set(
            eRunState.running,
            (
                <OverlayButton 
                    label={this.getAttribute("submitLabel","All Done")}
                    callback={this.submit}
                />
            )
        );

        
    }

   
    async startRound() {
        
        this.countdownState = eDelayState.none;
        this.activityState = eActivityState.none;
        this.runState = eRunState.starting;
        this.centerPos();

        this.refreshInfo();
        await this.countDown(this.countdownSeconds);

        this.runState = eRunState.running;
        this.refreshInfo();
        
       
         // start counting
        this.testStartedTime = new Date().getTime();

        this.roundNumber = 1;
        // allow time for answers
        if(this.inactivityTimeoutSeconds>0) {
            this.watchInactivity(this.inactivityTimeoutSeconds, this.inactiveTimeout)
        }
        
        await this.getClicks(this.testMaxCount);

        this.unwatchInactivity;
        
        // stop counting
        this.testEndedTime = new Date().getTime();

        this.runState=eRunState.stopped;
        this.refreshInfo();
    }

    inactiveTimeout() {
        console.log("inactive !!!");
        this.messageBox.showMessageBox(
            "Inactivity",
            "No activity detected",
            [
                new modalDialogButton(this.getAttribute("timeoutContinueLabel","Continue"),this.ignoreTimeout), 
                new modalDialogButton(this.getAttribute("timeoutAbortLabel","Exit"),this.cancelTest)
            ]
        );
    }

    ignoreTimeout() {
        this.messageBox.hideMessageBox();
        if(this.inactivityTimeoutSeconds>0) {
            this.watchInactivity(this.inactivityTimeoutSeconds, this.inactiveTimeout)
        }
    }

    cancelTest() {
        this.unwatchInactivity();
        this.submitted=true; 
        this.messageBox.hideMessageBox();
    }

    // accuracy 0 is perfect
    async dotClicked(accuracy: number, time: Date) {
        this.unwatchInactivity();
        let score: Result = await this.getScore(this.roundNumber, time.getTime() - this.testStartedTime, accuracy);
        this.results.add(score);
        this.countdownRemaining -= 1;
        this.roundNumber ++;
        if(this.inactivityTimeoutSeconds>0) {
            this.watchInactivity(this.inactivityTimeoutSeconds, this.inactiveTimeout);
        }
    }

    async getClicks(maxClicks?: number) : Promise<any> {
        this.activityState = eActivityState.answering;
        this.responseDone = false;
        if(maxClicks && maxClicks > 0) {
            this.countdownRemaining=maxClicks;
        }
        else {
            this.countdownRemaining=-1;
        }
        this.refreshInfo();

        while (this.countdownRemaining !== 0 && this.submitted===false){
            this.refreshInfo();
            await this.sleep(100);
        }
        //await this.countDown(numSeconds);
        this.activityState = eActivityState.none;
        this.refreshInfo();
        return;
    }

    async getScore(roundNumber: number, time: number, accuracy: number) : Promise<Result> {
        let correct: number = 0;
        let incorrect: number = 0;
        return Result.newInstance(roundNumber, 0, 0, time, accuracy,"","");
    }

    submit() {
        this.unwatchInactivity();
        console.log("complete pressed");
        this.submitted=true;
    }
}

manywho.component.register('CountClicker', CountClicker);
