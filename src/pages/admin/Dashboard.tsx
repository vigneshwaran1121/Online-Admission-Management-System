
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  FileCheck, 
  Clock, 
  Upload, 
  FileText, 
  CreditCard
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Dashboard card data with updated counts
  const dashboardCards = [
    {
      title: "Students List",
      count: 6,
      description: "View and manage all students",
      icon: <Users className="h-6 w-6 text-white" />,
      iconBg: "bg-blue-500",
      path: "/admin/students"
    },
    {
      title: "Verification Center",
      count: 3,
      description: "Verify student documents",
      icon: <FileCheck className="h-6 w-6 text-white" />,
      iconBg: "bg-green-500",
      path: "/admin/documents"
    },
    {
      title: "Pending List",
      count: 2,
      description: "View pending applications",
      icon: <Clock className="h-6 w-6 text-white" />,
      iconBg: "bg-amber-500",
      path: "/admin/pending"
    },
    {
      title: "Re-upload Pending",
      count: 1,
      description: "Documents requiring re-upload",
      icon: <Upload className="h-6 w-6 text-white" />,
      iconBg: "bg-orange-500",
      path: "/admin/reupload-pending"
    },
    {
      title: "Re-upload Verified",
      count: 1,
      description: "Verified re-uploaded documents",
      icon: <FileText className="h-6 w-6 text-white" />,
      iconBg: "bg-purple-500",
      path: "/admin/reupload-verified"
    },
    {
      title: "Payment Verified",
      count: 4,
      description: "Students with verified payments",
      icon: <CreditCard className="h-6 w-6 text-white" />,
      iconBg: "bg-teal-500",
      path: "/admin/payments"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4 p-1 rounded-full hover:bg-gray-200"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>

      {/* Dashboard cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map((card, index) => (
          <Card 
            key={index} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(card.path)}
          >
            <CardContent className="p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800">{card.title}</h3>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${card.iconBg}`}>
                  {card.icon}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-bold">{card.count}</p>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
