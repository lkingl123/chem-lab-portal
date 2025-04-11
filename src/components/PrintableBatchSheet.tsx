// components/PrintableBatchSheet.tsx
"use client";

import { forwardRef } from "react";
import type { BatchRecord, BatchPhase, BatchIngredient } from "../app/types/batches";

type Props = {
  batch: BatchRecord;
};

const PrintableBatchSheet = forwardRef<HTMLDivElement, Props>(({ batch }, ref) => {
  return (
    <div ref={ref} className="p-4">
      <h2 className="text-xl font-semibold mb-4">{batch.batchId}</h2>

      <div className="mb-4 text-sm text-gray-600 space-y-1">
        <p><strong>Formula:</strong> {batch.formulaName}</p>
        <p><strong>Weight:</strong> {batch.targetWeightKg} kg</p>
        <p><strong>Assigned By:</strong> {batch.assignedBy}</p>
        <p><strong>Status:</strong> {batch.status}</p>
      </div>

      {batch.phases && (
        <div className="border rounded-md p-3 mb-6">
          <p className="font-semibold mb-2">🧪 Ingredients by Phase</p>
          {batch.phases.map((phase: BatchPhase) => (
            <div key={phase.phaseId} className="mb-4">
              <h4 className="font-semibold text-blue-700 mb-1">Phase {phase.phaseId}</h4>
              <p className="text-sm italic mb-2">📝 {phase.instructions}</p>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-1 text-left">Ingredient</th>
                    <th className="p-1 text-right">% w/w</th>
                    <th className="p-1 text-right">Weight (g)</th>
                  </tr>
                </thead>
                <tbody>
                  {phase.ingredients.map((ing: BatchIngredient) => (
                    <tr key={`${phase.phaseId}-${ing.name}`} className="border-t">
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
    </div>
  );
});

export default PrintableBatchSheet;
