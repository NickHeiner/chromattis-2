import OpenAI from "openai";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

/**
 * Build the system prompt delivered to the model.
 * We intentionally do NOT describe the Chromattis mechanics – the agent must infer them.
 */
function buildSystemPrompt(level: number | string): string {
  return `You are playing the puzzle game Chromattis. Your goal is to successfully solve the specified level as efficiently as possible. Report when you have either found a solution or determined the puzzle is unsolvable. Level: ${level}.`;
}

/**
 * Build the user prompt delivered to the model.
 */
function buildUserPrompt(level: number | string): string {
  return `Solve Chromattis level ${level}.`;
}

/**
 * Submit a background job to OpenAI that attempts to solve the requested level.
 * Returns the newly-created job id.
 */
async function submitBackgroundJob(level: number | string): Promise<string> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.responses.create({
    model: "o3",
    // @ts-expect-error – "mode" is valid but missing in types
    mode: "background",
    instructions: buildSystemPrompt(level),
    input: buildUserPrompt(level),
    tools: [
      {
        type: "code_interpreter",
        container: { type: "auto" },
      },
    ],
    reasoning: { effort: "high" },
  });

  // The SDK returns the job meta when mode === "background" which includes an id
  return (response as any).id as string;
}

/**
 * Poll the given job id until it is no longer running, then print the outcome and token usage.
 */
async function pollJob(jobId: string): Promise<void> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  process.stdout.write(`Polling job ${jobId}`);

  while (true) {
    const job: any = await openai.responses.retrieve(jobId);

    // heartbeat
    process.stdout.write(".");

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
  const argv = await yargs(hideBin(process.argv))
    .option("level", {
      type: "number",
      describe: "Chromattis level number to solve",
    })
    .option("job-id", {
      type: "string",
      describe:
        "Listen to an existing background job instead of starting a new one",
    })
    .check((args: { level?: number; jobId?: string }) => {
      if (!args.level && !args.jobId) {
        throw new Error("You must provide either --level or --job-id.");
      }
      return true;
    })
    .help()
    .alias("h", "help").argv;

  if (argv.jobId) {
    await pollJob(argv.jobId as string);
    return;
  }

  const level = argv.level as number;
  const jobId = await submitBackgroundJob(level);
  console.log(`Created background job: ${jobId}`);

  await pollJob(jobId);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
