export type PhaseKey = "A" | "A'" | "B" | "C" | "D";

export type Ingredient = {
  ingredient: string;
  inci: string;
  function: string;
  percentage: number;
  grams: number;
  ounces: number;
};

export type Instruction = {
  phase: PhaseKey;
  text: string;
};

export type Formula = {
  id: string;
  name: string;
  formulaNumber: string; 
  analogousFormula: string;
  approvedBy: string;
  approvedDescriptionsBy: string;
  approvedDate: string;
  createdBy: string;
  status: string;
  batchSize: {
    value: number;
    unit: string;
  };
  phases: Record<PhaseKey, Ingredient[]>;
  instructions: Instruction[];
  lastModified: string;
};
