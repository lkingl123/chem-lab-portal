'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type User = {
  id: string;
  displayName: string;
  email: string;
  role: string;
};

export default function UserManagementPanel() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => toast.error("Failed to load users"));
  }, []);

  const updateRole = async (userId: string, newRole: string) => {
    const res = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      toast.success("Role updated");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } else {
      toast.error("Failed to update role");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">👥 Manage Users</h2>
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
                  value={u.role}
                  onChange={(e) => updateRole(u.id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="Manager">Manager</option>
                  <option value="Technician">Technician</option>
                  <option value="Chemist">Chemist</option>
                  <option value="Default Access">Default Access</option>
                </select>
              </td>
              <td className="p-2">
                <button className="text-red-600 hover:underline">Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
