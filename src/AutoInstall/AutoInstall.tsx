import { FlowComponent } from "flow-component-model";
import React = require("react");
declare const manywho: any;

export default class AutoInstall extends FlowComponent {
    deferredPrompt: any;

    constructor(props: any) {
        super(props);
        this.install=this.install.bind(this);
        window.addEventListener('beforeinstallprompt',this.install);
        window.addEventListener('appinstalled', this.installed);
        //if ('serviceWorker' in navigator) {
        //    navigator.serviceWorker.register('/service-worker.js');
        //  }
    }

    install(e: any) {
        e.preventDefault();
        this.deferredPrompt = e;
        console.log(`'beforeinstallprompt' event was fired.`);
    }

    installed() {
        // Hide the app-provided install promotion
        //hideInstallPromotion();
        // Clear the deferredPrompt so it can be garbage collected
        this.deferredPrompt = null;
        // Optionally, send analytics event to indicate successful install
        console.log('PWA was installed');
    }

    render() {
        return(
            <div>
                auto
            </div>
        );
    }
}

manywho.component.register('AutoInstall', AutoInstall);