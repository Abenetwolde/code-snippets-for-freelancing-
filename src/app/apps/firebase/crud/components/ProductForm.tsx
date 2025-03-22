// app/apps/firebase/components/ProductForm.tsx
"use client";

import { useState } from "react";
import { db } from "@/app/lib/firebase";
import { supabase } from "@/app/lib/supabase";
import { collection, addDoc } from "firebase/firestore";

export default function ProductForm() {
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imagePath = "";
      if (image) {
        const filePath = `products/${Date.now()}_${image.name}`;
        const { error: uploadError } = await supabase.storage.from("products").upload(filePath, image);
        if (uploadError) throw uploadError;
        imagePath = filePath;
      }

      await addDoc(collection(db, "products"), {
        name,
        category,
        price,
        rating,
        stock,
        imagePath,
      });

      setName("");
      setCategory("");
      setPrice(0);
      setRating(0);
      setStock(0);
      setImage(null);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border border-gray-200 p-4 rounded-lg">
      <h2 className="text-xl font-semibold">Add Product (Admin Only)</h2>
      <div>
        <label htmlFor="name" className="block text-lg font-medium mb-2">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-lg font-medium mb-2">Category</label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-lg font-medium mb-2">Price</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          className="w-full border border-gray-300 p-2 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="rating" className="block text-lg font-medium mb-2">Rating (0-5)</label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(Math.min(5, Math.max(0, parseFloat(e.target.value))))}
          className="w-full border border-gray-300 p-2 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="stock" className="block text-lg font-medium mb-2">Stock</label>
        <input
          type="number"
          id="stock"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value))}
          className="w-full border border-gray-300 p-2 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="image" className="block text-lg font-medium mb-2">Product Image</label>
        <input
          type="file"
          id="image"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full border border-gray-300 p-2 rounded-md"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600">
        Add Product
      </button>
    </form>
  );
}