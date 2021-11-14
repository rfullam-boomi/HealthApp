import { FlowComponent, FlowObjectDataArray } from 'flow-component-model';
import * as React from 'react';
import { CSSProperties } from 'react';
import { eActivityState, eDelayState, eRunState } from '../enums';
import { Result, Results } from '../results';
import Dot from './dot';
import './test.css';
import Test from './test';


declare const manywho: any;


export default class CountClicker extends Test {
    
    testMaxCount: number = 0;
    testRemainingCount: number = 0;
    testStartedTime: number;
    testEndedTime: number;
    round: number = 0;
    constructor(props: any) {
        super(props);
        this.testMaxCount = parseInt(this.getAttribute("clickCount","10"));
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
        await this.getClicks(this.testMaxCount);

        // stop counting
        this.testEndedTime = new Date().getTime();

        this.runState=eRunState.stopped;
        this.refreshInfo();
    }

    // accuracy 0 is perfect
    async dotClicked(accuracy: number, time: Date) {
        let score: Result = await this.getScore(this.roundNumber, time.getTime() - this.testStartedTime, accuracy);
        this.results.add(score);
        this.countdownRemaining -= 1;
        this.roundNumber ++;
    }

    async getClicks(maxTime?: number) : Promise<any> {
        this.activityState = eActivityState.answering;
        this.responseDone = false;
        if(maxTime && maxTime > 0) {
            this.countdownRemaining=maxTime;
        }
        else {
            this.countdownRemaining=-1;
        }
        this.refreshInfo();

        while (this.countdownRemaining !== 0){
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
}

manywho.component.register('CountClicker', CountClicker);
