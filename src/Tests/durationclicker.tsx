import './test.css';
import Test from './test';
import { eDotPosition } from '../enums';

declare const manywho: any;

export default class DurationClicker extends Test {
    async startTest(): Promise<void> {
        await super.startTest(-1, parseInt(this.getAttribute("durationSeconds","4")), eDotPosition.center);
    }
}

manywho.component.register('DurationClicker', DurationClicker);
