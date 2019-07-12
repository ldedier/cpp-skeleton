/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Implementation.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ldedier <ldedier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/07/12 20:04:26 by ldedier           #+#    #+#             */
/*   Updated: 2019/07/12 20:12:30 by ldedier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

class CppImplementation 
{
	prototype: string;
	body: string;
	methodName: string;
	parameters: string;

	constructor(prototype: string, body: string, methodName: string, parameters: string)
	{
		this.prototype = prototype;
		this.body = body;
		this.methodName = methodName;
		this.parameters = parameters;
	}

	public implements(): string
	{
		return (this.prototype + "\n{\n" + this.body + "\n}");
	}
}
export default CppImplementation;