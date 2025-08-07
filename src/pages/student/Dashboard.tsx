
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Edit, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your admission portal. Manage your application process here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* New Application Card */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              <CardTitle className="text-xl">New Application</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="min-h-[80px]">
              Start a new admission application. Fill in your details, upload documents, and submit for review.
            </CardDescription>
            <Button 
              className="w-full mt-4 bg-purple-800 hover:bg-purple-900"
              onClick={() => navigate("/student/application")}
            >
              Start New Application
            </Button>
          </CardContent>
        </Card>

        {/* Edit Application Card */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <Edit className="h-5 w-5 mr-2" />
              <CardTitle className="text-xl">Edit Application</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="min-h-[80px]">
              Continue editing your existing application. Update information or upload additional documents.
            </CardDescription>
            <Button 
              className="w-full mt-4 bg-purple-800 hover:bg-purple-900"
              onClick={() => navigate("/student/application")}
            >
              Edit Application
            </Button>
          </CardContent>
        </Card>

        {/* Application Status Card */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <ClipboardList className="h-5 w-5 mr-2" />
              <CardTitle className="text-xl">Application Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="min-h-[80px]">
              Track the status of your application, view updates, and check for any required actions.
            </CardDescription>
            <Button 
              className="w-full mt-4 bg-purple-800 hover:bg-purple-900"
              onClick={() => navigate("/student/documents")}
            >
              View Status
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
