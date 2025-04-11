"use client";

import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import type {
  BatchRecord,
  BatchPhase,
  BatchIngredient,
} from "../../app/types/batches";
import PrintableBatchSheet from "../PrintableBatchSheet";
import { useRef } from "react";

type Props = {
  batch: BatchRecord;
  onCancel: () => void;
  onComplete: () => void;
};

const BatchRecordForm = ({ batch, onCancel, onComplete }: Props) => {
  const { accounts } = useMsal();
  const userEmail = accounts[0]?.username || "unknown";

  const isOwner = batch.assignedTo?.toLowerCase() === userEmail.toLowerCase();
  const [notes, setNotes] = useState("");
  const [accepted, setAccepted] = useState(batch.status === "InProgress");

  const handleAccept = async () => {
    const timestamp = new Date().toISOString();

    const patch = {
      status: "InProgress",
      assignedTo: userEmail,
      assignedAt: timestamp,
    };

    try {
      const res = await fetch(`/api/batches/${batch.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
  
      if (res.ok) {
        setAccepted(true);
        onComplete(); // ✅ trigger dashboard refresh
      } else {
        const result = await res.json();
        alert(`❌ Failed to accept batch: ${result.error}`);
      }
    } catch (err) {
      console.error("PATCH error:", err);
      alert("❌ Network error");
    }
  };

  const handleComplete = async () => {
    const patch = {
      completedBy: userEmail,
      completedAt: new Date().toISOString(),
      completionNotes: notes,
      status: "Completed",
    };

    try {
      const res = await fetch(`/api/batches/${batch.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });

      if (res.ok) {
        alert("✅ Batch completed and signed!");
        onComplete();
      } else {
        const result = await res.json();
        alert(`❌ Failed to complete batch: ${result.error}`);
      }
    } catch (err) {
      console.error("PATCH error:", err);
      alert("❌ Network error");
    }
  };

  const handleAbort = async () => {
    const res = await fetch(`/api/batches/${batch.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "Aborted",
        abortedAt: new Date().toISOString(),
      }),
    });

    const result = await res.json();
    if (res.ok) {
      alert("⛔ Batch aborted");
      onComplete();
    } else {
      alert(`❌ Error: ${result.error}`);
    }
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-lg relative">
      {/* Print Button */}
      {accepted && isOwner && (
        <div className="absolute top-4 right-4">
          <a
            href={`/print/batch/${batch.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            🖨️ Print Sheet
          </a>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">{batch.batchId}</h2>

      <div className="mb-4 text-sm text-gray-600 space-y-1">
        <p>
          <strong>Formula:</strong> {batch.formulaName}
        </p>
        <p>
          <strong>Weight:</strong> {batch.targetWeightKg} kg
        </p>
        <p>
          <strong>Assigned By:</strong> {batch.assignedBy}
        </p>
        <p>
          <strong>You:</strong> {userEmail}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-1 rounded text-xs ${
              batch.status === "Completed"
                ? "bg-green-100 text-green-800"
                : batch.status === "InProgress"
                ? "bg-yellow-100 text-yellow-800"
                : batch.status === "Aborted"
                ? "bg-red-100 text-red-800"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {batch.status}
          </span>
        </p>
      </div>

      {/* Phase Instructions + Ingredients */}
      {batch.phases && (
        <div className="bg-gray-50 border rounded-md p-3 mb-6">
          <p className="font-semibold mb-2">🧪 Ingredients by Phase</p>
          {batch.phases.map((phase: BatchPhase) => (
            <div key={phase.phaseId} className="mb-4">
              <h4 className="font-semibold text-blue-700 mb-1">
                Phase {phase.phaseId}
              </h4>
              <p className="text-sm text-gray-700 italic mb-2">
                📝 {phase.instructions}
              </p>
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-1">Ingredient</th>
                    <th className="p-1 text-right">% w/w</th>
                    <th className="p-1 text-right">Weight (g)</th>
                  </tr>
                </thead>
                <tbody>
                  {phase.ingredients.map((ing: BatchIngredient) => (
                    <tr
                      key={`${phase.phaseId}-${ing.name}`}
                      className="border-t"
                    >
                      <td className="p-1">{ing.name}</td>
                      <td className="p-1 text-right">{ing.percentage}%</td>
                      <td className="p-1 text-right">{ing.weightGrams}g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* Notes Section */}
      {accepted && isOwner && (
        <div className="mb-6">
          <label className="block font-medium mb-1">
            Notes (for issues or comments)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border p-2 rounded"
            rows={4}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-4">
        {!accepted ? (
          <button
            onClick={handleAccept}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🟢 Accept Batch
          </button>
        ) : isOwner ? (
          <>
            <div className="flex gap-4">
              <button
                onClick={handleComplete}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                ✅ Complete & Sign
              </button>
              <button
                onClick={onCancel}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Minimize
              </button>
            </div>

            <div className="ml-auto">
              <button
                onClick={handleAbort}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                ⛔ Abort
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={onCancel}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default BatchRecordForm;
