
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
  Clock,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Student document interface
interface Student {
  id: string;
  name: string;
  program: string;
  pendingDocuments: number;
}

const PendingList = () => {
  const navigate = useNavigate();

  // Sample student data with pending documents
  const students = [
    { id: "STD002", name: "Sanjay", program: "Electronics Engineering", pendingDocuments: 3 },
    { id: "STD004", name: "Poorna", program: "Civil Engineering", pendingDocuments: 2 },
    { id: "STD006", name: "Saran", program: "Information Technology", pendingDocuments: 3 },
  ];

  // Sample documents data
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  
  const studentDocuments = {
    "STD002": [
      { id: "DOC006", type: "Academic Transcript", status: "pending", uploadDate: "2023-04-15" },
      { id: "DOC009", type: "Medical Certificate", status: "pending", uploadDate: "2023-04-15" },
      { id: "DOC010", type: "Income Certificate", status: "pending", uploadDate: "2023-04-15" },
    ],
    "STD004": [
      { id: "DOC016", type: "Academic Transcript", status: "pending", uploadDate: "2023-04-20" },
      { id: "DOC018", type: "Character Certificate", status: "pending", uploadDate: "2023-04-20" },
    ],
    "STD006": [
      { id: "DOC027", type: "ID Proof", status: "pending", uploadDate: "2023-04-22" },
      { id: "DOC028", type: "Character Certificate", status: "pending", uploadDate: "2023-04-22" },
      { id: "DOC031", type: "10th Certificate", status: "pending", uploadDate: "2023-04-22" },
    ]
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
          <h1 className="text-2xl font-bold tracking-tight">Pending Documents</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students with Pending Documents</CardTitle>
          <CardDescription>
            Review and verify pending documents submitted by students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Pending Documents</TableHead>
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
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        {student.pendingDocuments} Pending
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
                          onClick={() => navigate(`/admin/documents/${student.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Verify
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {expandedStudent === student.id && (
                    <TableRow>
                      <TableCell colSpan={5} className="p-0">
                        <div className="p-4 bg-gray-50">
                          <h4 className="text-sm font-medium mb-2">Pending Documents</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Document Type</TableHead>
                                <TableHead>Upload Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {studentDocuments[student.id as keyof typeof studentDocuments].map((doc) => (
                                <TableRow key={doc.id}>
                                  <TableCell>{doc.type}</TableCell>
                                  <TableCell>{doc.uploadDate}</TableCell>
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

export default PendingList;
