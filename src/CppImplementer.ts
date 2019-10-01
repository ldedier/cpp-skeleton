/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   CppImplementer.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ldedier <ldedier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/07/12 20:04:15 by ldedier           #+#    #+#             */
/*   Updated: 2019/10/01 05:12:43 by ldedier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as vscode from 'vscode';
import HppClassDecomposer from './HppClassDecomposer';
import CppImplementation from './Implementation';

class CppImplementer
{

	public command: string;
	public editor: vscode.TextEditor;
	public hppDoc: vscode.TextDocument;
	public generateSettersAndGetters: boolean;

	constructor(editor: vscode.TextEditor, hppDoc: vscode.TextDocument)
	{
		this.editor = editor;
		this.hppDoc = hppDoc;
		this.command = (vscode.workspace.getConfiguration().get('cpp-skeleton.headerCommandId') as string).trim();
		this.generateSettersAndGetters = vscode.workspace.getConfiguration().get('cpp-skeleton.generateSettersAndGetters') as boolean;
	}

	private processFillSkeletonFromHpp()
	{
		var ImplementationsArray: CppImplementation[] | null;
		ImplementationsArray = this.GetImplementationsArray();
		if (ImplementationsArray != null)
		{
			this.editor.edit( edit => {
				const pos: vscode.Position = this.editor.selection.active;
				edit.insert(pos,
					[
						"#include \""+ this.hppDoc.fileName.split("/").pop() as string +"\"",
						(<CppImplementation[]> ImplementationsArray).map(
							implementation => implementation.implements()).join("\n\n")
					].join("\n\n"));
			});
		}
		else
		{
			vscode.window.showErrorMessage(this.hppDoc.fileName + " is not a well formatted hpp class file.");
		}
	}

	private  computeImplementation(regexArray: RegExpExecArray, className: string, innerClass: boolean): CppImplementation
	{
		var type = regexArray[6];
		var rhs = regexArray[12];
		const stc = regexArray[2];
		const methodName = regexArray[13];
		const args = regexArray[14];

		if (rhs.charAt(0) == '(')
		{
			rhs = type + rhs;
			type = "";
		}

		var prototype: string;
		var body = "\t";
		// res = (stc ? "/*\n** static method\n*/\n" : "");
		let arr: RegExpMatchArray | null;
		if (!stc && innerClass && this.generateSettersAndGetters &&  (arr = methodName.match(new RegExp(/.*get([A-Za-z_0-9\-~].*)/g, ""))))
			body = "\treturn (this->_" + arr[1].charAt(0).toLowerCase() + arr[1].slice(1) + ");";
		else if (!stc && innerClass && this.generateSettersAndGetters && (arr = methodName.match(new RegExp(/.*set([A-Za-z_0-9\-~].*)/g, ""))))
			body = "\tthis->_" + arr[1].charAt(0).toLowerCase() + arr[1].slice(1) + " = " + args.split(" ").slice(-1)[0] + ";";
		const classNamePrefix = (innerClass ? className + "::" : "");
		if (type)
			prototype = type + "\t" + classNamePrefix + rhs;
		else
			prototype = classNamePrefix + rhs;
		return (new CppImplementation(prototype, body, methodName, args));
	}

	private GetImplementationsArray(): CppImplementation[] | null
	{
		const decomposer : HppClassDecomposer = new HppClassDecomposer(this.hppDoc);
		if (decomposer.success)
		{
			
			// const Functionregex = RegExp(/^(\t| )*(static)?(\t| )*(([A-Za-z_:\-~]*)((\t| )*(&|\*))?)(\t| )*(([A-Za-z_0-9<=\+\/\-~]*)\((.*)\).*);$/, 'gm');
			const Functionregex = RegExp(/^(\t| )*(static)?(\t| )*(const)?(\t| )*(([A-Za-z_:\-~]*)((\t| )*(\&|\*))?)(\t| )*(([A-Za-z_0-9\<\>!\*=\+\/\-~]*)\((.*)\).*);$/, 'gm');
			let array: RegExpExecArray | null;
			var implementations: CppImplementation[] = [];
			const className : string = (this.editor.document.fileName.split("/").pop() as string).split(".")[0];
			while ((array = Functionregex.exec(decomposer.innerClass)))
			{
				console.log(array);
				let implementation = this.computeImplementation(array, className, true);
				implementations.push(implementation);
			}
			while ((array = Functionregex.exec(decomposer.bottom)))
			{
				console.log(array);
				let implementation = this.computeImplementation(array, className, false);
				implementations.push(implementation);
			}
			return (implementations);
		}
		else
			return (null);
	}

	public  fillSkeleton()
	{
		if (this.command && this.command.length > 0)
		{
			vscode.commands.executeCommand(this.command).then(() => {
				vscode.window.showTextDocument(this.editor.document, 1, false).then(() => {
					this.processFillSkeletonFromHpp();
				})
			}, (err)=> {
				vscode.window.showErrorMessage(err.message);
			})
		}
		else
			this.processFillSkeletonFromHpp();
	}

	private processImplementMissingMethods()
	{
		const text = this.editor.document.getText();
		
		var implementationsArray: CppImplementation[] | null;
		var missingImplementations: CppImplementation[] = [];
		if ((implementationsArray = this.GetImplementationsArray()))
		{
			console.log('text', text);

			for (let i = 0; i < implementationsArray.length; i++) {
				const implementation = implementationsArray[i];
				if (text.indexOf(implementation.prototype) == -1)
					missingImplementations.push(implementationsArray[i])
			}
			if (missingImplementations.length > 0)
			{
				this.editor.edit( edit => {
					const pos: vscode.Position = this.editor.document.positionAt(this.editor.document.getText().length);
					// this.editor.selection.active = pos;
					edit.insert(pos,
						[	"",
							(<CppImplementation[]> missingImplementations).map(elt => elt.implements()).join("\n\n")
						].join("\n\n"));
				});
			}
		}
		else
			vscode.window.showErrorMessage(this.hppDoc.fileName + " is not a well formatted hpp class file.");
	}

	public static implementsMissingMethods()
	{
		if (vscode.window.activeTextEditor
			&& vscode.window.activeTextEditor.document.fileName.split(".").slice(-1)[0] == "cpp")
		{
			let editor = vscode.window.activeTextEditor as vscode.TextEditor;
			const matchinHppFileName = vscode.window.activeTextEditor.document.fileName.replace(/\.cpp/, ".hpp");
			vscode.workspace.openTextDocument(matchinHppFileName).then(
			(doc) => {
					const implementer : CppImplementer = new CppImplementer(editor, doc); 
					implementer.processImplementMissingMethods();
			},
			(err) => {
				vscode.window.showErrorMessage(err.message);
			})
		}
		else
			vscode.window.showErrorMessage("this command shall be executed while editing a .cpp file")
	}

	public static clearAsNewSkeleton()
	{
		if (vscode.window.activeTextEditor
			&& vscode.window.activeTextEditor.document.fileName.split(".").slice(-1)[0] == "cpp")
		{
			let editor = vscode.window.activeTextEditor as vscode.TextEditor;
			const matchinHppFileName = vscode.window.activeTextEditor.document.fileName.replace(/\.cpp/, ".hpp");
			vscode.workspace.openTextDocument(matchinHppFileName).then(
			(doc) => {
				var firstLine = editor.document.lineAt(0);
				var lastLine = editor.document.lineAt(editor.document.lineCount - 1);
				var textRange = new vscode.Range(0, 
								 firstLine.range.start.character, 
								 editor.document.lineCount - 1, 
								 lastLine.range.end.character);
				editor.edit(edit =>
				{
					edit.delete(textRange);
				}).then(() => {
					const implementer : CppImplementer = new CppImplementer(editor, doc); 
					implementer.fillSkeleton();
					})
			},
			(err) => {
				vscode.window.showErrorMessage(err.message);
			})
		}
		else
			vscode.window.showErrorMessage("this command shall be executed while editing a .cpp file")
	}
}
export default CppImplementer;