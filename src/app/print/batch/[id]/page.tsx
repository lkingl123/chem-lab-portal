// app/print/batch/[id]/page.tsx

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PrintableBatchSheet from "@/components/PrintableBatchSheet";
import type { BatchRecord } from "@/app/types/batches";

export default function PrintBatchPage() {
  const { id } = useParams();
  const [batch, setBatch] = useState<BatchRecord | null>(null);

  useEffect(() => {
    const fetchBatch = async () => {
      const res = await fetch(`/api/batches/${id}`);
      const data = await res.json();
      setBatch(data);
    };

    fetchBatch();
  }, [id]);

  useEffect(() => {
    if (batch) {
      setTimeout(() => {
        window.print();
      }, 500); // give time for rendering
    }
  }, [batch]);

  if (!batch) return <p>Loading...</p>;

  return (
    <div className="p-6 print:p-0">
      <PrintableBatchSheet batch={batch} />
    </div>
  );
}
