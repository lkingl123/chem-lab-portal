"use client";
import type { BatchRecord, BatchPhase, BatchIngredient } from "@/app/types/batches";

export default function PrintableBatchSheet({ batch }: { batch: BatchRecord }) {
  return (
    <div className="text-black p-8">
      <h1 className="text-2xl font-bold mb-4">Batch Sheet: {batch.batchId}</h1>

      <div className="mb-6 space-y-1 text-sm">
        <p><strong>Formula Name:</strong> {batch.formulaName}</p>
        <p><strong>Formula ID:</strong> {batch.formulaId}</p>
        <p><strong>Target Weight (kg):</strong> {batch.targetWeightKg}</p>
        <p><strong>Assigned To:</strong> {batch.assignedTo || "-"}</p>
        <p><strong>Assigned By:</strong> {batch.assignedBy || "-"}</p>
        <p><strong>Status:</strong> {batch.status}</p>
        <p><strong>Completed By:</strong> {batch.completedBy || "-"}</p>
        <p><strong>Completion Notes:</strong> {batch.completionNotes || "-"}</p>
        <p><strong>Completed At:</strong> {batch.completedAt || "-"}</p>
      </div>

      {batch.phases?.map((phase: BatchPhase) => (
        <div key={phase.phaseId} className="mb-6">
          <h2 className="text-lg font-semibold mb-1">Phase {phase.phaseId}</h2>
          <p className="italic text-gray-700 mb-2">{phase.instructions}</p>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-1">Ingredient</th>
                <th className="text-right p-1">% w/w</th>
                <th className="text-right p-1">Weight (g)</th>
              </tr>
            </thead>
            <tbody>
              {phase.ingredients.map((ing: BatchIngredient) => (
                <tr key={ing.name} className="border-t">
                  <td className="p-1">{ing.name}</td>
                  <td className="text-right p-1">{ing.percentage}%</td>
                  <td className="text-right p-1">{ing.weightGrams}g</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      
    </div>
  );
}
