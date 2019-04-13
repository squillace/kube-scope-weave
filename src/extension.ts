// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Imports the Microsoft Kubernetes extension API
import * as k8s from 'vscode-kubernetes-tools-api';

var isScopeForwarded: boolean = false;
var isScopeInstalled: boolean = false;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
    const openDisposable = vscode.commands.registerCommand('scope.open', openScope);
    const installDisposable = vscode.commands.registerCommand('scope.install', installScope);
    context.subscriptions.push(openDisposable);
    context.subscriptions.push(installDisposable);

}



// Installs Weave Scope IF it isn't already installed.
async function installScope(target?: any): Promise<void> {

    // TODO: Break this up into working progress on installation, move on to portforward prior to opening.

    // Grab kubectl
    // Check for explorer API
    const explorer = await k8s.extension.clusterExplorer.v1;
    if (!explorer.available) {
        vscode.window.showErrorMessage(`Command not available: ${explorer.reason}`);
        return;
    }
    
    const kubectl = await k8s.extension.kubectl.v1;
    if (!kubectl.available) {
        vscode.window.showErrorMessage(`kubectl not available: ${kubectl.reason}`);
        return;
    }

    const helm = await k8s.extension.helm.v1;
    if (!helm.available) {
        vscode.window.showErrorMessage(`Command not available: ${helm.reason}`);
        return;
    }
    
    // check for installation: 
        // get weave scope front-end pod. 
    const podName = await kubectl.api.invokeCommand(`get endpoints --selector app=weave-scope -o json`);

    if (!podName || podName.code !== 0) {
        vscode.window.showErrorMessage(`Can't get resource usage: ${podName ? podName.stderr : 'unable to run kubectl'}`);
        return;
    }
    else {
        const matchNoEndpoint = podName.stdout.match("No resources found.");
        if (!matchNoEndpoint){
            vscode.window.showInformationMessage('Weave scope is already installed.');
            return;
        }    

    }
    
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Installing Weave Scope...",
        cancellable: true
    }, (progress, token) => {
        token.onCancellationRequested(() => {
            vscode.window.showInformationMessage("Canceled Weave Scope Installation. You may need to run helm delete --purge manually.");
        });

        progress.report({ increment: 0 });



        setTimeout(() => {
            progress.report({ increment: 40, message: "Waiting for installation to be ready..." });
        }, 2000);

        setTimeout(() => {
            progress.report({ increment: 50, message: "I\'ll likely give up soon if it isn\'t ready..." });
        }, 3000);

        var p = new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 5000);
        });

        return p;
    });


    
    if (isScopeInstalled){
        vscode.window.showInformationMessage("Weave Scope is already installed.");
        return;
    }
    else {
        const scopeInstallDisposable = await helm.api.invokeCommand(`install stable/weave-scope --version 0.11.0`);
        if (!scopeInstallDisposable || scopeInstallDisposable.code !== 0) {
            vscode.window.showErrorMessage(`Unable to install Weave Scope. Helm reports: ${scopeInstallDisposable ? scopeInstallDisposable.stderr : 'unable to run helm install'}`);
            return;
        }
        else{
            vscode.window.showInformationMessage(scopeInstallDisposable.stdout);
        }
    }

    
    return;
}

async function openScope(target?: any): Promise<void> {

    // Check for explorer API
    const explorer = await k8s.extension.clusterExplorer.v1;
    if (!explorer.available) {
        vscode.window.showErrorMessage(`Command not available: ${explorer.reason}`);
        return;
	}
	
    const kubectl = await k8s.extension.kubectl.v1;
    if (!kubectl.available) {
        vscode.window.showErrorMessage(`kubectl not available: ${kubectl.reason}`);
        return;
    }

    /*
    if (isScopeForwarded) {
        installScope();
    }
    */
   
    // get weave scope front-end pod. 
    const podName = await kubectl.api.invokeCommand(`get endpoints --selector app=weave-scope -o json`);

    if (!podName || podName.code !== 0) {
        vscode.window.showErrorMessage(`Can't get resource usage: ${podName ? podName.stderr : 'unable to run kubectl'}`);
        return;
    }
    else {

        var scopePodInfo = JSON.parse(podName.stdout);
        var pod = scopePodInfo.items[0].subsets[0].addresses[0].targetRef.name;
        var namespace = scopePodInfo.items[0].subsets[0].addresses[0].targetRef.namespace;
        var targetPort = scopePodInfo.items[0].subsets[0].ports[0].port;

        const forwardResult = kubectl.api.portForward(pod, namespace, 8080, targetPort);
        if (forwardResult) {
            isScopeForwarded = true;

            // What's the clicked View item?
            const treeNode = explorer.api.resolveCommandTarget(target);

            // assuming it's a resource, find the type and absorb the json string from it.
            if (treeNode){
                switch (treeNode.nodeType) {
                    case 'context':    
                        vscode.env.openExternal(vscode.Uri.parse('http://localhost:8080'));
                        break;
                    case 'resource':
                    const scopeCommand = 'http://localhost:8080/#!/state/' + findNodeType(treeNode);           
                    vscode.env.openExternal(vscode.Uri.parse(scopeCommand));
                        break;
                    default:
                    console.log('It was neither a resource nor a context node.');
                    break;
                }
            }
        }
        else {
            vscode.window.showErrorMessage(`The Kubectl port-forward to scope failed.`); 

        }

    }
 
}


function findNodeType(treeNode: k8s.ClusterExplorerV1.ClusterExplorerResourceNode): string {

    var returnedJsonString = JSON.parse('{"pinnedMetricType":"CPU","showingNetworks":true,"topologyId":"services","topologyOptions":{"containers":{"system":["all"]},"pods":{"namespace":["default"],"pseudo":["show"]}}}'); 
    if (treeNode.resourceKind.manifestKind === 'Node') {
        const nodeName = treeNode.name;
        returnedJsonString.topologyId = 'hosts';
        return JSON.stringify(returnedJsonString);
        return returnedJsonString;
    } else if (treeNode.resourceKind.manifestKind === 'Pod') {
        const podName = treeNode.name;
        returnedJsonString.topologyId = 'pods';
        return JSON.stringify(returnedJsonString);
    } else if (treeNode.resourceKind.manifestKind === 'Service'){
        const serviceName = treeNode.name;
        returnedJsonString.topologyId = 'services';
        return JSON.stringify(returnedJsonString);
    } else if (treeNode.resourceKind.manifestKind === 'Namespace'){
        const namespaceName = treeNode.name;
        returnedJsonString.topologyOptions.pods.namespace = namespaceName;
        return JSON.stringify(returnedJsonString);
    }    
    else {
        return 'http://localhost:8080/';
    }
}

// this method is called when your extension is deactivated
export function deactivate() {}
