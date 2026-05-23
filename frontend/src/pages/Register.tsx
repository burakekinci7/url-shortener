import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Link2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardBody } from "../components/ui/Card";
import { extractErrorMessage, register } from "../lib/api";
import { useAuthStore } from "../lib/auth-store";

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string }>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const next: typeof errors = {};
    if (!email) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    else if (password.length < 8) next.password = "Must be at least 8 characters";
    if (!confirm) next.confirm = "Please confirm your password";
    else if (password !== confirm) next.confirm = "Passwords don't match";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await register(email, password);
      setAuth(res.token, res.user);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not create account"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white">
            <Link2 className="h-4 w-4" />
          </span>
          <span className="text-base font-semibold text-gray-900">Shortly</span>
        </Link>

        <Card>
          <CardBody>
            <h1 className="text-xl font-semibold text-gray-900">Create your account</h1>
            <p className="mt-1 text-sm text-gray-600">
              Track clicks and manage all your links in one place.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                disabled={loading}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                hint={errors.password ? undefined : "At least 8 characters"}
                disabled={loading}
              />
              <Input
                label="Confirm password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                error={errors.confirm}
                disabled={loading}
              />
              <Button type="submit" className="w-full" loading={loading}>
                Create account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
                Login
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
