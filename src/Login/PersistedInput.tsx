import { eContentType, FlowComponent } from "flow-component-model";
import React = require("react");

declare const manywho: any;

export default class PersistedInput extends FlowComponent {

    constructor(props: any) {
        super(props);
        this.onChange=this.onChange.bind(this);
        this.onBlur=this.onBlur.bind(this);
        this.state={contentValue: undefined}
    }

    async componentDidMount() {
        await super.componentDidMount();
        let contentValue: any = this.getStateValue();
        if(!contentValue) {
            if(this.getAttribute("persist","false").toLowerCase() === "true") {
                contentValue=localStorage.getItem(this.componentId);
                if(contentValue) {
                    switch(this.getStateValueType()){
                        case eContentType.ContentString:
                        case eContentType.ContentPassword:
                            this.setState({contentValue: contentValue});
                            break;

                        case eContentType.ContentNumber:
                            this.setState({contentValue: parseInt(contentValue)});
                            break;

                        case eContentType.ContentBoolean:
                            this.setState({contentValue: contentValue?.toLowerCase() === "true"});
                            break;

                        case eContentType.ContentDateTime:
                            this.setState({contentValue: new Date(contentValue)});
                            break;
                        
                    }
                }
            }
            await this.setStateValue(contentValue);
            console.log("val=" + this.getStateValue());
        }
        
    }

    async componentWillUnmount() {
        console.log("unload");
    }


    async onChange(e: any) {
        let val : any;
        let pval : string;

        switch(this.getStateValueType()){
            case eContentType.ContentString:
            case eContentType.ContentPassword:
            case eContentType.ContentNumber:
                val = "" + e.target.value;
                pval = "" + e.target.value;
                break;

            case eContentType.ContentBoolean:
                val=e.target.checked;
                pval = e.target.checked;
                this.onBlur(e);
                break;

            case eContentType.ContentDateTime:
                val = e.target.value;
                pval = e.target.value.toIsoString();
                break;
            
        }
        await this.setStateValue(val);
        console.log("val=" + this.getStateValue());
        this.setState({contentValue: val});
        if(this.getAttribute("persist","false").toLowerCase() === "true") {
            localStorage.setItem(this.componentId,pval);
        }
        

    }

    onBlur(e: any) {
        /*
        manywho.component.handleEvent(
            this,
            manywho.model.getComponent(
                this.props.id,
                this.props.flowKey,
            ),
            this.props.flowKey,
            null,
        );
        */
    }

    render() {

        const props: any = {
            mask: this.getAttribute("mask",""),
            value: this.state.contentValue,
            id: this.props.id,
            maxLength: this.model.maxSize,
            size: this.model.size,
            readOnly: this.model.readOnly,
            disabled: this.model.enabled === false,
            required: this.model.required === true,
            onChange: this.onChange,
            onBlur: this.onBlur,
            flowKey: this.props.flowKey,
            autoComplete: this.getAttribute("autocomplete","false").toLowerCase() === "true",
            //autoFocus: model.autoFocus,
            //title: model.label
        };

        let label = (
            <label
                //ACCESSIBILITY
                htmlFor={this.props.id}
                //END-ACCESSIBILITY
            >
                {this.model.label}
                {this.model.required ? <span className="input-required"> *</span> : null}
            </label>
        );

        let inputElement = null;
        let type: eContentType = this.getStateValueType()
        switch (true) {
            case type===eContentType.ContentDateTime:
                //inputElement = <InputDateTime {...props} />;
                break;
    
            case type===eContentType.ContentBoolean:
                label = null;
                //inputElement = <InputBoolean {...props} />;
                break;
    
            case type===eContentType.ContentNumber:
                //inputElement = <InputNumber {...props} />;
                break;
    
            case type===eContentType.ContentPassword || this.getAttribute("password","false").toLowerCase() === "true":
                /*delete props.flowKey;
                delete props.format;
                if (manywho.utils.isNullOrWhitespace(props.value)) {
                    // Prevent browser from autofilling the wrong password. Chrome in particular guesses the autofill
                    // value and generally gets it wrong because there is no username field associated with this
                    // value. Also we do not store passwords in plain-text so this value should never be pre-populated.
                    props.autoComplete = 'new-password';
                }
                // A type of 'hidden' prevents browsers trying to autofill the previous form input as a username.
                inputElement = <input {...props} className="form-control" type={model.isVisible ? 'password' : 'hidden'} />;
                */
                inputElement = (
                    <input 
                        {...props} 
                        className="form-control" 
                        type={'password'} 
                    />
                );
                break;
    
            default:
                //delete props.flowKey;
                //delete props.format;
    
                //if (manywho.utils.isNullOrEmpty(mask)) {
                    inputElement = (
                        <input
                            {...props}
                            className="form-control"
                            //type={model.attributes.type ? model.attributes.type : 'text'}
                        />
                    );
                //} else {
                //    inputElement = (
                //        <MaskedInput
                //            {...props}
                //            className="form-control"
                //            type={model.attributes.type ? model.attributes.type : 'text'}
                //        />
                //    );
                //}
                break;
        }

        let className = manywho.styling.getClasses(
            this.props.parentId, this.props.id, 'input', this.props.flowKey,
        ).join(' ');

        if (this.model.visible === false) {
            className += ' hidden';
        }

        if (this.outcomes) {
            className += ' has-outcomes';
        }

        className += ' form-group';

        const inputField = (
            <div key="">
                {label}
                {inputElement}
                <span className="help-block">{this.model.validationMessage}</span>
                <span className="help-block">{this.model.helpInfo}</span>
            </div>
        );

        return (
            <div 
                className={className}
            >
                {inputField}
            </div>
        );
    }
}

manywho.component.register("PersistedInput", PersistedInput);