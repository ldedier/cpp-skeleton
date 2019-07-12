/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   HppClassDecomposer.ts                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ldedier <ldedier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/07/12 20:04:23 by ldedier           #+#    #+#             */
/*   Updated: 2019/07/12 20:04:33 by ldedier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as vscode from 'vscode'

class HppClassDecomposer
{
	public text: string;
	public top: string;
	public innerClass: string;
	public bottom: string;
	public publicPart: string;
	public privatePart: string;
	public success: boolean;

	constructor(document: vscode.TextDocument)
	{
		this.text = document.getText();
		
		const regex : RegExp =  new RegExp(/^([^]*)class[^]*{([^]*public:([^]*)private:([^]*))};([^]*)$/, 'g');
		const array: RegExpExecArray | null = regex.exec(document.getText());
		if (array == null)
		{
			this.top = "";
			this.innerClass = "";
			this.publicPart = "";
			this.privatePart = "";
			this.bottom = "";
			this.text = "";
			this.success = false;
		}
		else
		{
			this.text = array[0];
			this.top = array[1];
			this.innerClass = array[2];
			this.publicPart = array[3];
			this.privatePart = array[4];
			this.bottom = array[5];
			this.success = true;
		}
	}

}



export default HppClassDecomposer;