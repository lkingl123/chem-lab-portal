"use client";

import { useEffect, useState } from "react";
import SmallLoadingSpinner from "@/components/SmallLoadingSpinner";

type Batch = {
  id: string;
  formulaName: string;
  formulaNumber: string;
  batchNumber: string;
  status: "InProgress" | "Completed" | "Aborted";
};

const InProgressBatches = ({ refreshKey }: { refreshKey: boolean }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/batches");
      const data = await res.json();
      const active = data.filter((b: Batch) => b.status === "InProgress");
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
        <p>No active batches.</p>
      ) : (
        <ul className="space-y-4">
          {batches.map((batch) => (
            <li key={batch.id} className="border p-3 rounded-md">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">{batch.formulaName}</h3>
                  <p className="text-sm text-gray-600">Formula #: {batch.formulaNumber}</p>
                  <p className="text-sm text-gray-600">Batch #: {batch.batchNumber}</p>
                  <p className="text-sm text-blue-500">Status: {batch.status}</p>
                </div>
                <div className="flex flex-col gap-2">
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InProgressBatches;
