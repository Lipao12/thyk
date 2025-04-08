import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Route, Switch, Router as WouterRouter, useLocation } from "wouter";
import Header from "./components/header";
import MobileNav from "./components/mobile-nav";
import Sidebar from "./components/sidebar";
import TaskForm from "./components/task-form";
import { Dialog } from "./components/ui/dialog";
import { Toaster } from "./components/ui/toaster";
import { useAuth } from "./context/auth-context";
import { auth } from "./lib/firebase";
import "./locales/i18n";
import Completed from "./pages/completed";
import Dashboard from "./pages/dashboard";
import { Loading } from "./pages/loading";
import Login from "./pages/login";
import NotFound from "./pages/not-found";
import Upcoming from "./pages/upcoming";

// Custom route components to pass the openTaskModal prop
const DashboardRoute = (props: any) => (
  <Dashboard openTaskModal={props.openTaskModal} />
);
const UpcomingRoute = (props: any) => (
  <Upcoming openTaskModal={props.openTaskModal} />
);
const CompletedRoute = (props: any) => (
  <Completed openTaskModal={props.openTaskModal} />
);

// Protected route component
function ProtectedRoute({
  children,
  isAuthenticated,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
}) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

function AppRouter({
  openTaskModal,
  isAuthenticated,
}: {
  openTaskModal: (taskId?: number) => void;
  isAuthenticated: boolean;
}) {
  return (
    <Switch>
      <Route path="/login">
        {isAuthenticated ? (
          <Dashboard openTaskModal={openTaskModal} />
        ) : (
          <Login />
        )}
      </Route>
      <Route path="/">
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <DashboardRoute openTaskModal={openTaskModal} />
        </ProtectedRoute>
      </Route>
      <Route path="/upcoming">
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <UpcomingRoute openTaskModal={openTaskModal} />
        </ProtectedRoute>
      </Route>
      <Route path="/completed">
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <CompletedRoute openTaskModal={openTaskModal} />
        </ProtectedRoute>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [location] = useLocation();
  const { user, userData, loading } = useAuth();

  /*useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("thyk_user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsAuthenticated(!!user.isLoggedIn);
      } catch (e) {
        setIsAuthenticated(false);
      }
    }
  }, [location]);*/
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const openTaskModal = (taskId?: number) => {
    setEditingTask(taskId ?? null);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  /*const handleLogout = () => {
    localStorage.removeItem("thyk_user");
    setIsAuthenticated(false);
  };*/
  const handleLogout = async () => {
    try {
      await signOut(auth); // Desloga do Firebase
      localStorage.removeItem("thyk_user");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  if (loading) return <Loading />;

  if (user) {
    console.log("Firebase User:", user);
    console.log("Firestore User Data:", userData);
  }

  // Don't render the app layout for login page
  if (location === "/login" && !isAuthenticated) {
    return (
      <WouterRouter>
        <Login />
        <Toaster />
      </WouterRouter>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header
        toggleSidebar={toggleSidebar}
        openTaskModal={openTaskModal}
        onLogout={handleLogout}
        user={isAuthenticated ? userData : null}
      />

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          openTaskModal={openTaskModal}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 pb-20 md:p-6">
          <WouterRouter>
            <AppRouter
              openTaskModal={openTaskModal}
              isAuthenticated={isAuthenticated}
            />
          </WouterRouter>
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <MobileNav openTaskModal={openTaskModal} />

      {/* Task Modal */}
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <TaskForm taskId={editingTask} onClose={closeTaskModal} />
      </Dialog>

      <Toaster />
    </div>
  );
}

export default App;
