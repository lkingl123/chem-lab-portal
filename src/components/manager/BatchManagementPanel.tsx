"use client";

import { useEffect, useState } from "react";
import { Formula } from "../../app/types/formula";
import { BatchRecord } from "../../app/types/batches";

export default function BatchManagementPanel() {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [selectedFormulaId, setSelectedFormulaId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [targetWeight, setTargetWeight] = useState<number>(1);
  const [isCreating, setIsCreating] = useState(false);
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [expanded, setExpanded] = useState<boolean>(false); // dropdown toggle

  useEffect(() => {
    if (expanded) {
      fetchApprovedFormulas();
      fetchBatches();
    }
  }, [expanded]);

  const fetchApprovedFormulas = async () => {
    const res = await fetch("/api/formulas");
    const data = await res.json();
    const approved = data.filter((p: any) => p.productInfo?.status === "Approved");
    console.log("✔ Approved formulas from DB:", approved);

    setFormulas(
      approved.map((p: any): Formula => ({
        id: p.productInfo.id,
        name: p.productInfo.productName,
        formulaNumber: p.productInfo.formulaNumber,
        analogousFormula: p.productInfo.analogousFormula,
        formulaType: p.productInfo.formulaType,
        approvedBy: p.productInfo.approvedBy,
        approvedDescriptionsBy: p.productInfo.approvedDescriptionsBy,
        approvedDate: p.productInfo.approvedDate,
        createdBy: p.productInfo.createdBy || "unknown",
        status: p.productInfo.status,
        batchSize: {
          value: parseFloat(p.productInfo.batchSize?.split(" ")[0]) || 0,
          unit: p.productInfo.batchSize?.split(" ")[1] || "Grams",
        },
        phases: p.phases,
        instructions: p.instructions || [],
        lastModified: p.productInfo.lastModified || "",
      }))
    );
  };

  const fetchBatches = async () => {
    const res = await fetch("/api/batches");
    const data = await res.json();
    console.log("🧪 Loaded batches:", data);
    setBatches(data.reverse());
  };

  const createBatch = async () => {
    if (!batchId || !selectedFormulaId || !targetWeight) {
      alert("❌ Please fill out all fields.");
      return;
    }

    const formula = formulas.find((f) => f.id === selectedFormulaId);
    if (!formula) return;

    const payload: Partial<BatchRecord> = {
      batchId,
      formulaId: formula.id,
      formulaName: formula.name,
      formulaType: formula.formulaType,
      approvedBy: formula.approvedBy,
      approvedDate: formula.approvedDate,
      targetWeightKg: targetWeight,
      createdBy: formula.createdBy || "unknown",
      createdAt: new Date().toISOString(),
      status: "Unassigned",
      assignedTo: null,
      assignedAt: null,
      completedBy: null,
      completedAt: null,
      completionNotes: null,
      phases: formula.phases.map((phase) => ({
        phaseId: phase.phaseId,
        instructions: phase.instructions,
        ingredients: phase.ingredients.map((ing) => ({
          name: ing.name,
          percentage: ing.percentage,
          weightGrams: Math.round((ing.percentage / 100) * targetWeight * 1000),
        })),
      })),
    };

    setIsCreating(true);
    const res = await fetch("/api/batches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setIsCreating(false);

    if (res.ok) {
      alert("✅ Batch created");
      setBatchId("");
      setTargetWeight(20);
      setSelectedFormulaId("");
      fetchBatches();
    } else {
      alert("❌ Failed to create batch");
    }
  };

  return (
    <div className="mt-1">
      {/* Dropdown Header */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left bg-gray-100 border border-gray-300 rounded-md px-4 py-3 font-semibold text-lg hover:bg-gray-200 transition"
      >
        📦 Batch Management
        <span className="float-right text-gray-500">{expanded ? "▼" : "▲"}</span>
      </button>

      {/* Dropdown Body */}
      {expanded && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow space-y-6">
          {/* Create Batch Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Batch ID"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <select
              value={selectedFormulaId}
              onChange={(e) => setSelectedFormulaId(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Formula</option>
              {formulas.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              placeholder="Target Weight (kg)"
              value={targetWeight}
              onChange={(e) => setTargetWeight(Number(e.target.value))}
              className="border p-2 rounded w-full"
            />
          </div>

          <button
            onClick={createBatch}
            disabled={isCreating}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            {isCreating ? "Creating..." : "➕ Create Batch"}
          </button>

          {/* Batch List */}
          <div>
            <h3 className="text-xl font-semibold mt-8 mb-2">📃 Existing Batches</h3>
            {batches.length === 0 ? (
              <p className="text-sm text-gray-600 italic">No batches yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {batches.map((b, idx) => (
                  <li
                    key={b.batchId || `batch-${idx}`}
                    className="border p-3 rounded bg-gray-50 flex justify-between items-center"
                  >
                    <span>
                      <strong>{b.batchId}</strong> — {b.formulaName} —{" "}
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                        {b.status}
                      </span>
                    </span>
                    <span className="text-xs text-gray-500">
                      Created: {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
