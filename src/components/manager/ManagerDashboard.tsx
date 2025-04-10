"use client";

import { withRoleProtection } from "@/components/withRoleProtection";
import LogoutButton from "@/components/LogoutButton";
import UserManagementPanel from "@/components/manager/UserManagementPanel";
import ProductManagementPanel from "@/components/manager/ProductManagementPanel";

function ManagerDashboardBase() {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🧑‍💼 Manager Dashboard</h1>
        <LogoutButton />
      </header>

      <div className="max-w-screen-xl mx-auto grid grid-cols-1 gap-12">
        {/* User Management Card */}
        <div className="bg-white p-3 rounded-xl shadow">
          <UserManagementPanel />
        </div>

        {/* Product Management Card */}
        <div className="bg-white p-3 rounded-xl shadow">
          <ProductManagementPanel />
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(ManagerDashboardBase, ["Manager"]);
