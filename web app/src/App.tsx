
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RealTimeDataProvider } from "./contexts/RealTimeDataContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherPortal from "./pages/TeacherPortal";
import SchoolPortal from "./pages/SchoolPortal";
import SubscriptionPage from "./pages/SubscriptionPage";
import SimpleSubscriptionPage from "./pages/SimpleSubscriptionPage";
import RequestToPayTest from "./pages/RequestToPayTest";
import SimpleRequestToPayTest from "./pages/SimpleRequestToPayTest";
import WorkingRequestToPayTest from "./pages/WorkingRequestToPayTest";
import MTNSetupGuide from "./pages/MTNSetupGuide";
import HireTeachers from "./pages/HireTeachers";
import DatabaseTest from "./components/DatabaseTest";
import ScheduleAppointment from "./pages/ScheduleAppointment";
import StatsDemo from "./pages/StatsDemo";
import TestPage from "./pages/TestPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { runFirebaseSetupCheck } from "./utils/firebaseInit";

const queryClient = new QueryClient();

const App = () => {
  // Initialize Firebase on app startup
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        console.log('🚀 Initializing Firebase...');
        const setupResult = await runFirebaseSetupCheck();

        if (setupResult.success) {
          console.log('✅ Firebase initialization completed successfully');
        } else {
          console.warn('⚠️ Firebase initialization completed with warnings');
          console.log('📋 Recommendations:', setupResult.recommendations);
        }
      } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
      }
    };

    initializeFirebase();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <SubscriptionProvider>
              <RealTimeDataProvider>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/database-test" element={<DatabaseTest />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/hire-teachers" element={<HireTeachers />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/simple-subscription" element={<SimpleSubscriptionPage />} />
            <Route path="/request-to-pay-test" element={<RequestToPayTest />} />
            <Route path="/simple-request-to-pay" element={<SimpleRequestToPayTest />} />
            <Route path="/working-request-to-pay" element={<WorkingRequestToPayTest />} />
            <Route path="/mtn-setup" element={<MTNSetupGuide />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/schedule-appointment" element={<ScheduleAppointment />} />
            <Route path="/stats-demo" element={<StatsDemo />} />
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
                <ProtectedRoute allowedRoles={['school', 'admin']}>
                  <SchoolPortal />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
              </RealTimeDataProvider>
            </SubscriptionProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
