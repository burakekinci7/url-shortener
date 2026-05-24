import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Link2, LogOut } from "lucide-react";
import { useAuthStore } from "../../lib/auth-store";
import { Button } from "../ui/Button";

export function Navbar() {
  const { user, token, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to={token ? "/dashboard" : "/"} className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white">
            <Link2 className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-gray-900">Shortly</span>
        </Link>

        <div className="flex items-center gap-3">
          {token && user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `hidden items-center gap-1.5 text-sm font-medium transition-colors sm:inline-flex ${
                    isActive ? "text-indigo-600" : "text-gray-700 hover:text-gray-900"
                  }`
                }
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </NavLink>
              <span className="hidden text-sm text-gray-600 md:inline">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Login
              </Link>
              <Link to="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
