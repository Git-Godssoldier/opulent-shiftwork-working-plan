#!/usr/bin/env node
/**
 * ShiftWork Five-Track Intake Visual QA Interops Runner — 5 Scenarios
 * Model lock: deepseek/deepseek-v4-flash (coordinator + worker)
 * Platform: platform.opulentia.ai (prod:confident-sheep-333)
 *
 * Scenarios loaded from scenarios/shiftwork_five_track_visual_qa.scenarios.json
 */
import { chromium } from "playwright";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { join } from "path";

const ARTIFACT_BASE = join(import.meta.dirname);
const PLATFORM_URL = "https://platform.opulentia.ai";
const TEST_PASSWORD = `InteropTest2026!`;
const TEST_NAME = `ShiftWork Interop Bot`;
const TEST_EMAIL = `shiftwork-test-${Date.now()}@example.com`;
const MODEL_ID = "deepseek/deepseek-v4-flash";
const MODEL_LABEL = "DeepSeek V4 Flash";
const MODEL_STORAGE_ENTRIES = {
  "opulent-preferred-model-v32": MODEL_ID,
  "opulentia-coordinator-model-v7": MODEL_ID,
  "opulentia-worker-model-v6": MODEL_ID,
  "opulentia-active-role-v1": "coordinator",
};

// Timestamped run dir so every sweep gets fresh artifacts — no mixing
// with stale judge-result.json from previous runs.
const RUN_TIMESTAMP = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const RUN_DIR = join(ARTIFACT_BASE, `runs/${RUN_TIMESTAMP}`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function screenshot(page, dir, name) {
  const path = join(dir, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  console.log(`  📸 ${name}`);
  return path;
}

async function captureScreenshot(page, result, dir, name) {
  const path = await screenshot(page, dir, name);
  result.screenshots.push(path);
  return path;
}

function countOccurrences(text, pattern) {
  if (!text || !pattern) return 0;
  let count = 0;
  let index = 0;
  while ((index = text.indexOf(pattern, index)) !== -1) {
    count += 1;
    index += pattern.length;
  }
  return count;
}

function buildPrompt(interop) {
  return `${interop.prompt}

Verification output contract:
- Do not write the completion marker until after the requested intake, persistence, retrieval, build-plan, and validation checks are actually complete.
- Before autos_done, write an evidence brief with: claim checked, data/tool source, exact artifact or issue/thread reference, blockers, and next action.
- Include workspace ID, writer thread ID, reader thread ID, Drive/file ID, selected questionnaire, owner_confirmed answers, draft_from_research_unconfirmed answers, visual QA target details, five acceptance inputs, build plan, and validation_check result.
- If a connector is unavailable, required data cannot be read, persistence/retrieval cannot be performed, or validation_check cannot run, say BLOCKED and do not emit the completion marker.
- Final autos_done summary must be exactly ${interop.marker}.`;
}

function commonPrefixLength(a, b) {
  const limit = Math.min(a.length, b.length);
  let index = 0;
  while (index < limit && a[index] === b[index]) index += 1;
  return index;
}

function extractEvidenceText(pageText, promptBaselineText) {
  if (!pageText) return "";
  if (!promptBaselineText) return pageText;
  if (pageText.startsWith(promptBaselineText)) {
    return pageText.slice(promptBaselineText.length);
  }
  // The RSC stream may embed the prompt text mid-document. Find the last
  // occurrence of the prompt baseline and take everything after it — that
  // is the agent's actual output.
  const lastIdx = pageText.lastIndexOf(promptBaselineText);
  if (lastIdx >= 0) {
    return pageText.slice(lastIdx + promptBaselineText.length);
  }
  // Fall back to common-prefix stripping if exact match fails.
  const prefixLength = commonPrefixLength(pageText, promptBaselineText);
  if (prefixLength > 200) {
    return pageText.slice(prefixLength);
  }
  // If we cannot isolate the prompt, return the full text but flag it.
  return pageText;
}

// Strip prompt instruction text from evidence so words like "BLOCKED" that
// appear in the verification contract are not mistaken for agent blockers.
function stripPromptInstructions(text) {
  if (!text) return text;
  return text
    .replace(/say\s+BLOCKED\s+and\s+do\s+not\s+emit\s+the\s+completion\s+marker/gi, "")
    .replace(/If a connector is unavailable[^.]*\./gi, "");
}

function evaluateEvidence(interop, finalText, promptBaselineText) {
  const evidenceText = extractEvidenceText(finalText, promptBaselineText);
  const cleanedEvidence = stripPromptInstructions(evidenceText);
  const lowerEvidence = cleanedEvidence.toLowerCase();
  // Count how many times the marker appears in the prompt baseline itself.
  // Those are prompt-echo occurrences, not agent-produced evidence.
  const markerInPrompt = countOccurrences(promptBaselineText || "", interop.marker);
  const markerInFullText = countOccurrences(finalText, interop.marker);
  const markerAfterPrompt = Math.max(0, markerInFullText - markerInPrompt);
  const autosDoneInPrompt = countOccurrences(promptBaselineText || "", "autos_done");
  const autosDoneInFullText = countOccurrences(finalText, "autos_done");
  const autosDoneAfterPrompt = Math.max(0, autosDoneInFullText - autosDoneInPrompt);
  const blockerPhrases = [
    "agent run failed",
    "latest run ended with an error",
    "no active connection",
    "connector exists but has no active connection",
    "could not authenticate",
    "could not find",
    "not available",
  ];
  const blockerMatches = blockerPhrases.filter((pattern) =>
    lowerEvidence.includes(pattern),
  );
  if (
    /\bblocked\b/.test(lowerEvidence) &&
    !/\bblockers?\s*:\s*(none|no|n\/a|not found|0)\b/.test(lowerEvidence)
  ) {
    blockerMatches.push("blocked");
  }

  const evidenceBriefTerms = [
    "claim checked",
    "data/tool source",
    "artifact",
    "blockers",
    "next action",
  ];
  const requiredTerms = interop.requiredEvidenceTerms ?? [];
  const missingEvidenceBriefTerms = evidenceBriefTerms.filter(
    (term) => !lowerEvidence.includes(term),
  );
  const missingRequiredTerms = requiredTerms.filter(
    (term) => !lowerEvidence.includes(term.toLowerCase()),
  );

  return {
    bodyChars: finalText.length,
    promptBaselineChars: promptBaselineText?.length ?? 0,
    evidenceChars: cleanedEvidence.length,
    markerOccurrencesTotal: markerInFullText,
    markerInPrompt,
    markerOccurrencesAfterPrompt: markerAfterPrompt,
    autosDoneInPrompt,
    autosDoneOccurrencesAfterPrompt: autosDoneAfterPrompt,
    blockerMatches,
    evidenceBriefTerms,
    missingEvidenceBriefTerms,
    requiredTerms,
    missingRequiredTerms,
    evidenceSnippet: cleanedEvidence.slice(-1200),
  };
}

async function enforceModelLock(page) {
  await page.evaluate((entries) => {
    try {
      for (const [key, value] of Object.entries(entries)) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // The next app-origin navigation will apply the context init script.
    }
  }, MODEL_STORAGE_ENTRIES);
}

async function readModelLock(page) {
  return await page.evaluate((keys) => {
    try {
      return Object.fromEntries(
        keys.map((key) => [key, window.localStorage.getItem(key)]),
      );
    } catch {
      return Object.fromEntries(keys.map((key) => [key, null]));
    }
  }, Object.keys(MODEL_STORAGE_ENTRIES));
}

// Load scenarios from JSON
const scenariosFile = readFileSync(
  join(ARTIFACT_BASE, "scenarios", "shiftwork_five_track_visual_qa.scenarios.json"),
  "utf8",
);
const scenariosData = JSON.parse(scenariosFile);
const scenarios = scenariosData.scenarios.map((s) => ({
  id: s.scenarioId,
  shortId: s.scenarioId.replace("SHIFTWORK-INTAKE-VQA-", "SW-VQA-"),
  name: `${s.track} Visual QA`,
  track: s.track,
  marker: s.completionMarker,
  prompt: s.prompt,
  dir: join(RUN_DIR, s.scenarioId),
  waitMs: 600000,
  intervalMs: 100000,
  requiredEvidenceTerms: [
    "workspace",
    "writer thread",
    "reader thread",
    "fileid",
    "owner_confirmed",
    "draft_from_research_unconfirmed",
    "visual qa",
    "acceptance inputs",
    "build plan",
    "validation_check",
  ],
}));

// Allow filtering scenarios via CLI: --only FULFILLMENT-03,SERVICE-04
const onlyArg = process.argv.find((a) => a === "--only");
let filteredScenarios = scenarios;
if (onlyArg) {
  const idx = process.argv.indexOf(onlyArg);
  const filterRaw = process.argv[idx + 1] ?? "";
  const filters = filterRaw.split(",").map((f) => f.trim().toUpperCase()).filter(Boolean);
  if (filters.length) {
    filteredScenarios = scenarios.filter((s) =>
      filters.some((f) => s.id.toUpperCase().includes(f) || s.shortId.toUpperCase().includes(f)),
    );
    console.log(`Filtering to ${filteredScenarios.length} scenario(s): ${filteredScenarios.map((s) => s.shortId).join(", ")}`);
  }
}

async function run() {
  console.log(`\n=== ShiftWork Five-Track Intake Visual QA Runner ===`);
  console.log(`Model: ${MODEL_LABEL}`);
  console.log(`Platform: ${PLATFORM_URL}`);
  console.log(`Scenarios: ${filteredScenarios.length}`);
  console.log(`Run dir: ${RUN_DIR}\n`);
  mkdirSync(RUN_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  });
  await context.addInitScript((entries) => {
    try {
      for (const [key, value] of Object.entries(entries)) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // localStorage is origin-bound; ignore non-app documents.
    }
  }, MODEL_STORAGE_ENTRIES);
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push({ text: msg.text(), url: page.url(), time: new Date().toISOString() });
    }
  });

  const results = [];

  try {
    // === Signup (fresh account each run) ===
    console.log("--- Signup ---");
    console.log(`  Email: ${TEST_EMAIL}`);
    await page.goto(`${PLATFORM_URL}/auth?mode=signup`, { waitUntil: "networkidle", timeout: 30000 });
    await sleep(3000);

    let loggedIn = false;

    const nameInput = page.locator("#name");
    const signupEmail = page.locator("#email");
    const signupPassword = page.locator("#password");

    if (await signupEmail.isVisible({ timeout: 5000 }).catch(() => false)) {
      if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nameInput.fill(TEST_NAME);
      }
      await signupEmail.fill(TEST_EMAIL);
      await signupPassword.fill(TEST_PASSWORD);
      const createBtn = page.locator('button[type="submit"]:has-text("Create account")').first();
      if (await createBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await createBtn.click();
        console.log("  Clicked Create account");
      } else {
        await page.locator('button[type="submit"]').first().click();
        console.log("  Clicked submit");
      }
      await page.waitForURL("**/dashboard**", { timeout: 20000 }).catch(() => {});
      await sleep(3000);
      if (page.url().includes("/dashboard")) {
        loggedIn = true;
        console.log("  ✅ Signed up");
      }
    }

    if (!loggedIn) {
      console.log("  ⚠️ Could not authenticate — attempting interops anyway");
    }
    await enforceModelLock(page);
    console.log("  Model lock:", await readModelLock(page));
    await screenshot(page, scenarios[0].dir, "00-after-login");

    // === Run interops ===
    for (const interop of filteredScenarios) {
      console.log(`\n--- [${interop.shortId}] ${interop.name} ---`);
      mkdirSync(interop.dir, { recursive: true });

      const result = {
        scenarioId: interop.id,
        shortId: interop.shortId,
        name: interop.name,
        track: interop.track,
        model: MODEL_ID,
        modelLock: {},
        startTime: new Date().toISOString(),
        verdict: "PENDING",
        marker: interop.marker,
        screenshots: [],
        consoleErrors: [],
        verification: null,
        notes: "",
        threadUrl: "",
        pageTextSnippet: "",
      };

      try {
        // Navigate to dashboard for fresh chat
        await enforceModelLock(page);
        await page.goto(`${PLATFORM_URL}/dashboard`, { waitUntil: "networkidle", timeout: 15000 }).catch(() => {});
        await sleep(5000);
        await enforceModelLock(page);
        result.modelLock = await readModelLock(page);
        const preferredModel = result.modelLock["opulent-preferred-model-v32"];
        if (preferredModel !== MODEL_ID) {
          result.verdict = "BLOCKED";
          result.notes = `Model lock failed: expected ${MODEL_ID}, got ${preferredModel || "null"}`;
          await captureScreenshot(page, result, interop.dir, `${interop.shortId}-model-lock-blocked`);
          result.endTime = new Date().toISOString();
          results.push(result);
          writeFileSync(join(interop.dir, "judge-result.json"), JSON.stringify(result, null, 2));
          console.log(`  Verdict: ${result.verdict} — ${result.notes}`);
          continue;
        }

        // Find chat textarea
        let messageInput = null;
        const selectors = [
          'textarea[placeholder*="ask" i]',
          'textarea[placeholder*="message" i]',
          'textarea[placeholder*="send" i]',
          'textarea[placeholder*="type" i]',
          'div[contenteditable="true"]',
          '[role="textbox"]',
          'textarea',
        ];
        for (const sel of selectors) {
          const candidate = page.locator(sel).first();
          if (await candidate.isVisible({ timeout: 2000 }).catch(() => false)) {
            messageInput = candidate;
            console.log(`  Found input: ${sel}`);
            break;
          }
        }

        if (messageInput) {
          const submittedPrompt = buildPrompt(interop);
          await messageInput.click();
          await messageInput.fill(submittedPrompt);
          await sleep(500);
          await captureScreenshot(page, result, interop.dir, `${interop.shortId}-prompt-typed`);
          const promptBaselineText = await page.textContent("body").catch(() => "");
          const promptBaselinePath = join(interop.dir, "prompt-baseline-text.txt");
          writeFileSync(promptBaselinePath, promptBaselineText || "");
          result.promptBaselineTextPath = promptBaselinePath;

          // Send via Enter
          await messageInput.press("Enter");
          console.log(`  Prompt sent, waiting ${interop.waitMs / 1000}s...`);
          result.threadUrl = page.url();

          // Wait and check — ONLY stop early on actual completion marker
          // after prompt, NOT on autos_done alone. autos_done can appear
          // in checklist/task-list text mid-workflow.
          const checks = Math.floor(interop.waitMs / interop.intervalMs);
          let markerFound = false;
          for (let i = 0; i < checks; i++) {
            await sleep(interop.intervalMs);
            console.log(`  Check ${i + 1}/${checks}...`);
            await captureScreenshot(page, result, interop.dir, `${interop.shortId}-check-${i + 1}`);

            const pageText = await page.textContent("body").catch(() => "");
            const verification = evaluateEvidence(interop, pageText || "", promptBaselineText || "");
            if (verification.markerOccurrencesAfterPrompt > 0) {
              console.log(`  Completion marker found after prompt at check ${i + 1}`);
              result.pageTextSnippet = verification.evidenceSnippet.slice(-500);
              markerFound = true;
              // Don't break immediately — wait one more interval for the
              // backend to reach terminal state and flush final content.
              await sleep(interop.intervalMs);
              await captureScreenshot(page, result, interop.dir, `${interop.shortId}-post-marker`);
              break;
            }
            if (verification.autosDoneOccurrencesAfterPrompt > 0) {
              console.log(`  autos_done seen at check ${i + 1} — continuing to wait for completion marker...`);
            }
          }

          // Recapture final page state after the wait loop completes
          await captureScreenshot(page, result, interop.dir, `${interop.shortId}-final`);
          result.threadUrl = page.url();
          result.markerFoundDuringWait = markerFound;

          // Capture console errors
          result.consoleErrors = [...consoleErrors];
          consoleErrors.length = 0;

          // Judge
          const finalText = await page.textContent("body").catch(() => "");
          const pageTextPath = join(interop.dir, "page-text-retest.txt");
          writeFileSync(pageTextPath, finalText || "");
          result.pageTextPath = pageTextPath;
          result.verification = evaluateEvidence(interop, finalText || "", promptBaselineText || "");
          result.pageTextSnippet = result.verification.evidenceSnippet.slice(-500);

          const hasVerifiedMarker = result.verification.markerOccurrencesAfterPrompt > 0;
          const hasPromptEchoOnly =
            result.verification.markerOccurrencesTotal > 0 &&
            result.verification.markerOccurrencesAfterPrompt === 0;
          const hasBlocker = result.verification.blockerMatches.length > 0;
          const hasMissingTerms = result.verification.missingRequiredTerms.length > 0;
          const hasMissingEvidenceBrief =
            result.verification.missingEvidenceBriefTerms.length > 0;

          // Structural proof: require actual ID patterns in the evidence,
          // not just term matches. This prevents false PASS from checklist
          // text that mentions terms without actual artifacts.
          const evidenceLower = (result.verification.evidenceSnippet || "").toLowerCase();
          const hasWorkspaceId = /ws_[a-z0-9]{8,}/.test(evidenceLower) || /workspace.*(?:id|[:\s])\s*[\w-]{8,}/.test(evidenceLower);
          const hasThreadId = /m[0-9a-z]{20,}/.test(evidenceLower) || /thread.*(?:id|[:\s])\s*[\w-]{10,}/.test(evidenceLower);
          const hasValidationResult = /validation_check.*(?:pass|fail|complete|result|✓|✗|done)/i.test(evidenceLower);
          const hasStructuralProof = hasWorkspaceId && hasThreadId && hasValidationResult;

          if (hasVerifiedMarker && !hasBlocker && !hasMissingTerms && !hasMissingEvidenceBrief && hasStructuralProof) {
            result.verdict = "PASS";
            result.notes = `Completion marker '${interop.marker}' found after submitted prompt with required intake evidence, evidence brief, and structural proof (workspace ID, thread ID, validation result)`;
          } else if (hasVerifiedMarker && !hasStructuralProof) {
            result.verdict = "INCONCLUSIVE";
            result.notes = `Completion marker found but structural proof missing (workspaceId=${hasWorkspaceId}, threadId=${hasThreadId}, validationResult=${hasValidationResult}) — may be checklist text, not final evidence`;
          } else if (hasBlocker) {
            result.verdict = "FAIL";
            result.notes = `Blocker evidence found after submitted prompt: ${result.verification.blockerMatches.join(", ")}`;
          } else if (hasPromptEchoOnly) {
            result.verdict = "INCONCLUSIVE";
            result.notes = "Completion marker only appeared in submitted prompt echo; no post-prompt completion evidence";
          } else if (hasMissingTerms) {
            result.verdict = "INCONCLUSIVE";
            result.notes = `Completion evidence missing required terms: ${result.verification.missingRequiredTerms.join(", ")}`;
          } else if (hasMissingEvidenceBrief) {
            result.verdict = "INCONCLUSIVE";
            result.notes = `Completion evidence missing evidence brief terms: ${result.verification.missingEvidenceBriefTerms.join(", ")}`;
          } else {
            result.verdict = "INCONCLUSIVE";
            result.notes = "No post-prompt completion marker found — needs manual review of screenshots and page text";
          }
        } else {
          result.verdict = "BLOCKED";
          result.notes = "Message input not found on dashboard";
          await captureScreenshot(page, result, interop.dir, `${interop.shortId}-blocked`);
        }
      } catch (err) {
        result.verdict = "BLOCKED";
        result.notes = `Exception: ${err.message}`;
        await captureScreenshot(page, result, interop.dir, `${interop.shortId}-error`).catch(() => null);
      }

      result.endTime = new Date().toISOString();
      results.push(result);

      // Write per-interop judge result
      const judgePath = join(interop.dir, "judge-result.json");
      writeFileSync(judgePath, JSON.stringify(result, null, 2));
      console.log(`  Verdict: ${result.verdict} — ${result.notes}`);
    }

    // Final screenshot
    await page.goto(`${PLATFORM_URL}/dashboard`, { waitUntil: "networkidle", timeout: 15000 }).catch(() => {});
    await sleep(2000);
    await screenshot(page, RUN_DIR, "99-final-dashboard");

  } catch (err) {
    console.error("Fatal error:", err);
  } finally {
    await browser.close();
  }

  // Write combined results
  const combined = {
    sweepDate: new Date().toISOString(),
    model: MODEL_ID,
    platform: PLATFORM_URL,
    testEmail: TEST_EMAIL,
    interops: results,
    summary: {
      total: results.length,
      pass: results.filter((r) => r.verdict === "PASS").length,
      fail: results.filter((r) => r.verdict === "FAIL").length,
      inconclusive: results.filter((r) => r.verdict === "INCONCLUSIVE").length,
      blocked: results.filter((r) => r.verdict === "BLOCKED").length,
    },
  };

  const combinedPath = join(RUN_DIR, "combined-judge-results.json");
  writeFileSync(combinedPath, JSON.stringify(combined, null, 2));
  console.log(`\n=== Sweep complete ===`);
  console.log(`Summary: ${combined.summary.pass} PASS, ${combined.summary.fail} FAIL, ${combined.summary.inconclusive} INCONCLUSIVE, ${combined.summary.blocked} BLOCKED`);
}

run().catch(console.error);
