
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Layouts
import DashboardLayout from "./components/layouts/DashboardLayout";
import AdminNav from "./components/navigation/AdminNav";
import AccountantNav from "./components/navigation/AccountantNav";
import StudentNav from "./components/navigation/StudentNav";

// Public Pages
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Index from "./pages/Index";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentApplication from "./pages/student/Application";
import StudentDocuments from "./pages/student/Documents";
import StudentPayments from "./pages/student/Payments";
import StudentProfile from "./pages/student/Profile";
import StudentSettings from "./pages/student/Settings";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import Students from "./pages/admin/Students";
import VerificationCenter from "./pages/admin/VerificationCenter";
import StudentDetails from "./pages/admin/StudentDetails";
import PendingList from "./pages/admin/PendingList";
import ReuploadPending from "./pages/admin/ReuploadPending";
import VerifiedDocuments from "./pages/admin/VerifiedDocuments";
import AdminSettings from "./pages/admin/Settings";

// Accountant Pages
import AccountantDashboard from "./pages/accountant/Dashboard";
import AccountantPayments from "./pages/accountant/Payments";
import AccountantStudents from "./pages/accountant/Students";
import AccountantVerify from "./pages/accountant/Verify";
import AccountantSettings from "./pages/accountant/Settings";
import AccountantStudentDetails from "./pages/accountant/StudentDetails";

// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />

            {/* Protected Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route 
                element={
                  <DashboardLayout sidebarContent={<StudentNav />} />
                }
              >
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/application" element={<StudentApplication />} />
                <Route path="/student/documents" element={<StudentDocuments />} />
                <Route path="/student/payments" element={<StudentPayments />} />
                <Route path="/student/profile" element={<StudentProfile />} />
                <Route path="/student/settings" element={<StudentSettings />} />
              </Route>
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route 
                element={
                  <DashboardLayout sidebarContent={<AdminNav />} />
                }
              >
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/students" element={<Students />} />
                <Route path="/admin/students/:studentId" element={<StudentDetails />} />
                <Route path="/admin/documents" element={<VerificationCenter />} />
                <Route path="/admin/documents/:studentId" element={<VerificationCenter />} />
                <Route path="/admin/pending" element={<PendingList />} />
                <Route path="/admin/reupload-pending" element={<ReuploadPending />} />
                <Route path="/admin/reupload-verified" element={<VerifiedDocuments />} />
                <Route path="/admin/payments" element={<div className="p-4">Payment Verified content</div>} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* Protected Accountant Routes */}
            <Route element={<ProtectedRoute allowedRoles={["accountant"]} />}>
              <Route 
                element={
                  <DashboardLayout sidebarContent={<AccountantNav />} />
                }
              >
                <Route path="/accountant/dashboard" element={<AccountantDashboard />} />
                <Route path="/accountant/payments" element={<AccountantPayments />} />
                <Route path="/accountant/students" element={<AccountantStudents />} />
                <Route path="/accountant/students/:studentId" element={<AccountantStudentDetails />} />
                <Route path="/accountant/verify" element={<AccountantVerify />} />
                <Route path="/accountant/settings" element={<AccountantSettings />} />
              </Route>
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
