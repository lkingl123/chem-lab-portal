'use client';

import { useState } from "react";
import { withRoleProtection } from "@/components/withRoleProtection";
import LogoutButton from "@/components/LogoutButton";
import ApprovedFormulaList from "@/components/technician/ApprovedFormulaList";
import BatchRecordForm from "@/components/technician/BatchRecordForm";
import InProgressBatches from "@/components/technician/InProgressBatches";
import type { Formula } from "../../app/types/formula";

function TechnicianDashboardBase() {
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const refreshBatches = () => setRefreshToggle(!refreshToggle);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <header className="max-w-screen-xl mx-auto px-6 flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🔧 Technician Dashboard</h1>
        <LogoutButton />
      </header>

      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column (1/3) – Approved Formulas + In Progress */}
        <div className="md:col-span-1 space-y-6">
          <ApprovedFormulaList onSelect={setSelectedFormula} />
          <InProgressBatches refreshKey={refreshToggle} />
        </div>

        {/* Right column (2/3) – Batch Record Form */}
        <div className="md:col-span-2">
          {selectedFormula && (
            <BatchRecordForm
              formula={selectedFormula}
              onCancel={() => setSelectedFormula(null)}
              onSave={refreshBatches}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(TechnicianDashboardBase, ["Technician"]);
