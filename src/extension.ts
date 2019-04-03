// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Imports the Microsoft Kubernetes extension API
import * as k8s from 'vscode-kubernetes-tools-api';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('scope.open', openScope);
    context.subscriptions.push(disposable);
}

async function openScope(target?: any): Promise<void> {

    // Check for explorer API
    const explorer = await k8s.extension.clusterExplorer.v1;
    if (!explorer.available) {
        vscode.window.showErrorMessage(`Command not available: ${explorer.reason}`);
        return;
	}
	
	//TODO: Decide whether I ever need to use kubectl
    const kubectl = await k8s.extension.kubectl.v1;
    if (!kubectl.available) {
        vscode.window.showErrorMessage(`kubectl not available: ${kubectl.reason}`);
        return;
    }

    // decide what type of treenode we have clicked: cluster, namespace, node, service, pod, container
    

    // What's the clicked View item?
    const treeNode = explorer.api.resolveCommandTarget(target);

    // assuming it's a resource, find the type and absorb the json string from it.
    if (treeNode && treeNode.nodeType === 'resource') {
        const scopeCommand = findNodeType(treeNode);
        if (treeNode) {
            vscode.window.showInformationMessage(scopeCommand);
            return;
        }
    }

	// function that creates the json for one of the above contexts

	// port-forwarding pod and then open `http://localhost:8080/#!/state/` + urlencoded json string returned from above.



}


function findNodeType(treeNode: k8s.ClusterExplorerV1.ClusterExplorerResourceNode): string {

// cluster: http://localhost:8080/#!/state/{%22pinnedMetricType%22:%22CPU%22,%22showingNetworks%22:true,%22topologyId%22:%22pods%22,%22topologyOptions%22:{%22containers%22:{%22system%22:[%22all%22]},%22pods%22:{%22namespace%22:[%22default%22],%22pseudo%22:[%22show%22]}}}

// cluster all namespaces: http://localhost:8080/#!/state/{%22pinnedMetricType%22:%22CPU%22,%22showingNetworks%22:true,%22topologyId%22:%22pods%22,%22topologyOptions%22:{%22containers%22:{%22system%22:[%22all%22]},%22pods%22:{%22pseudo%22:[%22show%22]}}}

// services: http://localhost:8080/#!/state/{%22pinnedMetricType%22:%22CPU%22,%22showingNetworks%22:true,%22topologyId%22:%22services%22,%22topologyOptions%22:{%22containers%22:{%22system%22:[%22all%22]},%22pods%22:{%22namespace%22:[%22default%22],%22pseudo%22:[%22show%22]}}}

// pods: http://localhost:8080/#!/state/{%22pinnedMetricType%22:%22CPU%22,%22showingNetworks%22:true,%22topologyId%22:%22pods%22,%22topologyOptions%22:{%22containers%22:{%22system%22:[%22all%22]},%22pods%22:{%22namespace%22:[%22default%22],%22pseudo%22:[%22show%22]}}}




    var returnedJsonString = JSON.parse('{"pinnedMetricType":"CPU","showingNetworks":true,"topologyId":"pods","topologyOptions":{"containers":{"system":["all"]},"pods":{"namespace":["default"],"pseudo":["show"]}}}');
    if (treeNode.resourceKind.manifestKind === 'Node') {
        const nodeName = treeNode.name;
        return returnedJsonString;
    } else if (treeNode.resourceKind.manifestKind === 'Pod') {
        const podName = treeNode.name;
        return returnedJsonString;
    } else if (treeNode.resourceKind.manifestKind === 'Service'){
        const serviceName = treeNode.name;
        return returnedJsonString;
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
