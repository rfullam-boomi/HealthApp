import { FlowComponent, FlowField, FlowObjectDataArray, FlowOutcome } from "flow-component-model";
import { CSSProperties } from "react";
import React = require("react");
import './voicerecorder.css';
import AudioGraph from "./voicegraph";
import { Result, Results } from "../results";

declare const manywho: any;

export default class VoiceRecorder extends FlowComponent {
    
    recorder: HTMLInputElement;
    mediaRecorder: any;
    results: Results;
    maxDuration: number = 0;
    countDownTimer: number =-1;

    constructor(props: any){
        super(props);
        this.moveHappened = this.moveHappened.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.recording = this.recording.bind(this);
        this.dataAvailable = this.dataAvailable.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
        this.recordingEnded = this.recordingEnded.bind(this);
        this.dataExtracted = this.dataExtracted.bind(this);
        this.done = this.done.bind(this);
        this.timerPing=this.timerPing.bind(this);
        this.state={recording: false, buffer: [], stimulousPrompt: "", instructionText: "", remainingTime: 0}
        this.results = new Results(this.getAttribute("resultTypeName","TestResult"));
        this.maxDuration = parseInt(this.getAttribute("responseSeconds","-1"));
    }

    async componentDidMount(){
        await super.componentDidMount();  
        let previousResults: FlowObjectDataArray = this.getStateValue() as FlowObjectDataArray;
        if(previousResults && previousResults.items.length>0) {
            let previousResult = previousResults.items[0];
            let base64data = previousResult.properties?.result?.value as string;
            let byteString = atob(base64data.split(',')[1]);
            let ab = new ArrayBuffer(byteString.length);
            let ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: "audio/webm" });
            const url = window.URL.createObjectURL(blob);
            // store the data into the state
            this.setState({buffer: ab,  dataurl: url});
        }

        let stimulousFieldName: string = this.getAttribute("stimulousField");
        let instructionFieldName: string = this.getAttribute("instructionField");
        if(stimulousFieldName){
            let stimulousField: FlowField = await this.loadValue(stimulousFieldName);
            if(stimulousField) {
                this.setState({stimulousPrompt: this.makeStimulousContent(stimulousField.value as string)});
            }
        }
        if(instructionFieldName){
            let instructionField: FlowField = await this.loadValue(instructionFieldName);
            if(instructionField) {
                this.setState({instructionText: instructionField.value as string});
            }
        }

        (manywho as any).eventManager.addDoneListener(this.moveHappened, this.componentId);
    }

    async componentWillUnmount(): Promise<void> {
        (manywho as any).eventManager.removeDoneListener(this.componentId);
    }

    moveHappened(xhr: XMLHttpRequest, request: any) {
        if ((xhr as any).invokeType === 'FORWARD') {

        }
    }

    async startRecording() {
        this.setState({buffer: [], dataurl: undefined});
        let audio = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        if(audio){
            this.setState({audio: audio});
            this.recording();
        }
        if(this.maxDuration>0){
            this.setState({remainingTime: this.maxDuration});
            this.countDownTimer = window.setInterval(this.timerPing,1000);
        }
      //.then(this.recording);
    }

    timerPing() {
        let remainingTime: number = this.state.remainingTime;
        remainingTime --;
        if(remainingTime<=0){
            window.clearInterval(this.countDownTimer);
            this.stopRecording();
            this.setState({remainingTime: 0});
        }
        else {
            this.setState({remainingTime: remainingTime});
        }
        window.setTimeout
        window.clearTimeout
    }

    recording() {
        let mime : string = this.getAttribute("MimeType","audio/webm");
        let bps : number = parseInt(this.getAttribute("BitsPerSecond","128000"));
        let codecs: string = "";
        const options = {mimeType: mime, audioBitsPerSecond: bps};
        this.mediaRecorder = new MediaRecorder(this.state.audio, options);
        this.mediaRecorder.addEventListener('dataavailable', this.dataAvailable);
        this.mediaRecorder.addEventListener('stop', this.recordingEnded);   
        this.mediaRecorder.start();
        this.setState({recording: true});
    }

    dataAvailable(e: any) {
        if (e.data.size > 0) {
            this.state.buffer.push(e.data);
        }
    }

    stopRecording() {
        this.state.audio.getTracks().forEach((track: any) => track.stop());
        this.setState({ audio: null });
    }

    recordingEnded(e: any) {
        var reader = new FileReader();
        let blob = new Blob(this.state.buffer,{ type: "audio/webm" });
        let url = window.URL.createObjectURL(blob);
        this.setState({dataurl: url});
        
        reader.readAsDataURL(new Blob(this.state.buffer,{ type: "audio/webm" })); 
        reader.onloadend = this.dataExtracted;
        this.setState({recording: false});
        //downloadLink.download = 'acetest.wav';
        this.mediaRecorder = null;
    }

    dataExtracted(e: any) {  
        let resultData = e.target.result;
        this.results.clear();
        this.results.add(Result.newInstance(1,0,0,0,0,resultData,""));  // TODO this should pass in the stimulous
        let results: FlowObjectDataArray = this.results.makeFlowObjectData();
        this.setStateValue(results);         
    }

    makeStimulousContent(stimulous: string): any {
        let content: any;
        if(stimulous){
            switch(true){
                case stimulous.startsWith("https:"):
                case stimulous.startsWith("http:"):
                    if (this.isUrlImage(stimulous)) {
                        content = (
                            <img
                                className="voice-prompt-content-img"
                                src={stimulous as string}
                                alt={stimulous as string}
                            />
                        );
                    } else {
                        content = (
                            <span 
                                className="voice-prompt-content-text"
                            >
                                {stimulous}
                            </span>
                        );
                    }
                    break;
                
                case stimulous.startsWith("data:"):
                    content = (
                        <span 
                            className="voice-prompt-content-text"
                        >
                            {stimulous}
                        </span>
                    );
                    break;

                default:
                    content = (
                        <span 
                            className="voice-prompt-content-text"
                        >
                            "{stimulous}"
                        </span>
                    );
                    break;

            }
        }
        return content;
    }

    isUrlImage(url: string): boolean {
        if (
            url.endsWith('jpg') ||
            url.endsWith('jpeg') ||
            url.endsWith('jfif') ||
            url.endsWith('png') ||
            url.endsWith('bmp') ||
            url.endsWith('ico') ||
            url.endsWith('gif')
        ) { return true; } else {
            return false;
        }
    }

    async done() {
        if(this.outcomes["OnComplete"]){
            await this.triggerOutcome("OnComplete");
        }
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

        

        let button: any;
        let countDown: any;
        let outcomes: any[] = [];
        if(this.state.recording === false){
            let label: string = "Start";
            if(this.state.dataurl) {
                label = "Start Again";
                outcomes.push(
                    <button
                        key="submit"
                        className="voice-button"
                        onClick={this.done} 
                    >
                        Submit    
                    </button>
                )
            }
            button=(
                <button
                    key="start"
                    className="voice-button"
                    onClick={this.startRecording} 
                >
                    {label}    
                </button>
            )
        }
        else {

            if(this.maxDuration>0){
                countDown=(
                    <div
                        className="voice-countdown"
                    >
                        <span
                            className="voice-countdown-label"
                        >
                            {this.state.remainingTime + " seconds left"}
                        </span>
                    </div>
                );
            }
            button=(
                <button
                    key="stop"
                    className="voice-button"
                    onClick={this.stopRecording} 
                >
                    Stop    
                </button>
            )
        }

        
        
        let audio: any;
        if(this.state.dataurl){
            audio=(
                <audio controls style={{width: '100%'}}>
                        <source src={this.state.dataurl} type="audio/webm"/>
                </audio>
            );
        }
        else {

        }

        let graph: any;
        if(this.state.audio) {
            graph=(
                <AudioGraph audio={this.state.audio} />
            );
        }

        
        Object.values(this.outcomes).forEach((outcome: FlowOutcome) => {
            if(outcome.developerName !== "OnComplete"){
                outcomes.push(
                    <button
                        key={outcome.developerName}
                        className="voice-button"
                        onClick={(e: any) => {this.triggerOutcome(outcome.developerName)}} 
                    >
                        {outcome.label}    
                    </button>
                )
            }
        });
        
        return(
            <div
                className="voice"
                style={style}
            >
                <div
                    className="voice-buttons"
                >
                    {button}
                </div>
                <div
                    className="voice-prompt"
                >
                    <div
                        className="voice-prompt-instruction"
                    >
                        {this.state.instructionText}
                    </div>
                    <div
                        className="voice-prompt-content"
                    >
                        {this.state.stimulousPrompt}
                    </div>
                </div>
                {countDown}
                <div
                    className="voice-graph"
                >
                    {audio}
                    {graph}
                </div>   
                <div
                    className="voice-buttons"
                >
                    {outcomes}
                </div>            
            </div>
        );
    }
}

manywho.component.register('VoiceRecorder', VoiceRecorder);