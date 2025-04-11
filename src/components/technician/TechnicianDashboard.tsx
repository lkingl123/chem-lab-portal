"use client";

import { useState } from "react";
import { withRoleProtection } from "@/components/withRoleProtection";
import LogoutButton from "@/components/LogoutButton";

import AvailableBatches from "@/components/technician/AvailableBatches";
import InProgressBatches from "@/components/technician/InProgressBatches";
import CompletedBatches from "@/components/technician/CompletedBatches";
import BatchRecordForm from "@/components/technician/BatchRecordForm";

import type { BatchRecord } from "../../app/types/batches";

function TechnicianDashboardBase() {
  const [selectedBatch, setSelectedBatch] = useState<BatchRecord | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const refreshBatches = () => setRefreshToggle(!refreshToggle);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <header className="max-w-screen-xl mx-auto px-6 flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🔧 Technician Dashboard</h1>
        <LogoutButton />
      </header>

      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column – batch lists */}
        <div className="md:col-span-1 space-y-6">
          <AvailableBatches
            onSelect={setSelectedBatch}
            refreshKey={refreshToggle}
          />
          <InProgressBatches
            refreshKey={refreshToggle}
            onSelect={setSelectedBatch}
            selectedBatchId={selectedBatch?.id || null}
          />
          <CompletedBatches refreshKey={refreshToggle} />
        </div>

        {/* Right column – form */}
        <div className="md:col-span-2">
          {selectedBatch && (
            <BatchRecordForm
              batch={selectedBatch}
              onCancel={() => setSelectedBatch(null)}
              onComplete={() => {
                setSelectedBatch(null);
                refreshBatches();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(TechnicianDashboardBase, ["Technician"]);
