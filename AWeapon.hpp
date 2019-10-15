/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   AWeapon.hpp                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ldedier <ldedier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/10/15 13:52:17 by ldedier           #+#    #+#             */
/*   Updated: 2019/10/15 23:06:18 by ldedier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef AWEAPON_HPP
# define AWEAPON_HPP

# include <iostream>

class AWeapon
{
	public:
		AWeapon(std::string const &name, int apcost, int damage);
		AWeapon(AWeapon const &instance);
		AWeapon &operator=(AWeapon const &rhs);
		~AWeapon(void);

		std::string		getName(void) const;
		int				getAPCost(void) const;
		int				getDamage(void) const;

		void			setName(std::string name);		
		void			setAPCost(int apcost);
		void			setDamage(int damage);
		
		virtual void	attack() const = 0;
		static void		func(void);

	protected:
		AWeapon(void);
		std::string _name;
		int			_apcost;
		int			_damage;
};

std::ostream &operator<<(std::ostream &o, AWeapon const &instance);
#endif