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
        let match: number = Math.floor(Math.random()*2);
        let labelPos: number = Math.floor(Math.random()*this.colours.length);
        this.label = this.colours[labelPos].name;
        if(match===1) {
            this.colour = this.colours[labelPos].color;
            this.correct=true;
        }
        else {
            let colorPos: number = Math.floor(Math.random()*this.colours.length);
            while(colorPos === labelPos) {
                colorPos = Math.floor(Math.random()*this.colours.length);
            }
            this.colour = this.colours[colorPos].color;
            this.correct = labelPos===colorPos;
            this.forceUpdate();
        }
        //let colorPos: number = Math.floor(Math.random()*this.colours.length);
        //this.colour = this.colours[colorPos].color;
        //this.correct = labelPos===colorPos;
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