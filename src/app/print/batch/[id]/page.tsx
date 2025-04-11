"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import PrintableBatchSheet from "@/components/PrintableBatchSheet";
import LoggingLoadingSpinner from "@/components/LoggingLoadingSpinner";
import type { BatchRecord } from "@/app/types/batches";

export default function PrintBatchPage() {
  const { id } = useParams();
  const [batch, setBatch] = useState<BatchRecord | null>(null);
  const hasPrintedRef = useRef(false); // ✅ Use a ref instead of state

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const res = await fetch(`/api/batches/${id}`);
        const data = await res.json();
        setBatch(data);
      } catch (err) {
        console.error("❌ Failed to fetch batch:", err);
      }
    };

    fetchBatch();
  }, [id]);

  useEffect(() => {
    if (batch && !hasPrintedRef.current) {
      hasPrintedRef.current = true; // ✅ Prevents double triggering
      setTimeout(() => {
        window.print();
      }, 500); // Give some time to render
    }
  }, [batch]);

  if (!batch) return <LoggingLoadingSpinner />;

  return (
    <div className="p-6 print:p-0">
      <PrintableBatchSheet batch={batch} />
    </div>
  );
}
