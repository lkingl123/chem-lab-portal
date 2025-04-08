// src/app/ManagerDashboard.tsx
"use client";

import { useEffect, useState } from "react";
import SmallLoadingSpinner from "./SmallLoadingSpinner";

interface User {
  id: string;
  displayName: string;
  email: string;
  role: string;
}

interface Product {
  productId: string;
  productName: string;
  marketing: {
    productHighlights: string[];
    productDescription: {
      short: string;
      full: string;
    };
    keyIngredients: {
      name: string;
      benefits: string;
      imageUrl: string;
    }[];
    ingredientList?: {
      name: string;
      inci: string;
      percentage: number;
      purpose: string;
    }[];
    ingredientsList?: string;
  };
}

export default function UserManagementPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteDisplayName, setInviteDisplayName] = useState("");
  const [inviteRole, setInviteRole] = useState("Technician");
  const [isInviting, setIsInviting] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editJson, setEditJson] = useState<string>("");
  const [openProductId, setOpenProductId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      alert("❌ Failed to load users");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const updateRole = async (userId: string, newRole: string) => {
    setLoadingUserId(userId);

    const res = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    setLoadingUserId(null);

    if (res.ok) {
      alert("✅ Role updated");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } else {
      alert("❌ Failed to update role");
    }
  };

  const removeUser = async (userId: string) => {
    const confirmed = confirm("Are you sure you want to remove this user?");
    if (!confirmed) return;

    setLoadingUserId(userId);
    const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
    setLoadingUserId(null);

    if (res.ok) {
      alert("🗑️ User removed");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } else {
      const err = await res.json();
      alert(`❌ Failed to remove user: ${err.error || "Unknown error"}`);
    }
  };


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

  const inviteUser = async () => {
    if (!inviteEmail || !inviteDisplayName || !inviteRole) {
      alert("❌ All fields are required.");
      return;
    }

    setIsInviting(true);

    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          displayName: inviteDisplayName,
          role: inviteRole,
        }),
      });

      const responseBody = await res.json();

      if (res.ok) {
        alert("✅ Invitation sent");
        setInviteEmail("");
        setInviteDisplayName("");
        setInviteRole("Technician");
        setShowInvite(false);
      } else {
        alert(`❌ ${responseBody.error || "Failed to send invite"}`);
      }
    } catch (err) {
      alert("Unexpected error while sending invite");
    }

    setIsInviting(false);
  };

  return (
    <div className="relative bg-white p-6 rounded-xl shadow">
      {/* Spinner Overlay */}
      {loading && (
        <SmallLoadingSpinner />
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">👥 Manage Users</h2>
        <div className="space-x-2">
          <button onClick={fetchUsers} className="px-3 py-1">
            🔄
          </button>
          <button
            onClick={() => setShowInvite(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            ➕ Invite User
          </button>
        </div>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
        {users.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{u.displayName}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">
                <select
                  disabled={loadingUserId === u.id}
                  value={u.role}
                  onChange={(e) => updateRole(u.id, e.target.value)}
                  className="border p-1 rounded disabled:opacity-50"
                >
                  <option value="Manager">Manager</option>
                  <option value="Technician">Technician</option>
                  <option value="Chemist">Chemist</option>
                </select>
              </td>
              <td className="p-2">
                <button
                  onClick={() => removeUser(u.id)}
                  disabled={loadingUserId === u.id}
                  className="text-red-600 hover:underline disabled:opacity-50"
                >
                  {loadingUserId === u.id ? "Removing..." : "Remove"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <h2 className="text-2xl font-semibold mb-4 mt-12">🧪 Product Marketing Overview</h2>
      {loadingProducts ? (
        <SmallLoadingSpinner />
      ) : (
        <div className="grid gap-6">
          {products.map((product) => (
            <div
              key={product.productId}
              className="p-6 border rounded-xl shadow space-y-4"
              style={{ overflow: 'visible', maxHeight: 'none', height: 'auto' }}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{product.productName}</h3>
                <div className="space-x-2">
                  <button
                    onClick={() => setOpenProductId((id) => id === product.productId ? null : product.productId)}
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
                      <p className="text-xs italic text-gray-600 mb-1">
                        Please note that ingredient lists are subject to change and may vary over time.
                      </p>
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

      {/* INVITE MODAL */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">📬 Invite New User</h3>
            <input
              type="text"
              placeholder="Display name"
              value={inviteDisplayName}
              onChange={(e) => setInviteDisplayName(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              required
            />
            <input
              type="email"
              placeholder="Email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              required
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="Manager">Manager</option>
              <option value="Technician">Technician</option>
              <option value="Chemist">Chemist</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowInvite(false)}
                className="px-4 py-2 text-gray-600 hover:underline"
                disabled={isInviting}
              >
                Cancel
              </button>
              <button
                onClick={inviteUser}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={isInviting}
              >
                {isInviting ? "Sending..." : "Send Invite"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL JSON EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-4">✏️ Edit Product JSON</h3>
            <pre className="text-xs text-gray-400 mb-1">Product ID: {editingProduct.productId}</pre>
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
