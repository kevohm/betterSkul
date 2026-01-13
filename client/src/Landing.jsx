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
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Status Badge */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 shadow-lg">
            {dbStatus === "checking" && (
              <>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
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

        {/* Main heading */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            BetterSkul
            <span className="block bg-gradient-to-r from-blue-400 via-orange-400 to-cyan-400 text-transparent bg-clip-text mt-3">
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
              className="group relative px-8 py-3.5 bg-gradient-to-r from-blue-600 to-orange-600 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-2"
            >
              <span>Launch Playground</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={checkDbStatus}
              className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-600 hover:border-slate-500"
            >
              Check Status
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Powerful Features
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need for professional SQL development
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-7 hover:border-slate-600 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:shadow-xl transition-shadow`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Specs Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700/50 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-12 text-center">
            Technical Specifications
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  API Features
                </h3>
              </div>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3 group">
                  <span className="text-orange-400 font-bold mt-1">•</span>
                  <span className="group-hover:text-white transition-colors">
                    Rate limiting (100 requests per 15 minutes)
                  </span>
                </li>
                <li className="flex items-start gap-3 group">
                  <span className="text-orange-400 font-bold mt-1">•</span>
                  <span className="group-hover:text-white transition-colors">
                    Query length validation (20,000 char limit)
                  </span>
                </li>
                <li className="flex items-start gap-3 group">
                  <span className="text-orange-400 font-bold mt-1">•</span>
                  <span className="group-hover:text-white transition-colors">
                    Configurable execution timeouts
                  </span>
                </li>
                <li className="flex items-start gap-3 group">
                  <span className="text-orange-400 font-bold mt-1">•</span>
                  <span className="group-hover:text-white transition-colors">
                    Connection pooling for performance
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Security & Reliability
                </h3>
              </div>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3 group">
                  <span className="text-orange-400 font-bold mt-1">•</span>
                  <span className="group-hover:text-white transition-colors">
                    CORS protection with domain whitelisting
                  </span>
                </li>
                <li className="flex items-start gap-3 group">
                  <span className="text-orange-400 font-bold mt-1">•</span>
                  <span className="group-hover:text-white transition-colors">
                    Comprehensive error handling
                  </span>
                </li>
                <li className="flex items-start gap-3 group">
                  <span className="text-orange-400 font-bold mt-1">•</span>
                  <span className="group-hover:text-white transition-colors">
                    Graceful shutdown procedures
                  </span>
                </li>
                <li className="flex items-start gap-3 group">
                  <span className="text-orange-400 font-bold mt-1">•</span>
                  <span className="group-hover:text-white transition-colors">
                    Health check monitoring endpoint
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-700/50 py-10 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          Built with Node.js, Express & MySQL • Designed for developers, by
          developers
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
