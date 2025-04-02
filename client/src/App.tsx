import { useState } from "react";
import { Route, Switch, Router as WouterRouter } from "wouter";
import Header from "./components/header";
import MobileNav from "./components/mobile-nav";
import Sidebar from "./components/sidebar";
import TaskForm from "./components/task-form";
import { Dialog } from "./components/ui/dialog";
import { Toaster } from "./components/ui/toaster";
import "./locales/i18n";
import Completed from "./pages/completed";
import Dashboard from "./pages/dashboard";
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

function Router({
  openTaskModal,
}: {
  openTaskModal: (taskId?: number) => void;
}) {
  return (
    <Switch>
      <Route path="/">
        <DashboardRoute openTaskModal={openTaskModal} />
      </Route>
      <Route path="/upcoming">
        <UpcomingRoute openTaskModal={openTaskModal} />
      </Route>
      <Route path="/completed">
        <CompletedRoute openTaskModal={openTaskModal} />
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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const openTaskModal = (taskId?: number) => {
    setEditingTask(taskId ?? null);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header toggleSidebar={toggleSidebar} openTaskModal={openTaskModal} />

      <div className="flex flex-1 max-w-7xl mx-auto w-full justify-center">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          openTaskModal={openTaskModal}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 pb-20 md:p-6">
          <WouterRouter>
            <Router openTaskModal={openTaskModal} />
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
