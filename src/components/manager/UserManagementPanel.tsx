"use client";

import { useEffect, useState } from "react";
import SmallLoadingSpinner from "../SmallLoadingSpinner";

interface User {
  id: string;
  displayName: string;
  email: string;
  role: string;
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
  const [expanded, setExpanded] = useState<boolean>(true);

  useEffect(() => {
    if (expanded) fetchUsers();
  }, [expanded]);

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
    <div className="mt-8">
      {/* Dropdown Header */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left bg-gray-100 border border-gray-300 rounded-md px-4 py-3 font-semibold text-lg hover:bg-gray-200 transition"
      >
        👥 Manage Users
        <span className="float-right text-gray-500">
          {expanded ? "▼" : "▲"}
        </span>
      </button>

      {/* Dropdown Content */}
      {expanded && (
        <div className="mt-6 relative">
          {loading && <SmallLoadingSpinner />}

          <div className="flex justify-between items-center mb-4">
            <div />
            <button
              onClick={() => setShowInvite(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            >
              ➕ Invite User
            </button>
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

          {/* Invite Modal */}
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
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full border p-2 rounded mb-4"
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
        </div>
      )}
    </div>
  );
}
