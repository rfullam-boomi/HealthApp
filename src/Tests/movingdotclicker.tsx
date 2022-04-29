import './test.css';
import Test from './test';
import { eDotPosition } from '../enums';

declare const manywho: any;

export default class MovingDotClicker extends Test {
    async startTest(): Promise<void> {
        await super.startTest(this.numRounds, -1, eDotPosition.random9);
    }
}

manywho.component.register('MovingDotClicker', MovingDotClicker);
