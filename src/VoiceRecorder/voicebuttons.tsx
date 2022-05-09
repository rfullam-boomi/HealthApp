import { FlowOutcome } from "flow-component-model";
import React = require("react");
import VoiceButton from "./voicebutton";
import VoiceRecorder from "./voicerecorder";


export default class VoiceButtons extends React.Component<any,any> {
    
    render(){
        let root: VoiceRecorder = this.props.parent;

        let topButtons: any[] = [];
        let bottomButtons: any[] = [];
        let outcomeButtons: any[] = [];

        if(root.state.recording === false){
            if(root.state.dataurl) {
                if(root.state.playing === false) {
                    bottomButtons.push(
                        <VoiceButton 
                            key="play"
                            classes="voice-button-bottom"
                            onclick={root.play} 
                            label="Play"
                            icon="play"
                            iconStyle={{color: "#05a605"}}
                        />
                    )
                }
                else {
                    bottomButtons.push(
                        <VoiceButton 
                            key="stopplay"
                            classes="voice-button-bottom"
                            onclick={root.stopPlay} 
                            label="Stop"
                            icon="stop"
                            iconStyle={{color: "#f00"}}
                        />
                    )
                }
                
                bottomButtons.push(
                    <VoiceButton 
                        key="submit"
                        classes="voice-button-bottom"
                        onclick={root.done} 
                        label="Save"
                        icon="cloud-upload"
                    />
                )
                bottomButtons.push(
                    <VoiceButton 
                        key="clear"
                        classes="voice-button-bottom"
                        onclick={root.clearRecording} 
                        label="Try again"
                        icon="remove"
                        iconStyle={{color: "#000"}}
                    />
                )
                /*
                topButtons.push(
                    <VoiceButton 
                        key="start"
                        classes="voice-button-top"
                        onclick={root.startRecording} 
                        label="Start again"
                        icon="record"
                        iconStyle={{color: "#f00"}}
                    />
                )
                */
            }
            else {
                topButtons.push(
                    <VoiceButton 
                        key="start"
                        classes="voice-button-top"
                        onclick={root.startRecording} 
                        label="Start recording"
                        icon="record"
                        iconStyle={{color: "#f00"}}
                    />
                )
            }
            
        }
        else {

            
            topButtons.push(
                <VoiceButton 
                    key="stop"
                    classes="voice-button-top"
                    onclick={root.stopRecording} 
                    label="Stop recording"
                    icon="stop"
                    iconStyle={{color: "#f00"}}
                />
            )
        }

        Object.values(root.outcomes).forEach((outcome: FlowOutcome) => {
            if(outcome.developerName !== "OnComplete"){
                outcomeButtons.push(
                    <button
                        key={outcome.developerName}
                        className="voice-outcome"
                        onClick={(e: any) => {root.triggerOutcome(outcome.developerName)}} 
                    >
                        {outcome.label}    
                    </button>
                )
            }
        });

        return (
            <div
                className="voice-buttons"
            >
                <div
                    className="voice-buttons-top"
                >
                    {topButtons}
                </div>
                <div
                    className="voice-buttons-bottom"
                >
                    {bottomButtons}
                </div>
                <div
                    className="voice-buttons-outcomes"
                >
                    {outcomeButtons}
                </div>
            </div>
        );
    }
}