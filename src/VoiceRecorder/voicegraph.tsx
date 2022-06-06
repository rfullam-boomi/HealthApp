import React = require("react");
import AudioVisualiser from "./voicevisualiser";

export default class AudioGraph extends React.Component <any,any> {

    audioContext: any;
    analyser: any;
    dataArray: any;
    source: any;
    rafId: any;

    constructor(props: any) {
        super(props);
        this.state = { audioData: new Uint8Array(0) };
        this.tick = this.tick.bind(this);
      }

    componentDidMount() {
        if(window.AudioContext) {
            this.audioContext = new (window.AudioContext);
        }
        else {
            this.audioContext = (window as any).webkitAudioContext;
        } // || window.webkitAudioContext)();
        if(this.audioContext) {
            this.analyser = this.audioContext.createAnalyser();
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.source = this.audioContext.createMediaStreamSource(this.props.audio);
            this.source.connect(this.analyser);
            this.rafId = requestAnimationFrame(this.tick);
        }
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        this.analyser.disconnect();
        this.source.disconnect();
      }

    tick() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.setState({ audioData: this.dataArray });
        this.rafId = requestAnimationFrame(this.tick);
    }

    render() {
        return (
            <AudioVisualiser 
                audioData={this.state.audioData} 
            />
        );
      }
}