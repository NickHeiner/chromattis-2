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
import logger, { LogMetadata } from "npm:nth-log";
import { GameState } from "../lib/game/types.ts";

//--------------------------------------------------------------------------//
// Logger setup
//--------------------------------------------------------------------------//
// Use trace level to see raw OpenAI events (set LOG_LEVEL=trace)
// Use info level for clean, human-readable progress updates (default)
// Note: nth-log wraps Bunyan, so it uses standard Bunyan log levels

const log = logger({
  name: "chromattis-solver",
  level: Deno.env.get("loglevel") as LogMetadata["level"] || "info",
});

//--------------------------------------------------------------------------//
// Helpers
//--------------------------------------------------------------------------//

function buildSystemPrompt(): string {
  return `
    You are playing a puzzle game. You have tools available to inspect and mutate the current state. 
    Use the tools to figure out how the puzzle works, then solve it. The puzzle is considered solved when all tiles are the same number.

    Your goal is to solve it in as few moves as possible.
    
    Throughout, explain your reasoning to the user`.trim();
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
    boolean: ["help", "show-target-tiles"],
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

  function getStateToShowModel(state: GameState) {
    if (flags.showTargetTiles) {
      return state;
    }

    return state.board.map(({ 
      // deno-lint-ignore no-unused-vars
      targetTiles, 
      ...rest 
    }) => rest);
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
    execute: () => getStateToShowModel(engine.state),
  });

  const tapTileTool = tool({
    name: "tap_tile",
    description: "Tap a tile on the board.",
    parameters: z
      .object({
        tileId: z.number().int().describe("ID of tile to tap"),
      })
      .strict(),
    execute: ({ tileId }) => getStateToShowModel(engine.clickTile(tileId)),
  });

  // -----------------------------------------------------------------------//
  // Build and run the agent
  // -----------------------------------------------------------------------//

  const agent = new Agent({
    name: "Chromattis Solver",
    instructions: buildSystemPrompt(),
    tools: [getStateTool, tapTileTool],
    model: "o3",
    modelSettings: {
      // This doesn't seem to actually work
      // @ts-expect-error looks like this isn't in the types yet https://chatgpt.com/c/686acd7d-876c-8011-adae-163f2d01b005
      reasoning: {
        effort: "high",
        summary: "response"
      }
    }
  });

  log.info(`Running agent on level ${level}...`);
  // Enable streaming so we can observe incremental events
  const result = await run(agent, "Solve the puzzle.", {
    reasoning: { effort: "high" },
    stream: true,
    maxTurns: 1_000
  } as any);

  // @ts-expect-error seems like the OAI types are wrong
  for await (const event of result) {
    // Log raw events at trace level
    if (event.type === "raw_model_stream_event") {
      log.trace(`${event.type} %o`, event.data);

      // Also capture specific event types at info level
      if (
        event.data?.type === "response.output_item.added" &&
        event.data?.item?.type === "reasoning"
      ) {
        log.info(`🤔 Model started reasoning...`);
      }

      if (event.type === "output_text_delta" && event.delta) {
        // These are text fragments - we log them at trace level
        log.trace(`Text delta: ${event.delta}`);
      }
    }
    // agent updated events
    if (event.type == "agent_updated_stream_event") {
      log.trace(`${event.type} %s`, event.agent.name);
    }
    // Agent SDK specific events
    if (event.type === "run_item_stream_event") {
      log.trace(`${event.type} %o`, event.item);

      // Log the event type name for debugging
      const itemType = event.item?.type;
      const itemConstructor = event.item?.constructor?.name;
      if (itemType) {
        log.trace(
          `Processing item type: ${itemType} (${
            itemConstructor || "unknown constructor"
          })`,
        );
      }

      // Log reasoning items at info level
      if (event.item?.type === "reasoning_item") {
        const reasoningContent = event.item.rawItem?.content;
        if (reasoningContent && reasoningContent.length > 0) {
          log.info(`🤔 Model reasoning:`, reasoningContent);
        } else {
          log.info(`🤔 Model is thinking...`);
        }
      }

      // Log meaningful events at info level
      if (event.item?.type === "tool_call_item") {
        const toolName = event.item.rawItem?.name;
        const args = event.item.rawItem?.arguments;
        log.info(`🔧 Tool call: ${toolName}`, args ? JSON.parse(args) : {});
      }

      if (event.item?.type === "tool_call_output_item") {
        const toolName = event.item.rawItem?.name;
        const output = event.item.output;
        if (toolName === "get_state" && output) {
          log.info(`📊 Game state:`, output);
        } else if (toolName === "tap_tile" && output) {
          log.info(`👆 Tapped tile, new state:`, output);
          if (output.isWin) {
            log.info(`🎉 Puzzle solved in ${output.moves} moves!`);
          }
        }
      }

      if (event.item?.type === "message_output_item") {
        // Log the full structure at trace level
        log.trace(`RunMessageOutputItem details:`, {
          id: event.item.rawItem?.id,
          role: event.item.rawItem?.role,
          contentLength: event.item.rawItem?.content?.length,
        });

        const text = event.item.rawItem?.content?.[0]?.text;
        if (text) {
          log.info(`💬 Agent message`, { text });
        }
      }
    }

    // Also check for direct RunMessageOutputItem events
    if (event.type === "RunMessageOutputItem") {
      log.info(`📝 RunMessageOutputItem event:`, event);
    }
  }
  log.info("✅ Agent run completed");
}
