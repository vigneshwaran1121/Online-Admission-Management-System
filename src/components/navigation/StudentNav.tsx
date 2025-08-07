
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  User,
  CreditCard,
  Settings,
} from "lucide-react";

const StudentNav = () => {
  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, path: "/student/dashboard" },
    { name: "New Application", icon: <FileText className="h-5 w-5" />, path: "/student/application" },
    { name: "Document Status", icon: <ClipboardList className="h-5 w-5" />, path: "/student/documents" },
    { name: "Payments", icon: <CreditCard className="h-5 w-5" />, path: "/student/payments" },
    { name: "Profile", icon: <User className="h-5 w-5" />, path: "/student/profile" },
    { name: "Settings", icon: <Settings className="h-5 w-5" />, path: "/student/settings" },
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
                ? "bg-purple-700 text-white"
                : "text-white hover:bg-purple-800"
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

export default StudentNav;
