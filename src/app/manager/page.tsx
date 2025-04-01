import { withRoleProtection } from "@/components/withRoleProtection";

function ManagerDashboard() {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">📋 Manager Dashboard</h1>
        <p>Review formula PRs, manage users, and check reports.</p>
      </div>
    );
  }


  export default withRoleProtection(ManagerDashboard, ["Manager"]);