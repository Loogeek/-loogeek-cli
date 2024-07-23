import { makeList } from '../inquirer.js'
import log from '../log.js'
import Github from './Github.js'
import Gitee from './Gitee.js'
import { getGitPlatform } from './GitServer.js'

export async function initGitServer() {
  let platform = getGitPlatform()
  if (!platform) {
    platform = await makeList({
      message: '请选择Git平台',
      choices: [{
        name: 'GitHub',
        value: 'github',
      }, {
        name: 'Gitee',
        value: 'gitee',
      }],
    })
  }
  log.verbose('platform', platform)
  let gitAPI
  if (platform === 'github')
    gitAPI = new Github()
  else
    gitAPI = new Gitee()

  gitAPI.savePlatform(platform)
  await gitAPI.init()
  return gitAPI
}
