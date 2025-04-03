'use client';

import { useState } from "react";
import { withRoleProtection } from "@/components/withRoleProtection";
import LogoutButton from "@/components/LogoutButton";
import ApprovedFormulaList from "@/components/technician/ApprovedFormulaList";
import BatchRecordForm from "@/components/technician/BatchRecordForm";
import InProgressBatches from "@/components/technician/InProgressBatches";

type Formula = {
  id: string;
  name: string;
  status: string;
};

function TechnicianDashboardBase() {
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const refreshBatches = () => setRefreshToggle(!refreshToggle);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🔧 Technician Dashboard</h1>
        <LogoutButton />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ApprovedFormulaList onSelect={setSelectedFormula} />
        {selectedFormula && (
          <BatchRecordForm
            formula={selectedFormula}
            onCancel={() => setSelectedFormula(null)}
            onSave={refreshBatches}
          />
        )}
        <InProgressBatches refreshKey={refreshToggle} />
      </div>
    </div>
  );
}

export default withRoleProtection(TechnicianDashboardBase, ["Technician"]);
