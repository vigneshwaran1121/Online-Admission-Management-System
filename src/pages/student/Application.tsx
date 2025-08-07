import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader, Save, ArrowLeft, ArrowRight, Upload, CreditCard, Check, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

// Define our multi-step form schema
const personalInfoSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  gender: z.string().min(1, { message: "Please select a gender" }),
  nationality: z.string().min(1, { message: "Nationality is required" }),
  aadhaarNumber: z.string().min(12, { message: "Aadhaar number must be 12 digits" }).max(12),
});

const addressSchema = z.object({
  street: z.string().min(1, { message: "Street address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State/Province is required" }),
  postalCode: z.string().min(1, { message: "Postal code is required" }),
  country: z.string().min(1, { message: "Country is required" }),
});

const academicSchema = z.object({
  program: z.string().min(1, { message: "Please select a program" }),
  educationLevel: z.string().min(1, { message: "Please select your education level" }),
  previousSchool: z.string().min(1, { message: "Previous school name is required" }),
  averageGrade: z.string().min(1, { message: "Average grade is required" }),
  personalStatement: z.string().min(50, { message: "Personal statement must be at least 50 characters" }),
});

const documentSchema = z.object({
  photoUploaded: z.boolean().optional(),
  tenthCertificateUploaded: z.boolean().optional(),
  twelfthCertificateUploaded: z.boolean().optional(),
  communityCertificateUploaded: z.boolean().optional(),
  incomeCertificateUploaded: z.boolean().optional(),
  transferCertificateUploaded: z.boolean().optional(),
  aadhaarCardUploaded: z.boolean().optional(),
  sportsCertificateUploaded: z.boolean().optional(),
  disabledCertificateUploaded: z.boolean().optional(),
  terms: z.boolean().refine(val => val === true, { 
    message: "You must accept the terms and conditions" 
  }),
});

const paymentSchema = z.object({
  paymentMethod: z.string().min(1, { message: "Payment method is required" }),
  nameOnCard: z.string().min(1, { message: "Name on card is required" }).optional(),
  cardNumber: z.string().min(16, { message: "Card number must be at least 16 digits" }).max(16).optional(),
  expiryDate: z.string().min(1, { message: "Expiry date is required" }).optional(),
  cvv: z.string().min(3, { message: "CVV must be at least 3 digits" }).max(4).optional(),
  upiId: z.string().min(1, { message: "UPI ID is required" }).optional(),
  applicationFeeAccepted: z.boolean().refine(val => val === true, { 
    message: "You must agree to pay the application fee" 
  }),
});

type FormValues = {
  personalInfo: z.infer<typeof personalInfoSchema>;
  address: z.infer<typeof addressSchema>;
  academic: z.infer<typeof academicSchema>;
  documents: z.infer<typeof documentSchema>;
  payment: z.infer<typeof paymentSchema>;
};

const StudentApplication = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});
  
  // Initialize form for each step
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      nationality: "",
      aadhaarNumber: "",
    },
  });

  const addressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
  });

  const academicForm = useForm<z.infer<typeof academicSchema>>({
    resolver: zodResolver(academicSchema),
    defaultValues: {
      program: "",
      educationLevel: "",
      previousSchool: "",
      averageGrade: "",
      personalStatement: "",
    },
  });

  const documentForm = useForm<z.infer<typeof documentSchema>>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      photoUploaded: false,
      tenthCertificateUploaded: false,
      twelfthCertificateUploaded: false,
      communityCertificateUploaded: false,
      incomeCertificateUploaded: false,
      transferCertificateUploaded: false,
      aadhaarCardUploaded: false,
      sportsCertificateUploaded: false,
      disabledCertificateUploaded: false,
      terms: false,
    },
  });
  
  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "",
      nameOnCard: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      upiId: "",
      applicationFeeAccepted: false,
    },
  });

  // Total number of steps (updated to 6)
  const totalSteps = 6;

  // Calculate progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Handle form submission for each step
  const handleNextStep = async () => {
    try {
      if (currentStep === 1) {
        await personalInfoForm.trigger();
        if (!personalInfoForm.formState.isValid) return;
      } else if (currentStep === 2) {
        await addressForm.trigger();
        if (!addressForm.formState.isValid) return;
      } else if (currentStep === 3) {
        await academicForm.trigger();
        if (!academicForm.formState.isValid) return;
      } else if (currentStep === 4) {
        await documentForm.trigger();
        if (!documentForm.formState.isValid) return;
      } else if (currentStep === 5) {
        await paymentForm.trigger();
        if (!paymentForm.formState.isValid) return;
      }

      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error("Error validating form:", error);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Save draft functionality
  const saveDraft = async () => {
    try {
      setIsSaving(true);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get current form values
      const formData = {
        personalInfo: personalInfoForm.getValues(),
        address: addressForm.getValues(),
        academic: academicForm.getValues(),
        documents: documentForm.getValues(),
        payment: paymentForm.getValues(),
      };
      
      console.log("Draft saved:", formData);
      
      // Show success message
      toast.success("Draft saved successfully", {
        description: "Your application progress has been saved.",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft", {
        description: "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Process payment (simulated)
  const processPayment = async () => {
    try {
      setIsProcessingPayment(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Payment processed successfully", {
        description: "Your application fee has been received.",
      });
      
      // Move to review step
      setCurrentStep(6);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Payment processing failed", {
        description: "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Final submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const formData = {
        personalInfo: personalInfoForm.getValues(),
        address: addressForm.getValues(),
        academic: academicForm.getValues(),
        documents: documentForm.getValues(),
        payment: paymentForm.getValues(),
      };
      
      console.log("Form submitted:", formData);
      
      // Show success message
      toast.success("Application submitted successfully", {
        description: "You'll receive a confirmation email shortly.",
      });
      
      // Navigate to dashboard
      navigate("/student/dashboard");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application", {
        description: "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // File upload handler
  const handleFileUpload = (documentId: string, file: File | null) => {
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please select a file smaller than 5MB.",
        });
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type", {
          description: "Please select a PDF, JPG, or PNG file.",
        });
        return;
      }
    }
    
    setUploadedFiles(prev => ({
      ...prev,
      [documentId]: file
    }));
    
    // Update form state
    const formKey = requiredDocuments.find(doc => doc.id === documentId)?.formKey || 
                   optionalDocuments.find(doc => doc.id === documentId)?.formKey;
    
    if (formKey) {
      documentForm.setValue(formKey as keyof z.infer<typeof documentSchema>, !!file);
    }
    
    if (file) {
      toast.success("File uploaded successfully", {
        description: `${file.name} has been uploaded.`,
      });
    }
  };

  // Remove uploaded file
  const removeFile = (documentId: string) => {
    handleFileUpload(documentId, null);
    toast.success("File removed", {
      description: "The uploaded file has been removed.",
    });
  };

  // List of available programs
  const programs = [
    { value: "computerscience", label: "Computer Science" },
    { value: "engineering", label: "Engineering" },
    { value: "business", label: "Business Administration" },
    { value: "medicine", label: "Medicine" },
    { value: "arts", label: "Arts & Humanities" },
    { value: "sciences", label: "Natural Sciences" },
  ];

  // Education levels
  const educationLevels = [
    { value: "highschool", label: "High School" },
    { value: "bachelor", label: "Bachelor's Degree" },
    { value: "master", label: "Master's Degree" },
    { value: "phd", label: "PhD" },
    { value: "other", label: "Other" },
  ];

  // Required and optional documents
  const requiredDocuments = [
    { id: "photo", name: "Photo", formKey: "photoUploaded", required: true },
    { id: "tenthCertificate", name: "10th Certificate", formKey: "tenthCertificateUploaded", required: true },
    { id: "twelfthCertificate", name: "12th Certificate", formKey: "twelfthCertificateUploaded", required: true },
    { id: "aadhaarCard", name: "Aadhaar Card", formKey: "aadhaarCardUploaded", required: true },
    { id: "communityCertificate", name: "Community Certificate", formKey: "communityCertificateUploaded", required: true },
    { id: "incomeCertificate", name: "Income Certificate", formKey: "incomeCertificateUploaded", required: true },
    { id: "transferCertificate", name: "Transfer Certificate", formKey: "transferCertificateUploaded", required: true },
  ];

  const optionalDocuments = [
    { id: "sportsCertificate", name: "Sports Certificate", formKey: "sportsCertificateUploaded" },
    { id: "disabledCertificate", name: "Disabled Certificate", formKey: "disabledCertificateUploaded" },
  ];

  // Payment methods
  const paymentMethods = [
    { value: "creditcard", label: "Credit Card" },
    { value: "debitcard", label: "Debit Card" },
    { value: "upi", label: "UPI" },
    { value: "netbanking", label: "Net Banking" },
  ];

  // Step title and description for each step
  const steps = [
    {
      title: "Personal Information",
      description: "Provide your personal details and contact information"
    },
    {
      title: "Address Information",
      description: "Provide your current residential address"
    },
    {
      title: "Academic Information",
      description: "Provide information about your education and program of interest"
    },
    {
      title: "Document Upload",
      description: "Upload required and optional documents"
    },
    {
      title: "Payment",
      description: "Pay application fees to continue"
    },
    {
      title: "Review & Submit",
      description: "Review your application before final submission"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Application</h1>
        <p className="text-muted-foreground">
          Complete all required information to submit your application
        </p>
      </div>

      {/* Application Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
          <CardDescription>
            Progress
          </CardDescription>
          <Progress value={progressPercentage} className="h-2 mt-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
        </CardHeader>
        <CardContent>
          {/* Step navigation */}
          <div className="flex justify-center mb-6">
            <Tabs 
              value={currentStep.toString()} 
              className="w-full"
              onValueChange={(value) => {
                const stepNumber = parseInt(value);
                // Only allow going to previous steps or current step
                if (stepNumber <= currentStep) {
                  setCurrentStep(stepNumber);
                }
              }}
            >
              <TabsList className="grid grid-cols-6 w-full">
                <TabsTrigger 
                  value="1" 
                  className={currentStep >= 1 ? "" : "opacity-50 cursor-not-allowed"}
                >
                  Personal
                </TabsTrigger>
                <TabsTrigger 
                  value="2" 
                  className={currentStep >= 2 ? "" : "opacity-50 cursor-not-allowed"}
                  disabled={currentStep < 2}
                >
                  Address
                </TabsTrigger>
                <TabsTrigger 
                  value="3" 
                  className={currentStep >= 3 ? "" : "opacity-50 cursor-not-allowed"}
                  disabled={currentStep < 3}
                >
                  Academic
                </TabsTrigger>
                <TabsTrigger 
                  value="4" 
                  className={currentStep >= 4 ? "" : "opacity-50 cursor-not-allowed"}
                  disabled={currentStep < 4}
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger 
                  value="5" 
                  className={currentStep >= 5 ? "" : "opacity-50 cursor-not-allowed"}
                  disabled={currentStep < 5}
                >
                  Payment
                </TabsTrigger>
                <TabsTrigger 
                  value="6" 
                  className={currentStep >= 6 ? "" : "opacity-50 cursor-not-allowed"}
                  disabled={currentStep < 6}
                >
                  Review
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{steps[0].title}</h3>
              <p className="text-muted-foreground mb-6">{steps[0].description}</p>
              
              <Form {...personalInfoForm}>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={personalInfoForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={personalInfoForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={personalInfoForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={personalInfoForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+91 98765 43210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={personalInfoForm.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={personalInfoForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-6">
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <RadioGroupItem value="male" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Male</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <RadioGroupItem value="female" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Female</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <RadioGroupItem value="other" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Other</FormLabel>
                                </FormItem>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={personalInfoForm.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl>
                            <Input placeholder="Indian" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={personalInfoForm.control}
                      name="aadhaarNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aadhaar Number</FormLabel>
                          <FormControl>
                            <Input placeholder="123456789012" {...field} maxLength={12} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </div>
          )}

          {/* Step 2: Address Information */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{steps[1].title}</h3>
              <p className="text-muted-foreground mb-6">{steps[1].description}</p>
              
              <Form {...addressForm}>
                <form className="space-y-4">
                  <FormField
                    control={addressForm.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={addressForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Chennai" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addressForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="Tamil Nadu" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={addressForm.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="600001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addressForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="India" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </div>
          )}

          {/* Step 3: Academic Information */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{steps[2].title}</h3>
              <p className="text-muted-foreground mb-6">{steps[2].description}</p>
              
              <Form {...academicForm}>
                <form className="space-y-4">
                  <FormField
                    control={academicForm.control}
                    name="program"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program of Interest</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a program" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {programs.map((program) => (
                              <SelectItem key={program.value} value={program.value}>
                                {program.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={academicForm.control}
                    name="educationLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Highest Level of Education</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select education level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {educationLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={academicForm.control}
                      name="previousSchool"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previous School/Institution</FormLabel>
                          <FormControl>
                            <Input placeholder="ABC Higher Secondary School" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={academicForm.control}
                      name="averageGrade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Average Grade/Percentage</FormLabel>
                          <FormControl>
                            <Input placeholder="85%" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter your percentage or GPA on a scale of 10
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={academicForm.control}
                    name="personalStatement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personal Statement</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us why you want to study this program and what makes you a good candidate..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum 50 characters. Explain your motivations and goals.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          )}

          {/* Step 4: Document Upload */}
          {currentStep === 4 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{steps[3].title}</h3>
              <p className="text-muted-foreground mb-6">{steps[3].description}</p>
              
              <Form {...documentForm}>
                <form className="space-y-6">
                  {/* Required Documents Section */}
                  <div className="bg-blue-50 p-4 rounded-md mb-6">
                    <h4 className="font-semibold text-blue-800 mb-2">Required Documents</h4>
                    <p className="text-sm text-blue-700 mb-4">
                      Please upload all required documents. Supported formats: PDF, JPG, PNG (Max size: 5MB per file)
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {requiredDocuments.map((doc) => (
                        <div key={doc.id} className="border rounded-md p-4 bg-white">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{doc.name} <span className="text-red-500">*</span></span>
                            {uploadedFiles[doc.id] && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(doc.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          
                          {!uploadedFiles[doc.id] ? (
                            <div className="flex items-center mt-2">
                              <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  handleFileUpload(doc.id, file);
                                }}
                                className="hidden"
                                id={`file-${doc.id}`}
                              />
                              <label htmlFor={`file-${doc.id}`} className="w-full">
                                <Button type="button" variant="outline" className="w-full" asChild>
                                  <span className="cursor-pointer flex items-center justify-center">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Choose File
                                  </span>
                                </Button>
                              </label>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between mt-2 p-2 bg-green-50 rounded border border-green-200">
                              <div className="flex items-center text-green-700">
                                <Check className="h-4 w-4 mr-2" />
                                <span className="text-sm">{uploadedFiles[doc.id]?.name}</span>
                              </div>
                            </div>
                          )}
                          
                          <p className="text-sm text-muted-foreground mt-2">
                            {uploadedFiles[doc.id] ? 
                              `Uploaded: ${uploadedFiles[doc.id]?.name}` : 
                              "No file chosen"
                            }
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Optional Documents Section */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-semibold mb-2">Optional Documents</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      These documents are optional but may be required for specific benefits or considerations
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {optionalDocuments.map((doc) => (
                        <div key={doc.id} className="border rounded-md p-4 bg-white">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{doc.name} <span className="text-gray-400">(Optional)</span></span>
                            {uploadedFiles[doc.id] && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(doc.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          
                          {!uploadedFiles[doc.id] ? (
                            <div className="flex items-center mt-2">
                              <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  handleFileUpload(doc.id, file);
                                }}
                                className="hidden"
                                id={`file-${doc.id}`}
                              />
                              <label htmlFor={`file-${doc.id}`} className="w-full">
                                <Button type="button" variant="outline" className="w-full" asChild>
                                  <span className="cursor-pointer flex items-center justify-center">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Choose File
                                  </span>
                                </Button>
                              </label>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between mt-2 p-2 bg-green-50 rounded border border-green-200">
                              <div className="flex items-center text-green-700">
                                <Check className="h-4 w-4 mr-2" />
                                <span className="text-sm">{uploadedFiles[doc.id]?.name}</span>
                              </div>
                            </div>
                          )}
                          
                          <p className="text-sm text-muted-foreground mt-2">
                            {uploadedFiles[doc.id] ? 
                              `Uploaded: ${uploadedFiles[doc.id]?.name}` : 
                              "No file chosen"
                            }
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Terms and Conditions */}
                  <div className="pt-6">
                    <FormField
                      control={documentForm.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I accept the terms and conditions
                            </FormLabel>
                            <FormDescription>
                              By submitting this application, I confirm that all the information provided is accurate and complete.
                              I understand that providing false information may lead to rejection of my application.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </div>
          )}

          {/* Step 5: Payment */}
          {currentStep === 5 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{steps[4].title}</h3>
              <p className="text-muted-foreground mb-6">{steps[4].description}</p>
              
              <Form {...paymentForm}>
                <form className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-md mb-6">
                    <h4 className="font-semibold text-green-800 mb-2">Application Fee</h4>
                    <div className="flex justify-between items-center mb-4">
                      <span>Processing Fee:</span>
                      <span className="font-bold text-lg">₹500.00</span>
                    </div>
                    <p className="text-sm text-green-700">
                      This is a one-time non-refundable application processing fee.
                    </p>
                  </div>
                  
                  <FormField
                    control={paymentForm.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paymentMethods.map((method) => (
                              <SelectItem key={method.value} value={method.value}>
                                {method.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Credit/Debit Card Payment Fields */}
                  {(paymentForm.watch("paymentMethod") === "creditcard" || paymentForm.watch("paymentMethod") === "debitcard") && (
                    <div className="space-y-4 p-4 border rounded-md">
                      <FormField
                        control={paymentForm.control}
                        name="nameOnCard"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name on Card</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={paymentForm.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="1234 5678 9012 3456" {...field} maxLength={16} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={paymentForm.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={paymentForm.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} maxLength={4} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* UPI Payment Fields */}
                  {paymentForm.watch("paymentMethod") === "upi" && (
                    <div className="space-y-4 p-4 border rounded-md">
                      <FormField
                        control={paymentForm.control}
                        name="upiId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>UPI ID</FormLabel>
                            <FormControl>
                              <Input placeholder="name@upi" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  {/* Net Banking - Just a placeholder, real implementation would have bank selection */}
                  {paymentForm.watch("paymentMethod") === "netbanking" && (
                    <div className="space-y-4 p-4 border rounded-md">
                      <p className="text-muted-foreground">Please select your bank on the next screen after proceeding.</p>
                    </div>
                  )}
                  
                  {/* Payment Agreement */}
                  <div className="pt-6">
                    <FormField
                      control={paymentForm.control}
                      name="applicationFeeAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to pay the application fee
                            </FormLabel>
                            <FormDescription>
                              I understand that this is a non-refundable application processing fee of ₹500.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 6 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{steps[5].title}</h3>
              <p className="text-muted-foreground mb-6">{steps[5].description}</p>
              
              <div className="space-y-6">
                {/* Personal Information Review */}
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-blue-50 p-3">
                    <h4 className="font-medium text-blue-800 flex items-center gap-2">
                      <span>1. Personal Information</span>
                    </h4>
                  </div>
                  <div className="p-4">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <dt className="text-sm text-gray-500">Name</dt>
                        <dd className="font-medium">{personalInfoForm.getValues().firstName} {personalInfoForm.getValues().lastName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Email</dt>
                        <dd className="font-medium">{personalInfoForm.getValues().email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Phone</dt>
                        <dd className="font-medium">{personalInfoForm.getValues().phone}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Date of Birth</dt>
                        <dd className="font-medium">{personalInfoForm.getValues().dateOfBirth}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Gender</dt>
                        <dd className="font-medium capitalize">{personalInfoForm.getValues().gender}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Nationality</dt>
                        <dd className="font-medium">{personalInfoForm.getValues().nationality}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Aadhaar Number</dt>
                        <dd className="font-medium">{personalInfoForm.getValues().aadhaarNumber}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                {/* Address Information Review */}
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-blue-50 p-3">
                    <h4 className="font-medium text-blue-800 flex items-center gap-2">
                      <span>2. Address Information</span>
                    </h4>
                  </div>
                  <div className="p-4">
                    <dl className="grid grid-cols-1 gap-y-2">
                      <div>
                        <dt className="text-sm text-gray-500">Street Address</dt>
                        <dd className="font-medium">{addressForm.getValues().street}</dd>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <div>
                          <dt className="text-sm text-gray-500">City</dt>
                          <dd className="font-medium">{addressForm.getValues().city}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">State</dt>
                          <dd className="font-medium">{addressForm.getValues().state}</dd>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <div>
                          <dt className="text-sm text-gray-500">Postal Code</dt>
                          <dd className="font-medium">{addressForm.getValues().postalCode}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Country</dt>
                          <dd className="font-medium">{addressForm.getValues().country}</dd>
                        </div>
                      </div>
                    </dl>
                  </div>
                </div>
                
                {/* Academic Information Review */}
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-blue-50 p-3">
                    <h4 className="font-medium text-blue-800 flex items-center gap-2">
                      <span>3. Academic Information</span>
                    </h4>
                  </div>
                  <div className="p-4">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <dt className="text-sm text-gray-500">Program of Interest</dt>
                        <dd className="font-medium">
                          {programs.find(p => p.value === academicForm.getValues().program)?.label || academicForm.getValues().program}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Education Level</dt>
                        <dd className="font-medium">
                          {educationLevels.find(e => e.value === academicForm.getValues().educationLevel)?.label || academicForm.getValues().educationLevel}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Previous School</dt>
                        <dd className="font-medium">{academicForm.getValues().previousSchool}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Average Grade</dt>
                        <dd className="font-medium">{academicForm.getValues().averageGrade}</dd>
                      </div>
                    </dl>
                    <div className="mt-4">
                      <dt className="text-sm text-gray-500">Personal Statement</dt>
                      <dd className="mt-1 text-sm border rounded-md p-3 bg-gray-50">
                        {academicForm.getValues().personalStatement}
                      </dd>
                    </div>
                  </div>
                </div>
                
                {/* Documents Review */}
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-blue-50 p-3">
                    <h4 className="font-medium text-blue-800 flex items-center gap-2">
                      <span>4. Documents</span>
                    </h4>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {requiredDocuments.map(doc => (
                        <div key={doc.id} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{doc.name}</span>
                        </div>
                      ))}
                      {optionalDocuments
                        .filter(doc => {
                          const values = documentForm.getValues();
                          const key = doc.formKey as keyof typeof values;
                          return values[key] === true;
                        })
                        .map(doc => (
                          <div key={doc.id} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>{doc.name}</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
                
                {/* Payment Review */}
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-blue-50 p-3">
                    <h4 className="font-medium text-blue-800 flex items-center gap-2">
                      <span>5. Payment</span>
                    </h4>
                  </div>
                  <div className="p-4">
                    <dl className="grid grid-cols-1 gap-y-2">
                      <div>
                        <dt className="text-sm text-gray-500">Payment Method</dt>
                        <dd className="font-medium">
                          {paymentMethods.find(m => m.value === paymentForm.getValues().paymentMethod)?.label || "Not specified"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Amount Paid</dt>
                        <dd className="font-medium">₹500.00</dd>
                      </div>
                    </dl>
                    <div className="mt-4 flex items-center gap-2 text-green-600">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">Payment Completed</span>
                    </div>
                  </div>
                </div>
                
                {/* Final Confirmation */}
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                  <h4 className="font-medium flex items-center gap-2">
                    <span>Please verify all information before final submission</span>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Once submitted, you will not be able to make changes to your application. Please review all information carefully.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePreviousStep}
              disabled={currentStep === 1 || isSubmitting || isSaving || isProcessingPayment}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              disabled={isSaving || isSubmitting || isProcessingPayment}
              onClick={saveDraft}
            >
              {isSaving ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" /> Saving
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Draft
                </>
              )}
            </Button>
          </div>
          
          {currentStep < 5 ? (
            <Button
              type="button"
              onClick={handleNextStep}
              disabled={isSubmitting || isSaving || isProcessingPayment}
            >
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : currentStep === 5 ? (
            <Button 
              type="button" 
              onClick={processPayment}
              disabled={isSubmitting || isSaving || isProcessingPayment}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isProcessingPayment ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" /> Processing
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" /> Pay ₹500.00
                </>
              )}
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={isSubmitting || isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" /> Submitting
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default StudentApplication;
