import Command from '@loogeek/cli-command'
import { log } from '@loogeek/cli-utils'

class InitCommand extends Command {
  get command() {
    return 'init [name]'
  }

  get description() {
    return 'init project'
  }

  get options() {
    return [
      ['-f, --force', '是否强制更新', false],
    ]
  }

  async action([name, opts]) {
    log.verbose('init action', name, opts)
  }
}

function Init(instance) {
  return new InitCommand(instance)
}

export default Init
