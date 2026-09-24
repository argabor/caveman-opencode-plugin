import { test, expect } from 'bun:test'
import plugin from '../index'
import { dispatchCommand, CAVEMAN_COMMANDS } from '../commands/dispatch'

test('default export exposes the V2 shape (id + setup)', () => {
  const p = plugin as any
  expect(p.id).toBe('caveman')
  expect(typeof p.setup).toBe('function')
})

test('default export exposes the V1 shape (server function)', () => {
  const p = plugin as any
  expect(typeof p.server).toBe('function')
})

test('command table covers the caveman commands', () => {
  const names = CAVEMAN_COMMANDS.map((c) => c.name)
  expect(names).toContain('caveman')
  expect(names).toContain('caveman-mode')
  expect(names).toContain('caveman-commit')
  expect(names).toContain('caveman-review')
})

test('dispatchCommand returns null for foreign commands', () => {
  expect(dispatchCommand('not-ours', '', 'ses_test')).toBeNull()
})

test('dispatchCommand handles caveman-mode toggle', () => {
  const out = dispatchCommand('caveman-mode', 'ultra', 'ses_test_dispatch')
  expect(typeof out).toBe('string')
  expect(out).toContain('ultra')
})
