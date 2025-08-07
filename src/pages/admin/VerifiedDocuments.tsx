
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
  ChevronLeft, 
  FileText, 
  CheckCircle,
  Eye,
  ChevronRight
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

// Student document interface
interface Student {
  id: string;
  name: string;
  program: string;
  verifiedDocuments: number;
  totalDocuments: number;
}

const VerifiedDocuments = () => {
  const navigate = useNavigate();

  // Sample student data with verified documents
  const students = [
    { id: "STD001", name: "Vicky", program: "Computer Science", verifiedDocuments: 5, totalDocuments: 5 },
    { id: "STD003", name: "Tharun", program: "Mechanical Engineering", verifiedDocuments: 5, totalDocuments: 5 },
    { id: "STD005", name: "Jaffro", program: "Business Administration", verifiedDocuments: 5, totalDocuments: 5 },
  ];

  // Sample documents data
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  
  const studentDocuments = {
    "STD001": [
      { id: "DOC001", type: "Academic Transcript", status: "verified", uploadDate: "2023-04-10" },
      { id: "DOC002", type: "ID Proof", status: "verified", uploadDate: "2023-04-10" },
      { id: "DOC003", type: "Character Certificate", status: "verified", uploadDate: "2023-04-10" },
      { id: "DOC004", type: "Medical Certificate", status: "verified", uploadDate: "2023-04-10" },
      { id: "DOC005", type: "Income Certificate", status: "verified", uploadDate: "2023-04-10" },
    ],
    "STD003": [
      { id: "DOC011", type: "Academic Transcript", status: "verified", uploadDate: "2023-04-18" },
      { id: "DOC012", type: "ID Proof", status: "verified", uploadDate: "2023-04-18" },
      { id: "DOC013", type: "Character Certificate", status: "verified", uploadDate: "2023-04-18" },
      { id: "DOC014", type: "Medical Certificate", status: "verified", uploadDate: "2023-04-18" },
      { id: "DOC015", type: "Income Certificate", status: "verified", uploadDate: "2023-04-18" },
    ],
    "STD005": [
      { id: "DOC021", type: "Academic Transcript", status: "verified", uploadDate: "2023-04-21" },
      { id: "DOC022", type: "ID Proof", status: "verified", uploadDate: "2023-04-21" },
      { id: "DOC023", type: "Character Certificate", status: "verified", uploadDate: "2023-04-21" },
      { id: "DOC024", type: "Medical Certificate", status: "verified", uploadDate: "2023-04-21" },
      { id: "DOC025", type: "Income Certificate", status: "verified", uploadDate: "2023-04-21" },
    ],
  };

  const toggleExpandStudent = (studentId: string) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null);
    } else {
      setExpandedStudent(studentId);
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
          <h1 className="text-2xl font-bold tracking-tight">Verified Documents</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students with Verified Documents</CardTitle>
          <CardDescription>
            Documents that have been verified by administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Verification Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <React.Fragment key={student.id}>
                  <TableRow>
                    <TableCell className="font-medium">{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.program}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {student.verifiedDocuments}/{student.totalDocuments} Verified
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleExpandStudent(student.id)}
                        >
                          {expandedStudent === student.id ? "Hide Documents" : "View Documents"}
                          {expandedStudent === student.id ? 
                            <ChevronLeft className="h-4 w-4 ml-1" /> : 
                            <ChevronRight className="h-4 w-4 ml-1" />
                          }
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/admin/students/${student.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Student Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {expandedStudent === student.id && (
                    <TableRow>
                      <TableCell colSpan={5} className="p-0">
                        <div className="p-4 bg-gray-50">
                          <h4 className="text-sm font-medium mb-2">Verified Documents</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Document Type</TableHead>
                                <TableHead>Upload Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {studentDocuments[student.id as keyof typeof studentDocuments].map((doc) => (
                                <TableRow key={doc.id}>
                                  <TableCell>{doc.type}</TableCell>
                                  <TableCell>{doc.uploadDate}</TableCell>
                                  <TableCell>
                                    <Badge className="bg-green-100 text-green-800">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Verified
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button size="sm" variant="outline">
                                          <Eye className="h-4 w-4 mr-1" />
                                          View
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>{doc.type}</DialogTitle>
                                          <DialogDescription>
                                            Uploaded by {student.name} on {doc.uploadDate}
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex flex-col items-center justify-center p-6 border rounded-md">
                                          <FileText className="h-16 w-16 text-gray-400 mb-2" />
                                          <p className="text-sm font-medium">{doc.type}</p>
                                          <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md w-full text-center">
                                            <p className="text-sm font-medium">Verified ✓</p>
                                          </div>
                                          <Button className="mt-4">
                                            View Document
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifiedDocuments;
