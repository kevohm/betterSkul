import { useState } from "react";
import {
  Play,
  Database,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const url = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

export default function App() {
  const [sql, setSql] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);

  const runQuery = async () => {
    setError("");
    setLoading(true);
    const startTime = performance.now();

    try {
      const res = await fetch(`${url}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql }),
      });
      const data = await res.json();
      const endTime = performance.now();
      setExecutionTime(((endTime - startTime) / 1000).toFixed(3));

      if (data.error) {
        setError(data.error);
        setResult([]);
      } else {
        setResult(data.rows);
      }
    } catch (err) {
      setError(err.message);
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      runQuery();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Database className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                SQL Query Interface
              </h1>
              <p className="text-sm text-slate-500">
                Execute queries and view results in real-time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Query Editor */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">
              Query Editor
            </h2>
            <span className="text-xs text-slate-500">
              Cmd/Ctrl + Enter to execute
            </span>
          </div>
          <div className="p-4">
            <textarea
              className="w-full p-4 font-mono text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              rows={8}
              placeholder="SELECT * FROM users WHERE status = 'active';"
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              {sql.length} characters
            </div>
            <button
              onClick={runQuery}
              disabled={loading || !sql.trim()}
              className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Execute Query
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-800 mb-1">
                Query Error
              </h3>
              <p className="text-sm text-red-700 font-mono">{error}</p>
            </div>
          </div>
        )}

        {!error && result.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-green-800 mb-1">
                Query Successful
              </h3>
              <p className="text-sm text-green-700">
                {result.length} {result.length === 1 ? "row" : "rows"} returned
                {executionTime && ` in ${executionTime}s`}
              </p>
            </div>
          </div>
        )}

        {/* Results Table */}
        {result.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-700">
                Query Results
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {Object.keys(result[0]).map((col) => (
                      <th
                        key={col}
                        className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {result.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      {Object.values(row).map((val, j) => (
                        <td
                          key={j}
                          className="px-4 py-3 text-sm text-slate-900 font-mono"
                        >
                          {val === null ? (
                            <span className="text-slate-400 italic">NULL</span>
                          ) : (
                            val
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && result.length === 0 && !loading && sql.trim() === "" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
              <Database className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Ready to Execute
            </h3>
            <p className="text-slate-500 mb-4">
              Enter your SQL query above and click Execute to see results
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-slate-400">
              <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs">
                Cmd
              </kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs">
                Enter
              </kbd>
              <span className="ml-1">to execute</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
