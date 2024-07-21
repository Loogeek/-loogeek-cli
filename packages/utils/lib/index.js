import isDebug from './isDebug.js'
import log from './log.js'
import { makeInput, makeList, makePassword } from './inquirer.js'
import { getLatestVersion, getNpmInfo } from './npm.js'
import request from './request.js'

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
}
