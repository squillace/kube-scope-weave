# kube-scope-weave README

The `kube-scope-weave` extension add [Weave Scope](https://www.weave.works/oss/scope/) functionality to the core VS Code Kubernetes extension experience. 

## Features

Scope is a tool for visualizing and interacting with your Kubernetes applications that works against any Kubernetes cluster. This extension, which depends upon the [VS Code Kubernetes extension](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools) for core Kubernetes support, enables:
- installing Weave Scope using the [Helm stable Weave Scope chart](https://hub.kubeapps.com/charts/stable/weave-scope).
- opening Scope to the appropriate context at:
>- Cluster
>- Node
>- Namespace
>- Service
>- Pod

## How to run

1. First of all, get all the prerequisites:
    - [Helm](https://helm.sh/docs/using_helm/#installing-the-helm-client) + [Tiller](https://helm.sh/docs/using_helm/#installing-tiller)
    - [VS Code Kubernetes extension](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools) - its API is used to create new behavior inside the core Kubernetes experience without having to rewrite any Kubernetes client
2. Clone this repo and run `npm install` to have all the dependencies installed
3. Open the project in VS Code and hit F5 to run a new instance with Scope plugin support
4. Run `Scope: Install Weave Scope` command (bring the command panel up with `Ctrl+Shift+P`)
5. Now open the Kubernetes extension - the _Open Weave Scope_ action should appear in the dropdown when right-clicking on the cluster or some of the individual K8s resources

_See the [this doc](https://github.com/squillace/kube-scope-weave/blob/master/vsc-extension-quickstart.md) for more information on how to run and test VS Code extensions._

## Known Issues

- Detection of existing Scope installations is done by looking for the `frontend` endpoint in the current namespace. If it cannot be found, a new installation is created.
- Currently, the default namespace is used in the Kubernetes extension. This will be a selection in the future.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.2
First published version. 
- In the command palette, you can locate Scope: Install Weave Scope if you want to manually install Weave Scope yourself. 
- Right clicking Weave scope will check and install Scope if it's not already installed. 

### 0.0.1

Initial release of the extension.
