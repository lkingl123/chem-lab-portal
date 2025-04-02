// src/app/chemist/formula/[id]/page.tsx

'use client';

import dynamic from "next/dynamic";

const FormulaEditor = dynamic(() => import("@/components/chemist/FormulaEditor"), {
  ssr: false,
});

export default function FormulaPage() {
  return <FormulaEditor />;
}
