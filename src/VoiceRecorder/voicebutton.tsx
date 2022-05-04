import React = require("react");

export default class VoiceButton extends React.Component<any,any> {
    
    render() {
        let icon;
        if(this.props.icon) {
            icon=(
                <span
                    className={"voice-button-icon glyphicon glyphicon-" + this.props.icon}
                    style={this.props.iconStyle}
                />
            );
        }

        let label;
        if(this.props.label) {
            label=(
                <span
                    className={"voice-button-label"}
                >
                    {this.props.label}    
                </span>
            );
        }

        return(
            <div
                className={"voice-button " + this.props.classes}
                onClick={this.props.onclick}
            >
                {icon}
                {label}
            </div>
        );
    }
}