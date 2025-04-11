"use client";

import { useState } from "react";
import { withRoleProtection } from "@/components/withRoleProtection";
import LogoutButton from "@/components/LogoutButton";
import { useMsal } from "@azure/msal-react";
import AvailableBatches from "@/components/technician/AvailableBatches";
import InProgressBatches from "@/components/technician/InProgressBatches";
import CompletedBatches from "@/components/technician/CompletedBatches";
import BatchRecordForm from "@/components/technician/BatchRecordForm";

import type { BatchRecord } from "../../app/types/batches";

function TechnicianDashboardBase() {
  const [selectedBatch, setSelectedBatch] = useState<BatchRecord | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const refreshBatches = () => setRefreshToggle(!refreshToggle);

  const { accounts } = useMsal();
  const userEmail = accounts[0]?.username || "Unknown User";

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <header className="max-w-screen-xl mx-auto px-6 flex justify-between items-center mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <h1 className="text-3xl font-bold">🔧 Technician Dashboard</h1>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
            👤 {userEmail}
          </span>
        </div>
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
