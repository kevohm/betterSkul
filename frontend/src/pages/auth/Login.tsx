
import { Book } from "lucide-react";
import { LoginForm } from "../../components/LoginForm";
import { Link } from "@tanstack/react-router";

export const metadata = {
  title: "Login - BetterSkul",
  description: "Sign in to your BetterSkul account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Header Logo */}
      <Link href="/" className="mb-12 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Book className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-primary">BetterSkul</span>
      </Link>

      {/* Login Form Container */}
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground text-center mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-center">
            Sign in to your account to continue
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
