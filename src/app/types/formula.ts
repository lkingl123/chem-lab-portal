// types/formula.ts

export type PhaseKey = "A" | "A'" | "B" | "C" | "D";

export type Ingredient = {
  name: string;
  inci: string;
  function: string;
  percentage: number;
};

export type Phase = {
  phaseId: PhaseKey;
  instructions: string;
  ingredients: Ingredient[];
};

export type Formula = {
  id: string; // Same as productInfo.id
  name: string; // productInfo.productName
  formulaNumber: string;
  analogousFormula: string;
  formulaType: string;
  approvedBy: string;
  approvedDescriptionsBy: string;
  approvedDate: string;
  createdBy: string;
  status: string;
  batchSize: {
    value: number;
    unit: string;
  };
  phases: Phase[];
  instructions: {
    phase: PhaseKey;
    text: string;
  }[];
  lastModified: string;
};
