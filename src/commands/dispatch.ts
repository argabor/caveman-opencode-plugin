import { handleMode } from './mode'
import { handleCommit } from './commit'
import { handleReview } from './review'

export interface CavemanCommandDef {
  name: string
  description: string
}

/**
 * The commands this plugin owns. Shared by the V1 `config` hook (which only
 * registers placeholder commands) and the V2 `ctx.command.transform` (which
 * registers executable commands).
 */
export const CAVEMAN_COMMANDS: CavemanCommandDef[] = [
  { name: 'caveman', description: 'Toggle caveman communication mode' },
  { name: 'caveman-mode', description: 'Toggle caveman communication mode' },
  { name: 'caveman-commit', description: 'Generate commit messages in caveman style' },
  { name: 'caveman-review', description: 'Review code in caveman style' },
]

/**
 * Resolve a caveman command to the text that should be submitted as the prompt.
 * Returns `null` when the command is not owned by this plugin.
 */
export function dispatchCommand(cmd: string, args: string, sessionID: string): string | null {
  if (cmd === 'caveman' || cmd === 'caveman-mode') {
    return handleMode(sessionID, [args]).message
  }

  if (cmd === 'caveman-commit') {
    return withUserInput(handleCommit(sessionID, args.split(/\s+/)), args)
  }

  if (cmd === 'caveman-review') {
    return withUserInput(handleReview(sessionID, args.split(/\s+/)), args)
  }

  return null
}

/**
 * The command text replaces the user's prompt, so the arguments (e.g. the code
 * to review) must be carried over after the instruction or the model gets
 * nothing to work on.
 */
function withUserInput(result: { systemInstruction?: string; message?: string }, args: string): string {
  if (!result.systemInstruction) return result.message || ''
  return args ? `${result.systemInstruction}\n\n${args}` : result.systemInstruction
}
