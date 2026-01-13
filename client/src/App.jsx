import { useState, useRef, useEffect } from "react";

const url = import.meta.env.VITE_BASE_URL || "http://localhost:4000/api";

const SQL_KEYWORDS = [
  "SELECT",
  "INSERT",
  "UPDATE",
  "DELETE",
  "FROM",
  "WHERE",
  "JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "INNER JOIN",
  "VALUES",
  "SET",
  "CREATE TABLE",
  "DROP TABLE",
  "ALTER TABLE",
  "ORDER BY",
  "GROUP BY",
  "LIMIT",
  "STATUS",
];

export default function App() {
  const [sql, setSql] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState("unknown"); // connected | down | unknown

  const terminalRef = useRef(null);
  const commandHistory = useRef([]);
  const historyIndex = useRef(0);

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [history, loading]);

  /** ---------------- DB STATUS ---------------- */
  const checkDbStatus = async (silent = false) => {
    try {
      const res = await fetch(`${url}/health`);
      const data = await res.json();

      setDbStatus(data.status === "healthy" ? "connected" : "down");

      if (!silent) {
        setHistory((h) => [
          ...h,
          {
            type: "system",
            value: `Database: MySQL | Status: ${data.status} | Time: ${data.timestamp}`,
          },
        ]);
      }
    } catch {
      setDbStatus("down");
      if (!silent) {
        setHistory((h) => [
          ...h,
          { type: "error", value: "Cannot reach database server" },
        ]);
      }
    }
  };

  // Check DB on startup
  useEffect(() => {
    checkDbStatus(true);
  }, []);

  /** ---------------- RUN QUERY ---------------- */
  const runQuery = async () => {
    if (!sql.trim()) return;

    const query = sql.trim();

    // Exit command
    if (query.toLowerCase() === "exit;" || query.toLowerCase() === "exit") {
      window.location.href = "/"; // navigate to landing page
      return;
    }

    // REPL command: status;
    if (query.toLowerCase() === "status;" || query.toLowerCase() === "status") {
      setSql("");
      commandHistory.current.push(query);
      historyIndex.current = commandHistory.current.length;

      setHistory((h) => [...h, { type: "query", value: query }]);
      await checkDbStatus();
      return;
    }

    if (dbStatus === "down") {
      setHistory((h) => [
        ...h,
        { type: "query", value: query },
        { type: "error", value: "Database is not connected" },
      ]);
      setSql("");
      return;
    }

    setSql("");
    setLoading(true);
    commandHistory.current.push(query);
    historyIndex.current = commandHistory.current.length;

    try {
      const start = performance.now();
      const res = await fetch(`${url}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: query }),
      });
      const data = await res.json();
      const time = ((performance.now() - start) / 1000).toFixed(3);

      if (!data.success) {
        setHistory((h) => [
          ...h,
          { type: "query", value: query },
          { type: "error", value: data.error || "Unknown error" },
        ]);
        return;
      }

      if (data.type === "SELECT") {
        setHistory((h) => [
          ...h,
          { type: "query", value: query },
          { type: "result", rows: data.rows, time },
        ]);
      } else {
        // INSERT / UPDATE / DELETE / DDL
        setHistory((h) => [
          ...h,
          { type: "query", value: query },
          {
            type: "system",
            value: `${data.message} | Affected rows: ${
              data.affectedRows
            } | Insert ID: ${data.insertId ?? "-"} | Warnings: ${
              data.warningCount
            } | Time: ${time}s`,
          },
        ]);
      }
    } catch (err) {
      setDbStatus("down");
      setHistory((h) => [
        ...h,
        { type: "query", value: query },
        { type: "error", value: err.message },
      ]);
    } finally {
      setLoading(false);
    }
  };;

  /** ---------------- AUTOCOMPLETE ---------------- */
  const autoComplete = () => {
    const parts = sql.split(/\s+/);
    const last = parts[parts.length - 1].toUpperCase();

    const match = SQL_KEYWORDS.find((k) => k.startsWith(last));
    if (!match) return;

    parts[parts.length - 1] = match;
    setSql(parts.join(" ") + " ");
  };

  /** ---------------- KEY HANDLING ---------------- */
  const handleKeyDown = (e) => {
    // Enter executes if ends with ;
    if (e.key === "Enter" && sql.trim().endsWith(";")) {
      e.preventDefault();
      runQuery();
      return;
    }

    // Ctrl / Cmd + Enter → force execute
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runQuery();
      return;
    }

    // Ctrl + L → clear
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setHistory([]);
      return;
    }

    // Ctrl + C → cancel
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      setSql("");
      setHistory((h) => [...h, { type: "system", value: "^C" }]);
      return;
    }

    // Arrow Up → previous command
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex.current > 0) {
        historyIndex.current -= 1;
        setSql(commandHistory.current[historyIndex.current] || "");
      }
      return;
    }

    // Arrow Down → next command
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex.current < commandHistory.current.length - 1) {
        historyIndex.current += 1;
        setSql(commandHistory.current[historyIndex.current] || "");
      } else {
        historyIndex.current = commandHistory.current.length;
        setSql("");
      }
      return;
    }

    // Tab → autocomplete
    if (e.key === "Tab") {
      e.preventDefault();
      autoComplete();
    }
  };

  /** ---------------- TABLE RENDER ---------------- */
  const renderTable = (rows) => {
    if (!rows.length) return "Empty set";

    const columns = Object.keys(rows[0]);
    const widths = columns.map((c) =>
      Math.max(c.length, ...rows.map((r) => String(r[c] ?? "NULL").length))
    );

    const line = "+" + widths.map((w) => "-".repeat(w + 2)).join("+") + "+";

    const header =
      "| " + columns.map((c, i) => c.padEnd(widths[i])).join(" | ") + " |";

    const body = rows
      .map(
        (r) =>
          "| " +
          columns
            .map((c, i) => String(r[c] ?? "NULL").padEnd(widths[i]))
            .join(" | ") +
          " |"
      )
      .join("\n");

    return `${line}
${header}
${line}
${body}
${line}`;
  };

  return (
    <div className="h-screen bg-black text-green-400 font-mono text-sm flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-green-800 text-green-500 flex justify-between">
        <span>MySQL REPL Playground</span>
        <span
          className={
            dbStatus === "connected"
              ? "text-green-400"
              : dbStatus === "down"
              ? "text-red-400"
              : "text-yellow-400"
          }
        >
          DB: {dbStatus}
        </span>
      </div>

      {/* Terminal */}
      <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {history.map((item, i) => {
          if (item.type === "query") {
            return (
              <div key={i}>
                <span className="text-green-500">mysql&gt; </span>
                <span className="text-green-300">{item.value}</span>
              </div>
            );
          }
          if (item.type === "error") {
            return (
              <div key={i} className="text-red-400">
                ERROR: {item.value}
              </div>
            );
          }
          if (item.type === "system") {
            return (
              <div key={i} className="text-green-500">
                {item.value}
              </div>
            );
          }
          if (item.type === "result") {
            return (
              <pre key={i} className="text-green-200 whitespace-pre-wrap">
                {renderTable(item.rows)}
                {"\n"}
                {item.rows.length} rows in set ({item.time}s)
              </pre>
            );
          }
        })}

        {loading && <div className="text-green-500">Running query...</div>}
      </div>

      {/* Input */}
      <div className="border-t border-green-800 px-4 py-6 flex items-start gap-2">
        <span className="text-green-500">mysql&gt;</span>
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          className="flex-1 bg-black text-green-300 outline-none resize-none"
          placeholder="SELECT * FROM users;"
        />
      </div>
    </div>
  );
}
