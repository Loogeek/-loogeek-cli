import path from 'node:path'
import { execa } from 'execa'

import { expect, it } from 'vitest'

const CLI = path.join(__dirname, '../bin/cli.js')
const bin = () => (...args) => execa(CLI, args)

// 测试运行错误的命令
it('run error command', async () => {
  const { stderr } = await bin()('iii')
  expect(stderr).toContain('未知的命令：iii')
})

// // 测试help命令不报错
it('should not throw error when use --help', async () => {
  let error = null
  try {
    await bin()('--help')
  }
  catch (e) {
    error = e
  }
  expect(error).toBe(null)
})

// 测试version正确显示
it('show correct version', async () => {
  const { stdout } = await bin()('-V')
  expect(stdout).toContain(require('../package.json').version)
})

// 测试是否正确开启debug模式
it('open debug mode', async () => {
  let error = null
  try {
    await bin()('--debug')
  }
  catch (e) {
    error = e
  }
  expect(error.message).toContain('launch debug mode')
})

it('cli test', () => {
  expect(1 + 1).toBe(2)
})
