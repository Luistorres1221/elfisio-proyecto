import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
import ActivateAccountPage from "./pages/ActivateAccountPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import PatientsPage from "./pages/admin/Patients";
import AppointmentsPage from "./pages/admin/Appointments";
import CalendarPage from "./pages/admin/Calendar";
import ServicesPage from "./pages/admin/Services";
import ClinicalHistoryPage from "./pages/admin/ClinicalHistory";
import SchedulesPage from "./pages/admin/Schedules";
import UsersPage from "./pages/admin/Users";
import RolesPage from "./pages/admin/Roles";
import ReportsPage from "./pages/admin/Reports";
import NotificationsPage from "./pages/admin/Notifications";
import SettingsPage from "./pages/admin/Settings";
import ProfilePage from "./pages/profile/ProfilePage";
import EditProfilePage from "./pages/profile/EditProfilePage";
import ChangePasswordPage from "./pages/profile/ChangePasswordPage";
import MisCitasPage from "./pages/profile/MisCitasPage";
import NotificationsListPage from "./pages/NotificationsPage";
import HelpPage from "./pages/HelpPage";
import HistoriaPage from "./pages/HistoriaPage";
import NosotrosPage from "./pages/NosotrosPage";
import TerminosCondicionesPage from "./pages/TerminosCondicionesPage";
import PoliticaCookiesPage from "./pages/PoliticaCookiesPage";
import TratamientoDatosPage from "./pages/TratamientoDatosPage";
import { useAuth } from "@/contexts/AuthContext";
import WhatsAppButton from "./components/WhatsAppButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            <Route element={<PublicSiteLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/historia" element={<HistoriaPage />} />
              <Route path="/nosotros" element={<NosotrosPage />} />
              <Route path="/terminos-condiciones" element={<TerminosCondicionesPage />} />
              <Route path="/politica-cookies" element={<PoliticaCookiesPage />} />
              <Route path="/tratamiento-datos" element={<TratamientoDatosPage />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/activar-cuenta" element={<ActivateAccountPage />} />
            <Route element={<RequireAuth />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="/profile/change-password" element={<ChangePasswordPage />} />
              <Route path="/profile/mis-citas" element={<MisCitasPage />} />
              <Route path="/notifications" element={<NotificationsListPage />} />
              <Route path="/help" element={<HelpPage />} />
            </Route>

            {/* admin routes */}
            <Route element={<RequireAdminAccess />}>
              <Route path="/admin" element={<AdminLayout />}>
              <Route
                index
                element={
                  <RoleGuard allowedRoles={["ADMIN", "RECEPCIONISTA"]}>
                    <Dashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="patients"
                element={
                  <RoleGuard allowedRoles={["ADMIN", "RECEPCIONISTA"]}>
                    <PatientsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="appointments"
                element={
                  <RoleGuard allowedRoles={["ADMIN", "RECEPCIONISTA"]}>
                    <AppointmentsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="calendar"
                element={
                  <RoleGuard allowedRoles={["ADMIN", "RECEPCIONISTA"]}>
                    <CalendarPage />
                  </RoleGuard>
                }
              />
              <Route
                path="services"
                element={
                  <RoleGuard allowedRoles={["ADMIN", "RECEPCIONISTA"]}>
                    <ServicesPage />
                  </RoleGuard>
                }
              />
              <Route
                path="schedules"
                element={
                  <RoleGuard allowedRoles={["ADMIN", "RECEPCIONISTA"]}>
                    <SchedulesPage />
                  </RoleGuard>
                }
              />
              <Route
                path="clinical"
                element={
                  <RoleGuard allowedRoles={["ADMIN", "RECEPCIONISTA"]}>
                    <ClinicalHistoryPage />
                  </RoleGuard>
                }
              />
              <Route
                path="users"
                element={
                  <RoleGuard allowedRoles={["ADMIN"]}>
                    <UsersPage />
                  </RoleGuard>
                }
              />
              <Route
                path="roles"
                element={
                  <RoleGuard allowedRoles={["ADMIN"]}>
                    <RolesPage />
                  </RoleGuard>
                }
              />
              <Route
                path="reports"
                element={
                  <RoleGuard allowedRoles={["ADMIN"]}>
                    <ReportsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="notifications"
                element={
                  <RoleGuard allowedRoles={["ADMIN"]}>
                    <NotificationsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="settings"
                element={
                  <RoleGuard allowedRoles={["ADMIN", "RECEPCIONISTA"]}>
                    <SettingsPage />
                  </RoleGuard>
                }
              />
              </Route>
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

interface RoleGuardProps {
  allowedRoles: string[];
  children: JSX.Element;
}

const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.includes(user.role)) {
    return children;
  }

  return <Navigate to={user.role === "ADMIN" || user.role === "RECEPCIONISTA" ? "/admin" : "/profile"} replace />;
};

const RequireAuth = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const RequireAdminAccess = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN" && user.role !== "RECEPCIONISTA") {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};

const PublicSiteLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};
