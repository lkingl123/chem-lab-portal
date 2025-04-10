// src/app/types/product.ts

export type Product = {
  productId: string;
  productName: string;
  marketing: {
    productHighlights: string[];
    productDescription: {
      short: string;
      full: string;
    };
    keyIngredients: {
      name: string;
      benefits: string;
      imageUrl: string;
    }[];
    ingredientList?: {
      name: string;
      inci: string;
      percentage: number;
      purpose: string;
    }[];
    ingredientsList?: string;
  };
};
