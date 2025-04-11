"use client";

import { useEffect, useState } from "react";
import SmallLoadingSpinner from "@/components/SmallLoadingSpinner";

type Batch = {
  id: string;
  formulaName: string;
  formulaNumber: string;
  batchId: string;
  assignedTo: string | null;
  assignedBy: string | null;
  status: "InProgress" | "Completed" | "Aborted";
};

const CompletedBatches = ({ refreshKey }: { refreshKey: boolean }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/batches");
      const data = await res.json();
      const completed = data.filter((b: Batch) => b.status === "Completed");
      setBatches(completed);
    } catch (err) {
      console.error("Failed to fetch completed batches", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [refreshKey]);

  return (
    <div className="relative bg-white shadow-md p-4 rounded-lg">
      {loading && <SmallLoadingSpinner />}

      <h2 className="text-xl font-semibold mb-4">✅ Completed Batches</h2>

      {!loading && batches.length === 0 ? (
        <p className="text-sm text-gray-500">No completed batches</p>
      ) : (
        <ul className="space-y-4">
          {batches.map((batch) => (
            <li key={batch.id} className="border p-3 rounded-md">
              <div className="space-y-1">
                <h3 className="text-lg font-bold">{batch.formulaName}</h3>
                <p className="text-sm text-gray-600">Batch #: {batch.batchId}</p>
                <p className="text-sm">
                    <strong>Assigned To:</strong>{" "}
                    {batch.assignedTo || <span className="text-gray-400 italic">Unassigned</span>}
                  </p>
                  <p className="text-sm">
                    <strong>Assigned By:</strong>{" "}
                    {batch.assignedBy || <span className="text-gray-400 italic">Unknown</span>}
                  </p>
                <p className="text-sm text-green-600">Status: {batch.status}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompletedBatches;
