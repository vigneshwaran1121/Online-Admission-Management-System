
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle, Award, FileCheck, User, Mail, Phone, CalendarCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ApplicationStatus = "pending" | "under_review" | "documents_required" | "verified" | "admitted" | "rejected";

const mockStudentData = {
  id: "STD001",
  name: "Vicky Ken",
  email: "vicky@example.com",
  phone: "9876543210",
  profileImage: "",
  dateOfBirth: "1999-05-15",
  gender: "Male",
  address: "123 Main St, Chennai, Tamil Nadu",
  program: "Computer Science",
  applicationId: "APP2023001",
  applicationStatus: "under_review" as ApplicationStatus,
  applicationProgress: 75,
  admissionNumber: null,
  documents: [
    { name: "10th Certificate", status: "verified" },
    { name: "12th Certificate", status: "verified" },
    { name: "Aadhaar Card", status: "verified" },
    { name: "Photo", status: "verified" },
    { name: "Community Certificate", status: "pending" },
    { name: "Income Certificate", status: "not_uploaded" },
    { name: "Transfer Certificate", status: "not_uploaded" },
  ],
  applicationDate: "2023-04-15",
};

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const studentData = mockStudentData;

  // Helper function for application status badge
  const getApplicationStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Application Pending
          </Badge>
        );
      case "under_review":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            <FileCheck className="h-3 w-3 mr-1" />
            Under Review
          </Badge>
        );
      case "documents_required":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Documents Required
          </Badge>
        );
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "admitted":
        return (
          <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
            <Award className="h-3 w-3 mr-1" />
            Admitted
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  // Helper function for document status badge
  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "not_uploaded":
        return <Badge variant="outline">Not Uploaded</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Profile</h1>
        <p className="text-muted-foreground">
          View and manage your personal information and application status
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Overview */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
            <CardDescription>Your basic information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={studentData.profileImage} />
              <AvatarFallback className="text-2xl bg-purple-100 text-purple-800">
                {studentData.name?.charAt(0) || "S"}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold">{studentData.name}</h3>
            <p className="text-muted-foreground mb-4">{studentData.program}</p>
            
            <div className="w-full space-y-3 mt-4">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-purple-600 mt-1" />
                <div className="flex-1 text-left">
                  <p className="text-sm text-muted-foreground">Student ID</p>
                  <p className="font-medium">{studentData.id}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-purple-600 mt-1" />
                <div className="flex-1 text-left">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{studentData.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-purple-600 mt-1" />
                <div className="flex-1 text-left">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{studentData.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CalendarCheck className="h-4 w-4 text-purple-600 mt-1" />
                <div className="flex-1 text-left">
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{studentData.dateOfBirth}</p>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="mt-6 w-full"
              onClick={() => navigate("/student/settings")}
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Application Status */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Current status of your college application</CardDescription>
              </div>
              {getApplicationStatusBadge(studentData.applicationStatus)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Application Progress</span>
                  <span className="text-sm font-medium">{studentData.applicationProgress}%</span>
                </div>
                <Progress value={studentData.applicationProgress} className="h-2" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Application ID</p>
                  <p className="font-medium">{studentData.applicationId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Applied on</p>
                  <p className="font-medium">{studentData.applicationDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Program</p>
                  <p className="font-medium">{studentData.program}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between">
                  <h4 className="font-medium">Admission Status</h4>
                  {studentData.admissionNumber ? (
                    <Badge className="bg-green-100 text-green-800">
                      <Award className="h-3 w-3 mr-1" /> 
                      Admitted
                    </Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </div>

                {studentData.admissionNumber ? (
                  <div className="p-4 bg-green-50 border border-green-100 rounded-md">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="text-lg font-semibold text-green-800">Admission Confirmed</h3>
                    </div>
                    <p className="mt-1 text-green-700">Congratulations! Your admission has been confirmed.</p>
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="text-sm text-green-700">Admission Number</p>
                        <p className="font-bold text-lg text-green-800">{studentData.admissionNumber}</p>
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Download Admission Letter
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-purple-50 border border-purple-100 rounded-md">
                    <p className="text-purple-700">
                      Your application is currently {studentData.applicationStatus.replace('_', ' ')}. 
                      Once all documents are verified and approved, your admission will be confirmed.
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Document Status</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {studentData.documents.map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 border rounded-md">
                      <span className="text-sm">{doc.name}</span>
                      {getDocumentStatusBadge(doc.status)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/student/documents')}
                >
                  View Document Status
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => navigate('/student/application')}
                >
                  Edit Application
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
