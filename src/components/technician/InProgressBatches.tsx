"use client";

import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import SmallLoadingSpinner from "@/components/SmallLoadingSpinner";
import type { BatchRecord } from "../../app/types/batches";

type Props = {
  refreshKey: boolean;
  onSelect: (batch: BatchRecord) => void;
  selectedBatchId: string | null;
};

const InProgressBatches = ({ refreshKey, onSelect, selectedBatchId }: Props) => {
  const { accounts } = useMsal();
  const userEmail = accounts[0]?.username || "";

  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/batches");
      const data = await res.json();
      const active = data.filter((b: BatchRecord) => b.status === "InProgress");
      setBatches(active);
    } catch (err) {
      console.error("Failed to fetch batches", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: "Completed" | "Aborted") => {
    const res = await fetch(`/api/batches/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const result = await res.json();
    if (res.ok) {
      alert(`✅ Batch marked as ${status}`);
      fetchBatches();
    } else {
      alert(`❌ Error: ${result.error}`);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [refreshKey]);

  return (
    <div className="relative bg-white shadow-md p-4 rounded-lg">
      {loading && <SmallLoadingSpinner />}

      <h2 className="text-xl font-semibold mb-4">🔁 In Progress Batches</h2>

      {!loading && batches.length === 0 ? (
        <p className="text-sm text-gray-500">No active batches</p>
      ) : (
        <ul className="space-y-4">
          {batches.map((batch) => {
            const isOwner = batch.assignedTo?.toLowerCase() === userEmail.toLowerCase();

            return (
              <li key={batch.id} className="border p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">{batch.formulaName}</h3>
                    <p className="text-sm text-gray-600">Batch #: {batch.batchId}</p>
                    <p className="text-sm">
                      <strong>Assigned To:</strong>{" "}
                      {batch.assignedTo || (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </p>
                    <p className="text-sm">
                      <strong>Assigned By:</strong>{" "}
                      {batch.assignedBy || (
                        <span className="text-gray-400 italic">Unknown</span>
                      )}
                    </p>
                    <p className="text-sm text-green-600">Status: {batch.status}</p>
                  </div>

                  {isOwner && (
                    <div className="flex flex-col gap-2">
                      {batch.id !== selectedBatchId && (
                        <button
                          onClick={() => onSelect(batch)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          ▶️ Continue
                        </button>
                      )}
                      <button
                        onClick={() => updateStatus(batch.id, "Completed")}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        ✅ Complete
                      </button>
                      <button
                        onClick={() => updateStatus(batch.id, "Aborted")}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        ⛔ Abort
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default InProgressBatches;
