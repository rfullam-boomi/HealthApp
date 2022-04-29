import * as React from 'react';
import './test.css';
import Test from './test';
import OverlayButton from './OverlayButton';
import { eDotPosition, eRunState } from '../enums';


declare const manywho: any;


export default class CountClicker extends Test {

    constructor(props: any) {
        super(props);
        
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

    async startTest(): Promise<void> {
        await super.startTest(parseInt(this.getAttribute("clickLimit","15")), -1, eDotPosition.center);
    }
}

manywho.component.register('CountClicker', CountClicker);
