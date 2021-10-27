import { eLoadingState, FlowComponent, FlowObjectData } from "flow-component-model";
import { CSSProperties } from "react";
import React = require("react");
import Face from "./face";
import './facebar.css';

declare const manywho: any;

export default class FaceBar extends FlowComponent {

    faces: Map<number,Face>;
    faceElements: Array<any>;
    //selectedFace: number; 
    previousContent: any;

    constructor(props: any){
        super(props);
        this.setFace = this.setFace.bind(this);
        this.buildFaces = this.buildFaces.bind(this);
        this.moveHappened = this.moveHappened.bind(this);
        this.state={selectedFace: undefined};
    }

    setFace(key: number, face: Face){
        if(face) {
            this.faces.set(key,face);
        }
        else {
            if(this.faces.has(key)){
                this.faces.delete(key);
            }
        }

    }

    //shouldComponentUpdate(nextprops: any, nextstate: any){
        //return true;
    //}

    async setSelectedFace(face: number){
        this.setState({selectedFace: face});
        await this.setStateValue(face);
        if(this.outcomes["OnSelect"]){
            await this.triggerOutcome("OnSelect");
        }
        else {
            manywho.engine.sync(this.flowKey);
            this.faces.forEach((face: Face) => {
                face.forceUpdate();
            });
        }
        
    }

    

    async componentDidMount(){
        await super.componentDidMount();   
        (manywho as any).eventManager.addDoneListener(this.moveHappened, this.componentId);
        this.buildFaces();
    }

    async componentWillUnmount(): Promise<void> {
        (manywho as any).eventManager.removeDoneListener(this.componentId);
    }

    moveHappened(xhr: XMLHttpRequest, request: any) {
        if ((xhr as any).invokeType === 'FORWARD') {
            this.buildFaces();
        }
    }

    buildFaces() {
        if(this.loadingState === eLoadingState.ready) {
            this.setState({selectedFace: parseInt(this.getStateValue() as string)});
            this.faces = new Map();
            this.faceElements = [];
            for(let status = 1 ; status <=5 ; status ++) {
                this.faceElements.push(
                    <Face  
                        key={status}
                        root={this}
                        level={status}
                        ref={(element: Face) => {this.setFace(status,element)}}
                    />
                )
            }
            this.forceUpdate();
        }
        else {
            setImmediate(this.buildFaces);
        }
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

        return (
            <div 
                key="fb"
                className="facebar"
                style={style}
            >
                {this.faceElements}
            </div>
        );
    }
}

manywho.component.register('FaceBar', FaceBar);