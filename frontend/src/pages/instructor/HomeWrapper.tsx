import { Book, LogOut, Settings, Home as HomeIcon, Users } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useLogout } from "../../features/auth/hooks";


const HomeWrapper = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      navigate({ to: "/login" });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-white border-r border-border">
        <div className="p-6 flex items-center gap-2 border-b border-border">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Book className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary">BetterSkul</span>
        </div>

        <nav className="p-4 h-full space-y-2">
          <Link
            to="/main"
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary text-foreground transition"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/main/courses"
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary text-foreground transition"
          >
            <Book className="w-5 h-5" />
            <span>My Courses</span>
          </Link>

          <Link
            to="/main/students"
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary text-foreground transition"
          >
            <Users className="w-5 h-5" />
            <span>Students</span>
          </Link>

          <Link
            to="/main/settings"
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary text-foreground transition"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4">
          <Button
            variant="outline"
            className="w-full gap-2 bg-transparent"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <LogOut className="w-4 h-4" />
            {logout.isPending ? "Signing out..." : "Sign out"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default HomeWrapper;
