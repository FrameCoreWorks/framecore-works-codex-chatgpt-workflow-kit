import { validateChatGptRepositorySetup } from "../chatgpt-skill-sources.mjs";

export function run(ctx) {
  const { findings, addFinding } = ctx.helpers.createFindings(ctx.root);
  for (const error of validateChatGptRepositorySetup(ctx.root)) {
    addFinding("INVALID_CHATGPT_REPOSITORY_SETUP", error.message, [error.file]);
  }
  return { findings };
}
