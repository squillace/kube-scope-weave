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

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

This extension uses the [VS Code Kubernetes extension](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools)'s API to create new behavior inside the core Kubernetes experience without having to rewrite any Kubernetes client code. Therefore, you must install that extension in order to use this one.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Known Issues

- Detection of existing Scope installations is done by looking for the `frontend` endpoint in the current namespace. If it cannot be found, a new installation is created.
- Currently, the default namespace is used. This will be a selection in the future. 

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Initial release of the extension.
