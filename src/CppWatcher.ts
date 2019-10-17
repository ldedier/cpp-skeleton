/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   CppWatcher.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ldedier <ldedier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/07/12 20:04:18 by ldedier           #+#    #+#             */
/*   Updated: 2019/10/18 00:58:23 by ldedier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as vscode from 'vscode';
import * as path from 'path';

import CppImplementer from './CppImplementer';

class CppWatcher {

	public fileSystemWatcher: vscode.FileSystemWatcher;

	constructor()
	{
		this.fileSystemWatcher = vscode.workspace.createFileSystemWatcher("**/[A-Z]{[A-Z],[a-z]}*.cpp",
			false, true, true);
		this.fileSystemWatcher.onDidCreate(this.onCreateCpp);
	}

	static getHppRelativePath() : string | null
	{
		let rel : string;
		rel = (vscode.workspace.getConfiguration().get('cpp-skeleton.matchingHppPath') as string).trim();

		if (!rel || ! rel.length)
			rel = ".";
		if (vscode.window.activeTextEditor)
		{		const res : string = path.normalize(path.dirname(vscode.window.activeTextEditor.document.fileName)
			+ "/" + rel + "/" + path.basename(vscode.window.activeTextEditor.document.fileName).replace(/\.cpp/, ".hpp"));
			return res;
		}
		else
			return null;
	}

	private onCreateCpp = (uri: vscode.Uri) => {

		if (vscode.window.activeTextEditor
			&& vscode.window.activeTextEditor.document.uri.path == uri.path && vscode.window.activeTextEditor.document.getText().length == 0)
		{
			let editor = vscode.window.activeTextEditor as vscode.TextEditor;
			const matchinHppFileName : string = <string>CppWatcher.getHppRelativePath();
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
}
export default CppWatcher;