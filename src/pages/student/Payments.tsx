
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  CreditCard,
  Download,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  IndianRupee,
} from "lucide-react";
import { toast } from "sonner";

// Payment status interface
interface Payment {
  id: string;
  description: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  paymentDate?: string;
  method?: string;
  transactionId?: string;
  receiptUrl?: string;
}

const StudentPayments = () => {
  // Mock payment data - removed the other fees, kept only admission fee
  const payments: Payment[] = [
    {
      id: "INV-2023-001",
      description: "Admission Fee",
      amount: 5000,
      status: "paid",
      dueDate: "2023-05-01",
      paymentDate: "2023-04-27",
      method: "Credit Card",
      transactionId: "TXN-123456",
      receiptUrl: "#",
    }
  ];
  
  // Helper function to render status badge
  const renderStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Overdue
          </Badge>
        );
      default:
        return null;
    }
  };

  // Function to handle payment
  const handlePayment = (paymentId: string) => {
    toast.success("Redirecting to payment gateway", {
      description: `Processing payment for ${paymentId}`
    });
  };

  // Function to download receipt
  const downloadReceipt = (paymentId: string) => {
    toast.success("Downloading receipt", {
      description: `Receipt for ${paymentId} is being downloaded`
    });
  };

  // Calculate totals
  const totalDue = payments
    .filter(p => p.status !== "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalPaid = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          View and manage your fee payments
        </p>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0">
              <p className="text-sm font-medium text-muted-foreground">Total Amount Paid</p>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <h2 className="text-3xl font-bold">₹{totalPaid.toLocaleString()}</h2>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                Paid
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0">
              <p className="text-sm font-medium text-muted-foreground">Amount Due</p>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <h2 className="text-3xl font-bold">₹{totalDue.toLocaleString()}</h2>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                Pending
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0">
              <p className="text-sm font-medium text-muted-foreground">Next Payment Due</p>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <h2 className="text-3xl font-bold">-</h2>
              <Badge variant="outline" className="border border-gray-200">
                ₹0
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View all your payments and their statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1 mb-2 sm:mb-0">
                      <div className="flex items-center">
                        <h4 className="font-medium">{payment.description}</h4>
                        {renderStatusBadge(payment.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">Invoice: {payment.id}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {payment.dueDate}
                        {payment.paymentDate && ` • Paid: ${payment.paymentDate}`}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <div className="font-semibold text-lg flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1" /> 
                        {payment.amount.toLocaleString()}
                      </div>
                      
                      {payment.status === "paid" ? (
                        <Button variant="outline" size="sm" onClick={() => downloadReceipt(payment.id)}>
                          <Download className="h-4 w-4 mr-1" /> Receipt
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handlePayment(payment.id)}>
                          <CreditCard className="h-4 w-4 mr-1" /> Pay Now
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Contact Support</DropdownMenuItem>
                          {payment.status === "paid" && (
                            <DropdownMenuItem onClick={() => downloadReceipt(payment.id)}>
                              Download Receipt
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
              <CardDescription>Payments that need to be processed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments
                  .filter(payment => payment.status === "pending")
                  .map((payment) => (
                    <div
                      key={payment.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1 mb-2 sm:mb-0">
                        <div className="flex items-center">
                          <h4 className="font-medium">{payment.description}</h4>
                          {renderStatusBadge(payment.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">Invoice: {payment.id}</p>
                        <p className="text-sm text-muted-foreground">Due: {payment.dueDate}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-lg flex items-center">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          {payment.amount.toLocaleString()}
                        </div>
                        <Button size="sm" onClick={() => handlePayment(payment.id)}>
                          <CreditCard className="h-4 w-4 mr-1" /> Pay Now
                        </Button>
                      </div>
                    </div>
                  ))}
                
                {payments.filter(payment => payment.status === "pending").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No pending payments</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="paid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paid Payments</CardTitle>
              <CardDescription>Payments that have been completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments
                  .filter(payment => payment.status === "paid")
                  .map((payment) => (
                    <div
                      key={payment.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1 mb-2 sm:mb-0">
                        <div className="flex items-center">
                          <h4 className="font-medium">{payment.description}</h4>
                          {renderStatusBadge(payment.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">Invoice: {payment.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Paid: {payment.paymentDate}
                          {payment.method && ` • Method: ${payment.method}`}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-lg flex items-center">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          {payment.amount.toLocaleString()}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => downloadReceipt(payment.id)}>
                          <Download className="h-4 w-4 mr-1" /> Receipt
                        </Button>
                      </div>
                    </div>
                  ))}
                
                {payments.filter(payment => payment.status === "paid").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No paid payments</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Payments</CardTitle>
              <CardDescription>Payments that are past their due date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments
                  .filter(payment => payment.status === "overdue")
                  .map((payment) => (
                    <div
                      key={payment.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50"
                    >
                      <div className="space-y-1 mb-2 sm:mb-0">
                        <div className="flex items-center">
                          <h4 className="font-medium">{payment.description}</h4>
                          {renderStatusBadge(payment.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">Invoice: {payment.id}</p>
                        <p className="text-sm text-red-600">Due: {payment.dueDate} (Overdue)</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-lg flex items-center">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          {payment.amount.toLocaleString()}
                        </div>
                        <Button size="sm" onClick={() => handlePayment(payment.id)}>
                          <CreditCard className="h-4 w-4 mr-1" /> Pay Now
                        </Button>
                      </div>
                    </div>
                  ))}
                
                {payments.filter(payment => payment.status === "overdue").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No overdue payments</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Available options to make your payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Credit/Debit Card</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Pay securely using your card. All major cards accepted.
              </p>
              <Button className="w-full mt-4" variant="outline">
                Pay with Card
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Bank Transfer</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Make a direct bank transfer to the institution account.
              </p>
              <Button className="w-full mt-4" variant="outline">
                View Bank Details
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Online Banking</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Pay using your bank's online portal with secure integration.
              </p>
              <Button className="w-full mt-4" variant="outline">
                Online Banking
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Need help with payments? <Button variant="link" className="p-0 h-auto">Contact support</Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StudentPayments;
