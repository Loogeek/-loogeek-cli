import isDebug from './isDebug.js'
import log from './log.js'
import { makeInput, makeList, makePassword } from './inquirer.js'
import { getLatestVersion, getNpmInfo } from './npm.js'
import request from './request.js'
import Github from './git/Github.js'
import Gitee from './git/Gitee.js'
import { getGitPlatform } from './git/GitServer.js'
import { initGitServer } from './git/GitUtils.js'

function printErrorLog(e, type) {
  if (isDebug())
    log.error(type, e)
  else
    log.error(type, e.message)
}

export {
  log,
  isDebug,
  makeInput,
  makePassword,
  makeList,
  getLatestVersion,
  getNpmInfo,
  printErrorLog,
  request,
  Github,
  Gitee,
  getGitPlatform,
  initGitServer,
}
