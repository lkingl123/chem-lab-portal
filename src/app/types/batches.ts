export interface BatchIngredient {
    name: string;
    percentage: number;
    weightGrams: number;
  }
  
  export interface BatchPhase {
    phaseId: string;
    instructions: string;
    ingredients: BatchIngredient[];
  }
  
  export interface BatchRecord {
    id:string;
    batchId: string;
    formulaId: string;
    formulaName: string;
    formulaType: string;
    approvedBy: string;
    approvedDate: string;
    targetWeightKg: number;
  
    createdBy: string;
    createdAt: string;
  
    status: "NotStarted" | "InProgress" | "Completed" | "Aborted";

    assignedTo: string | null;
    assignedAt: string | null;
    assignedBy: string | null;
  
    completedBy: string | null;
    completedAt: string | null;
  
    completionNotes: string | null;
  
    phases: BatchPhase[];
  }
  