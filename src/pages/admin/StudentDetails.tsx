import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  School,
  FileCheck,
  Award,
  AlertTriangle,
  Check
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Student status types
type StudentStatus = "pending" | "verified" | "incomplete";

// Document status types
type DocumentStatus = "pending" | "verified" | "rejected" | "reupload_pending" | "not_uploaded";

// Student interface
interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  program: string;
  applicationId: string;
  status: StudentStatus;
  admissionNumber?: string;
  applicationDate: string;
  documents: {
    id: string;
    type: string;
    status: DocumentStatus;
    uploadDate: string;
  }[];
}

// Sample students data
const studentsData: Record<string, Student> = {
  "STD001": {
    id: "STD001",
    name: "Vicky",
    email: "vicky@example.com",
    phone: "987-654-3210",
    dob: "1998-05-15",
    address: "123 Main St",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600001",
    program: "Computer Science",
    applicationId: "APP001",
    status: "verified",
    admissionNumber: "ADM2023001",
    applicationDate: "2023-04-01",
    documents: [
      { id: "DOC001", type: "Academic Transcript", status: "verified", uploadDate: "2023-04-10" },
      { id: "DOC002", type: "ID Proof", status: "verified", uploadDate: "2023-04-10" },
      { id: "DOC003", type: "Character Certificate", status: "verified", uploadDate: "2023-04-10" },
      { id: "DOC004", type: "Medical Certificate", status: "verified", uploadDate: "2023-04-10" },
      { id: "DOC005", type: "Income Certificate", status: "verified", uploadDate: "2023-04-10" },
    ]
  },
  "STD002": {
    id: "STD002",
    name: "Sanjay",
    email: "sanjay@example.com",
    phone: "876-543-2109",
    dob: "1999-07-20",
    address: "456 Park Ave",
    city: "Bangalore",
    state: "Karnataka",
    zipCode: "560001",
    program: "Electronics Engineering",
    applicationId: "APP002",
    status: "pending",
    applicationDate: "2023-04-05",
    documents: [
      { id: "DOC006", type: "Academic Transcript", status: "pending", uploadDate: "2023-04-15" },
      { id: "DOC007", type: "ID Proof", status: "rejected", uploadDate: "2023-04-12" },
      { id: "DOC008", type: "Character Certificate", status: "verified", uploadDate: "2023-04-14" },
      { id: "DOC009", type: "Medical Certificate", status: "pending", uploadDate: "2023-04-15" },
      { id: "DOC010", type: "Income Certificate", status: "pending", uploadDate: "2023-04-15" },
    ]
  },
  "STD003": {
    id: "STD003",
    name: "Tharun",
    email: "tharun@example.com",
    phone: "765-432-1098",
    dob: "1997-11-10",
    address: "789 Lake Blvd",
    city: "Hyderabad",
    state: "Telangana",
    zipCode: "500001",
    program: "Mechanical Engineering",
    applicationId: "APP003",
    status: "verified",
    admissionNumber: "ADM2023002",
    applicationDate: "2023-04-02",
    documents: [
      { id: "DOC011", type: "Academic Transcript", status: "verified", uploadDate: "2023-04-18" },
      { id: "DOC012", type: "ID Proof", status: "verified", uploadDate: "2023-04-18" },
      { id: "DOC013", type: "Character Certificate", status: "verified", uploadDate: "2023-04-18" },
      { id: "DOC014", type: "Medical Certificate", status: "verified", uploadDate: "2023-04-18" },
      { id: "DOC015", type: "Income Certificate", status: "verified", uploadDate: "2023-04-18" },
    ]
  },
  "STD004": {
    id: "STD004",
    name: "Poorna",
    email: "poorna@example.com",
    phone: "654-321-0987",
    dob: "2000-01-25",
    address: "101 River Road",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001",
    program: "Civil Engineering",
    applicationId: "APP004",
    status: "incomplete",
    applicationDate: "2023-04-08",
    documents: [
      { id: "DOC016", type: "Academic Transcript", status: "pending", uploadDate: "2023-04-20" },
      { id: "DOC017", type: "ID Proof", status: "verified", uploadDate: "2023-04-20" },
      { id: "DOC018", type: "Character Certificate", status: "pending", uploadDate: "2023-04-20" },
      { id: "DOC019", type: "Medical Certificate", status: "not_uploaded", uploadDate: "" },
      { id: "DOC020", type: "Income Certificate", status: "not_uploaded", uploadDate: "" },
    ]
  },
  "STD005": {
    id: "STD005",
    name: "Jaffro",
    email: "jaffro@example.com",
    phone: "543-210-9876",
    dob: "1998-09-30",
    address: "202 Hill Street",
    city: "Delhi",
    state: "Delhi",
    zipCode: "110001",
    program: "Business Administration",
    applicationId: "APP005",
    status: "verified",
    admissionNumber: "ADM2023003",
    applicationDate: "2023-04-03",
    documents: [
      { id: "DOC021", type: "Academic Transcript", status: "verified", uploadDate: "2023-04-21" },
      { id: "DOC022", type: "ID Proof", status: "verified", uploadDate: "2023-04-21" },
      { id: "DOC023", type: "Character Certificate", status: "verified", uploadDate: "2023-04-21" },
      { id: "DOC024", type: "Medical Certificate", status: "verified", uploadDate: "2023-04-21" },
      { id: "DOC025", type: "Income Certificate", status: "verified", uploadDate: "2023-04-21" },
    ]
  },
  "STD006": {
    id: "STD006",
    name: "Saran",
    email: "saran@example.com",
    phone: "432-109-8765",
    dob: "1999-03-15",
    address: "303 Mountain View",
    city: "Kolkata",
    state: "West Bengal",
    zipCode: "700001",
    program: "Information Technology",
    applicationId: "APP006",
    status: "pending",
    applicationDate: "2023-04-10",
    documents: [
      { id: "DOC026", type: "Academic Transcript", status: "reupload_pending", uploadDate: "2023-04-22" },
      { id: "DOC027", type: "ID Proof", status: "pending", uploadDate: "2023-04-22" },
      { id: "DOC028", type: "Character Certificate", status: "pending", uploadDate: "2023-04-22" },
      { id: "DOC029", type: "Medical Certificate", status: "not_uploaded", uploadDate: "" },
      { id: "DOC030", type: "Income Certificate", status: "not_uploaded", uploadDate: "" },
    ]
  }
};

const StudentDetails = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  // Find the student by ID
  const student = studentId ? studentsData[studentId] : null;

  const [admissionNumber, setAdmissionNumber] = useState<string>(
    student?.admissionNumber || `ADM${new Date().getFullYear()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
  );

  if (!student) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
        <h2 className="mt-4 text-2xl font-bold">Student Not Found</h2>
        <p className="mt-2 text-gray-500">The student you are looking for does not exist.</p>
        <Button
          className="mt-4"
          onClick={() => navigate("/admin/students")}
        >
          Back to Students List
        </Button>
      </div>
    );
  }

  // Helper function to get status badge
  const getStatusBadge = (status: StudentStatus) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <Check className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Pending
          </Badge>
        );
      case "incomplete":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Incomplete
          </Badge>
        );
      default:
        return null;
    }
  };

  // Helper function to get document status badge
  const getDocumentStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Rejected
          </Badge>
        );
      case "reupload_pending":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
            Reupload Pending
          </Badge>
        );
      case "not_uploaded":
        return (
          <Badge variant="outline">
            Not Uploaded
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleGenerateAdmission = () => {
    toast.success("Admission confirmed successfully", {
      description: `Admission number ${admissionNumber} has been generated for ${student.name}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/admin/students")}
            className="mr-4 p-1 rounded-full hover:bg-gray-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Student Details</h1>
            <p className="text-muted-foreground text-sm">
              Application ID: {student.applicationId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {student.status === "verified" ? (
            <Badge className="bg-green-100 text-green-800 px-3 py-1">
              <Award className="h-4 w-4 mr-1" />
              {student.admissionNumber || "Admission Confirmed"}
            </Badge>
          ) : (
            student.status !== "incomplete" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Award className="h-4 w-4 mr-1" />
                    Generate Admission
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Admission</DialogTitle>
                    <DialogDescription>
                      This will generate an admission number and confirm the student's application.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Please verify all student details and documents before confirming admission.
                    </p>
                    <div className="p-4 border rounded-md bg-gray-50">
                      <p className="font-medium">Student Name: {student.name}</p>
                      <p>Application ID: {student.applicationId}</p>
                      <p>Program: {student.program}</p>
                      <p className="mt-2 font-medium">Admission Number:</p>
                      <p className="text-xl font-bold text-green-600">{admissionNumber}</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setAdmissionNumber(`ADM${new Date().getFullYear()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`)}
                    >
                      Regenerate Number
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleGenerateAdmission}
                    >
                      Confirm Admission
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )
          )}
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/documents/${studentId}`)}
          >
            <FileCheck className="h-4 w-4 mr-1" />
            Verify Documents
          </Button>
        </div>
      </div>

      {/* Student Info */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Personal Details */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" /> 
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-3xl font-bold text-purple-600">{student.name[0]}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{student.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{student.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">{student.dob}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" /> 
              Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Street Address</p>
                <p className="font-medium">{student.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="font-medium">{student.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">State</p>
                <p className="font-medium">{student.state}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Zip Code</p>
                <p className="font-medium">{student.zipCode}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Details */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" /> 
              Application Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Application ID</p>
                <p className="font-medium">{student.applicationId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Program</p>
                <p className="font-medium">{student.program}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Application Date</p>
                <p className="font-medium">{student.applicationDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Application Status</p>
                <div className="mt-1">{getStatusBadge(student.status)}</div>
              </div>
              {student.admissionNumber && (
                <div>
                  <p className="text-sm text-gray-500">Admission Number</p>
                  <p className="font-medium text-green-600">{student.admissionNumber}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            Documents submitted by the student for verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Type</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.type}</TableCell>
                  <TableCell>{doc.uploadDate || "Not Uploaded"}</TableCell>
                  <TableCell>{getDocumentStatusBadge(doc.status)}</TableCell>
                  <TableCell className="text-right">
                    {doc.status !== "not_uploaded" && (
                      <Button size="sm" variant="outline">
                        View Document
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <div>
            <p className="text-sm font-medium">
              {student.documents.filter(d => d.status === "verified").length} of {student.documents.length} documents verified
            </p>
          </div>
          <Button 
            onClick={() => navigate(`/admin/documents/${studentId}`)}
          >
            <FileCheck className="h-4 w-4 mr-1" />
            Go to Document Verification
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StudentDetails;
