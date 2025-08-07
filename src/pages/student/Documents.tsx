import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
  RotateCw,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

// Document status types
type DocumentStatus = "not_uploaded" | "pending" | "verified" | "rejected";

// Document interface
interface Document {
  id: string;
  name: string;
  description: string;
  status: DocumentStatus;
  required: boolean;
  fileUrl?: string;
  uploadDate?: string;
  comments?: string;
  fileSize?: string;
  fileType?: string;
}

const Documents = () => {
  // Mock documents - removed Academic Transcript, Character Certificate, and Recommendation Letter
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "doc-2",
      name: "ID Proof / Passport",
      description: "Government issued photo identification",
      status: "verified",
      required: true,
      fileUrl: "https://example.com/id.pdf",
      uploadDate: "2023-04-10",
      fileSize: "0.8 MB",
      fileType: "PDF",
    },
    {
      id: "doc-4",
      name: "Medical Certificate",
      description: "Health certification from a registered physician",
      status: "not_uploaded",
      required: true,
    },
    {
      id: "doc-6",
      name: "Community Certificate",
      description: "Certificate proving your community category",
      status: "pending",
      required: true,
      fileUrl: "https://example.com/community.pdf",
      uploadDate: "2023-04-16",
      fileSize: "0.7 MB",
      fileType: "PDF",
    },
    {
      id: "doc-7",
      name: "Income Certificate",
      description: "Family income proof from competent authority",
      status: "not_uploaded",
      required: true,
    },
    {
      id: "doc-8",
      name: "Transfer Certificate",
      description: "Transfer certificate from previous institution",
      status: "not_uploaded",
      required: true,
    },
  ]);

  // UI states
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewDocument, setViewDocument] = useState<Document | null>(null);
  
  // Create refs for file inputs
  const fileInputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});

  // Helper function to get status badge
  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
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
            <AlertCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "not_uploaded":
        return (
          <Badge variant="outline">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Not Uploaded
          </Badge>
        );
      default:
        return null;
    }
  };

  // Handle file selection
  const handleFileSelected = (documentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Start the upload process with the selected file
    handleUploadFile(documentId, file);
  };
  
  // Handle document upload with file
  const handleUploadFile = (documentId: string, file: File) => {
    setUploading(documentId);
    setUploadProgress(0);
    
    // Get file size in MB (rounded to 1 decimal place)
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const fileType = file.name.split('.').pop()?.toUpperCase() || 'PDF';

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Update document status
          setDocuments(docs => 
            docs.map(doc => 
              doc.id === documentId 
                ? { 
                    ...doc, 
                    status: "pending", 
                    fileUrl: URL.createObjectURL(file),
                    uploadDate: new Date().toISOString().split('T')[0],
                    fileSize: `${fileSizeMB} MB`,
                    fileType: fileType
                  } 
                : doc
            )
          );
          
          setUploading(null);
          
          toast.success("Document uploaded successfully", {
            description: "Your document is now pending verification",
          });
          
          return 0;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  };

  // Trigger the hidden file input
  const triggerFileInput = (documentId: string) => {
    fileInputRefs.current[documentId]?.click();
  };

  // Handle document upload
  const handleUpload = (documentId: string) => {
    triggerFileInput(documentId);
  };

  // Handle document delete
  const handleDelete = (documentId: string) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === documentId
          ? { ...doc, status: "not_uploaded", fileUrl: undefined, uploadDate: undefined, fileSize: undefined, fileType: undefined }
          : doc
      )
    );
    
    toast.success("Document deleted successfully", {
      description: "You can upload a new document if needed",
    });
  };

  // Handle document reupload
  const handleReupload = (documentId: string) => {
    triggerFileInput(documentId);
  };

  // Count documents by status
  const documentCounts = {
    total: documents.length,
    uploaded: documents.filter(d => d.status !== "not_uploaded").length,
    verified: documents.filter(d => d.status === "verified").length,
    pending: documents.filter(d => d.status === "pending").length,
    rejected: documents.filter(d => d.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Document Management</h1>
        <p className="text-muted-foreground">
          Upload and manage your application documents
        </p>
      </div>

      {/* Document Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center h-24">
            <p className="text-sm text-muted-foreground mb-1">Documents Uploaded</p>
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                {documentCounts.uploaded}/{documentCounts.total}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center h-24">
            <p className="text-sm text-muted-foreground mb-1">Verified</p>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-green-600">
                {documentCounts.verified}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center h-24">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-yellow-600">
                {documentCounts.pending}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center h-24">
            <p className="text-sm text-muted-foreground mb-1">Rejected</p>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-red-600">
                {documentCounts.rejected}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Guidelines */}
      <Alert className="bg-blue-50 text-blue-800 border border-blue-200">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Document Guidelines</AlertTitle>
        <AlertDescription>
          Please upload all documents in PDF format. Each file should be less than 5MB. Ensure all documents are clear and legible.
        </AlertDescription>
      </Alert>

      {/* Hidden file inputs */}
      {documents.map((doc) => (
        <Input
          key={`file-input-${doc.id}`}
          type="file"
          ref={(el) => (fileInputRefs.current[doc.id] = el)}
          onChange={(e) => handleFileSelected(doc.id, e)}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
        />
      ))}

      {/* Document List */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Document Info */}
                <div className="p-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-500 mr-2" />
                      <h3 className="font-medium">{doc.name}</h3>
                      {doc.required && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <div>{getStatusBadge(doc.status)}</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {doc.description}
                  </p>
                  
                  {doc.uploadDate && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                      <span>Uploaded: {doc.uploadDate}</span>
                      {doc.fileSize && <span>Size: {doc.fileSize}</span>}
                      {doc.fileType && <span>Type: {doc.fileType}</span>}
                    </div>
                  )}
                  
                  {doc.status === "rejected" && doc.comments && (
                    <Alert className="mt-2 py-2 text-sm bg-red-50 text-red-800 border border-red-200">
                      <AlertCircle className="h-3 w-3" />
                      <AlertDescription className="text-xs">
                        {doc.comments}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {uploading === doc.id && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-1" />
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex md:flex-col p-4 gap-2 bg-gray-50 border-t md:border-t-0 md:border-l">
                  {doc.status === "not_uploaded" && (
                    <Button 
                      className="flex-1"
                      disabled={uploading !== null}
                      onClick={() => handleUpload(doc.id)}
                    >
                      <Upload className="h-4 w-4 mr-2" /> Upload
                    </Button>
                  )}
                  
                  {doc.status === "rejected" && (
                    <Button 
                      className="flex-1"
                      disabled={uploading !== null}
                      onClick={() => handleReupload(doc.id)}
                    >
                      <RotateCw className="h-4 w-4 mr-2" /> Re-upload
                    </Button>
                  )}
                  
                  {doc.status !== "not_uploaded" && (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setViewDocument(doc)}
                          >
                            <Eye className="h-4 w-4 mr-2" /> View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>{doc.name}</DialogTitle>
                            <DialogDescription>
                              {doc.description}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col items-center justify-center p-6 border rounded-md">
                            <FileText className="h-16 w-16 text-gray-400 mb-2" />
                            <p className="text-sm font-medium">{doc.name}</p>
                            {doc.fileSize && doc.fileType && (
                              <p className="text-xs text-gray-500">{doc.fileType} • {doc.fileSize}</p>
                            )}
                            <Button className="mt-4">
                              Download Document
                            </Button>
                          </div>
                          <DialogFooter className="sm:justify-start">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <p>Uploaded on {doc.uploadDate}</p>
                            </div>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="outline" 
                        className="flex-1" 
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Documents;
