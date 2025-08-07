
import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Bell, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  User,
  Search,
  Upload,
  FileCheck,
  CreditCard
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Badge } from "@/components/ui/badge";

interface DashboardLayoutProps {
  sidebarContent: React.ReactNode;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ sidebarContent }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine if we're in student, admin or accountant section
  const isStudentSection = location.pathname.includes("/student/");
  const isAdminSection = location.pathname.includes("/admin/");
  const isAccountantSection = location.pathname.includes("/accountant/");

  // Navigate to profile or settings based on user type
  const handleNavigateToProfile = () => {
    if (isStudentSection) {
      navigate('/student/profile');
    } else if (isAdminSection) {
      navigate('/admin/settings');
    } else if (isAccountantSection) {
      navigate('/accountant/settings');
    }
  };

  const handleNavigateToSettings = () => {
    if (isStudentSection) {
      navigate('/student/settings');
    } else if (isAdminSection) {
      navigate('/admin/settings');
    } else if (isAccountantSection) {
      navigate('/accountant/settings');
    }
  };

  // Sample notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif1",
      title: "Document Verification",
      message: "Sanjay's academic transcript needs verification",
      time: "10 minutes ago",
      read: false,
      icon: <FileCheck className="h-4 w-4 text-green-500" />
    },
    {
      id: "notif2",
      title: "Document Re-upload",
      message: "Saran has re-uploaded the required documents",
      time: "30 minutes ago",
      read: false,
      icon: <Upload className="h-4 w-4 text-orange-500" />
    },
    {
      id: "notif3",
      title: "Payment Verified",
      message: "Payment for Vicky has been verified by accountant",
      time: "1 hour ago",
      read: true,
      icon: <CreditCard className="h-4 w-4 text-blue-500" />
    }
  ]);

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  // Count unread notifications
  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-purple-900 text-white transition-transform duration-300 ease-in-out flex flex-col md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-purple-950">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-purple-900 font-bold">CE</span>
            </div>
            <span className="text-xl font-bold text-white">College ERP</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md md:hidden hover:bg-purple-800"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3">{sidebarContent}</div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 rounded-md md:hidden hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden md:block text-lg font-medium">
              {isStudentSection ? "Student Portal" : isAdminSection ? "Admin Portal" : "Accountant Portal"}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Popover>
              <PopoverTrigger asChild>
                <button className="p-1 rounded-md relative hover:bg-gray-100">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-3 border-b">
                  <h3 className="font-medium">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      className="text-xs text-blue-600 hover:text-blue-800"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${notif.read ? '' : 'bg-blue-50'}`}
                          onClick={() => markAsRead(notif.id)}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {notif.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <p className="font-medium text-sm">{notif.title}</p>
                                {!notif.read && (
                                  <Badge className="bg-blue-500 text-white text-xs h-5">New</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Bell className="h-10 w-10 text-gray-300 mx-auto" />
                      <p className="mt-2 text-gray-500 text-sm">No notifications</p>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t bg-gray-50 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    View all notifications
                  </button>
                </div>
              </PopoverContent>
            </Popover>
            <div className="h-8 w-[1px] bg-gray-200"></div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-sm rounded-full focus:outline-none">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      {isAdminSection ? 'AD' : isAccountantSection ? 'AC' : 'SU'}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">
                        {isAdminSection ? 'Admin User' : isAccountantSection ? 'Accountant User' : 'Student User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isAdminSection ? 'admin@example.com' : isAccountantSection ? 'accountant@example.com' : 'student@example.com'}
                      </p>
                    </div>
                    {/* Caret icon */}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleNavigateToProfile}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={handleNavigateToSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
