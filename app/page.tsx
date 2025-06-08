export default function Home() {
  return (
    <main className="bg-gray-100 min-h-screen flex flex-col items-center px-4 py-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mb-6">Price Comparison</h1>

      {/* Search Bar and Actions */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 w-full max-w-2xl">
        <input
          type="text"
          placeholder="Keyword or Product Name"
          className="w-full sm:w-2/3 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Search
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Export
        </button>
        <select className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* Comparison Container */}
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amazon */}
          <div>
            <h2 className="text-xl font-semibold text-center mb-4">Amazon</h2>
            <div className="flex flex-col gap-4">
              {[1000, 1200, 950].map((price, i) => (
                <div
                  key={i}
                  className="border p-4 rounded-lg shadow-sm bg-gray-50"
                >
                  <div className="w-full aspect-[2/1] mb-2 flex items-center justify-center rounded-md border-2 border-dashed border-gray-400">
                    <span className="text-gray-500">Image</span>
                  </div>
                  <p>
                    <strong>Title:</strong> Amazon Product{" "}
                    {String.fromCharCode(65 + i)}
                  </p>
                  <p>
                    <strong>Description:</strong> Description for Amazon product{" "}
                    {String.fromCharCode(65 + i)}.
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{price}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Flipkart */}
          <div>
            <h2 className="text-xl font-semibold text-center mb-4">Flipkart</h2>
            <div className="flex flex-col gap-4">
              {[970, 1100, 880].map((price, i) => (
                <div
                  key={i}
                  className="border p-4 rounded-lg shadow-sm bg-gray-50"
                >
                  <div className="w-full aspect-[2/1] mb-2 flex items-center justify-center rounded-md border-2 border-dashed border-gray-400">
                    <span className="text-gray-500">Image</span>
                  </div>
                  <p>
                    <strong>Title:</strong> Flipkart Product{" "}
                    {String.fromCharCode(65 + i)}
                  </p>
                  <p>
                    <strong>Description:</strong> Description for Flipkart
                    product {String.fromCharCode(65 + i)}.
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
