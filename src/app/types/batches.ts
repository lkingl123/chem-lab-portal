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
    batchId: string;
    formulaId: string;
    formulaName: string;
    formulaType: string;
    approvedBy: string;
    approvedDate: string;
    targetWeightKg: number;
  
    createdBy: string;
    createdAt: string;
  
    status: "Unassigned" | "In Progress" | "Completed";
  
    assignedTo: string | null;
    assignedAt: string | null;
  
    completedBy: string | null;
    completedAt: string | null;
  
    completionNotes: string | null;
  
    phases: BatchPhase[];
  }
  