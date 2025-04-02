// components/chemist/FormulaEditor.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

const FormulaEditor = () => {
  const { id } = useParams();
  const [rows, setRows] = useState([
    { ingredient: "Water", amount: "50", unit: "ml" },
    { ingredient: "Glycerin", amount: "10", unit: "ml" },
  ]);

  const updateRow = (
    index: number,
    field: "ingredient" | "amount" | "unit",
    value: string
  ) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };
  

  const addRow = () => {
    setRows([...rows, { ingredient: "", amount: "", unit: "" }]);
  };

  const removeRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

  const saveFormula = () => {
    // Will be connected to Cosmos DB in Step 2
    console.log("Saving formula:", { id, rows });
    alert("Formula saved! (placeholder)");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editing Formula: {id}</h1>

      <table className="w-full table-auto border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Ingredient</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Unit</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="border px-2 py-1">
                <input
                  className="w-full"
                  value={row.ingredient}
                  onChange={(e) => updateRow(index, "ingredient", e.target.value)}
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  className="w-full"
                  value={row.amount}
                  onChange={(e) => updateRow(index, "amount", e.target.value)}
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  className="w-full"
                  value={row.unit}
                  onChange={(e) => updateRow(index, "unit", e.target.value)}
                />
              </td>
              <td className="border px-2 py-1 text-center">
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => removeRow(index)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-4">
        <button
          onClick={addRow}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Add Row
        </button>
        <button
          onClick={saveFormula}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          💾 Save Formula
        </button>
      </div>
    </div>
  );
};

export default FormulaEditor;
