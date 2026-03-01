import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

export type UserRole = "admin" | "employee";

export interface CurrentUser {
  id: string;
  name: string;
  role: UserRole;
  rank: string;
  department: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const handleLogin = (user: CurrentUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <TooltipProvider>
      <Toaster />
      {!currentUser ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      )}
    </TooltipProvider>
  );
}

export default App;
