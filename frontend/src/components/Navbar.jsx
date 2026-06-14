import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-900 px-6 py-4 shadow-md">
      <div className="flex gap-6 text-white font-medium">
        <Link to="/">Dashboard</Link>
        <Link to="/customers">Customers</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/campaigns">Campaigns</Link>
        <Link to="/create-campaign">
          Create Campaign
        </Link>
        <Link to="/analytics">
          Analytics
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;