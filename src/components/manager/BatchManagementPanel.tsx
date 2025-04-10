"use client";

import { useEffect, useState } from "react";
import { Formula, Phase } from "../../app/types/formula";
import { BatchRecord } from "../../app/types/batches";

export default function BatchManagementPanel() {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [selectedFormulaId, setSelectedFormulaId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [targetWeight, setTargetWeight] = useState<number>(20);
  const [isCreating, setIsCreating] = useState(false);
  const [batches, setBatches] = useState<BatchRecord[]>([]);

  useEffect(() => {
    fetchApprovedFormulas();
    fetchBatches();
  }, []);

  const fetchApprovedFormulas = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    const approved = data.filter((p: any) => p.productInfo?.status === "Approved");

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
          unit: p.productInfo.batchSize?.split(" ")[1] || "Grams"
        },
        phases: p.phases,
        instructions: p.instructions || [],
        lastModified: p.productInfo.lastModified || ""
      }))
    );
  };

  const fetchBatches = async () => {
    const res = await fetch("/api/batches");
    const data = await res.json();
    setBatches(data.reverse());
  };

  const createBatch = async () => {
    if (!batchId || !selectedFormulaId || !targetWeight) {
      alert("Please fill out all fields.");
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
      createdBy: "Hardip", // In future: use logged-in manager
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
          weightGrams: Math.round((ing.percentage / 100) * targetWeight * 1000)
        }))
      }))
    };

    setIsCreating(true);
    const res = await fetch("/api/batches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
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
    <div className="mt-16 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">📦 Batch Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Batch ID"
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={selectedFormulaId}
          onChange={(e) => setSelectedFormulaId(e.target.value)}
          className="border p-2 rounded"
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
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={createBatch}
        disabled={isCreating}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
      >
        {isCreating ? "Creating..." : "➕ Create Batch"}
      </button>

      <h3 className="text-xl font-semibold mt-10 mb-2">📃 Existing Batches</h3>
      <ul className="space-y-2 text-sm">
        {batches.map((b) => (
          <li key={b.batchId} className="border p-3 rounded bg-gray-50">
            <strong>{b.batchId}</strong> — {b.formulaName} — {b.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
