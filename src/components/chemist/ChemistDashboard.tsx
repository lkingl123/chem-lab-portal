// components/chemist/ChemistDashboard.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import LoggingLoadingSpinner from "@/components/LoggingLoadingSpinner";
import { withRoleProtection } from "@/components/withRoleProtection";

type Formula = {
  id: string;
  name: string;
  status: string;
};

function ChemistDashboardBase() {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormulas = async () => {
      try {
        const res = await fetch("/api/formulas");
        const data = await res.json();
        setFormulas(data);
      } catch (err) {
        console.error("Failed to fetch formulas", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormulas();
  }, []);

  return (
    <div className="p-8 space-y-6">
      {/* Header row */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🧪 Chemist Dashboard</h1>
        <LogoutButton />
      </div>

      <p className="text-gray-700">View formulas, edit them, and submit for review.</p>

      {/* Sub-header + create button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Formulas</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => {
            alert("🚧 Create New Formula feature coming soon!");
          }}
        >
          + Create New Formula
        </button>
      </div>

      {/* Conditional Loading State */}
      {loading ? (
        <LoggingLoadingSpinner />
      ) : formulas.length === 0 ? (
        <p>No formulas found.</p>
      ) : (
        <div className="grid gap-4">
          {formulas.map((formula) => (
            <div
              key={formula.id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{formula.name}</h3>
              <p className="text-gray-600">Status: {formula.status}</p>
              <Link
                href={`/chemist/formula/${formula.id}`}
                className="text-blue-500 hover:underline"
              >
                Open
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default withRoleProtection(ChemistDashboardBase, ["Chemist"]);
