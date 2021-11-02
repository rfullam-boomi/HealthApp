import { FlowComponent, FlowObjectDataArray } from 'flow-component-model';
import * as React from 'react';
import { CSSProperties } from 'react';
import { eActivityState, eDelayState, eRunState } from '../enums';
import { Result, Results } from '../results';
import Dot from './dot';
import './test.css';
import Test from './test';


declare const manywho: any;


export default class DurationClicker extends Test {
    
    testDurationSeconds: number = 0;
    remainingDurationSeconds: number = 0;
    testStartedTime: number;
    testEndedTime: number;
    clickCounter: number = 0;
    constructor(props: any) {
        super(props);
        this.testDurationSeconds = parseInt(this.getAttribute("durationSeconds","4"));
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
        // allow time for answers
        await this.getClicks(this.testDurationSeconds);

        // stop counting
        this.testEndedTime = new Date().getTime();

        this.runState=eRunState.stopped;
        this.refreshInfo();
    }

    // accuracy 0 is perfect
    async dotClicked(accuracy: number, time: Date) {
        console.log("Dot");
        this.clickCounter += 1;
        let score: Result = await this.getScore(this.clickCounter, time.getTime() - this.testStartedTime, accuracy);
        this.results.add(score);
    }

    async getClicks(maxTime?: number) : Promise<any> {
        this.activityState = eActivityState.answering;
        this.responseDone = false;
        if(maxTime && maxTime > 0) {
            this.remainingDurationSeconds=maxTime;
        }
        else {
            this.remainingDurationSeconds=-1;
        }
        this.refreshInfo();

        while (this.remainingDurationSeconds !== 0){
            if(this.remainingDurationSeconds > 0) {
                this.remainingDurationSeconds-=1;
                this.countdownRemaining = this.remainingDurationSeconds;
            }
            this.refreshInfo();
            await this.sleep(1000);
        }
        //await this.countDown(numSeconds);
        this.activityState = eActivityState.none;
        this.refreshInfo();
        return;
    }

    async getScore(roundNumber: number, time: number, accuracy: number) : Promise<Result> {
        let correct: number = 0;
        let incorrect: number = 0;
        return new Result(roundNumber, 0, 0, time, accuracy);
    }
}

manywho.component.register('DurationClicker', DurationClicker);
