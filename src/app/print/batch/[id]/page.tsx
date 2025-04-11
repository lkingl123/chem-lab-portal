"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import PrintableBatchSheet from "@/components/PrintableBatchSheet";
import LoggingLoadingSpinner from "@/components/LoggingLoadingSpinner"; 
import type { BatchRecord } from "@/app/types/batches";

export default function PrintBatchPage() {
  const { id } = useParams();
  const [batch, setBatch] = useState<BatchRecord | null>(null);
  const hasPrintedRef = useRef(false);

  useEffect(() => {
    const fetchBatch = async () => {
      const res = await fetch(`/api/batches/${id}`);
      const data = await res.json();
      setBatch(data);
    };

    fetchBatch();
  }, [id]);

  useEffect(() => {
    if (batch && !hasPrintedRef.current) {
      hasPrintedRef.current = true;
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [batch]);

  if (!batch) return <LoggingLoadingSpinner />; 

  return (
    <div className="p-6 print:p-0">
      <PrintableBatchSheet batch={batch} />
    </div>
  );
}
