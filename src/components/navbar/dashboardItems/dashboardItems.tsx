import React from 'react';

interface Item {
	Itemname: string;
	SKU: string;
	Amount: number;
}

interface ItemListProps {
	items: Item[];
}

const DashboardItems: React.FC<ItemListProps> = ({ items }) => {
	console.log(items)

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold text-black mb-4">Almacén</h1>
			{items.length > 0 ? (
				<table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
					<thead>
						<tr className="w-full bg-gray-800 text-left text-gray-200 uppercase text-sm">
							<th className="p-4">Quantity</th>
							<th className="p-4 text-center">Name</th>
							<th className="p-4">Code</th>
						</tr>
					</thead>
					<tbody>
						{items.map((item) => (
							<tr key={item.SKU} className="border-b">
								<td className="p-4 text-left text-black">{item.Amount}</td>
								<td className="p-4 text-center text-black">{item.Itemname}</td>
								<td className="p-4 text-left text-black">{item.SKU}</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p className="text-center">No items available.</p>
			)}
		</div>
	);
}

export default DashboardItems;
