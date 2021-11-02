import { FlowObjectDataArray } from 'flow-component-model';
import * as React from 'react';
import { CSSProperties } from 'react';
import { eActivityState, eDelayState, eRunState } from '../enums';
import { Result, Results } from '../results';
import Dot from './dot';
import './test.css';
import Test from './test';



declare const manywho: any;


export default class MovingDotClicker extends Test {
    
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

        let score: Result = await this.getScore(this.roundNumber, roundEnd-roundStart, this.accuracy);

        this.results.add(score);

        this.runState=eRunState.stopped;
        this.refreshInfo();
    }

    // accuracy 0 is perfect
    async dotClicked(accuracy: number, time: Date) {
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

    async getScore(roundNumber: number, durationMilliseaconds: number, accuracy: number) : Promise<Result> {
        let correct: number = 0;
        let incorrect: number = 0;
    
        this.activityState = eActivityState.results;
        this.refreshInfo();
        return new Result(roundNumber, 0, 0, durationMilliseaconds, accuracy);
    }
}

manywho.component.register('MovingDotClicker', MovingDotClicker);
