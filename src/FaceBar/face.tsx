import React = require("react");
import FaceBar from "./facebar";


export default class Face extends React.Component<any,any> {
    
    canvas: HTMLCanvasElement;

    constructor(props: any){
        super(props);
        this.setCanvas=this.setCanvas.bind(this);
        this.setSelected=this.setSelected.bind(this);
        this.drawface=this.drawface.bind(this);
    }

    setCanvas(key: string, canvas: HTMLCanvasElement){
        if(canvas){
            this.canvas = canvas;
            this.drawface();
        }
        else {
            this.canvas = undefined;
        }
    }

    setSelected(e: any) {
        let root: FaceBar = this.props.root;
        root.setSelectedFace(this.props.level);
    }

    componentDidMount(){
        this.drawface();
    }

    drawHappyEyes(pen: CanvasRenderingContext2D, y: number, center: number, gap: number) {
        pen.lineWidth = 4;
        pen.fillStyle = "#000";    

        // left eye
        pen.beginPath();   
        pen.arc(center-gap, y + (gap / 4), gap / 2, 0 , Math.PI, true); 
        pen.stroke();

        // right eye
        pen.beginPath();   
        pen.arc(center+gap, y + (gap / 4), gap / 2, 0, Math.PI, true);     
        pen.stroke();   
    }

    drawNormalEyes(pen: CanvasRenderingContext2D, y: number, center: number, gap: number) {
        pen.lineWidth = 4;
        pen.fillStyle = "#000";    

        // left eye
        pen.beginPath();   
        pen.arc(center-gap, y, gap / 4, 0 , Math.PI * 2, true); 
        pen.closePath(); 
        pen.fill();

        // right eye
        pen.beginPath();   
        pen.arc(center+gap, y, gap / 4, 0, Math.PI * 2, true);  
        pen.closePath();    
        pen.fill();   
    }

    drawSadEyes(pen: CanvasRenderingContext2D, y: number, center: number, gap: number) {
        pen.lineWidth = 4;
        pen.fillStyle = "#000";    

        // left eye
        pen.beginPath();   
        pen.arc(center-gap, y - (gap / 4), gap / 2, Math.PI, 0 , true); 
        pen.stroke();

        // right eye
        pen.beginPath();   
        pen.arc(center+gap, y - (gap / 4), gap / 2, Math.PI, 0 , true);     
        pen.stroke();   
    }

    drawExtaticMouth(pen: CanvasRenderingContext2D, y: number, center: number, width: number) {
        pen.lineWidth = 4;
        pen.fillStyle = "#000";    

        pen.beginPath();   
        pen.arc(center, y , width / 2 , Math.PI , Math.PI * 2 , true); 
        pen.closePath(); 
        pen.fill(); 
    }

    drawHappyMouth(pen: CanvasRenderingContext2D, y: number, center: number, width: number) {
        pen.lineWidth = 4;
        pen.fillStyle = "#000";    

        pen.beginPath();   
        pen.arc(center, y , width / 2 , 0 , Math.PI , false); 
        //pen.closePath(); 
        pen.stroke(); 
    }

    drawStraightMouth(pen: CanvasRenderingContext2D, y: number, center: number, width: number) {
        pen.lineWidth = 4;
        pen.fillStyle = "#000";    

        pen.beginPath();   
        pen.moveTo(center-(width/2),y + (width / 4));
        pen.lineTo(center+(width/2),y + (width / 4))
        pen.closePath(); 
        pen.stroke();   
    }

    drawSadMouth(pen: CanvasRenderingContext2D, y: number, center: number, width: number) {
        pen.lineWidth = 4;
        pen.fillStyle = "#000";    

        pen.beginPath();   
        pen.arc(center, y + (width / 2) , width / 2 , 0, Math.PI , true); 
        //pen.closePath(); 
        pen.stroke();   
    }

    drawMiserableMouth(pen: CanvasRenderingContext2D, y: number, center: number, width: number) {
        pen.lineWidth = 4;
        pen.fillStyle = "#000";    

        pen.beginPath();   
        pen.arc(center, y + (width / 2), width / 2 , Math.PI * 2 , Math.PI , true); 
        pen.closePath(); 
        pen.fill(); 
    }

    drawface(){
        if(this.canvas){
            this.canvas.width=this.canvas.offsetWidth;
            this.canvas.height=this.canvas.offsetHeight;
            let pen:  CanvasRenderingContext2D = this.canvas.getContext("2d");  
            let width: number = this.canvas.width;
            let height: number = this.canvas.height;
            pen.clearRect(0, 0, width, height);
            let x: number = width / 2;
            let y: number = height / 2;
            let eyeY: number = height * 0.4;
            let mouthY: number = height * 0.6;
            let eyeX: number =  width / 6;
            let rad: number = x * 0.95; 

            //first background
            pen.beginPath();    
            pen.fillStyle = this.calcColor();    
            pen.arc(x, y, rad, 0, Math.PI * 2, true);    
            pen.closePath();    
            pen.fill();    

            switch(this.props.level){
                case 1:
                    this.drawHappyEyes(pen,eyeY, x, eyeX);
                    this.drawExtaticMouth(pen,mouthY,x,width / 4);
                    break;
                case 2:
                    this.drawNormalEyes(pen,eyeY, x, eyeX);
                    this.drawHappyMouth(pen,mouthY,x,width / 4);
                    break;
                case 3:
                    this.drawNormalEyes(pen,eyeY, x, eyeX);
                    this.drawStraightMouth(pen,mouthY,x,width / 4);
                    break;
                case 4:
                    this.drawNormalEyes(pen,eyeY, x, eyeX);
                    this.drawSadMouth(pen,mouthY,x,width / 4);
                    break;
                case 5:
                    this.drawSadEyes(pen,eyeY, x, eyeX);
                    this.drawMiserableMouth(pen,mouthY,x,width / 4);
                    break;

            }
        }
    }

    calcColor() : string{
        switch(this.props.level){
            case 1: // v good
                return "rgb(68 187 251)";
            case 2: // good
                return "rgb(64 171 115)";
            case 3: // ok
                return "rgb(236 215 14)";
            case 4: // ok
                return "rgb(239 142 10)";
            case 5: // ok
                return "rgb(226 3 3)";
        }
    }

    calcLabel() : string{
        switch(this.props.level){
            case 1: // v good
                return "Very Good";
            case 2: // good
                return "Good";
            case 3: // ok
                return "Okay";
            case 4: // ok
                return "Not Good";
            case 5: // ok
                return "Awful";
        }
    }

    render() {
        let root: FaceBar = this.props.root;
        
        let label: string = this.calcLabel();
        let color: string = this.calcColor();
        
        let className: string = "facebar-element";
        if(root.selectedFace===this.props.level){
            className += " facebar-element-selected"
        }
        return(
            <div
                className={className}
                onClick={this.setSelected}
            >
                <div
                    className="facebar-face-container"
                >
                    <div
                        className="facebar-face"
                    >
                        <canvas
                            id={"canvas" + this.props.level}
                            key={"canvas" + this.props.level}
                            className="facebar-canvas"
                            ref={(element: HTMLCanvasElement) => {this.setCanvas("canvas" + this.props.level,element)}}
                        />
                    </div>
                </div>
                <div
                    className="facebar-block"
                    style={{backgroundColor: color}}
                />
                <div
                    className="facebar-label"
                >
                    {label}
                </div>
            </div>
        );
    }
}