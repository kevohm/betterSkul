const dotenvx = require("@dotenvx/dotenvx")

dotenvx.config({path:".env"})

const readline = require("readline");
const pool = require("./db");
const { highlight } = require("cli-highlight");

// Dangerous SQL keywords to warn about
const DANGEROUS_KEYWORDS = ["DROP DATABASE", "DROP TABLE", "TRUNCATE"];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "mysql> ",
});

console.log('Welcome to MySQL REPL. Type "exit" to quit.');

rl.prompt();

rl.on("line", async (line) => {
  const input = line.trim();

  if (!input) {
    rl.prompt();
    return;
  }

  if (input.toLowerCase() === "exit") {
    console.log("Goodbye!");
    process.exit(0);
  }

  // Basic SQL validation
  const upperInput = input.toUpperCase();
  for (const keyword of DANGEROUS_KEYWORDS) {
    if (upperInput.includes(keyword)) {
      console.log(`⚠️ Warning: Dangerous SQL detected: "${keyword}"`);
      rl.prompt();
      return;
    }
  }

  try {
    // Highlight the SQL
    console.log(highlight(input, { language: "sql", ignoreIllegals: true }));

    // Execute the query
    const [rows] = await pool.query(input);

    // Pretty print results if there are rows
    if (Array.isArray(rows)) {
      console.table(rows);
    } else {
      console.log("✅ Query executed successfully.");
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }

  rl.prompt();
}).on("close", () => {
  console.log("Session ended.");
  process.exit(0);
});
