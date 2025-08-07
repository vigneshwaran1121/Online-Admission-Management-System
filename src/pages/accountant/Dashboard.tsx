
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, CheckCircle, AlertTriangle, FileText, CreditCard, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Payment status data
const paymentStatusData = [{
  id: 1,
  name: "Verified Payments",
  count: 4,
  color: "bg-green-500",
  icon: <CheckCircle className="h-5 w-5 text-green-600" />
}, {
  id: 2,
  name: "Pending Payments",
  count: 2,
  color: "bg-amber-500",
  icon: <AlertTriangle className="h-5 w-5 text-amber-600" />
}];

const AccountantDashboard = () => {
  const navigate = useNavigate();
  // Mock data for payment table
  const [paymentData, setPaymentData] = useState([{
    id: "STD001",
    name: "Vicky",
    email: "vicky@example.com",
    applicationId: "APP001",
    amount: "₹5,000",
    method: "UPI",
    transactionId: "TXN-9876543",
    date: "10 May, 2023",
    status: "Verified"
  }, {
    id: "STD002",
    name: "Sanjay",
    email: "sanjay@example.com",
    applicationId: "APP002",
    amount: "₹5,000",
    method: "Net Banking",
    transactionId: "TXN-8765432",
    date: "08 May, 2023",
    status: "Pending"
  }, {
    id: "STD003",
    name: "Tharun",
    email: "tharun@example.com",
    applicationId: "APP003",
    amount: "₹5,000",
    method: "Credit Card",
    transactionId: "TXN-7654321",
    date: "05 May, 2023",
    status: "Verified"
  }, {
    id: "STD004",
    name: "Poorna",
    email: "poorna@example.com",
    applicationId: "APP004",
    amount: "₹5,000",
    method: "UPI",
    transactionId: "TXN-6543210",
    date: "03 May, 2023",
    status: "Pending"
  }]);
  const [activeTab, setActiveTab] = useState("all");

  // Filter payments based on the active tab
  const filteredPayments = activeTab === "all" ? paymentData : paymentData.filter(payment => payment.status.toLowerCase() === activeTab.toLowerCase());
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Accountant Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-muted-foreground">Total Applications</p>
                <p className="text-3xl font-bold">6</p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +2% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-muted-foreground">Total Amount Received</p>
                <p className="text-3xl font-bold">₹30,000</p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +5% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Management Section */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold">Recent Payments</h2>
              <p className="text-sm text-muted-foreground">Verify and manage recent student application payments</p>
            </div>

            <div className="bg-white rounded-lg shadow">
              {/* Tabs and Search */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex gap-2">
                  <button className={`px-4 py-2 text-sm font-medium ${activeTab === "all" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`} onClick={() => setActiveTab("all")}>
                    All Payments
                  </button>
                  <button className={`px-4 py-2 text-sm font-medium ${activeTab === "pending" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`} onClick={() => setActiveTab("pending")}>
                    Pending
                  </button>
                  <button className={`px-4 py-2 text-sm font-medium ${activeTab === "verified" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`} onClick={() => setActiveTab("verified")}>
                    Verified
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Input placeholder="Search transactions..." className="w-64" />
                  <Button variant="outline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
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
                    {filteredPayments.map((payment, index) => <TableRow key={index}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.name}</p>
                            <p className="text-sm text-muted-foreground">{payment.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{payment.applicationId}</TableCell>
                        <TableCell>{payment.amount}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>{payment.transactionId}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${payment.status === "Verified" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                            {payment.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/accountant/students/${payment.id}`)}>
                              View
                            </Button>
                            {payment.status === "Pending" && <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => {
                          setPaymentData(prev => prev.map(p => p.id === payment.id ? {
                            ...p,
                            status: "Verified"
                          } : p));
                        }}>
                                Verify
                              </Button>}
                          </div>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </div>
              
              <div className="p-4 flex justify-center">
                <Button variant="outline" onClick={() => navigate("/accountant/payments")}>
                  View All Payments
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Status Summary and Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-6">Payment Status Summary</h3>
              <div className="space-y-6">
                {paymentStatusData.map(item => (
                  <div key={item.id} className="flex items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
                      {item.icon}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium">{item.name}</p>
                      <div className="mt-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${item.color}`} 
                            style={{
                              width: item.name === "Verified Payments" ? "80%" : "20%"
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium ml-2">{item.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" className="justify-start" onClick={() => navigate("/accountant/verify")}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Pending Payments
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => navigate("/accountant/students")}>
                    <Users className="h-4 w-4 mr-2" />
                    View Student Profiles
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => navigate("/accountant/payments")}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage Payments
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard;
