import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  CreditCard,
  FileText,
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PaymentStatus = "pending" | "verified" | "rejected";

interface StudentPayment {
  id: string;
  studentId: string;
  studentName: string;
  amount: string;
  applicationId: string;
  method: string;
  transactionId: string;
  date: string;
  status: PaymentStatus;
  comments?: string;
}

const AccountantVerify = () => {
  // Sample payment data
  const [payments, setPayments] = useState<StudentPayment[]>([
    {
      id: "PAY001",
      studentId: "STD001",
      studentName: "Vicky",
      amount: "₹25,000",
      applicationId: "APP-001",
      method: "UPI",
      transactionId: "TXN-9876543",
      date: "10 May, 2023",
      status: "verified",
    },
    {
      id: "PAY002",
      studentId: "STD002",
      studentName: "Sanjay",
      amount: "₹25,000",
      applicationId: "APP-002",
      method: "Net Banking",
      transactionId: "TXN-8765432",
      date: "08 May, 2023",
      status: "pending",
    },
    {
      id: "PAY003",
      studentId: "STD003",
      studentName: "Tharun",
      amount: "₹25,000",
      applicationId: "APP-003",
      method: "Credit Card",
      transactionId: "TXN-7654321",
      date: "05 May, 2023",
      status: "verified",
    },
    {
      id: "PAY004",
      studentId: "STD004",
      studentName: "Poorna",
      amount: "₹25,000",
      applicationId: "APP-004",
      method: "UPI",
      transactionId: "TXN-6543210",
      date: "03 May, 2023",
      status: "pending",
    },
  ]);

  const [selectedPayment, setSelectedPayment] = useState<StudentPayment | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Helper function to get status badge
  const getStatusBadge = (status: PaymentStatus) => {
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
      default:
        return null;
    }
  };

  // Filter only pending payments
  const pendingPayments = payments.filter(payment => payment.status === "pending");
  
  // Filter payments based on search
  const filteredPayments = payments.filter(payment => 
    payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.applicationId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle payment verification
  const handleVerify = (paymentId: string) => {
    setPayments(pays => 
      pays.map(pay => 
        pay.id === paymentId 
          ? { ...pay, status: "verified" } 
          : pay
      )
    );
    
    toast.success("Payment verified successfully");
  };

  // Handle payment rejection
  const handleReject = (paymentId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    setPayments(pays => 
      pays.map(pay => 
        pay.id === paymentId 
          ? { ...pay, status: "rejected", comments: reason } 
          : pay
      )
    );
    
    setRejectReason("");
    toast.success("Payment rejected, student will be notified");
  };

  // Handle status change
  const handleStatusChange = (paymentId: string, newStatus: PaymentStatus) => {
    setPayments(pays =>
      pays.map(pay =>
        pay.id === paymentId
          ? { ...pay, status: newStatus }
          : pay
      )
    );
    
    toast.success(`Payment status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Verify Students</h1>

      {/* Verification stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center h-24">
            <p className="text-sm text-muted-foreground mb-1">Pending Payments</p>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-yellow-600">
                {payments.filter(p => p.status === "pending").length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center h-24">
            <p className="text-sm text-muted-foreground mb-1">Verified Payments</p>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-green-600">
                {payments.filter(p => p.status === "verified").length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center h-24">
            <p className="text-sm text-muted-foreground mb-1">Rejected Payments</p>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-red-600">
                {payments.filter(p => p.status === "rejected").length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Input
          placeholder="Search by student name, ID or application ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Tabs for different verification sections */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="pending">Pending Payments</TabsTrigger>
          <TabsTrigger value="all">All Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-6">
          {/* Pending Payments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
              <CardDescription>
                Payments awaiting verification from accountant
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingPayments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.studentName}</TableCell>
                        <TableCell>{payment.applicationId}</TableCell>
                        <TableCell>{payment.amount}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>{payment.transactionId}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
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
                                  <DialogTitle>Payment Details</DialogTitle>
                                  <DialogDescription>
                                    Verify payment details for {payment.studentName}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4 py-4">
                                  <div>
                                    <p className="text-sm font-medium mb-1">Student</p>
                                    <p>{payment.studentName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium mb-1">Application ID</p>
                                    <p>{payment.applicationId}</p>
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
                                    <p className="text-sm font-medium mb-1">Transaction ID</p>
                                    <p>{payment.transactionId}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium mb-1">Date</p>
                                    <p>{payment.date}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                                  <FileText className="h-12 w-12 text-gray-400 mb-2" />
                                  <p className="text-sm font-medium">Payment Receipt</p>
                                  <Button className="mt-4">
                                    View Receipt
                                  </Button>
                                </div>
                                <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2">
                                  <Select onValueChange={(value) => handleStatusChange(payment.id, value as PaymentStatus)}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                      <SelectValue placeholder="Update Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="verified">Verify</SelectItem>
                                      <SelectItem value="rejected">Reject</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button 
                                    variant="default" 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => {
                                      handleVerify(payment.id);
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Verify Payment
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
                                  <DialogTitle>Reject Payment</DialogTitle>
                                  <DialogDescription>
                                    Please provide a reason for rejecting this payment.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <Textarea
                                    placeholder="Reason for rejection"
                                    className="min-h-[100px]"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                  />
                                </div>
                                <DialogFooter>
                                  <Button 
                                    variant="destructive"
                                    onClick={() => {
                                      handleReject(payment.id, rejectReason);
                                    }}
                                  >
                                    Reject Payment
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
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No pending payments</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All payments have been processed.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all" className="space-y-6">
          {/* All Payments Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Payments</CardTitle>
              <CardDescription>
                Complete list of all student payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.studentName}</TableCell>
                      <TableCell>{payment.applicationId}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>{payment.transactionId}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status)}
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
                                <DialogTitle>Payment Details</DialogTitle>
                                <DialogDescription>
                                  Payment details for {payment.studentName}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4 py-4">
                                <div>
                                  <p className="text-sm font-medium mb-1">Student</p>
                                  <p>{payment.studentName}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">Application ID</p>
                                  <p>{payment.applicationId}</p>
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
                                  <p className="text-sm font-medium mb-1">Transaction ID</p>
                                  <p>{payment.transactionId}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">Date</p>
                                  <p>{payment.date}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                                <FileText className="h-12 w-12 text-gray-400 mb-2" />
                                <p className="text-sm font-medium">Payment Receipt</p>
                                {payment.comments && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-800 w-full">
                                    <p className="font-medium">Comments:</p>
                                    <p>{payment.comments}</p>
                                  </div>
                                )}
                                <Button className="mt-4">
                                  View Receipt
                                </Button>
                              </div>
                              <DialogFooter className="flex justify-between">
                                {payment.status !== "verified" && (
                                  <Button 
                                    variant="default" 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => {
                                      handleVerify(payment.id);
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
      </Tabs>
    </div>
  );
};

export default AccountantVerify;
