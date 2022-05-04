import { eLoadingState, FlowComponent, FlowObjectData, FlowObjectDataArray } from "flow-component-model";
import { CSSProperties } from "react";
import React = require("react");
import { Result, Results } from "../results";
import Face from "./face";
import './facebar.css';

declare const manywho: any;

export default class FaceBar extends FlowComponent {

    faces: Map<number,Face>;
    faceElements: Array<any>;
    //selectedFace: number; 
    previousContent: any;

    results: Results;

    constructor(props: any){
        super(props);
        this.setFace = this.setFace.bind(this);
        this.buildFaces = this.buildFaces.bind(this);
        this.moveHappened = this.moveHappened.bind(this);
        this.state={selectedFace: undefined};
        this.results = new Results(this.getAttribute("resultTypeName","TestResult"));
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

    async setSelectedFace(face: number){ 
        this.setState({selectedFace: face});
        let result: Result;
        if(this.results.items.has(1)){
            result = this.results.items.get(1);
            result.result=""+face;
        }
        else {
            this.results.add(Result.newInstance(1,0,0,0,0,""+face,""));
        }

 
        let stateValue = this.results.makeFlowObjectData().items[0];
        await this.setStateValue(stateValue);
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
            let previousResult: FlowObjectData = this.getStateValue() as FlowObjectData;
            if(!previousResult){
                previousResult = this.model.dataSource?.items[0];
            }
            if(previousResult) {
                this.setStateValue(previousResult);
                let previousFace: number = parseInt((previousResult.properties?.result?.value as string) || "-1");
                this.results.add(
                    Result.fromObjectData(previousResult)
                );
                this.setState({selectedFace: previousFace});
            }
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