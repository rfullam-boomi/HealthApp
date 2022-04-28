import React = require("react");

export default class OverlayButton extends React.Component <any,any> {

    render() {

        return (
            <div
                className="test-overlay-button"
                onClick={this.props.callback}
            >
                {this.props.label}
            </div>
        );
    }
}