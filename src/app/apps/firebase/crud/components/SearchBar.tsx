// app/apps/firebase/components/SearchBar.tsx
"use client";

import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  imageUrl?: string;
}

interface SearchBarProps {
  products: Product[];
  onFilter: (filtered: Product[]) => void;
}

export default function SearchBar({ products, onFilter }: SearchBarProps) {
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(Infinity);
  const [minRating, setMinRating] = useState<number>(0);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category ? product.category === category : true;
      const matchesPrice = product.price >= minPrice && (maxPrice === Infinity || product.price <= maxPrice);
      const matchesRating = product.rating >= minRating;
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
    onFilter(filtered);
  }, [search, category, minPrice, maxPrice, minRating, products]);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded-md"
      />
      <div className="flex gap-4 flex-wrap">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice || ""}
          onChange={(e) => setMinPrice(e.target.value ? parseFloat(e.target.value) : 0)}
          className="border border-gray-300 p-2 rounded-md w-24"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice === Infinity ? "" : maxPrice}
          onChange={(e) => setMaxPrice(e.target.value ? parseFloat(e.target.value) : Infinity)}
          className="border border-gray-300 p-2 rounded-md w-24"
        />
        <input
          type="number"
          placeholder="Min Rating"
          value={minRating || ""}
          onChange={(e) => setMinRating(e.target.value ? parseFloat(e.target.value) : 0)}
          className="border border-gray-300 p-2 rounded-md w-24"
        />
      </div>
    </div>
  );
}