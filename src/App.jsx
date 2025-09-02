import React, { useEffect, useState } from "react";

const App = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const perPage = 100;

	useEffect(() => {
		fetch("http://20.193.149.47:2242/salons/service")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				setData(data);
				setLoading(false);
			})
			.catch((error) => {
				setError(error.message);
				setLoading(false);
			});
	}, []);

	// Loader
	if (loading)
		return (
			<div className="flex items-center justify-center h-screen bg-gray-100">
				<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);

	// Error
	if (error)
		return (
			<div className="flex items-center justify-center h-screen bg-red-100 text-red-600 font-semibold">
				Error: {error}
			</div>
		);

	// Filter logic
	const filteredData = data.filter((item) => {
		if (!search) return true;
		return (
			item.service_name?.toLowerCase().includes(search.toLowerCase()) ||
			String(item.id).includes(search)
		);
	});

	// Pagination logic
	const totalPages = Math.ceil(filteredData.length / perPage);
	const paginatedData = filteredData.slice(
		(page - 1) * perPage,
		page * perPage
	);

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
			<div className="w-full max-w-6xl bg-white p-6 rounded-xl shadow-lg">
				<h1 className="text-2xl font-bold mb-4 text-center">
					Salon Services
				</h1>

				{/* Search Box */}
				<div className="mb-4 flex justify-center">
					<input
						type="text"
						className="px-3 py-2 rounded border w-full max-w-md focus:outline-none focus:ring focus:border-blue-300"
						placeholder="Search by ID or Service Name..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
					/>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="min-w-full border rounded-lg">
						<thead className="bg-gray-200">
							<tr>
								<th className="px-4 py-2 border text-left">
									ID
								</th>
								<th className="px-4 py-2 border text-left">
									Service Name
								</th>
								<th className="px-4 py-2 border text-left">
									Service Time
								</th>
								<th className="px-4 py-2 border text-left">
									Price
								</th>
								<th className="px-4 py-2 border text-left">
									Discount
								</th>
								<th className="px-4 py-2 border text-left">
									Area
								</th>
							</tr>
						</thead>
						<tbody>
							{paginatedData.map((item) => (
								<tr key={item.id} className="hover:bg-gray-50">
									<td className="px-4 py-2 border">
										{item.id}
									</td>
									<td className="px-4 py-2 border">
										{item.service_name}
									</td>
									<td className="px-4 py-2 border">
										{item.service_time
											? `${item.service_time.days}d ${item.service_time.hours}h ${item.service_time.minutes}m`
											: "N/A"}
									</td>
									<td className="px-4 py-2 border">
										₹{item.price}
									</td>
									<td className="px-4 py-2 border">
										{item.discount}%
									</td>
									<td className="px-4 py-2 border">
										{item.area}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
					<button
						className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
						onClick={() => setPage(1)}
						disabled={page === 1}
					>
						First
					</button>
					<button
						className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						disabled={page === 1}
					>
						Prev
					</button>

					{/* Page Numbers */}
					{Array.from({ length: totalPages }, (_, i) => i + 1).map(
						(num) => (
							<button
								key={num}
								className={`px-3 py-1 rounded ${
									page === num
										? "bg-blue-500 text-white font-semibold"
										: "bg-gray-200 hover:bg-gray-300"
								}`}
								onClick={() => setPage(num)}
							>
								{num}
							</button>
						)
					)}

					<button
						className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
						onClick={() =>
							setPage((p) => Math.min(totalPages, p + 1))
						}
						disabled={page === totalPages}
					>
						Next
					</button>
					<button
						className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
						onClick={() => setPage(totalPages)}
						disabled={page === totalPages}
					>
						Last
					</button>
				</div>
			</div>
		</div>
	);
};

export default App;
