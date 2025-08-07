
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Eye, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  email: string;
  applicationId: string;
  department: string;
  course: string;
  applicationDate: string;
  paymentStatus: "Verified" | "Pending";
}

const AccountantPayments = () => {
  const navigate = useNavigate();
  
  const [students, setStudents] = useState<Student[]>([
    {
      id: "STD001",
      name: "Vicky",
      email: "vicky@example.com",
      applicationId: "APP001",
      department: "Computer Science",
      course: "B.Tech Computer Science",
      applicationDate: "4/15/2023",
      paymentStatus: "Verified",
    },
    {
      id: "STD002",
      name: "Sanjay",
      email: "sanjay@example.com",
      applicationId: "APP002",
      department: "Engineering",
      course: "B.Tech Mechanical Engineering",
      applicationDate: "3/10/2023",
      paymentStatus: "Pending",
    },
    {
      id: "STD003",
      name: "Tharun",
      email: "tharun@example.com",
      applicationId: "APP003",
      department: "Engineering",
      course: "B.Tech Computer Science",
      applicationDate: "3/5/2023",
      paymentStatus: "Verified",
    },
    {
      id: "STD004",
      name: "Poorna",
      email: "poorna@example.com",
      applicationId: "APP004",
      department: "Arts",
      course: "BA Economics",
      applicationDate: "3/12/2023",
      paymentStatus: "Pending",
    },
    {
      id: "STD005",
      name: "Jaffro",
      email: "jaffro@example.com",
      applicationId: "APP005",
      department: "Business",
      course: "BBA",
      applicationDate: "2/28/2023",
      paymentStatus: "Verified",
    },
    {
      id: "STD006",
      name: "Saran",
      email: "saran@example.com",
      applicationId: "APP006",
      department: "Engineering",
      course: "B.Tech Computer Science",
      applicationDate: "3/1/2023",
      paymentStatus: "Pending",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleVerifyPayment = (studentId: string) => {
    setStudents(
      students.map((student) =>
        student.id === studentId
          ? { ...student, paymentStatus: "Verified" }
          : student
      )
    );
    toast.success(`Payment verified for ${students.find(s => s.id === studentId)?.name}`);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.applicationId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-1 rounded-full hover:bg-gray-200"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">Payment Received</h1>
      </div>

      {/* Search */}
      <div className="relative">
        <Input
          placeholder="Search students..."
          className="w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Student List */}
      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-lg shadow-sm border p-4"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">{student.name}</h3>
                  <Badge
                    className={`ml-3 ${
                      student.paymentStatus === "Verified"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    Payment {student.paymentStatus}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{student.email}</p>
              </div>
              <div className="flex space-x-2 mt-4 md:mt-0">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/accountant/students/${student.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
                {student.paymentStatus === "Pending" && (
                  <Button 
                    onClick={() => handleVerifyPayment(student.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Payment
                  </Button>
                )}
                {student.paymentStatus === "Verified" && (
                  <Button variant="outline" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verified
                  </Button>
                )}
              </div>
            </div>

            {/* Student Details */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">Application ID</p>
                <p className="font-medium">{student.applicationId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{student.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Course</p>
                <p className="font-medium">{student.course}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Application Date</p>
                <p className="font-medium">{student.applicationDate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountantPayments;
