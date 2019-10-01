/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   CppWatcher.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ldedier <ldedier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/07/12 20:04:18 by ldedier           #+#    #+#             */
/*   Updated: 2019/10/01 04:53:28 by ldedier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as vscode from 'vscode';
import CppImplementer from './CppImplementer';

class CppWatcher {

	public fileSystemWatcher: vscode.FileSystemWatcher;

	constructor()
	{
		this.fileSystemWatcher = vscode.workspace.createFileSystemWatcher("**/[A-Z]{[A-Z],[a-z]}*.cpp",
			false, true, true);
		this.fileSystemWatcher.onDidCreate(this.onCreateCpp);
	}

	private onCreateCpp = (uri: vscode.Uri) => {

		if (vscode.window.activeTextEditor
			&& vscode.window.activeTextEditor.document.uri.path == uri.path && vscode.window.activeTextEditor.document.getText().length == 0)
		{
			let editor = vscode.window.activeTextEditor as vscode.TextEditor;
			const matchinHppFileName = vscode.window.activeTextEditor.document.fileName.replace(/\.cpp/, ".hpp");
			vscode.workspace.openTextDocument(matchinHppFileName).then(
			(hppDoc) => {
				const cppImplementer = new CppImplementer(editor, hppDoc);
				cppImplementer.fillSkeleton();
			},
			(err) => {
				vscode.window.showWarningMessage(err.message);
			})
		}
	}

	public implementMissingMethods()
	{

	}
}
export default CppWatcher;