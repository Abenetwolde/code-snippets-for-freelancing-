// app/apps/firebase/components/ProductList.tsx
"use client";

import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import { supabase } from "@/app/lib/supabase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import SearchBar from "./SearchBar";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  imagePath?: string; // Store Supabase file path
  imageUrl?: string;  // Public URL
}

interface ProductListProps {
  user: any;
  isAdmin: boolean;
}

export default function ProductList({ user, isAdmin }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), async (snapshot) => {
      const productList = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          let imageUrl = "";
          if (data.imagePath) {
            const { data: urlData } = supabase.storage.from("products").getPublicUrl(data.imagePath);
            imageUrl = urlData.publicUrl;
          }
          return { id: doc.id, ...data, imageUrl } as Product;
        })
      );
      setProducts(productList);
      setFilteredProducts(productList);
    });
    return () => unsubscribe();
  }, []);

  const handlePurchase = async (productId: string, currentStock: number) => {
    if (currentStock <= 0) return;
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, { stock: currentStock - 1 });
  };

  const handleFilter = (filtered: Product[]) => {
    setFilteredProducts(filtered);
  };

  return (
    <div className="space-y-6">
      <SearchBar products={products} onFilter={handleFilter} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border border-gray-200 p-4 rounded-lg">
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-md mb-2" />
            )}
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">Category: {product.category}</p>
            <p className="text-gray-600">Price: ${product.price}</p>
            <p className="text-gray-600">Rating: {product.rating}/5</p>
            <p className="text-gray-600">Stock: {product.stock}</p>
            <button
              onClick={() => handlePurchase(product.id, product.stock)}
              disabled={product.stock === 0 || !user}
              className={`mt-2 w-full py-2 px-4 rounded-md text-white ${
                product.stock > 0 && user
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}