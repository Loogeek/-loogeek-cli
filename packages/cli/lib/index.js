import createInitCommand from '@loogeek/cli-init'
import createInstallCommand from '@loogeek/cli-install'
import createLintCommand from '@loogeek/cli-lint'
import createCLI from './createCLI.js'

export default function () {
  const program = createCLI()
  createInitCommand(program)
  createInstallCommand(program)
  createLintCommand(program)

  program.parse(process.argv)
}
