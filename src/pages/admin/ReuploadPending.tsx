
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
  AlertCircle,
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
  reuploadPendingDocuments: number;
}

const ReuploadPending = () => {
  const navigate = useNavigate();

  // Sample student data with reupload pending documents
  const students = [
    { id: "STD006", name: "Saran", program: "Information Technology", reuploadPendingDocuments: 1 },
  ];

  // Sample documents data
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  
  const studentDocuments = {
    "STD006": [
      { 
        id: "DOC026", 
        type: "Academic Transcript", 
        status: "reupload_pending", 
        uploadDate: "2023-04-22",
        comments: "Document is not clearly visible. Please reupload a better quality document."
      },
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
          <h1 className="text-2xl font-bold tracking-tight">Reupload Pending Documents</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students with Reupload Pending Documents</CardTitle>
          <CardDescription>
            Documents that require resubmission from students
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Pending Reuploads</TableHead>
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
                        <Badge className="bg-orange-100 text-orange-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {student.reuploadPendingDocuments} Reupload Pending
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
                            View All
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {expandedStudent === student.id && (
                      <TableRow>
                        <TableCell colSpan={5} className="p-0">
                          <div className="p-4 bg-gray-50">
                            <h4 className="text-sm font-medium mb-2">Reupload Pending Documents</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Document Type</TableHead>
                                  <TableHead>Upload Date</TableHead>
                                  <TableHead>Comments</TableHead>
                                  <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {studentDocuments[student.id as keyof typeof studentDocuments].map((doc) => (
                                  <TableRow key={doc.id}>
                                    <TableCell>{doc.type}</TableCell>
                                    <TableCell>{doc.uploadDate}</TableCell>
                                    <TableCell>
                                      <p className="text-sm text-red-600">{doc.comments}</p>
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
                                            <div className="mt-4 p-3 bg-orange-50 text-orange-800 rounded-md w-full">
                                              <p className="text-sm font-medium">Reupload Requested:</p>
                                              <p className="text-sm">{doc.comments}</p>
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
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reupload pending documents</h3>
              <p className="mt-1 text-sm text-gray-500">
                All documents have been processed or verified.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReuploadPending;
