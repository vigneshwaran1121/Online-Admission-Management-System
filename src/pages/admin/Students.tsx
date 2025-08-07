
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  Search,
  UserCheck,
  FileText,
  Bell,
  FilterX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Student status types
type StudentStatus = "pending" | "verified" | "incomplete";

// Student interface
interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  applicationId: string;
  status: StudentStatus;
  documentsVerified: number;
  totalDocuments: number;
  admissionNumber?: string;
}

const Students = () => {
  const navigate = useNavigate();

  // Sample student data
  const [students] = useState<Student[]>([
    {
      id: "STD001",
      name: "Vicky",
      email: "vicky@example.com",
      phone: "987-654-3210",
      applicationId: "APP001",
      status: "verified",
      documentsVerified: 5,
      totalDocuments: 5,
      admissionNumber: "ADM2023001",
    },
    {
      id: "STD002",
      name: "Sanjay",
      email: "sanjay@example.com",
      phone: "876-543-2109",
      applicationId: "APP002",
      status: "pending",
      documentsVerified: 3,
      totalDocuments: 5,
    },
    {
      id: "STD003",
      name: "Tharun",
      email: "tharun@example.com",
      phone: "765-432-1098",
      applicationId: "APP003",
      status: "verified",
      documentsVerified: 5,
      totalDocuments: 5,
      admissionNumber: "ADM2023002",
    },
    {
      id: "STD004",
      name: "Poorna",
      email: "poorna@example.com",
      phone: "654-321-0987",
      applicationId: "APP004",
      status: "incomplete",
      documentsVerified: 2,
      totalDocuments: 5,
    },
    {
      id: "STD005",
      name: "Jaffro",
      email: "jaffro@example.com",
      phone: "543-210-9876",
      applicationId: "APP005",
      status: "verified",
      documentsVerified: 5,
      totalDocuments: 5,
      admissionNumber: "ADM2023003",
    },
    {
      id: "STD006",
      name: "Saran",
      email: "saran@example.com",
      phone: "432-109-8765",
      applicationId: "APP006",
      status: "pending",
      documentsVerified: 1,
      totalDocuments: 5,
    },
  ]);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<StudentStatus | "all">("all");

  // Filter students based on search term and status
  const filteredStudents = students.filter((student) => {
    // Filter by search term
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.applicationId.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const matchesStatus = filterStatus === "all" || student.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Helper function to get status badge
  const getStatusBadge = (status: StudentStatus) => {
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
          <h1 className="text-2xl font-bold tracking-tight">Students List</h1>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search students..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All
          </Button>
          <Button
            variant={filterStatus === "verified" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("verified")}
            className={filterStatus === "verified" ? "bg-green-600" : ""}
          >
            <UserCheck className="h-4 w-4 mr-1" />
            Verified
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("pending")}
            className={filterStatus === "pending" ? "bg-yellow-600" : ""}
          >
            <Bell className="h-4 w-4 mr-1" />
            Pending
          </Button>
          <Button
            variant={filterStatus === "incomplete" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("incomplete")}
            className={filterStatus === "incomplete" ? "bg-red-600" : ""}
          >
            <FileText className="h-4 w-4 mr-1" />
            Incomplete
          </Button>
          {filterStatus !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              <FilterX className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Students table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Admission Number</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                  <TableCell>
                    {student.documentsVerified}/{student.totalDocuments}
                  </TableCell>
                  <TableCell>
                    {student.admissionNumber || "Not Assigned"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/admin/students/${student.id}`)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/documents/${student.id}`)}
                      >
                        Verify Docs
                      </Button>
                    </div>
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

export default Students;
