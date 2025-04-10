// types/batchEvents.ts
export type BatchEvent = {
    id: string; // uuid or `${batchId}-${eventType}-${timestamp}`
    batchId: string;
    eventType: "Created" | "Assigned" | "Started" | "Completed" | "Aborted";
    triggeredBy: string;
    triggeredAt: string;
    notes?: string;
  };
  