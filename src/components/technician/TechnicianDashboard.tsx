'use client';

import { withRoleProtection } from "@/components/withRoleProtection";
import LogoutButton from "@/components/LogoutButton";

function TechnicianDashboardBase() {
    return (
        <div className="min-h-screen p-6 bg-gray-50">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">🔧 Technician Dashboard</h1>
            <LogoutButton />
          </header>
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <ApprovedFormulaList />
            <BatchRecordForm />
            <SOPDocumentViewer />
            <TechnicianLogs /> */}
          </div>
        </div>
      );
    }

export default withRoleProtection(TechnicianDashboardBase, ["Technician"]);
