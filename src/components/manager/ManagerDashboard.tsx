'use client';

import { withRoleProtection } from "@/components/withRoleProtection";
import LogoutButton from "@/components/LogoutButton";
import UserManagementPanel from "@/components/UserManagementPanel";

function ManagerDashboardBase() {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🧑‍💼 Manager Dashboard</h1>
        <LogoutButton />
      </header>

      <UserManagementPanel />
    </div>
  );
}

export default withRoleProtection(ManagerDashboardBase, ["Manager"]);
