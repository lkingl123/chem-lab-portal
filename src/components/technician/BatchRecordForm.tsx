"use client";

import { useState } from "react";
import type { Formula } from "../../app/types/formula";

type Props = {
  formula: Formula;
  onCancel: () => void;
  onSave: () => void;
};

const BatchRecordForm = ({ formula, onCancel, onSave }: Props) => {
  const [batchNumber, setBatchNumber] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    const record = {
      formulaId: formula.id,
      formulaName: formula.name,
      formulaNumber: formula.formulaNumber,
      batchNumber,
      notes,
      status: "InProgress",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Batch record saved!");
        onSave();
        onCancel();
      } else {
        alert(`❌ Failed to save batch: ${result.error}`);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("❌ Network error saving batch");
    }
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        🧾 Start Batch for: {formula.name}
      </h2>

      <div className="mb-4 text-sm text-gray-600">
        <p><strong>Formula Number:</strong> {formula.formulaNumber}</p>
        <p><strong>Batch Size:</strong> {formula.batchSize?.value} {formula.batchSize?.unit}</p>
      </div>

      {/* INGREDIENTS BY PHASE */}
      {formula.phases && (
        <div className="bg-gray-50 border rounded-md p-3 mb-6">
          <p className="font-semibold mb-2">🧪 Ingredients by Phase</p>
          {Object.entries(formula.phases).map(([phaseKey, ingredients]) => (
            <div key={phaseKey} className="mb-4">
              <h4 className="font-semibold text-blue-700 mb-1">Phase {phaseKey}</h4>
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-1">Ingredient</th>
                    <th className="p-1">INCI</th>
                    <th className="p-1">Function</th>
                    <th className="p-1">% w/w</th>
                    <th className="p-1">Grams</th>
                    <th className="p-1">Ounces</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ing, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-1">{ing.ingredient}</td>
                      <td className="p-1">{ing.inci || "-"}</td>
                      <td className="p-1">{ing.function || "-"}</td>
                      <td className="p-1">{ing.percentage}%</td>
                      <td className="p-1">{ing.grams}</td>
                      <td className="p-1">{ing.ounces}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* INSTRUCTIONS */}
      {formula.instructions?.length > 0 && (
        <div className="bg-gray-50 border rounded-md p-3 mb-6">
          <p className="font-semibold mb-2">📋 Instructions</p>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
            {formula.instructions.map((step, index) => (
              <li key={index}>
                <strong>Phase {step.phase}:</strong> {step.text}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* BATCH NUMBER + NOTES */}
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Batch Number</label>
          <input
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block font-medium">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border p-2 rounded mt-1"
            rows={4}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Generate Batch Record
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchRecordForm;
