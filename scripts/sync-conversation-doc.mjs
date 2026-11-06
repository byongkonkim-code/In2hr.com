import fs from "fs";
import path from "path";
import { execSync } from "child_process";

/**
 * Automated Conversation Log Archiver & GitHub Sync Script
 * Reads Antigravity conversation transcript and syncs to doc/ folder + GitHub.
 */
const TRANSCRIPT_PATH =
  "C:\\Users\\zambi\\.gemini\\antigravity\\brain\\b546c498-947f-4b69-95df-28e877fa8f87\\.system_generated\\logs\\transcript.jsonl";
const OUTPUT_DOC = path.join(process.cwd(), "doc", "transcript-auto-archive.md");

function syncTranscriptToDoc() {
  if (!fs.existsSync(TRANSCRIPT_PATH)) {
    console.log("Transcript file not found at:", TRANSCRIPT_PATH);
    return;
  }

  const lines = fs
    .readFileSync(TRANSCRIPT_PATH, "utf-8")
    .split("\n")
    .filter((l) => l.trim().length > 0);

  const entries = [];
  for (const line of lines) {
    try {
      const step = JSON.parse(line);
      if (step.type === "USER_INPUT" && step.content) {
        entries.push({
          role: "👤 User",
          time: step.created_at || "",
          content: step.content.replace(/<\/?USER_REQUEST>/g, "").trim(),
        });
      } else if (step.type === "PLANNER_RESPONSE" && step.content && step.content.trim()) {
        entries.push({
          role: "🤖 Assistant",
          time: step.created_at || "",
          content: step.content.trim(),
        });
      }
    } catch {
      // skip malformed line
    }
  }

  let markdown = `# IN2U HR 전체 대화 트랜스크립트 아카이브 (Auto-Synced)\n\n`;
  markdown += `> 마지막 자동 동기화 시각: ${new Date().toISOString()}\n\n---\n\n`;

  entries.forEach((item, idx) => {
    markdown += `### [${idx + 1}] ${item.role} (${item.time})\n\n${item.content}\n\n---\n\n`;
  });

  fs.mkdirSync(path.dirname(OUTPUT_DOC), { recursive: true });
  fs.writeFileSync(OUTPUT_DOC, markdown, "utf-8");
  console.log(`✅ Updated ${OUTPUT_DOC} with ${entries.length} conversation messages.`);

  if (process.argv.includes("--push")) {
    try {
      execSync("git add doc/", { stdio: "inherit" });
      execSync(`git commit -m "docs: auto-sync conversation log to doc/ folder" || exit 0`, {
        stdio: "inherit",
      });
      execSync("git push", { stdio: "inherit" });
      console.log("🚀 Successfully pushed updated doc/ folder to GitHub!");
    } catch (err) {
      console.warn("⚠️ Git push warning:", err.message);
    }
  }
}

syncTranscriptToDoc();
