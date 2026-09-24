/**
 * Minimal, hand-mirrored subset of the OpenCode V2 plugin API.
 *
 * Why hand-mirrored instead of `import type { ... } from '@opencode/plugin'`:
 * the same package must still load on V1 hosts, where `@opencode/plugin` may not
 * be resolvable. Keeping the types local avoids any runtime/type resolution
 * dependency on the V2 package, so a single build works on both generations.
 *
 * Reference: https://opencode.ai/v2/docs/build/plugins
 * Mirrored against the V2 plugin API as of @opencode/plugin 2.x.
 */

export interface V2SystemPart {
  type: 'text'
  text: string
}

/** Payload of `ctx.session.hook("context", ...)` — the outgoing model request. */
export interface V2ContextEvent {
  readonly sessionID: string
  system: V2SystemPart[]
  messages: unknown[]
  options: Record<string, unknown>
}

export interface V2PromptInput {
  text?: string
  [key: string]: unknown
}

export interface V2CommandInvocation {
  sessionID: string
  prompt: V2PromptInput
  delivery: 'steer' | 'queue'
}

export interface V2CommandDefinition {
  name: string
  description?: string
  execute(input: V2CommandInvocation): Promise<void>
}

export interface V2CommandEditor {
  add(definition: V2CommandDefinition): void
}

export interface V2Registration {
  dispose(): Promise<void>
}

export interface V2SessionDomain {
  hook(
    name: 'context',
    callback: (event: V2ContextEvent) => Promise<void> | void,
  ): Promise<V2Registration>
  prompt(input: Record<string, unknown>): Promise<unknown>
}

export interface V2CommandDomain {
  transform(callback: (editor: V2CommandEditor) => void): Promise<V2Registration>
}

export interface V2Location {
  directory: string
  workspaceID?: string
  project?: { id: string; directory: string; canonical: string }
}

export interface V2PluginContext {
  app: { version: string; channel: string }
  location: V2Location
  options: Record<string, unknown>
  session: V2SessionDomain
  command: V2CommandDomain
}

/** The V2 half of the dual-generation default export. */
export interface V2Plugin {
  id: string
  setup(ctx: V2PluginContext): Promise<void> | void
}
