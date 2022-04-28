import React = require("react");

export default class ColourName extends React.Component<any,any> {
    
    colours: Array<any> = [
        {name:"Red",color:"#f00"},
        {name:"Green",color:"#0f0"},
        {name:"Blue",color:"#00f"},
        {name:"Pink",color:"#f0f"},
        {name:"Yellow",color:"#fbde05"}
    ];

    label: string = "";
    colour: string = "transparent";
    correct: boolean = false;
    
    randomise() {
        let labelPos: number = Math.floor(Math.random()*this.colours.length);
        this.label = this.colours[labelPos].name;
        let colorPos: number = Math.floor(Math.random()*this.colours.length);
        this.colour = this.colours[colorPos].color;
        this.correct = labelPos===colorPos;
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