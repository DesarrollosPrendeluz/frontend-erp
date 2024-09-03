import React, { useState } from "react";
import Link from "next/link";
interface NavItem {
	name: string;
	href: string;
}

const navItems: NavItem[] = [
	{ name: "Dashboard", href: "/" },
	{ name: "Analytics", href: "/analytics" },
	{ name: "Settings", href: "/settings" },
];

const Navbar: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<nav className="bg-gray-800 p-4">
			<div className="container mx-auto flex items-center justify-between">
				<div className="text-white text-xl font-bold">
					Dashboard
				</div>

				<div className="hidden md:flex space-x-8">
					{navItems.map((item) => (
						<Link key={item.name} href={item.href}>
							<a className="text-gray-300 hover:text-white">{item.name}</a>
						</Link>
					))}
				</div>

				<div className="hidden md:flex items-center space-x-4">
					<span className="text-gray-300">Admin</span>
					<div className="relative">
						<button className="text-white focus:outline-none">
							<img
								className="h-8 w-8 rounded-full"
								src="https://via.placeholder.com/32"
								alt="User Profile"
							/>
						</button>
					</div>
				</div>

				<div className="md:hidden">
					<button onClick={toggleMenu} className="text-gray-300 hover:text-white focus:outline-none">
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
							/>
						</svg>
					</button>
				</div>
			</div>

			{isOpen && (
				<div className="md:hidden">
					{navItems.map((item) => (
						<Link key={item.name} href={item.href}>
							<a className="block py-2 px-4 text-gray-300 hover:bg-gray-700 hover:text-white">
								{item.name}
							</a>
						</Link>
					))}
					<div className="py-2 px-4">
						<span className="block text-gray-300">Admin</span>
						<div className="flex items-center mt-2">
							<img
								className="h-8 w-8 rounded-full"
								src="https://via.placeholder.com/32"
								alt="User Profile"
							/>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;

