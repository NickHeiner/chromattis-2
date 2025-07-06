// deno-lint-ignore-file no-explicit-any
// Load environment variables from a local .env file if present
// @ts-ignore – Remote Deno std import not resolvable by tsc without plugin
import { load as loadEnv } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

await loadEnv(); // Populate Deno.env with variables from .env if available

// @ts-ignore – Deno npm specifier
import OpenAI from "npm:openai";
// @ts-ignore – Remote Deno std import not resolvable by tsc without plugin
import { parse } from "https://deno.land/std@0.224.0/flags/mod.ts";
import { ChromattisGameEngine } from "../lib/game/engine.ts";
import { LEVELS } from "../lib/game/levels.ts";

/**
 * Build the system prompt delivered to the model.
 * We intentionally do NOT describe the Chromattis mechanics – the agent must infer them.
 */
function buildSystemPrompt(): string {
  return `
    You are playing a puzzle game. You have tools available to inspect and mutate the current state. 
    Use the tools to figure out how the puzzle works, then solve it. The puzzle is considered solved when all tiles are the same number.

    Your goal is to solve it in as few moves as possible.`;
}

const TOOL_DEFINITIONS = [
  {
    type: "function",
    name: "get_state",
    description: "Return the current game state as JSON.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
    strict: true,
  },
  {
    type: "function",
    name: "tap_tile",
    description: "Tap a tile on the board",
    parameters: {
      type: "object",
      properties: {
        tileId: { type: "integer", description: "ID of tile to tap" },
      },
      required: ["tileId"],
    },
    strict: true,
  },
] as const;

/**
 * Submit a background job to OpenAI that attempts to solve the requested level.
 * Returns the newly-created job id.
 */
async function submitBackgroundJob(): Promise<string> {
  const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") ?? "" });

  const response = await openai.responses.create({
    model: "o3",
    mode: "background",
    instructions: buildSystemPrompt(),
    input: "Solve the puzzle.",
    tools: [
      {
        type: "code_interpreter",
        container: { type: "auto" },
      },
      ...TOOL_DEFINITIONS,
    ],
    reasoning: { effort: "high" },
  } as any);

  // The SDK returns the job meta when mode === "background" which includes an id
  return (response as any).id as string;
}

/**
 * Poll the given job id until it is no longer running, then print the outcome and token usage.
 */
async function pollJob(
  jobId: string,
  engine: ChromattisGameEngine
): Promise<void> {
  const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") ?? "" });

  Deno.stdout.writeSync(new TextEncoder().encode(`Polling job ${jobId}`));

  while (true) {
    const job: any = await openai.responses.retrieve(jobId);

    // heartbeat
    Deno.stdout.writeSync(new TextEncoder().encode("."));

    if (job.status === "requires_action") {
      const action = job.required_action as any;
      if (action?.type === "submit_tool_outputs") {
        const toolOutputs = action.tool_calls.map((call: any) => {
          const { id, name, arguments: args } = call;

          if (name === "get_state") {
            return { tool_call_id: id, output: JSON.stringify(engine.state) };
          }

          if (name === "tap_tile") {
            let parsed: { tileId: number };
            try {
              parsed = JSON.parse(args);
            } catch {
              parsed = { tileId: NaN } as any;
            }
            const newState = engine.clickTile(parsed.tileId);
            return { tool_call_id: id, output: JSON.stringify(newState) };
          }

          // Fallback for unknown tools
          return { tool_call_id: id, output: "Unknown tool call" };
        });

        // Method not yet in type defs – using as any
        await (openai.responses as any).submit_tool_outputs(jobId, {
          tool_outputs: toolOutputs,
        });
        continue; // Immediately continue polling after submitting outputs
      }
    }

    if (job.status !== "in_progress" && job.status !== "queued") {
      console.log("\n\n=== Job finished ===");
      console.log(`Status: ${job.status}`);

      if (job.status === "completed") {
        if (job.response) {
          console.log("Model response:\n");
          console.log(job.response);
          console.log("\n");
        }

        if (job.usage) {
          const { input_tokens, output_tokens, total_tokens } = job.usage;
          console.log(
            `Token usage – input: ${input_tokens}, output: ${output_tokens}, total: ${total_tokens}`
          );
        }
      } else {
        console.log("The job did not complete successfully.");
        if (job.error) {
          console.error("Error from OpenAI:", job.error);
        }
      }
      break;
    }

    await new Promise((res) => setTimeout(res, 2000));
  }
}

async function main() {
  const flags = parse(Deno.args, {
    string: ["job-id"],
    boolean: ["help"],
    alias: { h: "help" },
  });

  const level = flags.level ? Number(flags.level) : undefined;
  const jobId = flags["job-id"] as string | undefined;

  if (flags.help || (!level && !jobId)) {
    console.log(
      `Usage: deno run -A ai/index.ts [--level <number>] [--job-id <id>]\n\n` +
        "Options:\n" +
        "  --level     Chromattis level number to solve\n" +
        "  --job-id    Listen to an existing background job instead of starting a new one\n" +
        "  -h, --help  Show this help message\n"
    );
    if (!level && !jobId) Deno.exit(1);
  }

  const engine = new ChromattisGameEngine(LEVELS);

  if (jobId) {
    await pollJob(jobId, engine);
    return;
  }

  if (!level) {
    console.error("Error: --level is required when --job-id is not provided.");
    Deno.exit(1);
  }

  engine.loadLevel(level);
  const newJobId = await submitBackgroundJob(level);
  console.log(`Created background job: ${newJobId}`);

  await pollJob(newJobId, engine);
}

main().catch((err) => {
  console.error(err);
  Deno.exit(1);
});
