"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "../lib/axios";

export function SignupForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState<"student" | "instructor">("student");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    fullName: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((p) => {
        const next = { ...p };
        delete next[name];
        return next;
      });
    }
  };

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};
    setError(null);

    if (step === 2) {
      if (role === "student") {
        if (!formData.firstName.trim())
          errors.firstName = "First name is required";
        if (!formData.lastName.trim())
          errors.lastName = "Last name is required";
        if (!formData.dateOfBirth)
          errors.dateOfBirth = "Date of birth is required";
      } else {
        if (!formData.fullName.trim())
          errors.fullName = "Full name is required";
      }

      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Invalid email address";
      }

      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
        setError("Passwords do not match");
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const registerMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        email: formData.email,
        password: formData.password,
        role,
        ...(role === "student"
          ? {
              first_name: formData.firstName,
              last_name: formData.lastName,
              date_of_birth: formData.dateOfBirth,
            }
          : { full_name: formData.fullName }),
      };

      const { data } = await api.post("/auth/register", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      window.location.href = "/login";
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || "Signup failed. Try again.";
      toast.error(message);
      setError(message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    registerMutation.mutate();
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
              step <= currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {step < currentStep ? <Check className="w-5 h-5" /> : step}
          </div>
          {step < 2 && <div className="w-16 h-1 bg-muted mx-3" />}
        </div>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      {renderStepIndicator()}

      {currentStep === 1 && (
        <RadioGroup
          value={role}
          onValueChange={(v) => setRole(v as any)}
          className="grid gap-4"
        >
          {["student", "instructor"].map((value) => (
            <label
              key={value}
              htmlFor={value}
              className={`
                rounded-xl border p-5 cursor-pointer transition hover:bg-muted
                ${
                  role === value
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={value} id={value} />
                <div>
                  <p className="font-medium capitalize">{value}</p>
                  <p className="text-sm text-muted-foreground">
                    {value === "student"
                      ? "Learn and build your career"
                      : "Teach and mentor students"}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </RadioGroup>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          {role === "student" ? (
            <>
              <Input
                name="firstName"
                placeholder="First name"
                onChange={handleChange}
              />
              <Input
                name="lastName"
                placeholder="Last name"
                onChange={handleChange}
              />
              <Input name="dateOfBirth" type="date" onChange={handleChange} />
            </>
          ) : (
            <Input
              name="fullName"
              placeholder="Full name"
              onChange={handleChange}
            />
          )}

          <Input name="email" placeholder="Email" onChange={handleChange} />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            onChange={handleChange}
          />
        </div>
      )}

      <div className="flex gap-3 mt-6">
        {currentStep === 2 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep(1)}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}

        {currentStep === 1 ? (
          <Button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="flex-1"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="submit"
            className="flex-1"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? "Creating account..."
              : "Create Account"}
          </Button>
        )}
      </div>
    </form>
  );
}
