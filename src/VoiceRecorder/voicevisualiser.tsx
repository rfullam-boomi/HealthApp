import React = require("react");


export default class AudioVisualiser extends React.Component<any,any> {
    canvas: HTMLCanvasElement;

    constructor(props: any) {
        super(props);
    }

    draw() {
        const { audioData } = this.props;
        const canvas = this.canvas;
        const height = canvas.height;
        const width = canvas.width;
        const context = canvas.getContext('2d');
        let x = 0;
        const sliceWidth = (width * 1.0) / audioData.length;
        context.lineWidth = 1;
        context.strokeStyle = '#000000';
        context.clearRect(0, 0, width, height);
        context.beginPath();
        context.moveTo(0, height / 2);
        for (const item of audioData) {
            const y = (item / 255.0) * height ;
            context.lineTo(x, y);
            x += sliceWidth;
        }
        context.lineTo(x, height / 2);
        context.stroke();
    }

    componentDidUpdate() {
        this.draw();
    }


    render() {
        return (
            <canvas 
                style={{width: "100%", height: "100%"}}
                ref={(element: HTMLCanvasElement) => {this.canvas = element}}
            />
        );
      }
}