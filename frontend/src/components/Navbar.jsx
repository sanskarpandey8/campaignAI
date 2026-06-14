import {
  Bell,
  UserCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-8 h-16 flex items-center justify-between">

      {/* Logo */}
      <h1 className="text-3xl font-bold">
        <span className="text-blue-600">
          Campaign
        </span>
        AI
      </h1>

      {/* Navigation */}
      <div className="flex items-center gap-8 font-medium">

        <Link to="/">Dashboard</Link>

        <Link to="/campaigns">
          Campaigns
        </Link>

        <Link to="/copilot">
          AI Copilot
        </Link>

        <Link
          to="/create-campaign"
          className="
            bg-blue-600
            text-white
            px-4 py-2
            rounded-xl
            hover:bg-blue-700
          "
        >
          Create Campaign
        </Link>

      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">
        <Bell />

        <div className="flex items-center gap-2">
          <UserCircle size={32} />
          <span>Admin</span>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;