'use client';

import { withRoleProtection } from "@/components/withRoleProtection";
import LogoutButton from "@/components/LogoutButton";

function ManagerDashboardBase() {
    return (
        <div className="p-8">
          <h1 className="text-3xl font-bold">📋 Manager Dashboard</h1>
          <p>Review formula PRs, manage users, and check reports.</p>
          <LogoutButton />
        </div>
      );
}

export default withRoleProtection(ManagerDashboardBase, ["Manager"]);
