"use client";

import { useState, useEffect } from "react";
import {
  Database,
  Zap,
  Shield,
  Clock,
  Code,
  Activity,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";

const url = import.meta.env?.VITE_BASE_URL || "http://localhost:4000/api";

export default function Landing() {
  const [dbStatus, setDbStatus] = useState("checking");
  const [responseTime, setResponseTime] = useState(null);

  const checkDbStatus = async () => {
    const startTime = Date.now();
    try {
      const res = await fetch(`${url}/health`);
      const data = await res.json();
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setDbStatus(data.status === "healthy" ? "connected" : "down");
    } catch {
      setDbStatus("down");
      setResponseTime(null);
    }
  };

  useEffect(() => {
    checkDbStatus();
    const interval = setInterval(checkDbStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Interactive SQL Editor",
      description:
        "Write and execute SQL queries with syntax highlighting and auto-completion",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Execution",
      description:
        "See query results instantly with detailed execution metrics and timing",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Built-in Validation",
      description:
        "SQL validation and error handling to prevent malformed queries",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Query Timeout Control",
      description:
        "Configure execution timeouts to prevent long-running queries",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Parameterized Queries",
      description:
        "Support for prepared statements with parameter binding for security",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Performance Metrics",
      description:
        "Track execution time, rows affected, and detailed query statistics",
      color: "from-rose-500 to-rose-600",
    },
  ];

  const handleGetStarted = () => {
    window.location.href = "/repl";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        {/* Status Badge */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg">
            {dbStatus === "checking" && (
              <>
                <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
                <span className="text-slate-300 font-medium text-sm">
                  Checking database...
                </span>
              </>
            )}
            {dbStatus === "connected" && (
              <>
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="text-slate-300 font-medium text-sm">
                  Database Connected
                  {responseTime && (
                    <span className="ml-2.5 text-slate-400 font-normal">
                      {responseTime}ms
                    </span>
                  )}
                </span>
              </>
            )}
            {dbStatus === "down" && (
              <>
                <XCircle className="w-5 h-5 text-rose-500" />
                <span className="text-slate-300 font-medium text-sm">
                  Database Unavailable
                </span>
              </>
            )}
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
          BetterRepl
          <span className="block bg-gradient-to-r from-rose-400 via-orange-400 to-yellow-400 text-transparent bg-clip-text mt-3">
            MySQL Playground
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          A secure, interactive environment for testing and executing MySQL
          queries with real-time feedback and comprehensive error handling.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGetStarted}
            disabled={dbStatus === "down"}
            className="group relative px-8 py-4 bg-orange-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-2"
          >
            <span>Launch Playground</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={checkDbStatus}
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-600 hover:border-slate-500"
          >
            Check Status
          </button>
        </div>
      </div>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Powerful Features
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need for professional SQL development
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2"
            >
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:shadow-2xl transition-shadow`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-10 mt-16 text-center text-slate-400 text-sm">
        Built with Node.js, Express & MySQL • Designed for developers, by
        developers
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
