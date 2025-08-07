
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Clock,
  Upload,
  FileText,
  CreditCard,
  Settings,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const AdminNav = () => {
  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, path: "/admin/dashboard" },
    { name: "Students List", icon: <Users className="h-5 w-5" />, path: "/admin/students" },
    { name: "Verification Center", icon: <FileCheck className="h-5 w-5" />, path: "/admin/documents" },
    { name: "Pending Documents", icon: <Clock className="h-5 w-5" />, path: "/admin/pending" },
    { name: "Reupload Requests", icon: <AlertCircle className="h-5 w-5" />, path: "/admin/reupload-pending" },
    { name: "Verified Documents", icon: <CheckCircle className="h-5 w-5" />, path: "/admin/reupload-verified" },
    { name: "Payment Verification", icon: <CreditCard className="h-5 w-5" />, path: "/admin/payments" },
    { name: "Settings", icon: <Settings className="h-5 w-5" />, path: "/admin/settings" },
  ];

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-md transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
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

export default AdminNav;
