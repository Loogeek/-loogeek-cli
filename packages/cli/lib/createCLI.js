import path from 'node:path'
import fse from 'fs-extra'
import { dirname } from 'dirname-filename-esm'
import semver from 'semver'
import { program } from 'commander'

import { log } from '@loogeek/cli-utils'

const __dirname = dirname(import.meta)
const pkgPath = path.resolve(__dirname, '../package.json')
const pkg = fse.readJsonSync(pkgPath)

const LOWEST_NODE_VERSION = '14.0.0'

function checkNodeVersion() {
  log.verbose('node version', process.version)
  if (!semver.gte(process.version, LOWEST_NODE_VERSION))
    throw new Error('chalk')
}

function preAction() {
  // 检查Node版本
  checkNodeVersion()
}

export default function createCLI() {
  log.info('version', pkg.version)

  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .hook('preAction', preAction)

  program.on('option:debug', () => {
    // log.info(program.opts())

    if (program.opts().debug)
      log.verbose('debug', 'launch debug mode')
  })

  program.on('command:*', (obj) => {
    log.error(`未知的命令：${obj[0]}`)
  })

  return program
}
