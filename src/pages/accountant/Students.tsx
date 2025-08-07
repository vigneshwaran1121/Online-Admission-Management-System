
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  CheckCircle, 
  Clock,
  Eye,
  FileText,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  course: string;
  applicationId: string;
  status: "Active" | "Pending" | "Rejected";
  paymentStatus: "Verified" | "Pending";
  documents: { name: string; status: string }[];
}

const AccountantStudents = () => {
  const navigate = useNavigate();
  
  const [students, setStudents] = useState<Student[]>([
    {
      id: "STD001",
      name: "Vicky",
      email: "vicky@example.com",
      phone: "+91 9876543214",
      department: "Computer Science",
      course: "B.Tech Computer Science",
      applicationId: "APP001",
      status: "Active",
      paymentStatus: "Verified",
      documents: [
        { name: "ID Proof", status: "Verified" },
        { name: "Community Certificate", status: "Verified" },
        { name: "Income Certificate", status: "Verified" },
      ],
    },
    {
      id: "STD002",
      name: "Sanjay",
      email: "sanjay@example.com",
      phone: "+91 8765432109",
      department: "Engineering",
      course: "B.Tech Mechanical Engineering",
      applicationId: "APP002",
      status: "Pending",
      paymentStatus: "Pending",
      documents: [
        { name: "ID Proof", status: "Pending" },
        { name: "Community Certificate", status: "Verified" },
        { name: "Income Certificate", status: "Pending" },
      ],
    },
    {
      id: "STD003",
      name: "Tharun",
      email: "tharun@example.com",
      phone: "+91 7654321098",
      department: "Engineering",
      course: "B.Tech Computer Science",
      applicationId: "APP003",
      status: "Active",
      paymentStatus: "Verified",
      documents: [
        { name: "ID Proof", status: "Verified" },
        { name: "Community Certificate", status: "Verified" },
        { name: "Income Certificate", status: "Verified" },
      ],
    },
    {
      id: "STD004",
      name: "Poorna",
      email: "poorna@example.com",
      phone: "+91 6543210987",
      department: "Arts",
      course: "BA Economics",
      applicationId: "APP004",
      status: "Pending",
      paymentStatus: "Pending",
      documents: [
        { name: "ID Proof", status: "Pending" },
        { name: "Income Certificate", status: "Pending" },
      ],
    },
    {
      id: "STD005",
      name: "Jaffro",
      email: "jaffro@example.com",
      phone: "+91 5432109876",
      department: "Business",
      course: "BBA",
      applicationId: "APP005",
      status: "Active",
      paymentStatus: "Verified",
      documents: [
        { name: "ID Proof", status: "Verified" },
        { name: "Community Certificate", status: "Verified" },
        { name: "Income Certificate", status: "Verified" },
      ],
    },
    {
      id: "STD006",
      name: "Saran",
      email: "saran@example.com",
      phone: "+91 4321098765",
      department: "Engineering",
      course: "B.Tech Computer Science",
      applicationId: "APP006",
      status: "Pending",
      paymentStatus: "Pending",
      documents: [
        { name: "ID Proof", status: "Verified" },
        { name: "Community Certificate", status: "Pending" },
        { name: "Income Certificate", status: "Pending" },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && student.paymentStatus.toLowerCase() === statusFilter.toLowerCase();
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "Rejected":
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
      <h1 className="text-2xl font-bold">Students Profiles</h1>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-64">
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="verified">Payment Verified</SelectItem>
              <SelectItem value="pending">Payment Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>{getStatusBadge(student.paymentStatus)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/accountant/students/${student.id}`)}
                    >
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
    </div>
  );
};

export default AccountantStudents;
