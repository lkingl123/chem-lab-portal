'use client';

import { withRoleProtection } from "@/components/withRoleProtection";
import LogoutButton from "@/components/LogoutButton";

function ChemistDashboardBase() {
    return (
        <div className="p-8">
          <h1 className="text-3xl font-bold">🧪 Chemist Dashboard</h1>
          <p>View formulas, edit them, and submit for review.</p>
          <LogoutButton />
        </div>
      );
}

export default withRoleProtection(ChemistDashboardBase, ["Chemist"]);
