import { useEffect, useState } from "react";
import type { BatchRecord } from "../../app/types/batches";

type Props = {
  onSelect: (batch: BatchRecord) => void;
  refreshKey?: boolean;
};

export default function AvailableBatches({ onSelect, refreshKey }: Props) {
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/batches");
        const data = await res.json();
        setBatches(data.filter((b: BatchRecord) => b.status === "NotStarted"));
      } catch (err) {
        console.error("❌ Failed to load batches", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, [refreshKey]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">📦 Available Batches</h2>

      {loading ? (
        <p>Loading...</p>
      ) : batches.length === 0 ? (
        <p className="text-sm text-gray-500">No available batches</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {batches.map((batch, index) => (
            <li
              key={batch.batchId || `${batch.formulaId}-${index}`}
              className="border p-2 rounded hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{batch.formulaName}</p>
                  <p className="text-gray-500">
                    Batch ID: {batch.batchId || "Unknown"}
                  </p>
                  <p className="text-gray-400">Status: {batch.status}</p>
                </div>
                <button
                  onClick={() => onSelect(batch)}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Start
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
