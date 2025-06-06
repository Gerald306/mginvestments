
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RealTimeDataProvider } from "./contexts/RealTimeDataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherPortal from "./pages/TeacherPortal";
import SchoolPortal from "./pages/SchoolPortal";
import SubscriptionPage from "./pages/SubscriptionPage";
import HireTeachers from "./pages/HireTeachers";
import DatabaseTest from "./components/DatabaseTest";
import ScheduleAppointment from "./pages/ScheduleAppointment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <RealTimeDataProvider>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/database-test" element={<DatabaseTest />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/hire-teachers" element={<HireTeachers />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/schedule-appointment" element={<ScheduleAppointment />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/teacher-portal"
              element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                  <TeacherPortal />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/school-portal" 
              element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolPortal />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </RealTimeDataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
