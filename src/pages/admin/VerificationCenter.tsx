
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChevronLeft, 
  FileText, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  CreditCard
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Document status types
type DocumentStatus = "pending" | "verified" | "rejected" | "reupload_pending";

// Student document interface
interface StudentDocument {
  id: string;
  studentId: string;
  studentName: string;
  documentType: string;
  uploadDate: string;
  status: DocumentStatus;
  fileUrl: string;
  comments?: string;
}

// Payment verification interface
interface PaymentVerification {
  id: string;
  studentId: string;
  studentName: string;
  amount: string;
  paymentDate: string;
  verifiedBy: string;
  verificationDate: string;
}

const VerificationCenter = () => {
  const navigate = useNavigate();

  // Sample documents data
  const [documents, setDocuments] = useState<StudentDocument[]>([
    {
      id: "DOC001",
      studentId: "STD001",
      studentName: "Vicky Ken",
      documentType: "ID Proof",
      uploadDate: "2023-04-10",
      status: "verified",
      fileUrl: "https://example.com/id.pdf",
    },
    {
      id: "DOC004",
      studentId: "STD002",
      studentName: "Sanjay",
      documentType: "ID Proof",
      uploadDate: "2023-04-12",
      status: "rejected",
      fileUrl: "https://example.com/id.pdf",
      comments: "ID card is expired. Please upload a valid ID."
    },
    {
      id: "DOC008",
      studentId: "STD006",
      studentName: "Saran",
      documentType: "Community Certificate",
      uploadDate: "2023-04-22",
      status: "reupload_pending",
      fileUrl: "https://example.com/community.pdf",
      comments: "Document is not clearly visible. Please reupload a better quality document."
    },
    {
      id: "DOC009",
      studentId: "STD002",
      studentName: "Sanjay",
      documentType: "Income Certificate",
      uploadDate: "2023-04-15",
      status: "pending",
      fileUrl: "https://example.com/income.pdf",
    },
    {
      id: "DOC010",
      studentId: "STD002",
      studentName: "Sanjay",
      documentType: "Transfer Certificate",
      uploadDate: "2023-04-15",
      status: "pending",
      fileUrl: "https://example.com/transfer.pdf",
    },
    {
      id: "DOC011",
      studentId: "STD003",
      studentName: "Tharun",
      documentType: "Community Certificate",
      uploadDate: "2023-04-18",
      status: "verified",
      fileUrl: "https://example.com/community.pdf",
    },
    {
      id: "DOC012",
      studentId: "STD003",
      studentName: "Tharun",
      documentType: "ID Proof",
      uploadDate: "2023-04-18",
      status: "verified",
      fileUrl: "https://example.com/id.pdf",
    },
  ]);

  // Sample payment verifications
  const [paymentVerifications, setPaymentVerifications] = useState<PaymentVerification[]>([
    {
      id: "PAY001",
      studentId: "STD001",
      studentName: "Vicky Ken",
      amount: "₹25,000",
      paymentDate: "2023-04-15",
      verifiedBy: "Finance Dept",
      verificationDate: "2023-04-16",
    },
    {
      id: "PAY002",
      studentId: "STD003",
      studentName: "Tharun",
      amount: "₹25,000",
      paymentDate: "2023-04-19",
      verifiedBy: "Finance Dept",
      verificationDate: "2023-04-20",
    },
    {
      id: "PAY003",
      studentId: "STD005",
      studentName: "Jaffro",
      amount: "₹25,000",
      paymentDate: "2023-04-22",
      verifiedBy: "Finance Dept",
      verificationDate: "2023-04-23",
    },
  ]);

  const [selectedDocument, setSelectedDocument] = useState<StudentDocument | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Helper function to get status badge
  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "reupload_pending":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Reupload Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  // Filter only pending documents
  const pendingDocuments = documents.filter(doc => doc.status === "pending");

  // Handle document verification
  const handleVerify = (documentId: string) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: "verified" } 
          : doc
      )
    );
    
    toast.success("Document verified successfully");
  };

  // Handle document rejection
  const handleReject = (documentId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: "rejected", comments: reason } 
          : doc
      )
    );
    
    setRejectReason("");
    toast.success("Document rejected, student will be notified");
  };

  // Handle request for reupload
  const handleRequestReupload = (documentId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for reupload request");
      return;
    }
    
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: "reupload_pending", comments: reason } 
          : doc
      )
    );
    
    setRejectReason("");
    toast.success("Reupload requested, student will be notified");
  };

  // Handle status change
  const handleStatusChange = (documentId: string, newStatus: DocumentStatus) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === documentId
          ? { ...doc, status: newStatus }
          : doc
      )
    );
    
    toast.success(`Document status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-1 rounded-full hover:bg-gray-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Verification Center</h1>
        </div>
      </div>

      {/* Verification stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center h-24">
            <p className="text-sm text-muted-foreground mb-1">Pending Documents</p>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-yellow-600">
                {documents.filter(d => d.status === "pending").length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center h-24">
            <p className="text-sm text-muted-foreground mb-1">Verified Documents</p>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-green-600">
                {documents.filter(d => d.status === "verified").length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center h-24">
            <p className="text-sm text-muted-foreground mb-1">Rejected Documents</p>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-red-600">
                {documents.filter(d => d.status === "rejected").length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center h-24">
            <p className="text-sm text-muted-foreground mb-1">Reupload Pending</p>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-orange-600">
                {documents.filter(d => d.status === "reupload_pending").length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different verification sections */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="pending">Document Verification</TabsTrigger>
          <TabsTrigger value="payments">Payment Verification</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-6">
          {/* Pending Documents Table */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Documents</CardTitle>
              <CardDescription>
                Documents awaiting verification from administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingDocuments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.studentName} ({doc.studentId})</TableCell>
                        <TableCell>{doc.documentType}</TableCell>
                        <TableCell>{doc.uploadDate}</TableCell>
                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>{doc.documentType}</DialogTitle>
                                  <DialogDescription>
                                    Uploaded by {doc.studentName} on {doc.uploadDate}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col items-center justify-center p-6 border rounded-md">
                                  <FileText className="h-16 w-16 text-gray-400 mb-2" />
                                  <p className="text-sm font-medium">{doc.documentType}</p>
                                  <Button className="mt-4">
                                    View Document
                                  </Button>
                                </div>
                                <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2">
                                  <Select onValueChange={(value) => handleStatusChange(doc.id, value as DocumentStatus)}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                      <SelectValue placeholder="Update Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="verified">Verify</SelectItem>
                                      <SelectItem value="rejected">Reject</SelectItem>
                                      <SelectItem value="reupload_pending">Request Reupload</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button 
                                    variant="default" 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => {
                                      handleVerify(doc.id);
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Verify Document
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reject Document</DialogTitle>
                                  <DialogDescription>
                                    Please provide a reason for rejecting this document.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <Textarea
                                    placeholder="Reason for rejection"
                                    className="min-h-[100px]"
                                    value={rejectReason}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRejectReason(e.target.value)}
                                  />
                                </div>
                                <DialogFooter>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => {
                                      handleRequestReupload(doc.id, rejectReason);
                                    }}
                                  >
                                    Request Reupload
                                  </Button>
                                  <Button 
                                    variant="destructive"
                                    onClick={() => {
                                      handleReject(doc.id, rejectReason);
                                    }}
                                  >
                                    Reject Document
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No pending documents</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All documents have been processed.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Documents Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Documents</CardTitle>
              <CardDescription>
                Complete list of all student documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.studentName} ({doc.studentId})</TableCell>
                      <TableCell>{doc.documentType}</TableCell>
                      <TableCell>{doc.uploadDate}</TableCell>
                      <TableCell>
                        {getStatusBadge(doc.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>{doc.documentType}</DialogTitle>
                                <DialogDescription>
                                  Uploaded by {doc.studentName} on {doc.uploadDate}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex flex-col items-center justify-center p-6 border rounded-md">
                                <FileText className="h-16 w-16 text-gray-400 mb-2" />
                                <p className="text-sm font-medium">{doc.documentType}</p>
                                {doc.comments && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-800 w-full">
                                    <p className="font-medium">Comments:</p>
                                    <p>{doc.comments}</p>
                                  </div>
                                )}
                                <Button className="mt-4">
                                  View Document
                                </Button>
                              </div>
                              <DialogFooter className="flex justify-between">
                                <Select onValueChange={(value) => handleStatusChange(doc.id, value as DocumentStatus)}>
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Update Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="verified">Verify</SelectItem>
                                    <SelectItem value="rejected">Reject</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="reupload_pending">Request Reupload</SelectItem>
                                  </SelectContent>
                                </Select>
                                {doc.status !== "verified" && (
                                  <Button 
                                    variant="default" 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => {
                                      handleVerify(doc.id);
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Verify
                                  </Button>
                                )}
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-6">
          {/* Payment Verification Table */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Verifications</CardTitle>
              <CardDescription>
                Students with payments verified by the accountant
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentVerifications.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Verified By</TableHead>
                      <TableHead>Verification Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentVerifications.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.studentName} ({payment.studentId})</TableCell>
                        <TableCell>{payment.amount}</TableCell>
                        <TableCell>{payment.paymentDate}</TableCell>
                        <TableCell>{payment.verifiedBy}</TableCell>
                        <TableCell>{payment.verificationDate}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/admin/students/${payment.studentId}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Student
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No payment verifications</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No students have verified payments yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VerificationCenter;
