// deno-lint-ignore-file no-explicit-any
// ---------------------------------------------------------------------------
// Chromattis solver powered by the OpenAI Agents SDK
// ---------------------------------------------------------------------------

// NOTE: This file was fully refactored to use the high-level `@openai/agents`
// SDK (https://openai.github.io/openai-agents-js/) instead of the low-level
// background-job polling previously implemented with the beta `responses` API.
// The CLI behaviour is unchanged: pass `--level <number>` to choose the puzzle
// level you want the agent to solve.

// Load environment variables from a local .env file if present
import { load as loadEnv } from "@std/dotenv";
await loadEnv({ export: true });

//--------------------------------------------------------------------------//
// Imports
//--------------------------------------------------------------------------//

import { parse } from "@std/flags";
import { z } from "zod";
import { Agent, run, tool } from "@openai/agents";
import { ChromattisGameEngine } from "../lib/game/engine.ts";
import { LEVELS } from "../lib/game/levels.ts";

//--------------------------------------------------------------------------//
// Helpers
//--------------------------------------------------------------------------//

function buildSystemPrompt(): string {
  return `
    You are playing a puzzle game. You have tools available to inspect and mutate the current state. 
    Use the tools to figure out how the puzzle works, then solve it. The puzzle is considered solved when all tiles are the same number.

    Your goal is to solve it in as few moves as possible.`.trim();
}

//--------------------------------------------------------------------------//
// Main CLI entrypoint
//--------------------------------------------------------------------------//

if (import.meta.main) {
  await main();
}

async function main() {
  const flags = parse(Deno.args, {
    string: ["level"],
    boolean: ["help"],
    alias: { h: "help" },
  });

  const level = flags.level ? Number(flags.level) : undefined;

  if (flags.help || !level) {
    console.log(
      `Usage: deno run -A ai/index.ts --level <number>\n\n` +
        "Options:\n" +
        "  --level     Chromattis level number to solve\n" +
        "  -h, --help  Show this help message\n",
    );
    if (!level) Deno.exit(1);
  }

  // -----------------------------------------------------------------------//
  // Initialise the game engine & tools
  // -----------------------------------------------------------------------//

  const engine = new ChromattisGameEngine(LEVELS);
  engine.loadLevel(level as number);

  const getStateTool = tool({
    name: "get_state",
    description: "Return the current game state as JSON.",
    parameters: z.object({}).strict(),
    execute: () => engine.state,
  });

  const tapTileTool = tool({
    name: "tap_tile",
    description: "Tap a tile on the board.",
    parameters: z
      .object({
        tileId: z.number().int().describe("ID of tile to tap"),
      })
      .strict(),
    execute: ({ tileId }) => engine.clickTile(tileId),
  });

  // -----------------------------------------------------------------------//
  // Build and run the agent
  // -----------------------------------------------------------------------//

  const agent = new Agent({
    name: "Chromattis Solver",
    instructions: buildSystemPrompt(),
    tools: [getStateTool, tapTileTool],
    model: "o3",
  });

  console.log(`Running agent on level ${level}...`);
  // Enable streaming so we can observe incremental events
  const result = await run(agent, "Solve the puzzle.", {
    reasoning: { effort: "high" },
    stream: true,
  } as any);

  // @ts-expect-error seems like the OAI types are wrong
  for await (const event of result) {
    // these are the raw events from the model
    if (event.type === 'raw_model_stream_event') {
      console.log(`${event.type} %o`, event.data);
    }
    // agent updated events
    if (event.type == 'agent_updated_stream_event') {
      console.log(`${event.type} %s`, event.agent.name);
    }
    // Agent SDK specific events
    if (event.type === 'run_item_stream_event') {
      console.log(`${event.type} %o`, event.item);
    }
  }
  console.log("\n=== Agent run completed ===\n");
}
