
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Users,
  ClipboardCheck,
  Settings,
} from "lucide-react";

const AccountantNav = () => {
  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, path: "/accountant/dashboard" },
    { name: "Payment Received", icon: <CreditCard className="h-5 w-5" />, path: "/accountant/payments" },
    { name: "Students Profile", icon: <Users className="h-5 w-5" />, path: "/accountant/students" },
    { name: "Verify Students", icon: <ClipboardCheck className="h-5 w-5" />, path: "/accountant/verify" },
    { name: "Settings", icon: <Settings className="h-5 w-5" />, path: "/accountant/settings" },
  ];

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center px-3 py-3 rounded-md transition-colors ${
              isActive
                ? "bg-white/10 text-white"
                : "text-white hover:bg-white/5"
            }`
          }
        >
          {item.icon}
          <span className="ml-3 text-sm font-medium">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default AccountantNav;
