import { FlowComponent } from "flow-component-model";
import { CSSProperties } from "react";
import React = require("react");
import './voicerecorder.css';
import { decode } from "base64-arraybuffer";
import AudioGraph from "./voicegraph";

declare const manywho: any;

export default class VoiceRecorder extends FlowComponent {
    
    recorder: HTMLInputElement;
    mediaRecorder: any;
    base64data: string;

    constructor(props: any){
        super(props);
        this.moveHappened = this.moveHappened.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.recording = this.recording.bind(this);
        this.dataAvailable = this.dataAvailable.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
        this.recordingEnded = this.recordingEnded.bind(this);
        this.dataExtracted = this.dataExtracted.bind(this);
        this.state={recording: false, buffer: []}
    }

    async componentDidMount(){
        await super.componentDidMount();   
        this.base64data = this.getStateValue() as string;
        this.setState({buffer: decode(this.base64data)});
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
        this.setState({buffer: []});
        let audio = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        if(audio){
            this.setState({audio: audio});
            this.recording();
        }
        
      //.then(this.recording);
    }

    recording() {
        const options = {mimeType: 'audio/webm'};
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
        let dataUri: string = URL.createObjectURL(new Blob(this.state.buffer));
        var reader = new FileReader();
        reader.readAsDataURL(new Blob(this.state.buffer)); 
        reader.onloadend = this.dataExtracted;
        this.setState({recording: false});
        //downloadLink.download = 'acetest.wav';
        this.mediaRecorder = null;
    }

    dataExtracted(e: any) {
        this.base64data = e.target.result;     
        this.setStateValue(this.base64data);           
        console.log(this.base64data);
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
        if(this.state.recording === false){
            button=(
                <button
                    className="voice-button"
                    onClick={this.startRecording} 
                >
                    Start    
                </button>
            )
        }
        else {
            button=(
                <button
                    className="voice-button"
                    onClick={this.stopRecording} 
                >
                    Stop    
                </button>
            )
        }

        let prompt: string = "Hello world";
        
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
                        className="voice-prompt-content"
                    >
                        {prompt}
                    </div>
                </div>
                <div
                    className="voice-graph"
                >
                    {this.state.audio ? <AudioGraph audio={this.state.audio} /> : ''}
                </div>               
            </div>
        );
    }
}

manywho.component.register('VoiceRecorder', VoiceRecorder);