'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import axios from 'axios';
import { exportResultsToExcel } from './utils/exportToExcel';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<{ amazon: any[]; flipkart: any[] }>({ amazon: [], flipkart: [] });
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortDisabled, setSortDisabled] = useState(true);
  const [loadingCounter, setLoadingCounter] = useState(0);

  const sortResults = (data: any[], order: 'asc' | 'desc') => {
    return [...data].sort((a, b) => {
      const priceA = parseFloat((a.price || '').toString().replace(/[^\d.]/g, '')) || 0;
      const priceB = parseFloat((b.price || '').toString().replace(/[^\d.]/g, '')) || 0;
      return order === 'asc' ? priceA - priceB : priceB - priceA;
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const order = e.target.value as 'asc' | 'desc';
    setSortOrder(order);
    setResults(prev => ({
      amazon: sortResults(prev.amazon, order),
      flipkart: sortResults(prev.flipkart, order)
    }));
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setSortDisabled(true);
    try {
      const res = await axios.post('http://localhost:4000/scrape', {
        keyword: searchTerm,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setResults({
        amazon: sortResults(res.data.amazon_data || [], sortOrder),
        flipkart: sortResults(res.data.flipkart_data || [], sortOrder),
      });
      setSortDisabled(false);
    } catch (error) {
      console.error('Error making POST request:', error);
      alert('Error occurred during POST request.');
      setResults({ amazon: [], flipkart: [] });
      setSortDisabled(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setResults({ amazon: [], flipkart: [] });
      setSortDisabled(true);
    }
  }, [searchTerm]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (loading) {
      setLoadingCounter(0);
      timer = setInterval(() => {
        setLoadingCounter((prev) => prev + 1);
      }, 1000);
    } else {
      setLoadingCounter(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading]);

  return (
    <main className="bg-gray-100 min-h-screen flex flex-col items-center px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Price Comparison</h1>

      {/* Search Section */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 w-full max-w-2xl">
        <input
          type="text"
          placeholder="Keyword or Product Name"
          className="w-full sm:w-2/3 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Search
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={results.amazon.length === 0 && results.flipkart.length === 0}
          onClick={() => exportResultsToExcel(results.amazon, results.flipkart)}
        >
          Export
        </button>
        <select
          id="sortprice"
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sortOrder}
          onChange={handleSortChange}
          disabled={sortDisabled}
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* Comparison Container */}
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amazon Column */}
          <div>
            <h2 className="text-xl font-semibold text-center mb-4">Amazon</h2>
            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="text-center text-gray-500">Loading... {loadingCounter}s</div>
              ) : results.amazon.length === 0 ? (
                <div className="text-center text-gray-400">No results</div>
              ) : (
                results.amazon.map((item, i) => (
                  <div
                    key={i}
                    className="border p-4 rounded-lg shadow-sm bg-gray-50"
                  >
                    <div className="w-full aspect-[2/1] mb-2 flex items-center justify-center rounded-md border-2 border-dashed border-gray-400">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="h-full max-h-32 object-contain" />
                      ) : (
                        <span className="text-gray-500">Image</span>
                      )}
                    </div>
                    <p>
                      <strong>Title:</strong> {item.title || 'N/A'}
                    </p>
                    <p>
                      <strong > Product Link: <Link className="text-green-500" href={item.link || ''} passHref={true} target="_blank" >CLICK</Link></strong>
                    </p>
                    <p>
                      <strong>Price:</strong> {item.price ? `${item.price}` : 'N/A'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Flipkart Column */}
          <div>
            <h2 className="text-xl font-semibold text-center mb-4">Flipkart</h2>
            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="text-center text-gray-500">Loading... {loadingCounter}s</div>
              ) : results.flipkart.length === 0 ? (
                <div className="text-center text-gray-400">No results</div>
              ) : (
                results.flipkart.map((item, i) => (
                  <div
                    key={i}
                    className="border p-4 rounded-lg shadow-sm bg-gray-50"
                  >
                    <div className="w-full aspect-[2/1] mb-2 flex items-center justify-center rounded-md border-2 border-dashed border-gray-400">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="h-full max-h-32 object-contain" />
                      ) : (
                        <span className="text-gray-500">Image</span>
                      )}
                    </div>
                    <p>
                      <strong>Title:</strong> {item.title || 'N/A'}
                    </p>
                    <p>
                      <strong > Product Link: <Link className="text-green-500" href={item.link || ''} passHref={true} target="_blank" >CLICK</Link></strong>
                    </p>
                    <p>
                      <strong>Price:</strong> {item.price ? `${item.price}` : 'N/A'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
