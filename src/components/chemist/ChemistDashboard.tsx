'use client';

import { withRoleProtection } from "@/components/withRoleProtection";

function ChemistDashboardBase() {
    return (
        <div className="p-8">
          <h1 className="text-3xl font-bold">🧪 Chemist Dashboard</h1>
          <p>View formulas, edit them, and submit for review.</p>
        </div>
      );
}

export default withRoleProtection(ChemistDashboardBase, ["Chemist"]);
