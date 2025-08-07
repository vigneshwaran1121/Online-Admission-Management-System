
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen,
  CreditCard,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Eye
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PaymentStatus = "pending" | "verified" | "rejected";

interface StudentPayment {
  id: string;
  amount: string;
  method: string;
  transactionId: string;
  date: string;
  status: PaymentStatus;
  comments?: string;
}

interface Document {
  id: string;
  type: string;
  uploadDate: string;
  status: "pending" | "verified" | "rejected" | "reupload_pending";
  comments?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  course: string;
  applicationId: string;
  applicationDate: string;
  status: "Active" | "Pending" | "Rejected";
  paymentStatus: PaymentStatus;
  payments: StudentPayment[];
  documents: Document[];
}

const mockStudents: Student[] = [
  {
    id: "STD001",
    name: "Vicky",
    email: "vicky@example.com",
    phone: "+91 9876543214",
    address: "123 Main Street, Chennai, Tamil Nadu",
    department: "Computer Science",
    course: "B.Tech Computer Science",
    applicationId: "APP001",
    applicationDate: "2023-05-10",
    status: "Active",
    paymentStatus: "verified",
    payments: [
      {
        id: "PAY001",
        amount: "₹25,000",
        method: "UPI",
        transactionId: "TXN-9876543",
        date: "2023-05-10",
        status: "verified",
      }
    ],
    documents: [
      {
        id: "DOC001",
        type: "ID Proof",
        uploadDate: "2023-04-10",
        status: "verified"
      },
      {
        id: "DOC002",
        type: "Community Certificate",
        uploadDate: "2023-04-10",
        status: "verified"
      },
      {
        id: "DOC003",
        type: "Income Certificate",
        uploadDate: "2023-04-10",
        status: "verified"
      }
    ]
  },
  {
    id: "STD002",
    name: "Sanjay",
    email: "sanjay@example.com",
    phone: "+91 8765432109",
    address: "456 Second Street, Chennai, Tamil Nadu",
    department: "Engineering",
    course: "B.Tech Mechanical Engineering",
    applicationId: "APP002",
    applicationDate: "2023-05-12",
    status: "Pending",
    paymentStatus: "pending",
    payments: [
      {
        id: "PAY002",
        amount: "₹25,000",
        method: "Net Banking",
        transactionId: "TXN-8765432",
        date: "2023-05-12",
        status: "pending",
      }
    ],
    documents: [
      {
        id: "DOC004",
        type: "ID Proof",
        uploadDate: "2023-04-12",
        status: "pending"
      },
      {
        id: "DOC005",
        type: "Community Certificate",
        uploadDate: "2023-04-12",
        status: "verified"
      },
      {
        id: "DOC006",
        type: "Income Certificate",
        uploadDate: "2023-04-12",
        status: "pending"
      }
    ]
  },
  {
    id: "STD003",
    name: "Tharun",
    email: "tharun@example.com",
    phone: "+91 7654321098",
    address: "789 Third Street, Chennai, Tamil Nadu",
    department: "Engineering",
    course: "B.Tech Computer Science",
    applicationId: "APP003",
    applicationDate: "2023-05-15",
    status: "Active",
    paymentStatus: "verified",
    payments: [
      {
        id: "PAY003",
        amount: "₹25,000",
        method: "Credit Card",
        transactionId: "TXN-7654321",
        date: "2023-05-15",
        status: "verified",
      }
    ],
    documents: [
      {
        id: "DOC007",
        type: "ID Proof",
        uploadDate: "2023-04-15",
        status: "verified"
      },
      {
        id: "DOC008",
        type: "Community Certificate",
        uploadDate: "2023-04-15",
        status: "verified"
      },
      {
        id: "DOC009",
        type: "Income Certificate",
        uploadDate: "2023-04-15",
        status: "verified"
      }
    ]
  },
  // Add more students as needed, matching the mock data in Students.tsx
];

const AccountantStudentDetails = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();

  // Find the student by studentId from the mock list
  const student = mockStudents.find((s) => s.id === studentId);

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-4">Student not found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const handleVerifyPayment = (paymentId: string) => {
    setStudent({
      ...student,
      paymentStatus: "verified",
      payments: student.payments.map((payment) =>
        payment.id === paymentId
          ? { ...payment, status: "verified" }
          : payment
      )
    });
    toast.success("Payment verified successfully");
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-1 rounded-full hover:bg-gray-200"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{student.name}</h1>
          <p className="text-muted-foreground">{student.applicationId}</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Student personal and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {student.name}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {student.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {student.phone}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {student.address}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Status */}
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>
                  Current status and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">
                    <Badge className="bg-green-100 text-green-800">
                      {student.status}
                    </Badge>
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <div>{getStatusBadge(student.paymentStatus)}</div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Application Date</p>
                  <p className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {student.applicationDate}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>
                  Student's academic details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{student.department}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Course</p>
                    <p className="font-medium flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                      {student.course}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Application ID</p>
                    <p className="font-medium">{student.applicationId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  Complete payment history for this student
                </CardDescription>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.transactionId}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Payment Details</DialogTitle>
                                <DialogDescription>
                                  View payment details and receipt
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4 py-4">
                                <div>
                                  <p className="text-sm font-medium mb-1">Transaction ID</p>
                                  <p>{payment.transactionId}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">Amount</p>
                                  <p>{payment.amount}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">Method</p>
                                  <p>{payment.method}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">Date</p>
                                  <p>{payment.date}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">Status</p>
                                  <div>{getStatusBadge(payment.status)}</div>
                                </div>
                              </div>
                              <div className="flex flex-col items-center justify-center p-6 border rounded-md">
                                <FileText className="h-16 w-16 text-gray-400 mb-2" />
                                <p className="text-sm font-medium">Payment Receipt</p>
                                <Button className="mt-4">
                                  Download Receipt
                                </Button>
                              </div>
                              {payment.status === "pending" && (
                                <DialogFooter>
                                  <Button
                                    onClick={() => handleVerifyPayment(payment.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Verify Payment
                                  </Button>
                                </DialogFooter>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          {payment.status === "pending" && (
                            <Button 
                              size="sm" 
                              onClick={() => handleVerifyPayment(payment.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Submitted documents and their verification status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.type}</TableCell>
                      <TableCell>{doc.uploadDate}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            doc.status === "verified"
                              ? "bg-green-100 text-green-800"
                              : doc.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : doc.status === "reupload_pending"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {doc.status === "verified" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {doc.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1).replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountantStudentDetails;
