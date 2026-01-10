
import { Link } from "@tanstack/react-router";
import { Book } from "lucide-react";
import { SignupForm } from "../../components/SignupForm";

export const metadata = {
  title: "Sign Up - BetterSkul",
  description: "Create a new BetterSkul account",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Header Logo */}
      <Link to="/" className="mb-12 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Book className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-primary">BetterSkul</span>
      </Link>

      {/* Signup Form Container */}
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground text-center mb-2">
            Create account
          </h1>
          <p className="text-muted-foreground text-center">
            Get started with BetterSkul today
          </p>
        </div>

        <SignupForm />

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link
               to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
