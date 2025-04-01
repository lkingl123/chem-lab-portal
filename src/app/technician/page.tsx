import { withRoleProtection } from "@/components/withRoleProtection";

function TechnicianDashboard() {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">🔧 Technician Dashboard</h1>
        <p>View approved formulas and generate batch records.</p>
      </div>
    );
  }
  

  export default withRoleProtection(TechnicianDashboard, ["Technician"]);