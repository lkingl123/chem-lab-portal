"use client";

import { withRoleProtection } from "@/components/withRoleProtection";
import LogoutButton from "@/components/LogoutButton";
import UserManagementPanel from "@/components/manager/UserManagementPanel";
import ProductManagementPanel from "@/components/manager/ProductManagementPanel";
import BatchManagementPanel from "@/components/manager/BatchManagementPanel";
import { useMsal } from "@azure/msal-react";


function ManagerDashboardBase() {

  const { accounts } = useMsal();
  const userEmail = accounts[0]?.username || "Unknown User";
  return (
    <div className="min-h-screen p-6 bg-gray-50">
            <header className="max-w-screen-xl mx-auto px-6 flex justify-between items-center mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                <h1 className="text-3xl font-bold">🔧 Manager Dashboard</h1>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                  👤 {userEmail}
                </span>
              </div>
              <LogoutButton />
            </header>
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 gap-4">
        {/* User Management Card */}
        <div className="bg-white p-3 rounded-xl shadow">
          <UserManagementPanel />
        </div>

        {/* Batch Management Card */}
        <div className="bg-white p-3 rounded-xl shadow">
          <BatchManagementPanel />
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
