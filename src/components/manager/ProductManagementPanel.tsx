"use client";

import { useEffect, useState } from "react";
import SmallLoadingSpinner from "../SmallLoadingSpinner";
import type { Product } from "../../app/types/product";

export default function ProductManagementPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editJson, setEditJson] = useState<string>("");
  const [openProductId, setOpenProductId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false); 

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("❌ Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setEditJson(JSON.stringify(product, null, 2));
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    try {
      const parsed = JSON.parse(editJson);
      const res = await fetch(`/api/products/${editingProduct.productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      if (res.ok) {
        const updated = await res.json();
        alert("✅ Product updated");
        setProducts((prev) =>
          prev.map((p) => (p.productId === updated.productId ? updated : p))
        );
        setEditingProduct(null);
      } else {
        alert("❌ Failed to update product");
      }
    } catch (err) {
      alert("❌ Invalid JSON format");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });

    if (res.ok) {
      alert("🗑️ Product deleted");
      setProducts((prev) => prev.filter((p) => p.productId !== productId));
    } else {
      alert("❌ Failed to delete product");
    }
  };

  useEffect(() => {
    if (expanded) fetchProducts();
  }, [expanded]);

  return (
    <div className="mt-12">
      {/* Dropdown Header */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left bg-gray-100 border border-gray-300 rounded-md px-4 py-3 font-semibold text-lg hover:bg-gray-200 transition"
      >
        🧪 Product Marketing Overview
        <span className="float-right text-gray-500">
          {expanded ? "▼" : "▲"}
        </span>
      </button>

      {/* Dropdown Body */}
      {expanded && (
        <div className="mt-6">
          {loadingProducts ? (
            <SmallLoadingSpinner />
          ) : (
            <div className="grid gap-6">
              {products.map((product) => (
                <div
                  key={product.productId}
                  className="p-6 border rounded-xl shadow space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold">{product.productName}</h3>
                    <div className="space-x-2">
                      <button
                        onClick={() =>
                          setOpenProductId((id) =>
                            id === product.productId ? null : product.productId
                          )
                        }
                        className="text-sm text-gray-700 hover:underline"
                      >
                        {openProductId === product.productId ? "Hide" : "View All"}
                      </button>
                      <button
                        onClick={() => handleEditClick(product)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.productId)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  {openProductId === product.productId && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-1">Product Description:</h4>
                        <p className="text-sm text-gray-800 whitespace-pre-line">
                          {product.marketing.productDescription.full}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-1">Product Highlights:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-800">
                          {product.marketing.productHighlights.map((highlight, i) => (
                            <li key={i}>{highlight}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-1">Key Ingredients:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-800">
                          {product.marketing.keyIngredients.map((ing, i) => (
                            <li key={i}>{ing.name}</li>
                          ))}
                        </ul>
                      </div>

                      {product.marketing.ingredientList && (
                        <div>
                          <h4 className="font-semibold mb-1">Ingredient List:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-800">
                            {product.marketing.ingredientList
                              .slice()
                              .sort((a, b) => b.percentage - a.percentage)
                              .map((ing, i) => (
                                <li key={i}>
                                  <strong>{ing.inci}</strong> ({ing.name}) – {ing.percentage}% ({ing.purpose})
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}

                      {product.marketing.ingredientsList && (
                        <div>
                          <h4 className="font-semibold mb-1">Ingredients:</h4>
                          <p className="text-sm text-gray-800 whitespace-pre-line">
                            {product.marketing.ingredientsList}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* JSON Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-4">✏️ Edit Product JSON</h3>
            <textarea
              value={editJson}
              onChange={(e) => setEditJson(e.target.value)}
              className="w-full border p-3 rounded h-96 font-mono text-sm mb-4"
              placeholder="Paste full JSON here"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
