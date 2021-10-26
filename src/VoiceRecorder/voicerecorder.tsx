import { FlowComponent } from "flow-component-model";
import { CSSProperties } from "react";
import React = require("react");
import './voicerecorder.css';

declare const manywho: any;

export default class VoiceRecorder extends FlowComponent {
    
    recorder: HTMLInputElement;
    constructor(props: any){
        super(props);
        this.moveHappened = this.moveHappened.bind(this);
    }

    async componentDidMount(){
        await super.componentDidMount();   
        (manywho as any).eventManager.addDoneListener(this.moveHappened, this.componentId);
    }

    async componentWillUnmount(): Promise<void> {
        (manywho as any).eventManager.removeDoneListener(this.componentId);
    }

    moveHappened(xhr: XMLHttpRequest, request: any) {
        if ((xhr as any).invokeType === 'FORWARD') {

        }
    }

    voiceRecorded(e: any) {

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

        return(
            <div
                className="voice"
                style={style}
            >
                <input 
                    type="file"
                    accept="audio/*"
                    capture
                    ref={(element: HTMLInputElement) => {this.recorder=element}}
                    onChange={this.voiceRecorded}
                    style={{display: "none"}}
                />
                Hello
            </div>
        );
    }
}

manywho.component.register('VoiceRecorder', VoiceRecorder);