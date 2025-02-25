import urlJoin from 'url-join'
import axios from 'axios'

export function getNpmInfo(npmName) {
  // cnpm源：https://registry.npm.taobao.org/
  const registry = 'https://registry.npmjs.org/'
  const url = urlJoin(registry, npmName)
  return axios.get(url).then((resp) => {
    try {
      return resp.data
    }
    catch (error) {
      return Promise.reject(error)
    }
  })
}

export function getLatestVersion(npmName) {
  return getNpmInfo(npmName).then((data) => {
    if (!data['dist-tags'] || !data['dist-tags'].latest) {
      log.error('没有 latest 版本号')
      return Promise.reject(new Error('没有 latest 版本号'))
    }
    return data['dist-tags'].latest
  })
}
