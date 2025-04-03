"use client";

import { useState } from "react";

type Formula = {
  id: string;
  name: string;
};

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
      batchNumber,
      notes,
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
        onSave();    // ⬅️ Refresh batch list
        onCancel();  // ⬅️ Close form
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
        <div className="flex gap-4">
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
