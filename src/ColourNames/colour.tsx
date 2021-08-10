import React = require("react");

export default class ColourName extends React.Component<any,any> {
    
    colours: Array<string> = ["red","green","blue"];

    label: string = "";
    colour: string = "transparent";
    correct: boolean = false;
    
    randomise() {
        this.label = this.colours[Math.floor(Math.random()*this.colours.length)].replace(/\s(.)/g, function($1) { return $1.toUpperCase(); });
        this.colour = this.colours[Math.floor(Math.random()*this.colours.length)];
        this.correct = this.label.toLowerCase() === this.colour;
        this.forceUpdate();
    }

    clear() {
        this.label = "";
        this.colour = "transparent";
        this.forceUpdate();
    }

    render() {
        return (
            <div
                className="colnam-colour"
            >
                <span
                    className="colnam-colour-label"
                    style={{color: this.colour}}
                >
                    {this.label}
                </span>
            </div>
        );
    }
}