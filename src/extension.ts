/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   extension.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ldedier <ldedier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/07/12 20:04:21 by ldedier           #+#    #+#             */
/*   Updated: 2019/10/01 04:53:38 by ldedier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import CppWatcher from './CppWatcher';
import CppImplementer from './CppImplementer';

const watcher : CppWatcher = new CppWatcher();

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('cpp-skeleton.addMissingMethods', CppImplementer.implementsMissingMethods);
	let disposable2 = vscode.commands.registerCommand('cpp-skeleton.clearAsNewSkeleton', CppImplementer.clearAsNewSkeleton);

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
	
}

export function deactivate() {}
