"use client";

import { useEffect, useState } from "react";
import LoggingLoadingSpinner from "../LoggingLoadingSpinner";

type Formula = {
  id: string;
  name: string;
  status: string;
};

type Props = {
  onSelect: (formula: Formula) => void;
};

const ApprovedFormulaList = ({ onSelect }: Props) => {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedFormulas = async () => {
      try {
        const res = await fetch("/api/formulas");
        const data = await res.json();
        const approved = data.filter((f: Formula) => f.status === "Approved");
        setFormulas(approved);
      } catch (error) {
        console.error("❌ Failed to fetch approved formulas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedFormulas();
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow-md p-4 rounded-lg text-center">
        <LoggingLoadingSpinner />
      </div>
    );
  }

  if (formulas.length === 0) {
    return (
      <div className="bg-white shadow-md p-4 rounded-lg text-center">
        <p>No approved formulas found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">✅ Approved Formulas</h2>
      <ul className="space-y-4">
        {formulas.map((formula) => (
          <li key={formula.id} className="border p-3 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">{formula.name}</h3>
                <p className="text-sm text-gray-500">ID: {formula.id}</p>
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => onSelect(formula)}
              >
                Start Production
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApprovedFormulaList;
